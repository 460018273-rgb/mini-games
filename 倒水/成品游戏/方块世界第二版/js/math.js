(function (BW) {
  'use strict';
  function normalize(v) {
    var l = Math.hypot(v[0], v[1], v[2]);
    return l ? [v[0] / l, v[1] / l, v[2] / l] : [0, 0, 0];
  }
  function cross(a, b) {
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  }
  function dot(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
  function perspective(out, fov, aspect, near, far) {
    var q = 1 / Math.tan(fov / 2);
    out.fill(0); out[0]=q/aspect; out[5]=q; out[10]=(far+near)/(near-far); out[11]=-1; out[14]=2*far*near/(near-far);
  }
  function lookAt(out, eye, target) {
    var z=normalize([eye[0]-target[0],eye[1]-target[1],eye[2]-target[2]]);
    var r=normalize(cross([0,1,0],z)); var u=cross(z,r);
    out[0]=r[0];out[1]=u[0];out[2]=z[0];out[3]=0;
    out[4]=r[1];out[5]=u[1];out[6]=z[1];out[7]=0;
    out[8]=r[2];out[9]=u[2];out[10]=z[2];out[11]=0;
    out[12]=-dot(r,eye);out[13]=-dot(u,eye);out[14]=-dot(z,eye);out[15]=1;
  }
  BW.Math3D={normalize:normalize,perspective:perspective,lookAt:lookAt};
}(window.BlockWorld));
