"""Find legal grid paths for browser replay; no mutation of production level data."""
import collections,json,re,sys
from pathlib import Path
# Export the JavaScript literal using the same JS parser used by the application.
import subprocess
levels=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('index.html','utf8');const a=s.indexOf('const LEVELS = ['),b=s.indexOf('let currentLevelIndex',a);console.log(JSON.stringify(vm.runInNewContext(s.slice(a,b)+';LEVELS')));"],text=True))
solutions=[]
for bs in levels:
 groups={}
 for i,b in enumerate(bs):groups.setdefault((b['w'],b['h'],b['id']=='main'),[]).append(i)
 def key(p):
  out=list(p)
  for ids in groups.values():
   for i,v in zip(ids,sorted(p[i] for i in ids)):out[i]=v
  return tuple(out)
 dims=[(b['w'],b['h']) for b in bs];start=tuple(b['ly']*4+b['lx'] for b in bs);first=key(start);nodes={first:(start,None,None)};q=collections.deque([first]);goal=None
 while q:
  k=q.popleft();p=nodes[k][0]
  if p[0]==13:goal=k;break
  occupied=0
  for at,(w,h) in zip(p,dims):
   for y in range(h):
    for x in range(w):
     bit=1<<(at+y*4+x)
     assert not occupied&bit,'Overlapping initial or reached state'
     occupied|=bit
  for i,(at,(w,h)) in enumerate(zip(p,dims)):
   other=occupied^sum(1<<(at+y*4+x) for y in range(h) for x in range(w))
   for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
    for step in range(1,6):
     x=at%4+dx*step;y=at//4+dy*step
     if x<0 or y<0 or x+w>4 or y+h>5:break
     mask=sum(1<<((y+yy)*4+x+xx) for yy in range(h) for xx in range(w))
     if mask&other:break
     np=list(p);np[i]=y*4+x;np=tuple(np);nk=key(np)
     if nk not in nodes:
      nodes[nk]=(np,k,{'id':bs[i]['id'],'dx':dx*step,'dy':dy*step});q.append(nk)
 assert goal is not None,'Unsolvable level'
 moves=[];k=goal
 while nodes[k][1] is not None:
  moves.append(nodes[k][2]);k=nodes[k][1]
 moves.reverse();moves.append({'id':'main','dx':0,'dy':1});solutions.append(moves)
 print('Level',len(solutions),'solution',len(moves),'slides',file=sys.stderr)
Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/klotski-solutions.json').write_text(json.dumps(solutions))
