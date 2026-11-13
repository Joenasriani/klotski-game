const {chromium}=require('playwright');
const fs=require('node:fs');const cp=require('node:child_process');const assert=require('node:assert/strict');
const current=fs.readFileSync('index.html','utf8');
const old=cp.execFileSync('git',['show','fb3d9dfae0c1c7ee03a02617a532c50b7b36bfb6:index.html'],{encoding:'utf8'});
function audio(s){return s.slice(s.indexOf('function initAudio()'),s.indexOf('// --- Interaction Logic ---'));}
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage();
 const results=await page.evaluate(async sources=>{
  const all={};
  for(const [label,src] of Object.entries(sources)){
   all[label]={};
   for(const kind of ['slide','snap','both','muted','rest']){
    const ctx=new OfflineAudioContext(1,48000,48000);
    const render=new Function('ctx','kind',`let audioCtx,slideNoiseNode,slideGainNode;let soundMuted=kind==='muted';const window={AudioContext:function(){return ctx}};const document={hidden:false};${src};initAudio();if(['slide','both','muted'].includes(kind))updateSlideVolume(10);if(['snap','both','muted'].includes(kind))playSnapSound();return audioCtx.startRendering();`);
    const data=(await render(ctx,kind)).getChannelData(0);let sum=0,peak=0;
    for(const n of data){sum+=n*n;peak=Math.max(peak,Math.abs(n));}
    all[label][kind]={rms:Math.sqrt(sum/data.length),peak};
   }
  }return all;
 },{old:audio(old),updated:audio(current)});
 assert(results.updated.slide.rms>results.old.slide.rms*2.8,'slide gain improvement');
 assert.equal(results.updated.snap.rms,results.old.snap.rms,'original snap preserved');
 assert(results.updated.both.peak<0.9,'headroom');
 assert.equal(results.updated.muted.peak,0);assert.equal(results.updated.rest.peak,0);
 console.log(JSON.stringify(results,null,2));console.log('PASS: real OfflineAudioContext renders restored slide volume, unchanged snap, no clipping, mute/rest silence');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
