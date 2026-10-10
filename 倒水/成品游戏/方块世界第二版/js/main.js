(function (BW) {
  'use strict';
  var running=true,last=performance.now();
  function showError(error,module){running=false;BW.Errors.show(error,module);}
  function frame(now){if(!running)return;try{var dt=Math.min(.05,(now-last)/1000);last=now;BW.Player.update(dt);var camera=BW.Player.camera();BW.Render.draw(camera);var hit=BW.Raycast.cast(camera.eye,camera.direction,BW.Config.rayDistance);BW.UI.update(now,hit);requestAnimationFrame(frame);}catch(e){showError(e,'动画循环');}}
  try{BW.World.generate();BW.Render.init();BW.Player.init();BW.UI.init();requestAnimationFrame(frame);}catch(e){showError(e,'初始化');}
}(window.BlockWorld));
