(function (BW) {
  'use strict';
  var solid=Object.create(null), blocks=[];
  function key(x,y,z){return x+','+y+','+z;}
  function add(x,y,z,m){solid[key(x,y,z)]=m;blocks.push({x:x,y:y,z:z,m:m});}
  function generate(){
    solid=Object.create(null);blocks=[];
    var n=BW.Config.worldSize,x,z;
    for(x=0;x<n;x++)for(z=0;z<n;z++)add(x,0,z,2);
    add(4,1,4,0);add(5,1,3,1);add(6,1,4,2);
    add(8,1,6,1);add(8,2,6,0);
    add(2,1,7,2);add(2,2,7,2);
  }
  BW.World={
    generate:generate,
    key:key,
    get:function(x,y,z){return solid[key(x,y,z)];},
    has:function(x,y,z){return solid[key(x,y,z)]!==undefined;},
    blocks:function(){return blocks;}
  };
}(window.BlockWorld));
