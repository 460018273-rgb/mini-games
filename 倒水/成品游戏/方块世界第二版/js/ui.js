(function (BW) {
  'use strict';
  var canvas,ctx,state,debug,lastFpsTime=0,frames=0,fps=0;
  function init(){canvas=document.getElementById('outline');ctx=canvas.getContext('2d');state=document.getElementById('state');debug=document.getElementById('debug');if(!ctx)throw new Error('无法创建描边画布');}
  function resize(){var g=BW.Render.canvas();if(canvas.width!==g.width||canvas.height!==g.height){canvas.width=g.width;canvas.height=g.height;}}
  function drawTarget(hit){
    resize();ctx.clearRect(0,0,canvas.width,canvas.height);if(!hit)return;
    var q=[[hit.x,hit.y,hit.z],[hit.x+1,hit.y,hit.z],[hit.x+1,hit.y+1,hit.z],[hit.x,hit.y+1,hit.z],[hit.x,hit.y,hit.z+1],[hit.x+1,hit.y,hit.z+1],[hit.x+1,hit.y+1,hit.z+1],[hit.x,hit.y+1,hit.z+1]];
    var e=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];ctx.beginPath();ctx.strokeStyle='#d7c89f';ctx.lineWidth=Math.max(2,canvas.width/700);
    e.forEach(function(edge){var a=BW.Render.project(q[edge[0]][0],q[edge[0]][1],q[edge[0]][2],canvas.width,canvas.height),b=BW.Render.project(q[edge[1]][0],q[edge[1]][1],q[edge[1]][2],canvas.width,canvas.height);if(a&&b){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}});ctx.stroke();
  }
  function update(now,hit){
    frames++;if(now-lastFpsTime>=500){fps=Math.round(frames*1000/(now-lastFpsTime||1));frames=0;lastFpsTime=now;}
    if(!hit)state.textContent='准星待命 · 未命中';else if(hit.distance<=BW.Config.interactionDistance)state.textContent='目标方块 · 可交互 · '+hit.distance.toFixed(2)+' 格';else state.textContent='目标方块 · 距离太远 · '+hit.distance.toFixed(2)+' 格';
    var p=BW.Player.position();debug.textContent='FPS '+fps+' · 坐标 '+p.map(function(v){return v.toFixed(2);}).join(', ')+' · '+BW.World.blocks().length+' 方块 · '+BW.Render.triangles()+' 三角形';
    drawTarget(hit);
  }
  BW.UI={init:init,update:update};
}(window.BlockWorld));
