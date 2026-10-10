(function (BW) {
  'use strict';
  function cast(origin,dir,maxDistance){
    var cell=[Math.floor(origin[0]),Math.floor(origin[1]),Math.floor(origin[2])];
    var step=[dir[0]>=0?1:-1,dir[1]>=0?1:-1,dir[2]>=0?1:-1];
    var delta=[dir[0]?Math.abs(1/dir[0]):Infinity,dir[1]?Math.abs(1/dir[1]):Infinity,dir[2]?Math.abs(1/dir[2]):Infinity];
    var side=[0,0,0],distance=0,face=[0,0,0];
    for(var i=0;i<3;i++)side[i]=dir[i]>=0?(cell[i]+1-origin[i])*delta[i]:(origin[i]-cell[i])*delta[i];
    for(var guard=0;guard<512&&distance<=maxDistance;guard++){
      if(BW.World.has(cell[0],cell[1],cell[2]))return{x:cell[0],y:cell[1],z:cell[2],distance:distance,face:face.slice(),material:BW.World.get(cell[0],cell[1],cell[2])};
      var axis=side[0]<=side[1]&&side[0]<=side[2]?0:(side[1]<=side[2]?1:2);distance=side[axis];cell[axis]+=step[axis];side[axis]+=delta[axis];face=[0,0,0];face[axis]=-step[axis];
    }
    return null;
  }
  BW.Raycast={cast:cast};
}(window.BlockWorld));
