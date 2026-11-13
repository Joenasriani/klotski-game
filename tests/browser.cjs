const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const server=spawn('python3',['-m','http.server','8000','--bind','127.0.0.1'],{stdio:'ignore'});
const url='http://127.0.0.1:8000/';
const launch={headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']};
(async()=>{
 let browser;
 try {
  for(let i=0;i<50;i++){try{await fetch(url);break;}catch{await new Promise(r=>setTimeout(r,100));}}
  browser=await chromium.launch(launch);
  const context=await browser.newContext({viewport:{width:900,height:800}});
  const page=await context.newPage();const errors=[];const remote=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(url))remote.push(r.url());});
  await page.goto(url);await page.waitForFunction(()=>typeof renderer!=='undefined' && !renderingFailed && blocks.length>0);
  fs.mkdirSync('qa-results',{recursive:true});
  // Blocking every external host still permits local runtime assets and fonts.
  await context.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());await page.reload();await page.waitForFunction(()=>!renderingFailed && blocks.length===3);
  await page.screenshot({path:'qa-results/desktop.png'});
  assert.equal(await page.title(),'3D Klotski Puzzle');
  const paths=JSON.parse(fs.readFileSync('/tmp/klotski-solutions.json'));
  for(let level=0;level<paths.length;level++){
   for(const move of paths[level]){
    const pts=await page.evaluate(m=>{
     const b=blocks.find(b=>b.id===m.id);const p=b.mesh.position.clone();p.y=0.4;
     const end=p.clone();end.x+=m.dx;end.z+=m.dy;
     function screen(v){v.project(camera);return {x:(v.x+1)*innerWidth/2,y:(1-v.y)*innerHeight/2};}
     return {start:screen(p),end:screen(end),lx:b.lx+m.dx,ly:b.ly+m.dy};
    },move);
    await page.mouse.move(pts.start.x,pts.start.y);await page.mouse.down();
    await page.mouse.move(pts.end.x,pts.end.y,{steps:6});await page.mouse.up();
    await page.waitForFunction(({id,lx,ly})=>{const b=blocks.find(b=>b.id===id);return b.lx===lx&&b.ly===ly&&activeTweens.length===0;},{id:move.id,lx:pts.lx,ly:pts.ly},{timeout:3000});
   }
   await page.locator('#win-overlay.active').waitFor();
   assert.equal(await page.evaluate(()=>currentLevelIndex),level);
   console.log(`PASS: Level ${level+1} completed through rendered mouse dragging`);
   if(level===0){await page.reload();await page.locator('#win-overlay.active').waitFor();assert.equal(await page.evaluate(()=>highestUnlockedLevel),1);}
   await page.locator('#win-btn').click();
  }
  assert.equal(await page.evaluate(()=>currentLevelIndex),0);
  // Mobile dimensions, safe bounds, and hit targets. No touch gameplay claim here.
  for(const [width,height] of [[360,800],[800,360],[320,568],[768,1024]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);
   const result=await page.evaluate(()=>({
    buttons:[...document.querySelectorAll('header button,#sound-btn')].map(b=>{const r=b.getBoundingClientRect();return {height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom};}),
    clip:blocks.some(b=>{const box=new THREE.Box3().setFromObject(b.mesh);return [box.min,box.max].some(v=>{const p=v.clone().project(camera);return Math.abs(p.x)>1||Math.abs(p.y)>1;});})
   }));
   assert(result.buttons.every(r=>r.height>=44 && r.left>=0 && r.right<=width && r.top>=0 && r.bottom<=height),JSON.stringify({width,height,...result}));
   assert(!result.clip,`Clipped initial board at ${width}x${height}`);
   await page.screenshot({path:`qa-results/${width}x${height}.png`});
  }
  await page.locator('#sound-btn').click();await page.reload();assert.equal(await page.locator('#sound-btn').innerText(),'Sound: Off');
  assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
  await context.close();
  // Failed graphics initialization must show a useful recovery screen.
  const fallback=await browser.newContext();const errorPage=await fallback.newPage();
  await errorPage.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};});
  await errorPage.goto(url);await errorPage.locator('#runtime-error').waitFor({state:'visible'});await errorPage.screenshot({path:'qa-results/graphics-fallback.png'});
  console.log('PASS: external-network-independent boot, all-level progression, saved win/mute, responsive bounds, and graphics fallback');
 }finally {if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
