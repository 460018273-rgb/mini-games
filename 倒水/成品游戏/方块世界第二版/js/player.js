(function (BW) {
  'use strict';
  var pos=[5.5,1,10],yaw=0,pitch=.10,vy=0,grounded=true,keys=Object.create(null);
  function collides(x,y,z){
    var r=BW.Config.playerRadius,h=BW.Config.playerHeight,eps=.0001;
    for(var gx=Math.floor(x-r);gx<=Math.floor(x+r-eps);gx++)for(var gy=Math.floor(y);gy<=Math.floor(y+h-eps);gy++)for(var gz=Math.floor(z-r);gz<=Math.floor(z+r-eps);gz++)if(BW.World.has(gx,gy,gz))return true;
    return false;
  }
  function init(){
    var c=BW.Render.canvas();
    c.addEventListener('click',function(){try{c.requestPointerLock();}catch(e){}});
    document.addEventListener('mousemove',function(e){if(document.pointerLockElement===c){yaw-=e.movementX*.0024;pitch=Math.max(-1.45,Math.min(1.45,pitch-e.movementY*.0024));}});
    document.addEventListener('keydown',function(e){keys[e.code]=true;if(e.code==='Space')e.preventDefault();});
    document.addEventListener('keyup',function(e){keys[e.code]=false;});
    window.addEventListener('blur',function(){keys=Object.create(null);});
  }
  function update(dt){
    var fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw),mx=0,mz=0;
    if(keys.KeyW){mx+=fx;mz+=fz;}if(keys.KeyS){mx-=fx;mz-=fz;}if(keys.KeyD){mx+=rx;mz+=rz;}if(keys.KeyA){mx-=rx;mz-=rz;}
    var ml=Math.hypot(mx,mz),speed=BW.Config.moveSpeed;if(ml){mx=mx/ml*speed*dt;mz=mz/ml*speed*dt;if(!collides(pos[0]+mx,pos[1],pos[2]))pos[0]+=mx;if(!collides(pos[0],pos[1],pos[2]+mz))pos[2]+=mz;}
    grounded=collides(pos[0],pos[1]-.04,pos[2]);if(grounded&&keys.Space){vy=BW.Config.jumpSpeed;grounded=false;}vy-=BW.Config.gravity*dt;
    var dy=vy*dt;if(!collides(pos[0],pos[1]+dy,pos[2]))pos[1]+=dy;else{if(vy<0){for(var i=0;i<8&&!collides(pos[0],pos[1]-.01,pos[2]);i++)pos[1]-=.01;grounded=true;}vy=0;}
    if(pos[1]<-10){pos=[5.5,1,10];vy=0;}
  }
  function camera(){var cp=Math.cos(pitch);return{eye:[pos[0],pos[1]+BW.Config.eyeHeight,pos[2]],direction:[-Math.sin(yaw)*cp,-Math.sin(pitch),-Math.cos(yaw)*cp]};}
  BW.Player={init:init,update:update,camera:camera,position:function(){return pos.slice();}};
}(window.BlockWorld));
