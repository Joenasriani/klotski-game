package com.joenasr.klotski;

import android.app.Instrumentation;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelFileDescriptor;
import android.os.SystemClock;
import android.view.PixelCopy;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.File;
import java.io.FileOutputStream;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Test-only selection of authored levels; captures unmodified app pixels with PixelCopy. */
@RunWith(AndroidJUnit4.class)
public final class StoreScreenshotsTest {
    private final Instrumentation instrumentation = InstrumentationRegistry.getInstrumentation();
    private MainActivity activity;
    private WebView web;
    private WebView findWeb(View v) {
        if (v instanceof WebView) return (WebView) v;
        if (v instanceof ViewGroup) for (int n=0;n<((ViewGroup)v).getChildCount();n++) {
            WebView found=findWeb(((ViewGroup)v).getChildAt(n)); if(found!=null)return found;
        }
        return null;
    }
    private String js(String source) throws Exception {
        CountDownLatch done=new CountDownLatch(1);
        AtomicReference<String> value=new AtomicReference<>();
        instrumentation.runOnMainSync(()->web.evaluateJavascript(source,v->{value.set(v);done.countDown();}));
        assertTrue("JavaScript callback timed out",done.await(20,TimeUnit.SECONDS));
        return value.get();
    }
    private void waitReady() throws Exception {
        long deadline=SystemClock.uptimeMillis()+30000;
        while(SystemClock.uptimeMillis()<deadline) {
            if("true".equals(js("typeof renderer!=='undefined' && !renderingFailed && blocks.length>0 && document.fonts.status==='loaded'")))return;
            SystemClock.sleep(250);
        }
        fail("Android WebView did not render the game");
    }
    private void shell(String command) throws Exception {
        try(ParcelFileDescriptor descriptor=instrumentation.getUiAutomation().executeShellCommand(command);
            java.io.FileInputStream input=new java.io.FileInputStream(descriptor.getFileDescriptor())) {
            byte[] buffer=new byte[4096];while(input.read(buffer)!=-1) { /* drain */ }
        }
    }
    private Rect bounds() {
        Rect rect=new Rect();
        instrumentation.runOnMainSync(()->{int[] xy=new int[2];web.getLocationInWindow(xy);rect.set(xy[0],xy[1],xy[0]+web.getWidth(),xy[1]+web.getHeight());});
        return rect;
    }
    private void viewport(int width,int height,int density) throws Exception {
        shell("wm density "+density);
        int displayHeight=height;
        for(int tries=0;tries<5;tries++) {
            shell("wm size "+width+"x"+displayHeight);
            SystemClock.sleep(2000);
            Rect actual=bounds();
            if(actual.width()==width&&actual.height()==height)return;
            displayHeight+=height-actual.height();
        }
        assertEquals(width,bounds().width());assertEquals(height,bounds().height());
    }
    private void capture(File destination) throws Exception {
        Rect rect=bounds(); Bitmap image=Bitmap.createBitmap(rect.width(),rect.height(),Bitmap.Config.ARGB_8888);
        CountDownLatch done=new CountDownLatch(1);int[] result={-1};
        instrumentation.runOnMainSync(()->PixelCopy.request(activity.getWindow(),rect,image,r->{result[0]=r;done.countDown();},new Handler(Looper.getMainLooper())));
        assertTrue(done.await(20,TimeUnit.SECONDS));assertEquals(PixelCopy.SUCCESS,result[0]);
        image.setHasAlpha(false);
        try(FileOutputStream output=new FileOutputStream(destination)){assertTrue(image.compress(Bitmap.CompressFormat.PNG,100,output));}
        image.recycle();
    }
    @Test public void captureStoreScreenshots() throws Exception {
        Intent start=new Intent(instrumentation.getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity=(MainActivity)instrumentation.startActivitySync(start);
        instrumentation.runOnMainSync(()->web=findWeb(activity.getWindow().getDecorView()));
        assertNotNull(web);waitReady();
        File output=new File(instrumentation.getTargetContext().getExternalFilesDir(null),"store-screens");
        assertTrue(output.mkdirs()||output.isDirectory());
        JSONArray metadata=new JSONArray();
        // Tablet labels describe logical screen classes, not physical hardware measurements.
        String[] profiles={"phone","tablet-7-class","tablet-10-class"};
        int[][] sizes={{1080,1920,420},{1440,2560,360},{2160,3840,400}};
        int[] levels={0,3,5,9};
        try {
            for(int p=0;p<profiles.length;p++) {
                viewport(sizes[p][0],sizes[p][1],sizes[p][2]);waitReady();
                for(int level:levels) {
                    js("highestUnlockedLevel=9;currentLevelIndex="+level+";document.getElementById('level-display').innerText='Level '+(currentLevelIndex+1);updateLevelButtons();resetGame();true");
                    SystemClock.sleep(1500);
                    assertEquals("false",js("renderingFailed"));
                    assertEquals("true",js("[...document.querySelectorAll('header button,#sound-btn')].every(b=>{let r=b.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&r.height>=44})"));
                    String filename=profiles[p]+"-level-"+(level+1)+".png";capture(new File(output,filename));
                    metadata.put(new JSONObject().put("file",filename).put("level",level+1).put("width",sizes[p][0]).put("height",sizes[p][1]).put("densityDpi",sizes[p][2]).put("webState",new JSONObject(new JSONArray("["+js("JSON.stringify({level:currentLevelIndex+1,blocks:blocks.length,width:innerWidth,height:innerHeight})")+"]").getString(0))));
                }
            }
            JSONObject manifest=new JSONObject().put("captureMethod","Android PixelCopy: WebView bounds, no pixel editing").put("api",android.os.Build.VERSION.SDK_INT).put("fingerprint",android.os.Build.FINGERPRINT).put("version",BuildConfig.VERSION_NAME).put("note","Emulator with phone/tablet logical display sizes. Test-only driver selects unchanged authored layouts; not physical-device acceptance.").put("screenshots",metadata);
            try(FileOutputStream file=new FileOutputStream(new File(output,"capture-provenance.json"))){file.write(manifest.toString(2).getBytes(java.nio.charset.StandardCharsets.UTF_8));}
        } finally {shell("wm size reset");shell("wm density reset");instrumentation.runOnMainSync(()->activity.finish());}
    }
}
