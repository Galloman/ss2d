(function(){var e=!0,g=null,j=!1;function k(){return function(){}}function l(a,b){function c(){}c.prototype=b.prototype;a.ia=b.prototype;a.prototype=new c};var m,n;
function q(a){this.m=a;a=a.d;a.style.outline="none";this.m.w=e;this.p=j;if(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i))this.p=e;this.p||window.addEventListener("mousedown",r,e);window.addEventListener("keydown",s,e);window.addEventListener("keyup",s,e);a.addEventListener("mousedown",s,e);a.addEventListener("mouseup",s,e);a.addEventListener("mousemove",s,e);a.addEventListener("touchstart",s,j);a.addEventListener("touchend",
s,j);a.addEventListener("touchcancel",s,j);a.addEventListener("touchleave",s,j);this.G={};this.u=this.t=-50;this.P=this.O=0;this.B=j;this.s=new t(this.t,this.u);this.N=new t(this.O,this.P);this.D=this.R=j}q.prototype.q=function(){this.O=this.t;this.P=this.u;this.N.a=this.O;this.N.b=this.P;this.R=this.B;this.B=this.D};function s(a){m.z.handleEvent(a)}function r(){var a=m.z;a.m.w&&(a.m.w=j,a.D=j)}
q.prototype.handleEvent=function(a){var b=e;switch(a.type){case "mousedown":case "touchstart":b=this.p?window.event.targetTouches[0]:a;this.t=b.offsetX||b.pageX-this.m.d.offsetLeft;this.u=b.offsetY||b.pageY-this.m.d.offsetTop;this.s.a=this.t;this.s.b=this.u;if(this.p&&b||!this.p)this.D=this.m.w=e,a.preventDefault(),a.stopPropagation(),this.m.d.addEventListener("touchmove",s,j);b=j;break;case "mouseup":case "touchend":case "touchcancel":b=this.p?window.event.targetTouches[0]:a;if(this.p&&!b||!this.p)this.D=
this.B=j,a.preventDefault(),a.stopPropagation(),this.m.d.removeEventListener("touchmove",s,j);b=j;break;case "keydown":this.m.w?(this.G["_"+parseInt(a.keyCode)]=e,(37==a.keyCode||38==a.keyCode||39==a.keyCode||40==a.keyCode||32==a.keyCode)&&a.preventDefault(),b=j):b=e;break;case "keyup":this.m.w?(this.G["_"+parseInt(a.keyCode)]=j,delete this.G["_"+parseInt(a.keyCode)],b=j):b=e;break;case "mousemove":case "touchmove":if(a=this.p?window.event.targetTouches[0]:a)this.t=a.offsetX||a.pageX-this.m.d.offsetLeft,
this.u=a.offsetY||a.pageY-this.m.d.offsetTop,this.s.a=this.t,this.s.b=this.u;b=void 0}return b};function t(a,b){this.a=a;this.b=b}t.prototype.length=function(){return Math.sqrt(this.a*this.a+this.b*this.b)};t.prototype.normalize=function(){var a=1/this.length();return new t(a*this.a,a*this.b)};function u(a,b){return new t(b.a-a.a,b.b-a.b)};function v(){this.f=1;this.h=this.g=0;this.i=1;this.k=this.j=0;this.ga=Array(9)}function w(a,b,c,d,f,h,Q){a.f=b;a.g=c;a.h=d;a.i=f;a.j=h;a.k=Q}v.prototype.toString=function(){return"(a="+this.f+", b="+this.g+", c="+this.h+", d="+this.i+", tx="+this.j+", ty="+this.k+")"};function x(a,b){w(a,b.f*a.f+b.h*a.g,b.g*a.f+b.i*a.g,b.f*a.h+b.h*a.i,b.g*a.h+b.i*a.i,b.f*a.j+b.h*a.k+1*b.j,b.g*a.j+b.i*a.k+1*b.k)}v.prototype.translate=function(a,b){this.j+=a;this.k+=b;return this};
v.prototype.scale=function(a,b){this.f*=a;this.g*=b;this.h*=a;this.i*=b;this.j*=a;this.k*=b;return this};v.prototype.rotate=function(a){var b=new v;w(b,-Math.cos(a),-Math.sin(a),-Math.sin(a),Math.cos(a),0,0);x(this,b);delete b;return this};function y(a){this.l=a;this.T=new v}y.prototype.I=k();y.prototype.I=function(a){w(this.T,1,0,0,1,0,0);a=z(a,this.T);this.l.save();this.l.transform(a.f,a.g,a.h,a.i,a.j,a.k)};y.prototype.H=k();y.prototype.H=function(){this.l.restore()};function A(){if(n)return n;if("undefined"!==typeof AudioContext)return new AudioContext;if("undefined"!==typeof webkitAudioContext)return new webkitAudioContext;console.log("AudioContext not supported");return g};function B(a,b,c,d,f){this.d=document.getElementById(a);this.l=this.d.getContext("2d");this.S=j;this.ba=f||60;this.z=new q(this);this.U=(new Date).getTime();m=this;this.d.width=c||800;this.d.height=d||600;n=A();this.K=b||g;this.da=new y(this.l);this.aa="#202020"}function C(){D(m)}
function D(a){var b=(new Date).getTime(),c=b-a.U;a.$(a.d.width,a.d.height);a.K.q(c/1E3);a.z.q(c/1E3);a.l.fillStyle=a.aa;a.l.fillRect(0,0,a.d.width,a.d.height);a.K.A(a.da);a.U=b;b=Math.max(0,1/a.ba-((new Date).getTime()-b)/1E3);a.S&&setTimeout(C,1E3*b)}B.prototype.$=k();function E(a){if(a instanceof E)this.v=a.v.slice(0);else if(a instanceof Array&&2<a.length)this.v=a.slice(0);else if("string"==typeof a||"number"==typeof a)"string"==typeof a&&(a=parseInt("0x"+a.replace("#","").substring(0,6))),a&=16777215,this.v=[(a&16711680)>>16,(a&65280)>>8,a&255]}function F(a){var b=Math.floor(a.v[0]).toString(16),b=1==b.length?"0"+b:b,c=Math.floor(a.v[1]).toString(16),c=1==c.length?"0"+c:c;a=Math.floor(a.v[2]).toString(16);a=1==a.length?"0"+a:a;return"#"+b+c+a};var G=0;function H(a,b,c,d,f,h){this.c=new t(a||0,b||0);this.X=d||0;this.M=this.L=0;this.Y=c||1;this.Z=c||1;this.r=g;this.F=j;this.W=this.V=0;this.J=f instanceof E?f:new E(f||16777215);this.fa=h||1;this.ha=G++}function z(a,b){b=b||new v;(0!=a.L||0!=a.M)&&b.translate(-a.L,-a.M);(0!=a.V||0!=a.W)&&b.translate(-a.V,-a.W);(1!=a.Y||1!=a.Z)&&b.scale(a.Y,a.Z);0!=a.X&&b.rotate(a.X);(0!=a.c.a||0!=a.c.b)&&b.translate(a.c.a,a.c.b);return b}
function I(a,b){for(var c=[],d=a;d.r;)c.unshift(d.r),d=d.r;var d=new v,f=new v;for(matIndex in c)w(f,1,0,0,1,0,0),z(c[matIndex],f),x(d,f);c=d.f*d.i-d.h*d.g;w(d,d.i/c,-d.g/c,-d.h/c,d.f/c,(d.h*d.k-d.i*d.j)/c,(d.g*d.j-d.f*d.k)/c);var h;h||(h=new t(0,0));c=b.a;h.a=d.f*b.a+d.h*b.b+d.j;h.b=d.g*c+d.i*b.b+d.k;delete worldMatrix;return h}H.prototype.q=k();H.prototype.A=k();H.prototype.C=function(){return g};function J(a,b,c,d,f){H.call(this,a,b,1,0,f,1);this.ea=c||10;this.ca=d||10}l(J,H);J.prototype.A=function(a){a.I(this);var b=a.l;b.fillStyle=F(this.J);b.rect(0,0,this.ea,this.ca);a.H()};function K(a,b,c,d){J.call(this,a,b,2*c,2*c,d);this.e=c;this.F=j;this.L=this.M=c}l(K,J);K.prototype.C=function(a){var b=this.c;a=I(this,a);return Math.abs(Math.sqrt((a.a-b.a)*(a.a-b.a)+(a.b-b.b)*(a.b-b.b)))<=this.e?this:g};K.prototype.A=function(a){a.I(this);var b=a.l;b.beginPath();b.fillStyle=F(this.J);b.arc(this.e,this.e,this.e,0,2*Math.PI,e);b.closePath();b.fill();a.H()};
K.prototype.q=function(a){if(!this.F){var b=u(this.c,I(this,m.z.s)),c=b.length();b.normalize();var d=m.z.G._16!=g?1:-1;this.c.a+=0.2*(Math.max(0,100-c)*b.a*a)*d;this.c.b+=0.2*(Math.max(0,100-c)*b.b*a)*d;b=this.r.n;for(c=b.indexOf(this);c<b.length;++c)if(d=b[c],d instanceof K){var f=u(this.c,d.c),h=f.length();this.c.a+=-Math.max(0,d.e+this.e-h)*f.a*a;this.c.b+=-Math.max(0,d.e+this.e-h)*f.b*a;d.c.a+=Math.max(0,d.e+this.e-h)*f.a*a;d.c.b+=Math.max(0,d.e+this.e-h)*f.b*a}}this.c.a=Math.max(Math.min(this.c.a,
m.d.width-this.e),this.e);this.c.b=Math.max(Math.min(this.c.b,m.d.height-this.e),this.e)};function L(a,b,c,d){H.call(this,a,b,c,d);this.n=[]}l(L,H);L.prototype.q=function(a){M(this,a)};function M(a,b){for(var c in a.n)a.n[c].q&&a.n[c].q(b)}L.prototype.A=function(a){a.I(this);for(var b in this.n)this.n[b].A(a);a.H()};function N(a,b){if(b instanceof Array)for(var c in b)N(a,b[c]);else b instanceof H&&(b.r&&O(b.r,b),b.r=a,a.n.push(b))}function O(a,b){if(b instanceof Array)for(var c in b)O(a,b[c]);else c=a.n.indexOf(b),-1!=c&&a.n.splice(c,1),b.r=g}
L.prototype.C=function(a){var b=g,c;for(c in this.n)b=this.n[c].C(a)||b;return b};function P(){L.call(this)}l(P,L);P.prototype.q=function(a){var b=m.z;this.o&&(this.o.F=j);b.B&&!b.R&&((this.o=this.C(b.s))||N(this,new K(b.t-3*Math.random()+3*Math.random(),b.u-3*Math.random()+3*Math.random(),Math.max(13*Math.random(),10),"#"+Math.floor(16777215*Math.max(Math.random(),0.2)).toString(16))));b.B&&(b.R&&this.o)&&(b=u(b.N,b.s),this.o.c.a+=b.a,this.o.c.b+=b.b,this.o.F=e);M(this,a)};var R=new P,S=new B("mainScene",R,window.innerWidth,window.innerHeight);S.$=function(){this.d.width=window.innerWidth;this.d.height=window.innerHeight};for(var T=100;T--;){var U=new K(0.5*m.d.width+10*Math.random(),0.5*m.d.height+10*Math.random(),Math.max(13*Math.random(),10),"#"+Math.floor(16777215*Math.max(Math.random(),0.2)).toString(16));N(R,U)}R.o=g;var V=new H;V.q=function(){this.c.a=5;this.c.b=window.innerHeight-10};
V.A=function(a){a.l.font="normal 14px Verdana";a.l.fillStyle="#FFFFFF";a.l.fillText("Press shift to invert cursor force",this.c.a,this.c.b)};N(R,V);m.w=e;!S.S&&S.K!=g&&(S.S=e,D(S));})();