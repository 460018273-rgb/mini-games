(function (BW) {
  'use strict';
  var canvas,gl,program,pb,cb,ib,pos=[],col=[],ind=[],P=new Float32Array(16),V=new Float32Array(16);
  var D=[
    [[0,0,1],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[[0,0,-1],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]],
    [[1,0,0],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]],[[-1,0,0],[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]],
    [[0,1,0],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],[[0,-1,0],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]]
  ];
  function shader(type,source){var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'着色器编译失败');return s;}
  function init(){
    canvas=document.getElementById('game');gl=canvas.getContext('webgl',{alpha:false,antialias:true,depth:true});
    if(!gl)throw new Error('无法创建 WebGL；请使用支持 WebGL 的浏览器');
    var vs='attribute vec3 p;attribute vec3 c;uniform mat4 P;uniform mat4 V;varying vec3 color;void main(){color=c;gl_Position=P*V*vec4(p,1.0);}';
    var fs='precision mediump float;varying vec3 color;void main(){gl_FragColor=vec4(color,1.0);}';
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'WebGL 程序链接失败');
    pb=gl.createBuffer();cb=gl.createBuffer();ib=gl.createBuffer();rebuild();
  }
  function rebuild(){
    pos=[];col=[];ind=[];var palette=BW.Config.colors,lights=[.94,.82,.70,.62,1.05,.58];
    BW.World.blocks().forEach(function(b){D.forEach(function(d,face){
      if(BW.World.has(b.x+d[0][0],b.y+d[0][1],b.z+d[0][2]))return;
      var base=pos.length/3,q=palette[b.m],light=lights[face];
      d[1].forEach(function(v){pos.push(b.x+v[0],b.y+v[1],b.z+v[2]);col.push(Math.min(1,q[0]*light),Math.min(1,q[1]*light),Math.min(1,q[2]*light));});
      ind.push(base,base+1,base+2,base,base+2,base+3);
    });});
    gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pos),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,cb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(col),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ind),gl.STATIC_DRAW);
  }
  function draw(camera){
    var ratio=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*ratio)),h=Math.max(1,Math.floor(canvas.clientHeight*ratio));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    gl.viewport(0,0,w,h);BW.Math3D.perspective(P,BW.Config.fieldOfView*Math.PI/180,w/h,.1,100);
    var eye=camera.eye,dir=camera.direction;BW.Math3D.lookAt(V,eye,[eye[0]+dir[0],eye[1]+dir[1],eye[2]+dir[2]]);
    gl.clearColor(.57,.70,.75,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);gl.useProgram(program);
    var ap=gl.getAttribLocation(program,'p'),ac=gl.getAttribLocation(program,'c');
    gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,cb);gl.enableVertexAttribArray(ac);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.uniformMatrix4fv(gl.getUniformLocation(program,'P'),false,P);gl.uniformMatrix4fv(gl.getUniformLocation(program,'V'),false,V);gl.drawElements(gl.TRIANGLES,ind.length,gl.UNSIGNED_SHORT,0);
  }
  function project(x,y,z,width,height){
    var vx=V[0]*x+V[4]*y+V[8]*z+V[12],vy=V[1]*x+V[5]*y+V[9]*z+V[13],vz=V[2]*x+V[6]*y+V[10]*z+V[14];
    var w=P[3]*vx+P[7]*vy+P[11]*vz+P[15];if(w<=.001)return null;
    return [((P[0]*vx+P[4]*vy+P[8]*vz+P[12])/w*.5+.5)*width,(-((P[1]*vx+P[5]*vy+P[9]*vz+P[13])/w)*.5+.5)*height];
  }
  BW.Render={init:init,rebuild:rebuild,draw:draw,project:project,canvas:function(){return canvas;},triangles:function(){return ind.length/3;}};
}(window.BlockWorld));
