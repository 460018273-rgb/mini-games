(function (BW) {
  'use strict';
  var box=document.getElementById('error');
  function show(error,module){
    box.hidden=false;
    box.textContent='方块世界 L9-C 运行错误\n\n模块：'+(module||'未知模块')+'\n'+(error&&error.name?error.name:'Error')+': '+(error&&error.message?error.message:String(error))+'\n\n'+(error&&error.stack?error.stack:'浏览器未提供堆栈');
  }
  BW.Errors={show:show};
  window.addEventListener('error',function(e){show(e.error||new Error(e.message||'未知脚本错误'),e.filename||'未知脚本');});
}(window.BlockWorld));
