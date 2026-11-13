// Real Three.js math and geometry with a minimal DOM/renderer adapter.
// This checks state/input logic, not rendered appearance or a physical device.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
let assertions = 0;
function equal(a,b) { assert.deepEqual(a,b); assertions++; }
function boot(saved, {denied=false, brokenGraphics=false}={}) {
  let value = saved || null;
  const elements = {};
  function el(id) { return elements[id] ||= {style:{}, hidden:true, innerText:'', textContent:'', disabled:false,
    classList:{add(){},remove(){}}, setAttribute(){}, appendChild(){}, addEventListener(){}}; }
  const capture = new Set();
  const canvas = { addEventListener(){}, getBoundingClientRect:()=>({left:0,top:0,width:900,height:800}),
    setPointerCapture:id=>capture.add(id), hasPointerCapture:id=>capture.has(id), releasePointerCapture:id=>capture.delete(id)};
  const ctx = {console, Math, JSON, Set, window:null, innerWidth:900, innerHeight:800, devicePixelRatio:1,
    addEventListener(){}, requestAnimationFrame(){}, document:{body:{style:{}},hidden:false,getElementById:el,addEventListener(){}},
    localStorage:{ getItem(){if(denied)throw Error('denied');return value;},setItem(k,v){if(denied)throw Error('denied');value=v;} }};
  ctx.window = ctx; vm.createContext(ctx); vm.runInContext(fs.readFileSync('vendor/three.min.js','utf8'),ctx);
  ctx.THREE.WebGLRenderer = class { constructor(){if(brokenGraphics)throw Error('test WebGL failure');this.domElement=canvas;this.shadowMap={};}setSize(){}setPixelRatio(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);} };
  ctx.THREE.OrbitControls = class {constructor(){this.enabled=true;}update(){}};
  vm.runInContext(script,ctx);
  return {run:code=>vm.runInContext(code,ctx),saved:()=>value,capture,elements};
}
let game = boot();
equal(game.run('blocks.length'),3);
equal(game.run('currentLevelIndex'),0);
// A real raycast through the real camera selects a visible pawn.
game.run(`function testPoint(id,dx=0,dz=0){ const b=blocks.find(b=>b.id===id); const p=b.mesh.position.clone(); p.y=0.4; p.x+=dx;p.z+=dz;p.project(camera); return {clientX:(p.x+1)*450,clientY:(1-p.y)*400,preventDefault(){},button:0,isPrimary:true,pointerId:1}; }
onPointerDown(testPoint('p1'));`);
equal(game.run('selectedBlock.id'),'p1');
equal(game.run('controls.enabled'),false);
game.run(`onPointerMove({...testPoint('p1',-1,0),pointerId:2});onPointerUp({pointerId:2});`);
equal(game.run('selectedBlock.id'),'p1');
game.run(`onPointerMove(testPoint('p1',-1,0));onPointerUp({pointerId:1});`);
equal(game.run("blocks.find(b=>b.id==='p1').lx"),0);
equal(game.run('controls.enabled'),true);
equal(game.capture.size,0);
// Saved in-progress board survives reload, with no invalid overlap accepted.
const saved = game.saved();
let restored=boot(saved);
equal(restored.run("blocks.find(b=>b.id==='p1').lx"),0);
restored.run(`onPointerDown(testPoint = (()=>{const b=blocks.find(b=>b.id==='p2');const p=b.mesh.position.clone();p.y=0.4;p.project(camera);return {clientX:(p.x+1)*450,clientY:(1-p.y)*400,button:0,isPrimary:true,pointerId:7};})()); cancelDrag();`);
equal(restored.run('selectedBlock'),null);
equal(restored.run('controls.enabled'),true);
equal(restored.capture.size,0);
// Restart while selected and context failure never erase valid saved progress.
game.run(`onPointerDown(testPoint('p2')); resetGame();`);
equal(game.run('controls.enabled'),true);
equal(game.run("blocks.find(b=>b.id==='p1').lx"),1);
equal(game.capture.size,0);
const bad=JSON.parse(saved);bad.positions[1].lx=bad.positions[2].lx;
equal(boot(JSON.stringify(bad)).run("blocks.find(b=>b.id==='p1').lx"),1);
equal(boot('{broken').run('currentLevelIndex'),0);
equal(boot(null,{denied:true}).run('blocks.length'),3);
const failed=boot(saved,{brokenGraphics:true});
equal(failed.elements['runtime-error'].hidden,false);
equal(failed.saved(),saved);
game.run('toggleSound()');equal(boot(game.saved()).run('soundMuted'),true);
// Completed-state restoration and all-level unlock boundaries.
game.run("checkWinCondition({id:'main',ly:4})");
equal(game.run('highestUnlockedLevel'),1);
restored=boot(game.saved());equal(restored.run('isGameWon'),true);equal(restored.run('highestUnlockedLevel'),1);
restored.run('nextLevel()');equal(restored.run('currentLevelIndex'),1);equal(restored.run('isGameWon'),false);
// Repeated resets dispose old per-block geometry while keeping materials reusable.
game.run('globalThis.disposed=0;blocks.forEach(b=>b.mesh.geometry.addEventListener("dispose",()=>disposed++));resetGame()');
equal(game.run('disposed'),3);
console.log(`PASS: ${assertions} state, raycast, persistence, pointer, cleanup and fallback assertions`);
