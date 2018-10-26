webpackJsonp([0],{

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Copyright Google Inc. All Rights Reserved.
(function() { 'use strict';var f,aa="function"==typeof Object.create?Object.create:function(a){var b=function(){};b.prototype=a;return new b},ba;if("function"==typeof Object.setPrototypeOf)ba=Object.setPrototypeOf;else{var ca;a:{var da={Za:!0},ea={};try{ea.__proto__=da;ca=ea.Za;break a}catch(a){}ca=!1}ba=ca?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}
var fa=ba,g=function(a,b){a.prototype=aa(b.prototype);a.prototype.constructor=a;if(fa)fa(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.Xa=b.prototype},ha="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},h="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:
this,ia=function(){ia=function(){};h.Symbol||(h.Symbol=ja)},ja=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}(),la=function(){ia();var a=h.Symbol.iterator;a||(a=h.Symbol.iterator=h.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&ha(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ka(this)}});la=function(){}},ka=function(a){var b=0;return ma(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})},ma=function(a){la();a={next:a};a[h.Symbol.iterator]=
function(){return this};return a},na=function(a){la();var b=a[Symbol.iterator];return b?b.call(a):ka(a)},k=this,l=function(){},oa=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==
c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},pa=function(a){var b=oa(a);return"array"==b||"object"==b&&"number"==typeof a.length},p=function(a){return"function"==oa(a)},qa=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ra=function(a,b,c){return a.call.apply(a.bind,arguments)},sa=function(a,b,c){if(!a)throw Error();
if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},q=function(a,b,c){q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ra:sa;return q.apply(null,arguments)},ta=Date.now||function(){return+new Date},r=function(a,b){a=a.split(".");var c=k;a[0]in c||"undefined"==typeof c.execScript||
c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c=c[d]&&c[d]!==Object.prototype[d]?c[d]:c[d]={}:c[d]=b},t=function(a,b){function c(){}c.prototype=b.prototype;a.Xa=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Vb=function(a,c,m){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var u=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,u);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};t(u,Error);u.prototype.name="CustomError";var ua=function(a,b){a=a.split("%s");for(var c="",d=a.length-1,e=0;e<d;e++)c+=a[e]+(e<b.length?b[e]:"%s");u.call(this,c+a[d])};t(ua,u);ua.prototype.name="AssertionError";var va=function(a,b){throw new ua("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Da=function(a){if(!wa.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(xa,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(ya,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(za,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(Aa,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(Ba,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(Ca,"&#0;"));return a},xa=/&/g,ya=/</g,za=/>/g,Aa=/"/g,Ba=/'/g,Ca=/\x00/g,wa=/[\x00&<>"']/;var v;a:{var Ea=k.navigator;if(Ea){var Fa=Ea.userAgent;if(Fa){v=Fa;break a}}v=""};var w=function(a,b,c){this.reset(a,b,c,void 0,void 0)};w.prototype.na=null;var Ga=0;w.prototype.reset=function(a,b,c,d,e){"number"==typeof e||Ga++;this.Ya=d||ta();this.B=a;this.Ab=b;this.La=c;delete this.na};w.prototype.Da=function(a){this.B=a};var x=function(a){this.Na=a;this.P=this.ia=this.B=this.j=null},y=function(a,b){this.name=a;this.value=b};y.prototype.toString=function(){return this.name};
var Ha=new y("SHOUT",1200),Ia=new y("SEVERE",1E3),Ja=new y("WARNING",900),Ka=new y("INFO",800),La=new y("CONFIG",700),Ma=[new y("OFF",Infinity),Ha,Ia,Ja,Ka,La,new y("FINE",500),new y("FINER",400),new y("FINEST",300),new y("ALL",0)],z=null,Na=function(a){if(!z){z={};for(var b=0,c;c=Ma[b];b++)z[c.value]=c,z[c.name]=c}if(a in z)return z[a];for(b=0;b<Ma.length;++b)if(c=Ma[b],c.value<=a)return c;return null};x.prototype.getName=function(){return this.Na};x.prototype.getParent=function(){return this.j};
x.prototype.Da=function(a){this.B=a};var Oa=function(a){if(a.B)return a.B;if(a.j)return Oa(a.j);va("Root logger has no level set.");return null};x.prototype.log=function(a,b,c){if(a.value>=Oa(this).value)for(p(b)&&(b=b()),a=new w(a,String(b),this.Na),c&&(a.na=c),c=this;c;){var d=c,e=a;if(d.P)for(var m=0;b=d.P[m];m++)b(e);c=c.getParent()}};x.prototype.info=function(a,b){this.log(Ka,a,b)};
var Pa={},A=null,Qa=function(){A||(A=new x(""),Pa[""]=A,A.Da(La))},Ra=function(){Qa();return A},Sa=function(a){Qa();var b;if(!(b=Pa[a])){b=new x(a);var c=a.lastIndexOf("."),d=a.substr(c+1);c=Sa(a.substr(0,c));c.ia||(c.ia={});c.ia[d]=b;b.j=c;Pa[a]=b}return b};var B=function(a){var b=Ta;b&&b.log(Ja,a,void 0)};var C=function(){this.Ra=ta()},Ua=null;C.prototype.set=function(a){this.Ra=a};C.prototype.reset=function(){this.set(ta())};C.prototype.get=function(){return this.Ra};var Va=function(a){this.Gb=a||"";Ua||(Ua=new C);this.Rb=Ua};f=Va.prototype;f.Fa=!0;f.Va=!0;f.Pb=!0;f.Ob=!0;f.Wa=!1;f.Qb=!1;var E=function(a){return 10>a?"0"+a:String(a)},Wa=function(a,b){a=(a.Ya-b)/1E3;b=a.toFixed(3);var c=0;if(1>a)c=2;else for(;100>a;)c++,a*=10;for(;0<c--;)b=" "+b;return b},Xa=function(a){Va.call(this,a)};t(Xa,Va);var Ya=function(){this.Hb=q(this.$a,this);this.Y=new Xa;this.Y.Va=!1;this.Y.Wa=!1;this.Ka=this.Y.Fa=!1;this.lb={}};
Ya.prototype.$a=function(a){if(!this.lb[a.La]){var b=this.Y;var c=[];c.push(b.Gb," ");if(b.Va){var d=new Date(a.Ya);c.push("[",E(d.getFullYear()-2E3)+E(d.getMonth()+1)+E(d.getDate())+" "+E(d.getHours())+":"+E(d.getMinutes())+":"+E(d.getSeconds())+"."+E(Math.floor(d.getMilliseconds()/10)),"] ")}b.Pb&&c.push("[",Wa(a,b.Rb.get()),"s] ");b.Ob&&c.push("[",a.La,"] ");b.Qb&&c.push("[",a.B.name,"] ");c.push(a.Ab);b.Wa&&(d=a.na)&&c.push("\n",d instanceof Error?d.message:d.toString());b.Fa&&c.push("\n");b=
c.join("");if(c=Za)switch(a.B){case Ha:F(c,"info",b);break;case Ia:F(c,"error",b);break;case Ja:F(c,"warn",b);break;default:F(c,"log",b)}}};var G=null,Za=k.console,F=function(a,b,c){if(a[b])a[b](c);else a.log(c)};var $a={Wb:!0},ab={Xb:!0},H=function(){throw Error("Do not instantiate directly");};H.prototype.eb=null;H.prototype.toString=function(){return this.content};var bb=function(){H.call(this)};t(bb,H);bb.prototype.ja=$a;var db=function(){var a=cb(void 0,void 0);if(!qa(a))return String(a);if(a instanceof H){if(a.ja===$a)return a.content;if(a.ja===ab)return Da(a.content)}va("Soy template output is unsafe for use as HTML: "+a);return"zSoyz"};var I=function(a,b){this.xb=100;this.fb=a;this.Kb=b;this.ca=0;this.$=null};I.prototype.get=function(){if(0<this.ca){this.ca--;var a=this.$;this.$=a.next;a.next=null}else a=this.fb();return a};I.prototype.put=function(a){this.Kb(a);this.ca<this.xb&&(this.ca++,a.next=this.$,this.$=a)};var eb=function(a){k.setTimeout(function(){throw a;},0)},fb,gb=function(){var a=k.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==v.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow;a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+
"//"+b.location.host;a=q(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==v.indexOf("Trident")&&-1==v.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Ga;c.Ga=null;a()}};return function(a){d.next={Ga:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in
document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){k.setTimeout(a,0)}};var hb=function(){this.fa=this.M=null},jb=new I(function(){return new ib},function(a){a.reset()});hb.prototype.add=function(a,b){var c=jb.get();c.set(a,b);this.fa?this.fa.next=c:this.M=c;this.fa=c};hb.prototype.remove=function(){var a=null;this.M&&(a=this.M,this.M=this.M.next,this.M||(this.fa=null),a.next=null);return a};var ib=function(){this.next=this.scope=this.pa=null};ib.prototype.set=function(a,b){this.pa=a;this.scope=b;this.next=null};
ib.prototype.reset=function(){this.next=this.scope=this.pa=null};var ob=function(a,b){kb||lb();mb||(kb(),mb=!0);nb.add(a,b)},kb,lb=function(){if(k.Promise&&k.Promise.resolve){var a=k.Promise.resolve(void 0);kb=function(){a.then(pb)}}else kb=function(){var a=pb;!p(k.setImmediate)||k.Window&&k.Window.prototype&&-1==v.indexOf("Edge")&&k.Window.prototype.setImmediate==k.setImmediate?(fb||(fb=gb()),fb(a)):k.setImmediate(a)}},mb=!1,nb=new hb,pb=function(){for(var a;a=nb.remove();){try{a.pa.call(a.scope)}catch(b){eb(b)}jb.put(a)}mb=!1};var M=function(a){this.g=0;this.Sa=void 0;this.D=this.o=this.j=null;this.Z=this.oa=!1;if(a!=l)try{var b=this;a.call(void 0,function(a){K(b,2,a)},function(a){if(!(a instanceof L))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(d){}K(b,3,a)})}catch(c){K(this,3,c)}},qb=function(){this.next=this.context=this.I=this.S=this.A=null;this.W=!1};qb.prototype.reset=function(){this.context=this.I=this.S=this.A=null;this.W=!1};
var rb=new I(function(){return new qb},function(a){a.reset()}),sb=function(a,b,c){var d=rb.get();d.S=a;d.I=b;d.context=c;return d},N=function(){var a,b,c=new M(function(c,e){a=c;b=e});return new tb(c,a,b)};M.prototype.then=function(a,b,c){return ub(this,p(a)?a:null,p(b)?b:null,c)};M.prototype.then=M.prototype.then;M.prototype.$goog_Thenable=!0;M.prototype.cancel=function(a){0==this.g&&ob(function(){var b=new L(a);vb(this,b)},this)};
var vb=function(a,b){if(0==a.g)if(a.j){var c=a.j;if(c.o){for(var d=0,e=null,m=null,n=c.o;n&&(n.W||(d++,n.A==a&&(e=n),!(e&&1<d)));n=n.next)e||(m=n);e&&(0==c.g&&1==d?vb(c,b):(m?(d=m,d.next==c.D&&(c.D=d),d.next=d.next.next):wb(c),xb(c,e,3,b)))}a.j=null}else K(a,3,b)},zb=function(a,b){a.o||2!=a.g&&3!=a.g||yb(a);a.D?a.D.next=b:a.o=b;a.D=b},ub=function(a,b,c,d){var e=sb(null,null,null);e.A=new M(function(a,n){e.S=b?function(c){try{var e=b.call(d,c);a(e)}catch(J){n(J)}}:a;e.I=c?function(b){try{var e=c.call(d,
b);void 0===e&&b instanceof L?n(b):a(e)}catch(J){n(J)}}:n});e.A.j=a;zb(a,e);return e.A};M.prototype.Sb=function(a){this.g=0;K(this,2,a)};M.prototype.Tb=function(a){this.g=0;K(this,3,a)};
var K=function(a,b,c){if(0==a.g){a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself"));a.g=1;a:{var d=c,e=a.Sb,m=a.Tb;if(d instanceof M){zb(d,sb(e||l,m||null,a));var n=!0}else{if(d)try{var D=!!d.$goog_Thenable}catch(J){D=!1}else D=!1;if(D)d.then(e,m,a),n=!0;else{if(qa(d))try{var Z=d.then;if(p(Z)){Ab(d,Z,e,m,a);n=!0;break a}}catch(J){m.call(a,J);n=!0;break a}n=!1}}}n||(a.Sa=c,a.g=b,a.j=null,yb(a),3!=b||c instanceof L||Bb(a,c))}},Ab=function(a,b,c,d,e){var m=!1,n=function(a){m||(m=!0,c.call(e,
a))},D=function(a){m||(m=!0,d.call(e,a))};try{b.call(a,n,D)}catch(Z){D(Z)}},yb=function(a){a.oa||(a.oa=!0,ob(a.jb,a))},wb=function(a){var b=null;a.o&&(b=a.o,a.o=b.next,b.next=null);a.o||(a.D=null);return b};M.prototype.jb=function(){for(var a;a=wb(this);)xb(this,a,this.g,this.Sa);this.oa=!1};
var xb=function(a,b,c,d){if(3==c&&b.I&&!b.W)for(;a&&a.Z;a=a.j)a.Z=!1;if(b.A)b.A.j=null,Cb(b,c,d);else try{b.W?b.S.call(b.context):Cb(b,c,d)}catch(e){Db.call(null,e)}rb.put(b)},Cb=function(a,b,c){2==b?a.S.call(a.context,c):a.I&&a.I.call(a.context,c)},Bb=function(a,b){a.Z=!0;ob(function(){a.Z&&Db.call(null,b)})},Db=eb,L=function(a){u.call(this,a)};t(L,u);L.prototype.name="cancel";var tb=function(a,b,c){this.K=a;this.resolve=b;this.reject=c};var O=function(){this.X=this.X;this.da=this.da};O.prototype.X=!1;O.prototype.la=function(){this.X||(this.X=!0,this.ma())};O.prototype.ma=function(){if(this.da)for(;this.da.length;)this.da.shift()()};var Eb=function(a,b,c){O.call(this);this.yb=null!=c?q(a,c):a;this.wb=b;this.cb=q(this.Fb,this);this.ha=[]};t(Eb,O);f=Eb.prototype;f.L=!1;f.T=0;f.C=null;f.mb=function(a){this.ha=arguments;this.C||this.T?this.L=!0:Fb(this)};f.stop=function(){this.C&&(k.clearTimeout(this.C),this.C=null,this.L=!1,this.ha=[])};f.pause=function(){this.T++};f.resume=function(){this.T--;this.T||!this.L||this.C||(this.L=!1,Fb(this))};f.ma=function(){Eb.Xa.ma.call(this);this.stop()};
f.Fb=function(){this.C=null;this.L&&!this.T&&(this.L=!1,Fb(this))};var Fb=function(a){var b=a.cb;var c=a.wb;if(!p(b))if(b&&"function"==typeof b.handleEvent)b=q(b.handleEvent,b);else throw Error("Invalid listener argument");b=2147483647<Number(c)?-1:k.setTimeout(b,c||0);a.C=b;a.yb.apply(null,a.ha)};var P=function(a){a.controller=this;this.a=a;this.v=this.f=this.b=null;this.Pa=this.Eb.bind(this);this.G=this.Bb.bind(this);this.H=this.Cb.bind(this);this.m=0;this.Ub=new Eb(this.kb,200,this)};f=P.prototype;f.za=function(){this.f&&(this.m++,this.a.isPaused=!this.a.isPaused,this.a.isPaused?this.f.pause(null,this.H,this.G):this.f.play(null,this.H,this.G))};f.stop=function(){this.f&&(this.m++,this.f.stop(null,this.H,this.G))};
f.seek=function(){if(this.f){this.v&&(clearTimeout(this.v),this.v=null);this.m++;var a=new chrome.cast.media.SeekRequest;a.currentTime=this.a.currentTime;this.f.seek(a,this.H,this.G)}};f.xa=function(){this.b&&(this.m++,this.a.isMuted=!this.a.isMuted,this.b.setReceiverMuted(this.a.isMuted,this.H,this.G))};f.Ea=function(){this.Ub.mb()};f.kb=function(){this.b&&(this.m++,this.b.setReceiverVolumeLevel(this.a.volumeLevel,this.H,this.G))};f.Cb=function(){this.m--;this.w()};
f.Bb=function(){this.m--;this.f&&this.f.getStatus(null,l,l)};f.Eb=function(){this.f&&(this.a.currentTime=this.f.getEstimatedTime(),this.v=setTimeout(this.Pa,1E3))};
f.w=function(a){if(!(0<this.m))if(this.b){this.a.displayName=this.b.displayName||"";var b=this.b.statusText||"";this.a.displayStatus=b!=this.a.displayName?b:"";!a&&this.b.receiver&&(a=this.b.receiver.volume)&&(null!=a.muted&&(this.a.isMuted=a.muted),null!=a.level&&(this.a.volumeLevel=a.level),this.a.canControlVolume="fixed"!=a.controlType);this.f?(this.a.isMediaLoaded=this.f.playerState!=chrome.cast.media.PlayerState.IDLE,this.a.isPaused=this.f.playerState==chrome.cast.media.PlayerState.PAUSED,this.a.canPause=
0<=this.f.supportedMediaCommands.indexOf(chrome.cast.media.MediaCommand.PAUSE),this.V(this.f.media),this.a.canSeek=0<=this.f.supportedMediaCommands.indexOf(chrome.cast.media.MediaCommand.SEEK)&&0!=this.a.duration,this.a.currentTime=this.f.getEstimatedTime(),this.v&&(clearTimeout(this.v),this.v=null),this.f.playerState==chrome.cast.media.PlayerState.PLAYING&&(this.v=setTimeout(this.Pa,1E3))):this.V(null)}else this.a.displayName="",this.a.displayStatus="",this.V(null)};
f.V=function(a){a?(this.a.duration=a.duration||0,a.metadata&&a.metadata.title&&(this.a.displayStatus=a.metadata.title)):(this.a.isMediaLoaded=!1,this.a.canPause=!1,this.a.canSeek=!1,this.a.currentTime=0,this.a.duration=0)};var Gb=function(a){if(!a.f)for(var b=0,c=a.b.media;b<c.length;b++)if(!c[b].idleReason){a.f=c[b];a.f.addUpdateListener(a.zb.bind(a));break}},Hb=function(a,b){a.b=b;b.addMediaListener(a.Ma.bind(a));b.addUpdateListener(a.Ca.bind(a));Gb(a);a.w()};f=P.prototype;
f.Ca=function(a){a||(this.f=this.b=null);this.w()};f.Ma=function(){Gb(this);this.w(!0)};f.zb=function(a){a||(this.f=null);this.w(!0)};f.ra=function(a,b){return b?100*a/b:0};f.sa=function(a,b){return b?a*b/100:0};f.qa=function(a){return 0>a?"":[("0"+Math.floor(a/3600)).substr(-2),("0"+Math.floor(a/60)%60).substr(-2),("0"+Math.floor(a)%60).substr(-2)].join(":")};var Ib=function(a){function b(a){this.content=a}b.prototype=a.prototype;return function(a,d){a=new b(String(a));void 0!==d&&(a.eb=d);return a}}(bb),Jb={"\x00":"&#0;","\t":"&#9;","\n":"&#10;","\x0B":"&#11;","\f":"&#12;","\r":"&#13;"," ":"&#32;",'"':"&quot;","&":"&amp;","'":"&#39;","-":"&#45;","/":"&#47;","<":"&lt;","=":"&#61;",">":"&gt;","`":"&#96;","\u0085":"&#133;","\u00a0":"&#160;","\u2028":"&#8232;","\u2029":"&#8233;"},Kb=function(a){return Jb[a]},Lb=/[\x00\x22\x27\x3c\x3e]/g,Mb=/<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g,
Nb=/</g;var cb=function(a,b){(a=b||a)&&a.gb?(a=a&&a.gb,null!=a&&a.ja===$a?(a=String(a.content).replace(Mb,"").replace(Nb,"&lt;"),a=String(a).replace(Lb,Kb)):a=Da(String(a)),a=' nonce="'+a+'"'):a="";return Ib("<style"+a+'>.cast_caf_state_c {fill: var(--connected-color, #4285f4);}.cast_caf_state_d {fill: var(--disconnected-color, #7d7d7d);}.cast_caf_state_h {opacity: 0;}</style><svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24"><g><path id="cast_caf_icon_arch0" class="cast_caf_status_d" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path id="cast_caf_icon_arch1" class="cast_caf_status_d" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path id="cast_caf_icon_arch2" class="cast_caf_status_d" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path id="cast_caf_icon_box" class="cast_caf_status_d" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path id="cast_caf_icon_boxfill" class="cast_caf_state_h" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>')};
cb.Yb="cast.framework.CastButtonTemplate.icon";r("cast.framework.VERSION","1.0.07");r("cast.framework.LoggerLevel",{DEBUG:0,INFO:800,WARNING:900,ERROR:1E3,NONE:1500});r("cast.framework.CastState",{NO_DEVICES_AVAILABLE:"NO_DEVICES_AVAILABLE",NOT_CONNECTED:"NOT_CONNECTED",CONNECTING:"CONNECTING",CONNECTED:"CONNECTED"});
r("cast.framework.SessionState",{NO_SESSION:"NO_SESSION",SESSION_STARTING:"SESSION_STARTING",SESSION_STARTED:"SESSION_STARTED",SESSION_START_FAILED:"SESSION_START_FAILED",SESSION_ENDING:"SESSION_ENDING",SESSION_ENDED:"SESSION_ENDED",SESSION_RESUMED:"SESSION_RESUMED"});r("cast.framework.CastContextEventType",{CAST_STATE_CHANGED:"caststatechanged",SESSION_STATE_CHANGED:"sessionstatechanged"});
r("cast.framework.SessionEventType",{APPLICATION_STATUS_CHANGED:"applicationstatuschanged",APPLICATION_METADATA_CHANGED:"applicationmetadatachanged",ACTIVE_INPUT_STATE_CHANGED:"activeinputstatechanged",VOLUME_CHANGED:"volumechanged",MEDIA_SESSION:"mediasession"});
r("cast.framework.RemotePlayerEventType",{ANY_CHANGE:"anyChanged",IS_CONNECTED_CHANGED:"isConnectedChanged",IS_MEDIA_LOADED_CHANGED:"isMediaLoadedChanged",DURATION_CHANGED:"durationChanged",CURRENT_TIME_CHANGED:"currentTimeChanged",IS_PAUSED_CHANGED:"isPausedChanged",VOLUME_LEVEL_CHANGED:"volumeLevelChanged",CAN_CONTROL_VOLUME_CHANGED:"canControlVolumeChanged",IS_MUTED_CHANGED:"isMutedChanged",CAN_PAUSE_CHANGED:"canPauseChanged",CAN_SEEK_CHANGED:"canSeekChanged",DISPLAY_NAME_CHANGED:"displayNameChanged",
STATUS_TEXT_CHANGED:"statusTextChanged",TITLE_CHANGED:"titleChanged",DISPLAY_STATUS_CHANGED:"displayStatusChanged",MEDIA_INFO_CHANGED:"mediaInfoChanged",IMAGE_URL_CHANGED:"imageUrlChanged",PLAYER_STATE_CHANGED:"playerStateChanged"});r("cast.framework.ActiveInputState",{ACTIVE_INPUT_STATE_UNKNOWN:-1,ACTIVE_INPUT_STATE_NO:0,ACTIVE_INPUT_STATE_YES:1});var Ob=function(a){Ra().Da(Na(a))};r("cast.framework.setLoggerLevel",Ob);G||(G=new Ya);
if(G){var Pb=G;if(1!=Pb.Ka){var Qb=Ra(),Rb=Pb.Hb;Qb.P||(Qb.P=[]);Qb.P.push(Rb);Pb.Ka=!0}}Ob(1E3);var Q=function(a){this.type=a};r("cast.framework.EventData",Q);var Sb=function(a){this.type="activeinputstatechanged";this.activeInputState=a};g(Sb,Q);r("cast.framework.ActiveInputStateEventData",Sb);var Tb=function(a){this.applicationId=a.appId;this.name=a.displayName;this.images=a.appImages;this.namespaces=this.ya(a.namespaces||[])};r("cast.framework.ApplicationMetadata",Tb);Tb.prototype.ya=function(a){return a.map(function(a){return a.name})};var Ub=function(a){this.type="applicationmetadatachanged";this.metadata=a};g(Ub,Q);r("cast.framework.ApplicationMetadataEventData",Ub);var Vb=function(a){this.type="applicationstatuschanged";this.status=a};g(Vb,Q);r("cast.framework.ApplicationStatusEventData",Vb);var Wb=Sa("cast.framework.EventTarget"),R=function(){this.R={}};R.prototype.addEventListener=function(a,b){a in this.R||(this.R[a]=[]);a=this.R[a];a.includes(b)||a.push(b)};R.prototype.removeEventListener=function(a,b){a=this.R[a]||[];b=a.indexOf(b);0<=b&&a.splice(b,1)};R.prototype.dispatchEvent=function(a){a&&a.type&&(this.R[a.type]||[]).slice().forEach(function(b){try{b(a)}catch(c){Wb&&Wb.log(Ia,"Handler for "+a.type+" event failed: "+c,c)}})};var Xb=function(a){a=a||{};this.receiverApplicationId=a.receiverApplicationId||null;this.resumeSavedSession=void 0!==a.resumeSavedSession?a.resumeSavedSession:!0;this.autoJoinPolicy=void 0!==a.autoJoinPolicy?a.autoJoinPolicy:chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;this.language=a.language||null};r("cast.framework.CastOptions",Xb);var Yb=function(a){this.type="mediasession";this.mediaSession=a};g(Yb,Q);r("cast.framework.MediaSessionEventData",Yb);var Zb=function(a,b){this.type="volumechanged";this.volume=a;this.isMute=b};g(Zb,Q);r("cast.framework.VolumeEventData",Zb);var S=function(a,b){this.h=new R;this.g=b;this.c=a;this.Ta=a.sessionId;this.U=a.statusText;this.Qa=a.receiver;this.i=a.receiver.volume;this.ba=new Tb(a);this.aa=a.receiver.isActiveInput;this.c.addMediaListener(this.wa.bind(this));$b(this)};r("cast.framework.CastSession",S);var $b=function(a){var b=a.c.loadMedia.bind(a.c);a.c.loadMedia=function(c,e,m){b(c,function(b){e&&e(b);a.wa(b)},m)};var c=a.c.queueLoad.bind(a.c);a.c.queueLoad=function(b,e,m){c(b,function(b){e&&e(b);a.wa(b)},m)}};
S.prototype.addEventListener=function(a,b){this.h.addEventListener(a,b)};S.prototype.addEventListener=S.prototype.addEventListener;S.prototype.removeEventListener=function(a,b){this.h.removeEventListener(a,b)};S.prototype.removeEventListener=S.prototype.removeEventListener;
var ac=function(a,b){a.Qa=b;!b.volume||a.i&&a.i.muted==b.volume.muted&&a.i.level==b.volume.level||(a.i=b.volume,a.h.dispatchEvent(new Zb(a.i.level,a.i.muted)));a.aa!=b.isActiveInput&&(a.aa=b.isActiveInput,b=a.aa,a.h.dispatchEvent(new Sb(null==b?-1:b?1:0)))};S.prototype.ub=function(){return this.c};S.prototype.getSessionObj=S.prototype.ub;S.prototype.tb=function(){return this.Ta};S.prototype.getSessionId=S.prototype.tb;S.prototype.ta=function(){return this.g};S.prototype.getSessionState=S.prototype.ta;
S.prototype.qb=function(){return this.Qa};S.prototype.getCastDevice=S.prototype.qb;S.prototype.ob=function(){return this.ba};S.prototype.getApplicationMetadata=S.prototype.ob;S.prototype.pb=function(){return this.U};S.prototype.getApplicationStatus=S.prototype.pb;S.prototype.nb=function(){var a=this.aa;return null==a?-1:a?1:0};S.prototype.getActiveInputState=S.prototype.nb;S.prototype.Ia=function(a){"SESSION_ENDED"!=this.g&&(a?this.c.stop(l,l):this.c.leave(l,l))};S.prototype.endSession=S.prototype.Ia;
S.prototype.setVolume=function(a){var b=N(),c=Promise.resolve(b.K);this.i&&(this.i.level=a,this.i.muted=!1);this.c.setReceiverVolumeLevel(a,function(){return b.resolve()},function(a){return b.reject(a.code)});return c};S.prototype.setVolume=S.prototype.setVolume;S.prototype.vb=function(){return this.i?this.i.level:null};S.prototype.getVolume=S.prototype.vb;
S.prototype.Mb=function(a){var b=N(),c=Promise.resolve(b.K);this.i&&(this.i.muted=a);this.c.setReceiverMuted(a,function(){return b.resolve()},function(a){return b.reject(a.code)});return c};S.prototype.setMute=S.prototype.Mb;S.prototype.isMute=function(){return this.i?this.i.muted:null};S.prototype.isMute=S.prototype.isMute;S.prototype.sendMessage=function(a,b){var c=N(),d=Promise.resolve(c.K);this.c.sendMessage(a,b,function(){return c.resolve()},function(a){return c.reject(a.code)});return d};
S.prototype.sendMessage=S.prototype.sendMessage;S.prototype.addMessageListener=function(a,b){this.c.addMessageListener(a,b)};S.prototype.addMessageListener=S.prototype.addMessageListener;S.prototype.removeMessageListener=function(a,b){this.c.removeMessageListener(a,b)};S.prototype.removeMessageListener=S.prototype.removeMessageListener;S.prototype.loadMedia=function(a){var b=N(),c=Promise.resolve(b.K);this.c.loadMedia(a,function(){b.resolve()},function(a){b.reject(a.code)});return c};
S.prototype.loadMedia=S.prototype.loadMedia;S.prototype.Ja=function(){a:{var a=this.c;if(a.media){a=na(a.media);for(var b=a.next();!b.done;b=a.next())if(b=b.value,!b.idleReason){a=b;break a}}a=null}return a};S.prototype.getMediaSession=S.prototype.Ja;S.prototype.wa=function(a){a.media&&this.h.dispatchEvent(new Yb(a))};S.prototype.ya=function(a){return a.map(function(a,c){return c.name})};var bc=function(a){this.type="caststatechanged";this.castState=a};g(bc,Q);r("cast.framework.CastStateEventData",bc);var cc=function(a,b,c){this.type="sessionstatechanged";this.session=a;this.sessionState=b;this.errorCode=void 0!==c?c:null};g(cc,Q);r("cast.framework.SessionStateEventData",cc);var Ta=Sa("cast.framework.CastContext"),T=function(){this.h=new R;this.va=!1;this.u=null;this.Ba=!1;this.N="NO_DEVICES_AVAILABLE";this.l="NO_SESSION";this.ea=this.b=null};r("cast.framework.CastContext",T);T.prototype.addEventListener=function(a,b){this.h.addEventListener(a,b)};T.prototype.addEventListener=T.prototype.addEventListener;T.prototype.removeEventListener=function(a,b){this.h.removeEventListener(a,b)};T.prototype.removeEventListener=T.prototype.removeEventListener;
T.prototype.Nb=function(a){if(this.va)B("CastContext already initialized, new options are ignored");else{this.u=new Xb(a);if(!this.u||!this.u.receiverApplicationId)throw Error("Missing application id in cast options");a=new chrome.cast.SessionRequest(this.u.receiverApplicationId);this.u.language&&(a.language=this.u.language);a=new chrome.cast.ApiConfig(a,this.Ua.bind(this),this.Jb.bind(this),this.u.autoJoinPolicy);chrome.cast.initialize(a,l,l);chrome.cast.addReceiverActionListener(this.Ib.bind(this));
this.va=!0}};T.prototype.setOptions=T.prototype.Nb;T.prototype.rb=function(){return this.N};T.prototype.getCastState=T.prototype.rb;T.prototype.ta=function(){return this.l};T.prototype.getSessionState=T.prototype.ta;
T.prototype.requestSession=function(){var a=this;if(!this.va)throw Error("Cannot start session before cast options are provided");var b=N(),c=Promise.resolve(b.K);ub(b.K,null,l,void 0);c.catch(l);var d="NOT_CONNECTED"==this.N;chrome.cast.requestSession(function(c){a.Ua(c);b.resolve(null)},function(c){d&&U(a,"SESSION_START_FAILED",c?c.code:void 0);b.reject(c.code)});return c};T.prototype.requestSession=T.prototype.requestSession;T.prototype.sb=function(){return this.b};
T.prototype.getCurrentSession=T.prototype.sb;T.prototype.ib=function(a){this.b&&this.b.Ia(a)};T.prototype.endCurrentSession=T.prototype.ib;T.prototype.Jb=function(a){(this.Ba=a==chrome.cast.ReceiverAvailability.AVAILABLE)&&!this.b&&this.ea&&this.u.resumeSavedSession&&chrome.cast.requestSessionById(this.ea);dc(this)};T.prototype.Ib=function(a,b){this.b||b!=chrome.cast.ReceiverAction.CAST?this.b&&b==chrome.cast.ReceiverAction.STOP?U(this,"SESSION_ENDING"):a&&ac(this.b,a):U(this,"SESSION_STARTING")};
T.prototype.Ua=function(a){var b="SESSION_STARTING"==this.l?"SESSION_STARTED":"SESSION_RESUMED";this.ea=null;this.b=new S(a,b);a.addUpdateListener(this.Ca.bind(this));U(this,b)};
T.prototype.Ca=function(){if(this.b)switch(this.b.c.status){case chrome.cast.SessionStatus.DISCONNECTED:case chrome.cast.SessionStatus.STOPPED:U(this,"SESSION_ENDED");this.ea=this.b.Ta;this.b=null;break;case chrome.cast.SessionStatus.CONNECTED:var a=this.b,b=a.ba,c=a.c,d;if(d=b.applicationId==c.appId&&b.name==c.displayName)a:if(d=b.namespaces,b=b.ya(c.namespaces||[]),pa(d)&&pa(b)&&d.length==b.length){c=d.length;for(var e=0;e<c;e++)if(d[e]!==b[e]){d=!1;break a}d=!0}else d=!1;d||(a.ba=new Tb(a.c),a.h.dispatchEvent(new Ub(a.ba)));
ac(a,a.c.receiver);a.U!=a.c.statusText&&(a.U=a.c.statusText,a.h.dispatchEvent(new Vb(a.U)));break;default:B("Unknown session status "+this.b.c.status)}else B("Received session update event without known session")};
var U=function(a,b,c){b==a.l?"SESSION_START_FAILED"==b&&a.h.dispatchEvent(new cc(a.b,a.l,c)):(a.l=b,a.b&&(a.b.g=a.l),a.h.dispatchEvent(new cc(a.b,a.l,c)),dc(a))},dc=function(a){var b="NO_DEVICES_AVAILABLE";switch(a.l){case "SESSION_STARTING":case "SESSION_ENDING":b="CONNECTING";break;case "SESSION_STARTED":case "SESSION_RESUMED":b="CONNECTED";break;case "NO_SESSION":case "SESSION_ENDED":case "SESSION_START_FAILED":b=a.Ba?"NOT_CONNECTED":"NO_DEVICES_AVAILABLE";break;default:B("Unexpected session state: "+
a.l)}b!==a.N&&(a.N=b,a.h.dispatchEvent(new bc(b)))};T.ua=void 0;T.O=function(){return T.ua?T.ua:T.ua=new T};T.getInstance=T.O;var V=function(a){this.F=a;try{this.F.createShadowRoot().innerHTML=cb().content}catch(b){this.F.innerHTML=db()}},gc=function(a,b){a.ka=T.O();a.Oa=a.Db.bind(a);a.ga=[];for(var c=0;3>c;c++)a.ga.push(b.querySelector("#cast_caf_icon_arch"+c));a.ab=b.querySelector("#cast_caf_icon_box");a.bb=b.querySelector("#cast_caf_icon_boxfill");a.Aa=0;a.J=null;a.hb=window.getComputedStyle(a.F,null).display;a.g=a.ka.N;ec(a);a.F.addEventListener("click",fc);a.ka.addEventListener("caststatechanged",a.Oa)},hc=function(a){a.ka.removeEventListener("caststatechanged",
a.Oa);null!==a.J&&(window.clearTimeout(a.J),a.J=null)},fc=function(){T.O().requestSession()};V.prototype.Db=function(a){this.g=a.castState;ec(this)};var ec=function(a){if("NO_DEVICES_AVAILABLE"==a.g)a.F.style.display="none";else switch(a.F.style.display=a.hb,a.g){case "NOT_CONNECTED":ic(a,!1,"cast_caf_state_h");break;case "CONNECTING":ic(a,!1,"cast_caf_state_h");a.J||a.Ha();break;case "CONNECTED":ic(a,!0,"cast_caf_state_c")}};
V.prototype.Ha=function(){this.J=null;if("CONNECTING"==this.g){for(var a=0;3>a;a++)jc(this.ga[a],a==this.Aa);this.Aa=(this.Aa+1)%3;this.J=window.setTimeout(this.Ha.bind(this),300)}};var ic=function(a,b,c){for(var d=na(a.ga),e=d.next();!e.done;e=d.next())jc(e.value,b);jc(a.ab,b);a.bb.setAttribute("class",c)},jc=function(a,b){a.setAttribute("class",b?"cast_caf_state_c":"cast_caf_state_d")},W=function(){return HTMLElement.call(this)||this};g(W,HTMLElement);
W.prototype.createdCallback=function(){this.s=new V(this)};W.prototype.attachedCallback=function(){gc(this.s,this.shadowRoot||this)};W.prototype.detachedCallback=function(){hc(this.s)};W.prototype.la=function(){};var X=function(){return HTMLButtonElement.call(this)||this};g(X,HTMLButtonElement);X.prototype.createdCallback=function(){this.s=new V(this)};X.prototype.attachedCallback=function(){gc(this.s,this.shadowRoot||this)};X.prototype.detachedCallback=function(){hc(this.s)};X.prototype.la=function(){};
var lc=function(){var a=document.createElement.bind(document);document.createElement=function(b,c){if("google-cast-launcher"===b||"button"===b&&c&&("google-cast-button"===c||"google-cast-button"===c.is)){var d=a(b,c);kc(d);return d}return a.apply(null,arguments)}},mc=function(){document.querySelectorAll("button[is=google-cast-button], google-cast-launcher").forEach(function(a){return kc(a)})},kc=function(a){a.s=new V(a);gc(a.s,a.shadowRoot||a);a.la=function(){hc(a.s)}};
document.registerElement?(document.registerElement("google-cast-button",{prototype:X.prototype,extends:"button"}),document.registerElement("google-cast-launcher",{prototype:W.prototype})):("complete"!==document.readyState?window.addEventListener("load",mc):mc(),lc());r("cast.framework.RemotePlayer",function(){this.isMediaLoaded=this.isConnected=!1;this.currentTime=this.duration=0;this.volumeLevel=1;this.canControlVolume=!0;this.canSeek=this.canPause=this.isMuted=this.isPaused=!1;this.displayStatus=this.title=this.statusText=this.displayName="";this.controller=this.savedPlayerState=this.playerState=this.imageUrl=this.mediaInfo=null});var nc=function(a,b,c){this.type=a;this.field=b;this.value=c};g(nc,Q);r("cast.framework.RemotePlayerChangedEvent",nc);var Y=function(a){var b=new R;P.call(this,oc(a,b));this.h=b;a=T.O();a.addEventListener("sessionstatechanged",this.Lb.bind(this));(a=a.b)?Hb(this,a.c):this.w()};g(Y,P);r("cast.framework.RemotePlayerController",Y);var oc=function(a,b){return new window.Proxy(a,{set:function(a,d,e){if(e===a[d])return!0;a[d]=e;b.dispatchEvent(new nc(d+"Changed",d,e));b.dispatchEvent(new nc("anyChanged",d,e));return!0}})};Y.prototype.addEventListener=function(a,b){this.h.addEventListener(a,b)};
Y.prototype.addEventListener=Y.prototype.addEventListener;Y.prototype.removeEventListener=function(a,b){this.h.removeEventListener(a,b)};Y.prototype.removeEventListener=Y.prototype.removeEventListener;Y.prototype.Lb=function(a){switch(a.sessionState){case "SESSION_STARTED":case "SESSION_RESUMED":this.a.isConnected=!0;var b=a.session&&a.session.c;b&&(Hb(this,b),a.session.addEventListener("mediasession",this.Ma.bind(this)))}};
Y.prototype.w=function(a){var b=T.O().b;b?this.a.savedPlayerState=null:this.a.isConnected&&(this.a.savedPlayerState={mediaInfo:this.a.mediaInfo,currentTime:this.a.currentTime,isPaused:this.a.isPaused});P.prototype.w.call(this,a);this.a.isConnected=!!b;this.a.statusText=b&&b.U||"";a=b&&b.Ja();this.a.playerState=a&&a.playerState||null};
Y.prototype.V=function(a){P.prototype.V.call(this,a);var b=(this.a.mediaInfo=a)&&a.metadata;a=null;var c="";b&&(c=b.title||"",(b=b.images)&&0<b.length&&(a=b[0].url));this.a.title=c;this.a.imageUrl=a};Y.prototype.za=function(){P.prototype.za.call(this)};Y.prototype.playOrPause=Y.prototype.za;Y.prototype.stop=function(){P.prototype.stop.call(this)};Y.prototype.stop=Y.prototype.stop;Y.prototype.seek=function(){P.prototype.seek.call(this)};Y.prototype.seek=Y.prototype.seek;Y.prototype.xa=function(){P.prototype.xa.call(this)};
Y.prototype.muteOrUnmute=Y.prototype.xa;Y.prototype.Ea=function(){P.prototype.Ea.call(this)};Y.prototype.setVolumeLevel=Y.prototype.Ea;Y.prototype.qa=function(a){return P.prototype.qa.call(this,a)};Y.prototype.getFormattedTime=Y.prototype.qa;Y.prototype.ra=function(a,b){return P.prototype.ra.call(this,a,b)};Y.prototype.getSeekPosition=Y.prototype.ra;Y.prototype.sa=function(a,b){return P.prototype.sa.call(this,a,b)};Y.prototype.getSeekTime=Y.prototype.sa; }).call(window);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),

/***/ 153:
/***/ (function(module, exports) {

(function() {var e=function(a){return!!document.currentScript&&(-1!=document.currentScript.src.indexOf("?"+a)||-1!=document.currentScript.src.indexOf("&"+a))},f=e("loadGamesSDK")?"/cast_game_sender.js":"/cast_sender.js",g=e("loadCastFramework")||e("loadCastApplicationFramework"),h=function(){return"function"==typeof window.__onGCastApiAvailable?window.__onGCastApiAvailable:null},k=["pkedcjkdefgpdelpbcmbmeomcjbeemfm","enhhojjnijigcajfphajepfemndkmdlo"],m=function(a){a.length?l(a.shift(),function(){m(a)}):n()},
p=function(a){return"chrome-extension://"+a+f},l=function(a,c,b){var d=document.createElement("script");d.onerror=c;b&&(d.onload=b);d.src=a;(document.head||document.documentElement).appendChild(d)},q=function(a){return 0<=window.navigator.userAgent.indexOf(a)},n=function(){var a=h();a&&a(!1,"No cast extension found")},r=function(){if(g){var a=2,c=h(),b=function(){a--;0==a&&c&&c(!0)};window.__onGCastApiAvailable=b;l("//www.gstatic.com/cast/sdk/libs/sender/1.0/cast_framework.js",n,b)}};if(q("CriOS")){var t=window.__gCrWeb&&window.__gCrWeb.message&&window.__gCrWeb.message.invokeOnHost;t&&(r(),t({command:"cast.sender.init"}))}else if(q("Android")&&q("Chrome/")&&window.navigator.presentation){r();var u=window.navigator.userAgent.match(/Chrome\/([0-9]+)/);m(["//www.gstatic.com/eureka/clank/"+(u?parseInt(u[1],10):0)+f,"//www.gstatic.com/eureka/clank"+f])}else window.chrome&&window.navigator.presentation&&!q("Edge")?(r(),m(k.map(p))):n();})();

/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(170);


/***/ }),

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_route__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_route___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_route__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular_animate__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular_animate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angular_animate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__styles_index__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_popper_js__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_tooltip_js__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jquery_flipster__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jquery_flipster___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_jquery_flipster__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_moment__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_typeface_roboto__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_typeface_roboto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_typeface_roboto__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_bootstrap_js_dist_carousel__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_bootstrap_js_dist_carousel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_bootstrap_js_dist_carousel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_bootstrap_js_dist_collapse__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_bootstrap_js_dist_collapse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_bootstrap_js_dist_collapse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_bootstrap_js_dist_popover__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_bootstrap_js_dist_popover___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_bootstrap_js_dist_popover__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_bootstrap_js_dist_tooltip__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_bootstrap_js_dist_tooltip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_bootstrap_js_dist_tooltip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_bootstrap_js_dist_util__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_bootstrap_js_dist_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_bootstrap_js_dist_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_ag_grid_community__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_ag_grid_community___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_ag_grid_community__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__API_subsonic_api__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__API_subsonic_api___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__API_subsonic_api__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__API_cast_framework__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__API_cast_framework___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__API_cast_framework__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__API_cast_v1__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__API_cast_v1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__API_cast_v1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__factories__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__config_js__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__run_js__ = __webpack_require__(333);



__webpack_require__.p = "http://localhost:" + undefined + "/";





//import 'jquery-easing';


//import 'bootstrap';







__webpack_require__(121);




//import Clipboard from 'clipboard';






__WEBPACK_IMPORTED_MODULE_15_ag_grid_community__["initialiseAgGridWithAngular1"](__WEBPACK_IMPORTED_MODULE_0_angular___default.a);
$('[data-toggle="popover"]').popover();

__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('subsonic', [__WEBPACK_IMPORTED_MODULE_1_angular_route___default.a, __WEBPACK_IMPORTED_MODULE_2_angular_animate___default.a, 'agGrid', __WEBPACK_IMPORTED_MODULE_19__components__["a" /* default */].name, __WEBPACK_IMPORTED_MODULE_21__factories__["a" /* default */].name, __WEBPACK_IMPORTED_MODULE_20__services__["a" /* default */].name])
  .config(__WEBPACK_IMPORTED_MODULE_22__config_js__["a" /* default */])
  .run(__WEBPACK_IMPORTED_MODULE_23__run_js__["a" /* default */]);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(18)))

/***/ }),

/***/ 176:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_bootstrap_scss__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_bootstrap_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sass_bootstrap_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sass_fontawesome_scss__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sass_fontawesome_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__sass_fontawesome_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ag_grid_community_dist_styles_ag_grid_css__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ag_grid_community_dist_styles_ag_grid_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ag_grid_community_dist_styles_ag_grid_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ag_grid_community_dist_styles_ag_theme_dark_css__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ag_grid_community_dist_styles_ag_theme_dark_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ag_grid_community_dist_styles_ag_theme_dark_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery_flipster_dist_jquery_flipster_min_css__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery_flipster_dist_jquery_flipster_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jquery_flipster_dist_jquery_flipster_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sass_base_scss__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sass_base_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__sass_base_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sass_mixins_scss__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sass_mixins_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__sass_mixins_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sass_loader_scss__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sass_loader_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__sass_loader_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sass_toolbar_scss__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sass_toolbar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__sass_toolbar_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__sass_sidebar_scss__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__sass_sidebar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__sass_sidebar_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__sass_header_scss__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__sass_header_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__sass_header_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__sass_footer_scss__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__sass_footer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__sass_footer_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__sass_artist_scss__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__sass_artist_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__sass_artist_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__sass_artists_scss__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__sass_artists_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__sass_artists_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__sass_index_view_scss__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__sass_index_view_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__sass_index_view_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__sass_playlist_scss__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__sass_playlist_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__sass_playlist_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__sass_playing_scss__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__sass_playing_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__sass_playing_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__sass_fresh_scss__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__sass_fresh_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__sass_fresh_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__sass_genre_scss__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__sass_genre_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__sass_genre_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__sass_genres_scss__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__sass_genres_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__sass_genres_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__sass_starred_scss__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__sass_starred_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__sass_starred_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__sass_status_scss__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__sass_status_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__sass_status_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__sass_subsonicSettings_scss__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__sass_subsonicSettings_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__sass_subsonicSettings_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__sass_debug_scss__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__sass_debug_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__sass_debug_scss__);
//import 'bootstrap/dist/css/bootstrap.min.css';


























/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(178);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./bootstrap.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./bootstrap.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ":root {\n  --blue: #007bff;\n  --indigo: #6610f2;\n  --purple: #6f42c1;\n  --pink: #e83e8c;\n  --red: #dc3545;\n  --orange: #fd7e14;\n  --yellow: #ffc107;\n  --green: #28a745;\n  --teal: #20c997;\n  --cyan: #17a2b8;\n  --white: #fff;\n  --gray: #6c757d;\n  --gray-dark: #343a40;\n  --primary: #007bff;\n  --secondary: #6c757d;\n  --success: #28a745;\n  --info: #17a2b8;\n  --warning: #ffc107;\n  --danger: #dc3545;\n  --light: #f8f9fa;\n  --dark: #343a40;\n  --breakpoint-xs: 0;\n  --breakpoint-sm: 576px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 992px;\n  --breakpoint-xl: 1200px;\n  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\nhtml {\n  font-family: sans-serif;\n  line-height: 1.15;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -ms-overflow-style: scrollbar;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }\n\n@-ms-viewport {\n  width: device-width; }\n\narticle, aside, figcaption, figure, footer, header, hgroup, main, nav, section {\n  display: block; }\n\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  text-align: left;\n  background-color: #fff; }\n\n[tabindex=\"-1\"]:focus {\n  outline: 0 !important; }\n\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: 0.5rem; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nabbr[title],\nabbr[data-original-title] {\n  text-decoration: underline;\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  cursor: help;\n  border-bottom: 0; }\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit; }\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0; }\n\ndt {\n  font-weight: 700; }\n\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0; }\n\nblockquote {\n  margin: 0 0 1rem; }\n\ndfn {\n  font-style: italic; }\n\nb,\nstrong {\n  font-weight: bolder; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -.25em; }\n\nsup {\n  top: -.5em; }\n\na {\n  color: #007bff;\n  text-decoration: none;\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects; }\n  a:hover {\n    color: #0056b3;\n    text-decoration: underline; }\n\na:not([href]):not([tabindex]) {\n  color: inherit;\n  text-decoration: none; }\n  a:not([href]):not([tabindex]):hover, a:not([href]):not([tabindex]):focus {\n    color: inherit;\n    text-decoration: none; }\n  a:not([href]):not([tabindex]):focus {\n    outline: 0; }\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n  font-size: 1em; }\n\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto;\n  -ms-overflow-style: scrollbar; }\n\nfigure {\n  margin: 0 0 1rem; }\n\nimg {\n  vertical-align: middle;\n  border-style: none; }\n\nsvg {\n  overflow: hidden;\n  vertical-align: middle; }\n\ntable {\n  border-collapse: collapse; }\n\ncaption {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: #6c757d;\n  text-align: left;\n  caption-side: bottom; }\n\nth {\n  text-align: inherit; }\n\nlabel {\n  display: inline-block;\n  margin-bottom: 0.5rem; }\n\nbutton {\n  border-radius: 0; }\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color; }\n\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\nbutton,\ninput {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  padding: 0;\n  border-style: none; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  -webkit-appearance: listbox; }\n\ntextarea {\n  overflow: auto;\n  resize: vertical; }\n\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit;\n  color: inherit;\n  white-space: normal; }\n\nprogress {\n  vertical-align: baseline; }\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n[type=\"search\"] {\n  outline-offset: -2px;\n  -webkit-appearance: none; }\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n::-webkit-file-upload-button {\n  font: inherit;\n  -webkit-appearance: button; }\n\noutput {\n  display: inline-block; }\n\nsummary {\n  display: list-item;\n  cursor: pointer; }\n\ntemplate {\n  display: none; }\n\n[hidden] {\n  display: none !important; }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.2;\n  color: inherit; }\n\nh1, .h1 {\n  font-size: 2.5rem; }\n\nh2, .h2 {\n  font-size: 2rem; }\n\nh3, .h3 {\n  font-size: 1.75rem; }\n\nh4, .h4 {\n  font-size: 1.5rem; }\n\nh5, .h5 {\n  font-size: 1.25rem; }\n\nh6, .h6 {\n  font-size: 1rem; }\n\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300; }\n\n.display-1 {\n  font-size: 6rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\n.display-2 {\n  font-size: 5.5rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\n.display-3 {\n  font-size: 4.5rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\n.display-4 {\n  font-size: 3.5rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\nhr {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1); }\n\nsmall,\n.small {\n  font-size: 80%;\n  font-weight: 400; }\n\nmark,\n.mark {\n  padding: 0.2em;\n  background-color: #fcf8e3; }\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline-item {\n  display: inline-block; }\n  .list-inline-item:not(:last-child) {\n    margin-right: 0.5rem; }\n\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase; }\n\n.blockquote {\n  margin-bottom: 1rem;\n  font-size: 1.25rem; }\n\n.blockquote-footer {\n  display: block;\n  font-size: 80%;\n  color: #6c757d; }\n  .blockquote-footer::before {\n    content: \"\\2014   \\A0\"; }\n\n.img-fluid {\n  max-width: 100%;\n  height: auto; }\n\n.img-thumbnail {\n  padding: 0.25rem;\n  background-color: #fff;\n  border: 1px solid #dee2e6;\n  border-radius: 0.25rem;\n  max-width: 100%;\n  height: auto; }\n\n.figure {\n  display: inline-block; }\n\n.figure-img {\n  margin-bottom: 0.5rem;\n  line-height: 1; }\n\n.figure-caption {\n  font-size: 90%;\n  color: #6c757d; }\n\ncode {\n  font-size: 87.5%;\n  color: #e83e8c;\n  word-break: break-word; }\n  a > code {\n    color: inherit; }\n\nkbd {\n  padding: 0.2rem 0.4rem;\n  font-size: 87.5%;\n  color: #fff;\n  background-color: #212529;\n  border-radius: 0.2rem; }\n  kbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: 700; }\n\npre {\n  display: block;\n  font-size: 87.5%;\n  color: #212529; }\n  pre code {\n    font-size: inherit;\n    color: inherit;\n    word-break: normal; }\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll; }\n\n.container {\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto; }\n  @media (min-width: 576px) {\n    .container {\n      max-width: 540px; } }\n  @media (min-width: 768px) {\n    .container {\n      max-width: 720px; } }\n  @media (min-width: 992px) {\n    .container {\n      max-width: 960px; } }\n  @media (min-width: 1200px) {\n    .container {\n      max-width: 1140px; } }\n\n.container-fluid {\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto; }\n\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -15px;\n  margin-left: -15px; }\n\n.no-gutters {\n  margin-right: 0;\n  margin-left: 0; }\n  .no-gutters > .col,\n  .no-gutters > [class*=\"col-\"] {\n    padding-right: 0;\n    padding-left: 0; }\n\n.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,\n.col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,\n.col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,\n.col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,\n.col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,\n.col-xl-auto {\n  position: relative;\n  width: 100%;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px; }\n\n.col {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%; }\n\n.col-auto {\n  flex: 0 0 auto;\n  width: auto;\n  max-width: none; }\n\n.col-1 {\n  flex: 0 0 8.33333%;\n  max-width: 8.33333%; }\n\n.col-2 {\n  flex: 0 0 16.66667%;\n  max-width: 16.66667%; }\n\n.col-3 {\n  flex: 0 0 25%;\n  max-width: 25%; }\n\n.col-4 {\n  flex: 0 0 33.33333%;\n  max-width: 33.33333%; }\n\n.col-5 {\n  flex: 0 0 41.66667%;\n  max-width: 41.66667%; }\n\n.col-6 {\n  flex: 0 0 50%;\n  max-width: 50%; }\n\n.col-7 {\n  flex: 0 0 58.33333%;\n  max-width: 58.33333%; }\n\n.col-8 {\n  flex: 0 0 66.66667%;\n  max-width: 66.66667%; }\n\n.col-9 {\n  flex: 0 0 75%;\n  max-width: 75%; }\n\n.col-10 {\n  flex: 0 0 83.33333%;\n  max-width: 83.33333%; }\n\n.col-11 {\n  flex: 0 0 91.66667%;\n  max-width: 91.66667%; }\n\n.col-12 {\n  flex: 0 0 100%;\n  max-width: 100%; }\n\n.order-first {\n  order: -1; }\n\n.order-last {\n  order: 13; }\n\n.order-0 {\n  order: 0; }\n\n.order-1 {\n  order: 1; }\n\n.order-2 {\n  order: 2; }\n\n.order-3 {\n  order: 3; }\n\n.order-4 {\n  order: 4; }\n\n.order-5 {\n  order: 5; }\n\n.order-6 {\n  order: 6; }\n\n.order-7 {\n  order: 7; }\n\n.order-8 {\n  order: 8; }\n\n.order-9 {\n  order: 9; }\n\n.order-10 {\n  order: 10; }\n\n.order-11 {\n  order: 11; }\n\n.order-12 {\n  order: 12; }\n\n.offset-1 {\n  margin-left: 8.33333%; }\n\n.offset-2 {\n  margin-left: 16.66667%; }\n\n.offset-3 {\n  margin-left: 25%; }\n\n.offset-4 {\n  margin-left: 33.33333%; }\n\n.offset-5 {\n  margin-left: 41.66667%; }\n\n.offset-6 {\n  margin-left: 50%; }\n\n.offset-7 {\n  margin-left: 58.33333%; }\n\n.offset-8 {\n  margin-left: 66.66667%; }\n\n.offset-9 {\n  margin-left: 75%; }\n\n.offset-10 {\n  margin-left: 83.33333%; }\n\n.offset-11 {\n  margin-left: 91.66667%; }\n\n@media (min-width: 576px) {\n  .col-sm {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-sm-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-sm-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-sm-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-sm-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-sm-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-sm-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-sm-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-sm-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-sm-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-sm-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-sm-first {\n    order: -1; }\n  .order-sm-last {\n    order: 13; }\n  .order-sm-0 {\n    order: 0; }\n  .order-sm-1 {\n    order: 1; }\n  .order-sm-2 {\n    order: 2; }\n  .order-sm-3 {\n    order: 3; }\n  .order-sm-4 {\n    order: 4; }\n  .order-sm-5 {\n    order: 5; }\n  .order-sm-6 {\n    order: 6; }\n  .order-sm-7 {\n    order: 7; }\n  .order-sm-8 {\n    order: 8; }\n  .order-sm-9 {\n    order: 9; }\n  .order-sm-10 {\n    order: 10; }\n  .order-sm-11 {\n    order: 11; }\n  .order-sm-12 {\n    order: 12; }\n  .offset-sm-0 {\n    margin-left: 0; }\n  .offset-sm-1 {\n    margin-left: 8.33333%; }\n  .offset-sm-2 {\n    margin-left: 16.66667%; }\n  .offset-sm-3 {\n    margin-left: 25%; }\n  .offset-sm-4 {\n    margin-left: 33.33333%; }\n  .offset-sm-5 {\n    margin-left: 41.66667%; }\n  .offset-sm-6 {\n    margin-left: 50%; }\n  .offset-sm-7 {\n    margin-left: 58.33333%; }\n  .offset-sm-8 {\n    margin-left: 66.66667%; }\n  .offset-sm-9 {\n    margin-left: 75%; }\n  .offset-sm-10 {\n    margin-left: 83.33333%; }\n  .offset-sm-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 768px) {\n  .col-md {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-md-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-md-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-md-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-md-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-md-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-md-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-md-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-md-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-md-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-md-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-md-first {\n    order: -1; }\n  .order-md-last {\n    order: 13; }\n  .order-md-0 {\n    order: 0; }\n  .order-md-1 {\n    order: 1; }\n  .order-md-2 {\n    order: 2; }\n  .order-md-3 {\n    order: 3; }\n  .order-md-4 {\n    order: 4; }\n  .order-md-5 {\n    order: 5; }\n  .order-md-6 {\n    order: 6; }\n  .order-md-7 {\n    order: 7; }\n  .order-md-8 {\n    order: 8; }\n  .order-md-9 {\n    order: 9; }\n  .order-md-10 {\n    order: 10; }\n  .order-md-11 {\n    order: 11; }\n  .order-md-12 {\n    order: 12; }\n  .offset-md-0 {\n    margin-left: 0; }\n  .offset-md-1 {\n    margin-left: 8.33333%; }\n  .offset-md-2 {\n    margin-left: 16.66667%; }\n  .offset-md-3 {\n    margin-left: 25%; }\n  .offset-md-4 {\n    margin-left: 33.33333%; }\n  .offset-md-5 {\n    margin-left: 41.66667%; }\n  .offset-md-6 {\n    margin-left: 50%; }\n  .offset-md-7 {\n    margin-left: 58.33333%; }\n  .offset-md-8 {\n    margin-left: 66.66667%; }\n  .offset-md-9 {\n    margin-left: 75%; }\n  .offset-md-10 {\n    margin-left: 83.33333%; }\n  .offset-md-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 992px) {\n  .col-lg {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-lg-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-lg-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-lg-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-lg-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-lg-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-lg-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-lg-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-lg-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-lg-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-lg-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-lg-first {\n    order: -1; }\n  .order-lg-last {\n    order: 13; }\n  .order-lg-0 {\n    order: 0; }\n  .order-lg-1 {\n    order: 1; }\n  .order-lg-2 {\n    order: 2; }\n  .order-lg-3 {\n    order: 3; }\n  .order-lg-4 {\n    order: 4; }\n  .order-lg-5 {\n    order: 5; }\n  .order-lg-6 {\n    order: 6; }\n  .order-lg-7 {\n    order: 7; }\n  .order-lg-8 {\n    order: 8; }\n  .order-lg-9 {\n    order: 9; }\n  .order-lg-10 {\n    order: 10; }\n  .order-lg-11 {\n    order: 11; }\n  .order-lg-12 {\n    order: 12; }\n  .offset-lg-0 {\n    margin-left: 0; }\n  .offset-lg-1 {\n    margin-left: 8.33333%; }\n  .offset-lg-2 {\n    margin-left: 16.66667%; }\n  .offset-lg-3 {\n    margin-left: 25%; }\n  .offset-lg-4 {\n    margin-left: 33.33333%; }\n  .offset-lg-5 {\n    margin-left: 41.66667%; }\n  .offset-lg-6 {\n    margin-left: 50%; }\n  .offset-lg-7 {\n    margin-left: 58.33333%; }\n  .offset-lg-8 {\n    margin-left: 66.66667%; }\n  .offset-lg-9 {\n    margin-left: 75%; }\n  .offset-lg-10 {\n    margin-left: 83.33333%; }\n  .offset-lg-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 1200px) {\n  .col-xl {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-xl-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-xl-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-xl-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-xl-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-xl-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-xl-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-xl-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-xl-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-xl-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-xl-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-xl-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-xl-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-xl-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-xl-first {\n    order: -1; }\n  .order-xl-last {\n    order: 13; }\n  .order-xl-0 {\n    order: 0; }\n  .order-xl-1 {\n    order: 1; }\n  .order-xl-2 {\n    order: 2; }\n  .order-xl-3 {\n    order: 3; }\n  .order-xl-4 {\n    order: 4; }\n  .order-xl-5 {\n    order: 5; }\n  .order-xl-6 {\n    order: 6; }\n  .order-xl-7 {\n    order: 7; }\n  .order-xl-8 {\n    order: 8; }\n  .order-xl-9 {\n    order: 9; }\n  .order-xl-10 {\n    order: 10; }\n  .order-xl-11 {\n    order: 11; }\n  .order-xl-12 {\n    order: 12; }\n  .offset-xl-0 {\n    margin-left: 0; }\n  .offset-xl-1 {\n    margin-left: 8.33333%; }\n  .offset-xl-2 {\n    margin-left: 16.66667%; }\n  .offset-xl-3 {\n    margin-left: 25%; }\n  .offset-xl-4 {\n    margin-left: 33.33333%; }\n  .offset-xl-5 {\n    margin-left: 41.66667%; }\n  .offset-xl-6 {\n    margin-left: 50%; }\n  .offset-xl-7 {\n    margin-left: 58.33333%; }\n  .offset-xl-8 {\n    margin-left: 66.66667%; }\n  .offset-xl-9 {\n    margin-left: 75%; }\n  .offset-xl-10 {\n    margin-left: 83.33333%; }\n  .offset-xl-11 {\n    margin-left: 91.66667%; } }\n\n.table {\n  width: 100%;\n  margin-bottom: 1rem;\n  background-color: transparent; }\n  .table th,\n  .table td {\n    padding: 0.75rem;\n    vertical-align: top;\n    border-top: 1px solid #dee2e6; }\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6; }\n  .table tbody + tbody {\n    border-top: 2px solid #dee2e6; }\n  .table .table {\n    background-color: #fff; }\n\n.table-sm th,\n.table-sm td {\n  padding: 0.3rem; }\n\n.table-bordered {\n  border: 1px solid #dee2e6; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #dee2e6; }\n  .table-bordered thead th,\n  .table-bordered thead td {\n    border-bottom-width: 2px; }\n\n.table-borderless th,\n.table-borderless td,\n.table-borderless thead th,\n.table-borderless tbody + tbody {\n  border: 0; }\n\n.table-striped tbody tr:nth-of-type(odd) {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.table-hover tbody tr:hover {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n.table-primary,\n.table-primary > th,\n.table-primary > td {\n  background-color: #b8daff; }\n\n.table-hover .table-primary:hover {\n  background-color: #9fcdff; }\n  .table-hover .table-primary:hover > td,\n  .table-hover .table-primary:hover > th {\n    background-color: #9fcdff; }\n\n.table-secondary,\n.table-secondary > th,\n.table-secondary > td {\n  background-color: #d6d8db; }\n\n.table-hover .table-secondary:hover {\n  background-color: #c8cbcf; }\n  .table-hover .table-secondary:hover > td,\n  .table-hover .table-secondary:hover > th {\n    background-color: #c8cbcf; }\n\n.table-success,\n.table-success > th,\n.table-success > td {\n  background-color: #c3e6cb; }\n\n.table-hover .table-success:hover {\n  background-color: #b1dfbb; }\n  .table-hover .table-success:hover > td,\n  .table-hover .table-success:hover > th {\n    background-color: #b1dfbb; }\n\n.table-info,\n.table-info > th,\n.table-info > td {\n  background-color: #bee5eb; }\n\n.table-hover .table-info:hover {\n  background-color: #abdde5; }\n  .table-hover .table-info:hover > td,\n  .table-hover .table-info:hover > th {\n    background-color: #abdde5; }\n\n.table-warning,\n.table-warning > th,\n.table-warning > td {\n  background-color: #ffeeba; }\n\n.table-hover .table-warning:hover {\n  background-color: #ffe8a1; }\n  .table-hover .table-warning:hover > td,\n  .table-hover .table-warning:hover > th {\n    background-color: #ffe8a1; }\n\n.table-danger,\n.table-danger > th,\n.table-danger > td {\n  background-color: #f5c6cb; }\n\n.table-hover .table-danger:hover {\n  background-color: #f1b0b7; }\n  .table-hover .table-danger:hover > td,\n  .table-hover .table-danger:hover > th {\n    background-color: #f1b0b7; }\n\n.table-light,\n.table-light > th,\n.table-light > td {\n  background-color: #fdfdfe; }\n\n.table-hover .table-light:hover {\n  background-color: #ececf6; }\n  .table-hover .table-light:hover > td,\n  .table-hover .table-light:hover > th {\n    background-color: #ececf6; }\n\n.table-dark,\n.table-dark > th,\n.table-dark > td {\n  background-color: #c6c8ca; }\n\n.table-hover .table-dark:hover {\n  background-color: #b9bbbe; }\n  .table-hover .table-dark:hover > td,\n  .table-hover .table-dark:hover > th {\n    background-color: #b9bbbe; }\n\n.table-active,\n.table-active > th,\n.table-active > td {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n.table-hover .table-active:hover {\n  background-color: rgba(0, 0, 0, 0.075); }\n  .table-hover .table-active:hover > td,\n  .table-hover .table-active:hover > th {\n    background-color: rgba(0, 0, 0, 0.075); }\n\n.table .thead-dark th {\n  color: #fff;\n  background-color: #212529;\n  border-color: #32383e; }\n\n.table .thead-light th {\n  color: #495057;\n  background-color: #e9ecef;\n  border-color: #dee2e6; }\n\n.table-dark {\n  color: #fff;\n  background-color: #212529; }\n  .table-dark th,\n  .table-dark td,\n  .table-dark thead th {\n    border-color: #32383e; }\n  .table-dark.table-bordered {\n    border: 0; }\n  .table-dark.table-striped tbody tr:nth-of-type(odd) {\n    background-color: rgba(255, 255, 255, 0.05); }\n  .table-dark.table-hover tbody tr:hover {\n    background-color: rgba(255, 255, 255, 0.075); }\n\n@media (max-width: 575.98px) {\n  .table-responsive-sm {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-sm > .table-bordered {\n      border: 0; } }\n\n@media (max-width: 767.98px) {\n  .table-responsive-md {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-md > .table-bordered {\n      border: 0; } }\n\n@media (max-width: 991.98px) {\n  .table-responsive-lg {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-lg > .table-bordered {\n      border: 0; } }\n\n@media (max-width: 1199.98px) {\n  .table-responsive-xl {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-xl > .table-bordered {\n      border: 0; } }\n\n.table-responsive {\n  display: block;\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n  -ms-overflow-style: -ms-autohiding-scrollbar; }\n  .table-responsive > .table-bordered {\n    border: 0; }\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: calc(2.25rem + 2px);\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  color: #495057;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .form-control {\n      transition: none; } }\n  .form-control::-ms-expand {\n    background-color: transparent;\n    border: 0; }\n  .form-control:focus {\n    color: #495057;\n    background-color: #fff;\n    border-color: #80bdff;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .form-control::-webkit-input-placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control:-ms-input-placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control::-ms-input-placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control::placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control:disabled, .form-control[readonly] {\n    background-color: #e9ecef;\n    opacity: 1; }\n\nselect.form-control:focus::-ms-value {\n  color: #495057;\n  background-color: #fff; }\n\n.form-control-file,\n.form-control-range {\n  display: block;\n  width: 100%; }\n\n.col-form-label {\n  padding-top: calc(0.375rem + 1px);\n  padding-bottom: calc(0.375rem + 1px);\n  margin-bottom: 0;\n  font-size: inherit;\n  line-height: 1.5; }\n\n.col-form-label-lg {\n  padding-top: calc(0.5rem + 1px);\n  padding-bottom: calc(0.5rem + 1px);\n  font-size: 1.25rem;\n  line-height: 1.5; }\n\n.col-form-label-sm {\n  padding-top: calc(0.25rem + 1px);\n  padding-bottom: calc(0.25rem + 1px);\n  font-size: 0.875rem;\n  line-height: 1.5; }\n\n.form-control-plaintext {\n  display: block;\n  width: 100%;\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  margin-bottom: 0;\n  line-height: 1.5;\n  color: #212529;\n  background-color: transparent;\n  border: solid transparent;\n  border-width: 1px 0; }\n  .form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg {\n    padding-right: 0;\n    padding-left: 0; }\n\n.form-control-sm {\n  height: calc(1.8125rem + 2px);\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem; }\n\n.form-control-lg {\n  height: calc(2.875rem + 2px);\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem; }\n\nselect.form-control[size], select.form-control[multiple] {\n  height: auto; }\n\ntextarea.form-control {\n  height: auto; }\n\n.form-group {\n  margin-bottom: 1rem; }\n\n.form-text {\n  display: block;\n  margin-top: 0.25rem; }\n\n.form-row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -5px;\n  margin-left: -5px; }\n  .form-row > .col,\n  .form-row > [class*=\"col-\"] {\n    padding-right: 5px;\n    padding-left: 5px; }\n\n.form-check {\n  position: relative;\n  display: block;\n  padding-left: 1.25rem; }\n\n.form-check-input {\n  position: absolute;\n  margin-top: 0.3rem;\n  margin-left: -1.25rem; }\n  .form-check-input:disabled ~ .form-check-label {\n    color: #6c757d; }\n\n.form-check-label {\n  margin-bottom: 0; }\n\n.form-check-inline {\n  display: inline-flex;\n  align-items: center;\n  padding-left: 0;\n  margin-right: 0.75rem; }\n  .form-check-inline .form-check-input {\n    position: static;\n    margin-top: 0;\n    margin-right: 0.3125rem;\n    margin-left: 0; }\n\n.valid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 80%;\n  color: #28a745; }\n\n.valid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: .1rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #fff;\n  background-color: rgba(40, 167, 69, 0.9);\n  border-radius: 0.25rem; }\n\n.was-validated .form-control:valid, .form-control.is-valid, .was-validated\n.custom-select:valid,\n.custom-select.is-valid {\n  border-color: #28a745; }\n  .was-validated .form-control:valid:focus, .form-control.is-valid:focus, .was-validated\n  .custom-select:valid:focus,\n  .custom-select.is-valid:focus {\n    border-color: #28a745;\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); }\n  .was-validated .form-control:valid ~ .valid-feedback,\n  .was-validated .form-control:valid ~ .valid-tooltip, .form-control.is-valid ~ .valid-feedback,\n  .form-control.is-valid ~ .valid-tooltip, .was-validated\n  .custom-select:valid ~ .valid-feedback,\n  .was-validated\n  .custom-select:valid ~ .valid-tooltip,\n  .custom-select.is-valid ~ .valid-feedback,\n  .custom-select.is-valid ~ .valid-tooltip {\n    display: block; }\n\n.was-validated .form-control-file:valid ~ .valid-feedback,\n.was-validated .form-control-file:valid ~ .valid-tooltip, .form-control-file.is-valid ~ .valid-feedback,\n.form-control-file.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label {\n  color: #28a745; }\n\n.was-validated .form-check-input:valid ~ .valid-feedback,\n.was-validated .form-check-input:valid ~ .valid-tooltip, .form-check-input.is-valid ~ .valid-feedback,\n.form-check-input.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:valid ~ .custom-control-label, .custom-control-input.is-valid ~ .custom-control-label {\n  color: #28a745; }\n  .was-validated .custom-control-input:valid ~ .custom-control-label::before, .custom-control-input.is-valid ~ .custom-control-label::before {\n    background-color: #71dd8a; }\n\n.was-validated .custom-control-input:valid ~ .valid-feedback,\n.was-validated .custom-control-input:valid ~ .valid-tooltip, .custom-control-input.is-valid ~ .valid-feedback,\n.custom-control-input.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:valid:checked ~ .custom-control-label::before, .custom-control-input.is-valid:checked ~ .custom-control-label::before {\n  background-color: #34ce57; }\n\n.was-validated .custom-control-input:valid:focus ~ .custom-control-label::before, .custom-control-input.is-valid:focus ~ .custom-control-label::before {\n  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(40, 167, 69, 0.25); }\n\n.was-validated .custom-file-input:valid ~ .custom-file-label, .custom-file-input.is-valid ~ .custom-file-label {\n  border-color: #28a745; }\n  .was-validated .custom-file-input:valid ~ .custom-file-label::after, .custom-file-input.is-valid ~ .custom-file-label::after {\n    border-color: inherit; }\n\n.was-validated .custom-file-input:valid ~ .valid-feedback,\n.was-validated .custom-file-input:valid ~ .valid-tooltip, .custom-file-input.is-valid ~ .valid-feedback,\n.custom-file-input.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .custom-file-input:valid:focus ~ .custom-file-label, .custom-file-input.is-valid:focus ~ .custom-file-label {\n  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); }\n\n.invalid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 80%;\n  color: #dc3545; }\n\n.invalid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: .1rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #fff;\n  background-color: rgba(220, 53, 69, 0.9);\n  border-radius: 0.25rem; }\n\n.was-validated .form-control:invalid, .form-control.is-invalid, .was-validated\n.custom-select:invalid,\n.custom-select.is-invalid {\n  border-color: #dc3545; }\n  .was-validated .form-control:invalid:focus, .form-control.is-invalid:focus, .was-validated\n  .custom-select:invalid:focus,\n  .custom-select.is-invalid:focus {\n    border-color: #dc3545;\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25); }\n  .was-validated .form-control:invalid ~ .invalid-feedback,\n  .was-validated .form-control:invalid ~ .invalid-tooltip, .form-control.is-invalid ~ .invalid-feedback,\n  .form-control.is-invalid ~ .invalid-tooltip, .was-validated\n  .custom-select:invalid ~ .invalid-feedback,\n  .was-validated\n  .custom-select:invalid ~ .invalid-tooltip,\n  .custom-select.is-invalid ~ .invalid-feedback,\n  .custom-select.is-invalid ~ .invalid-tooltip {\n    display: block; }\n\n.was-validated .form-control-file:invalid ~ .invalid-feedback,\n.was-validated .form-control-file:invalid ~ .invalid-tooltip, .form-control-file.is-invalid ~ .invalid-feedback,\n.form-control-file.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label {\n  color: #dc3545; }\n\n.was-validated .form-check-input:invalid ~ .invalid-feedback,\n.was-validated .form-check-input:invalid ~ .invalid-tooltip, .form-check-input.is-invalid ~ .invalid-feedback,\n.form-check-input.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:invalid ~ .custom-control-label, .custom-control-input.is-invalid ~ .custom-control-label {\n  color: #dc3545; }\n  .was-validated .custom-control-input:invalid ~ .custom-control-label::before, .custom-control-input.is-invalid ~ .custom-control-label::before {\n    background-color: #efa2a9; }\n\n.was-validated .custom-control-input:invalid ~ .invalid-feedback,\n.was-validated .custom-control-input:invalid ~ .invalid-tooltip, .custom-control-input.is-invalid ~ .invalid-feedback,\n.custom-control-input.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:invalid:checked ~ .custom-control-label::before, .custom-control-input.is-invalid:checked ~ .custom-control-label::before {\n  background-color: #e4606d; }\n\n.was-validated .custom-control-input:invalid:focus ~ .custom-control-label::before, .custom-control-input.is-invalid:focus ~ .custom-control-label::before {\n  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(220, 53, 69, 0.25); }\n\n.was-validated .custom-file-input:invalid ~ .custom-file-label, .custom-file-input.is-invalid ~ .custom-file-label {\n  border-color: #dc3545; }\n  .was-validated .custom-file-input:invalid ~ .custom-file-label::after, .custom-file-input.is-invalid ~ .custom-file-label::after {\n    border-color: inherit; }\n\n.was-validated .custom-file-input:invalid ~ .invalid-feedback,\n.was-validated .custom-file-input:invalid ~ .invalid-tooltip, .custom-file-input.is-invalid ~ .invalid-feedback,\n.custom-file-input.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .custom-file-input:invalid:focus ~ .custom-file-label, .custom-file-input.is-invalid:focus ~ .custom-file-label {\n  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25); }\n\n.form-inline {\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center; }\n  .form-inline .form-check {\n    width: 100%; }\n  @media (min-width: 576px) {\n    .form-inline label {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-bottom: 0; }\n    .form-inline .form-group {\n      display: flex;\n      flex: 0 0 auto;\n      flex-flow: row wrap;\n      align-items: center;\n      margin-bottom: 0; }\n    .form-inline .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle; }\n    .form-inline .form-control-plaintext {\n      display: inline-block; }\n    .form-inline .input-group,\n    .form-inline .custom-select {\n      width: auto; }\n    .form-inline .form-check {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: auto;\n      padding-left: 0; }\n    .form-inline .form-check-input {\n      position: relative;\n      margin-top: 0;\n      margin-right: 0.25rem;\n      margin-left: 0; }\n    .form-inline .custom-control {\n      align-items: center;\n      justify-content: center; }\n    .form-inline .custom-control-label {\n      margin-bottom: 0; } }\n\n.btn {\n  display: inline-block;\n  font-weight: 400;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border: 1px solid transparent;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .btn {\n      transition: none; } }\n  .btn:hover, .btn:focus {\n    text-decoration: none; }\n  .btn:focus, .btn.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .btn.disabled, .btn:disabled {\n    opacity: 0.65; }\n  .btn:not(:disabled):not(.disabled) {\n    cursor: pointer; }\n\na.btn.disabled,\nfieldset:disabled a.btn {\n  pointer-events: none; }\n\n.btn-primary {\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff; }\n  .btn-primary:hover {\n    color: #fff;\n    background-color: #0069d9;\n    border-color: #0062cc; }\n  .btn-primary:focus, .btn-primary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n  .btn-primary.disabled, .btn-primary:disabled {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n  .btn-primary:not(:disabled):not(.disabled):active, .btn-primary:not(:disabled):not(.disabled).active,\n  .show > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #0062cc;\n    border-color: #005cbf; }\n    .btn-primary:not(:disabled):not(.disabled):active:focus, .btn-primary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-primary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n\n.btn-secondary {\n  color: #fff;\n  background-color: #6c757d;\n  border-color: #6c757d; }\n  .btn-secondary:hover {\n    color: #fff;\n    background-color: #5a6268;\n    border-color: #545b62; }\n  .btn-secondary:focus, .btn-secondary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n  .btn-secondary.disabled, .btn-secondary:disabled {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d; }\n  .btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active,\n  .show > .btn-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #545b62;\n    border-color: #4e555b; }\n    .btn-secondary:not(:disabled):not(.disabled):active:focus, .btn-secondary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-secondary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n\n.btn-success {\n  color: #fff;\n  background-color: #28a745;\n  border-color: #28a745; }\n  .btn-success:hover {\n    color: #fff;\n    background-color: #218838;\n    border-color: #1e7e34; }\n  .btn-success:focus, .btn-success.focus {\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n  .btn-success.disabled, .btn-success:disabled {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745; }\n  .btn-success:not(:disabled):not(.disabled):active, .btn-success:not(:disabled):not(.disabled).active,\n  .show > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #1e7e34;\n    border-color: #1c7430; }\n    .btn-success:not(:disabled):not(.disabled):active:focus, .btn-success:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-success.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n\n.btn-info {\n  color: #fff;\n  background-color: #17a2b8;\n  border-color: #17a2b8; }\n  .btn-info:hover {\n    color: #fff;\n    background-color: #138496;\n    border-color: #117a8b; }\n  .btn-info:focus, .btn-info.focus {\n    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n  .btn-info.disabled, .btn-info:disabled {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8; }\n  .btn-info:not(:disabled):not(.disabled):active, .btn-info:not(:disabled):not(.disabled).active,\n  .show > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #117a8b;\n    border-color: #10707f; }\n    .btn-info:not(:disabled):not(.disabled):active:focus, .btn-info:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-info.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n\n.btn-warning {\n  color: #212529;\n  background-color: #ffc107;\n  border-color: #ffc107; }\n  .btn-warning:hover {\n    color: #212529;\n    background-color: #e0a800;\n    border-color: #d39e00; }\n  .btn-warning:focus, .btn-warning.focus {\n    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n  .btn-warning.disabled, .btn-warning:disabled {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107; }\n  .btn-warning:not(:disabled):not(.disabled):active, .btn-warning:not(:disabled):not(.disabled).active,\n  .show > .btn-warning.dropdown-toggle {\n    color: #212529;\n    background-color: #d39e00;\n    border-color: #c69500; }\n    .btn-warning:not(:disabled):not(.disabled):active:focus, .btn-warning:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-warning.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n\n.btn-danger {\n  color: #fff;\n  background-color: #dc3545;\n  border-color: #dc3545; }\n  .btn-danger:hover {\n    color: #fff;\n    background-color: #c82333;\n    border-color: #bd2130; }\n  .btn-danger:focus, .btn-danger.focus {\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n  .btn-danger.disabled, .btn-danger:disabled {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545; }\n  .btn-danger:not(:disabled):not(.disabled):active, .btn-danger:not(:disabled):not(.disabled).active,\n  .show > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #bd2130;\n    border-color: #b21f2d; }\n    .btn-danger:not(:disabled):not(.disabled):active:focus, .btn-danger:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-danger.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n\n.btn-light {\n  color: #212529;\n  background-color: #f8f9fa;\n  border-color: #f8f9fa; }\n  .btn-light:hover {\n    color: #212529;\n    background-color: #e2e6ea;\n    border-color: #dae0e5; }\n  .btn-light:focus, .btn-light.focus {\n    box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n  .btn-light.disabled, .btn-light:disabled {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa; }\n  .btn-light:not(:disabled):not(.disabled):active, .btn-light:not(:disabled):not(.disabled).active,\n  .show > .btn-light.dropdown-toggle {\n    color: #212529;\n    background-color: #dae0e5;\n    border-color: #d3d9df; }\n    .btn-light:not(:disabled):not(.disabled):active:focus, .btn-light:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-light.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n\n.btn-dark {\n  color: #fff;\n  background-color: #343a40;\n  border-color: #343a40; }\n  .btn-dark:hover {\n    color: #fff;\n    background-color: #23272b;\n    border-color: #1d2124; }\n  .btn-dark:focus, .btn-dark.focus {\n    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n  .btn-dark.disabled, .btn-dark:disabled {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40; }\n  .btn-dark:not(:disabled):not(.disabled):active, .btn-dark:not(:disabled):not(.disabled).active,\n  .show > .btn-dark.dropdown-toggle {\n    color: #fff;\n    background-color: #1d2124;\n    border-color: #171a1d; }\n    .btn-dark:not(:disabled):not(.disabled):active:focus, .btn-dark:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-dark.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n\n.btn-outline-primary {\n  color: #007bff;\n  background-color: transparent;\n  background-image: none;\n  border-color: #007bff; }\n  .btn-outline-primary:hover {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n  .btn-outline-primary:focus, .btn-outline-primary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n  .btn-outline-primary.disabled, .btn-outline-primary:disabled {\n    color: #007bff;\n    background-color: transparent; }\n  .btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n    .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-primary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n\n.btn-outline-secondary {\n  color: #6c757d;\n  background-color: transparent;\n  background-image: none;\n  border-color: #6c757d; }\n  .btn-outline-secondary:hover {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d; }\n  .btn-outline-secondary:focus, .btn-outline-secondary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n  .btn-outline-secondary.disabled, .btn-outline-secondary:disabled {\n    color: #6c757d;\n    background-color: transparent; }\n  .btn-outline-secondary:not(:disabled):not(.disabled):active, .btn-outline-secondary:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d; }\n    .btn-outline-secondary:not(:disabled):not(.disabled):active:focus, .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-secondary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n\n.btn-outline-success {\n  color: #28a745;\n  background-color: transparent;\n  background-image: none;\n  border-color: #28a745; }\n  .btn-outline-success:hover {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745; }\n  .btn-outline-success:focus, .btn-outline-success.focus {\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n  .btn-outline-success.disabled, .btn-outline-success:disabled {\n    color: #28a745;\n    background-color: transparent; }\n  .btn-outline-success:not(:disabled):not(.disabled):active, .btn-outline-success:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-success.dropdown-toggle {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745; }\n    .btn-outline-success:not(:disabled):not(.disabled):active:focus, .btn-outline-success:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-success.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n\n.btn-outline-info {\n  color: #17a2b8;\n  background-color: transparent;\n  background-image: none;\n  border-color: #17a2b8; }\n  .btn-outline-info:hover {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8; }\n  .btn-outline-info:focus, .btn-outline-info.focus {\n    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n  .btn-outline-info.disabled, .btn-outline-info:disabled {\n    color: #17a2b8;\n    background-color: transparent; }\n  .btn-outline-info:not(:disabled):not(.disabled):active, .btn-outline-info:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-info.dropdown-toggle {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8; }\n    .btn-outline-info:not(:disabled):not(.disabled):active:focus, .btn-outline-info:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-info.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n\n.btn-outline-warning {\n  color: #ffc107;\n  background-color: transparent;\n  background-image: none;\n  border-color: #ffc107; }\n  .btn-outline-warning:hover {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107; }\n  .btn-outline-warning:focus, .btn-outline-warning.focus {\n    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n  .btn-outline-warning.disabled, .btn-outline-warning:disabled {\n    color: #ffc107;\n    background-color: transparent; }\n  .btn-outline-warning:not(:disabled):not(.disabled):active, .btn-outline-warning:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-warning.dropdown-toggle {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107; }\n    .btn-outline-warning:not(:disabled):not(.disabled):active:focus, .btn-outline-warning:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-warning.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n\n.btn-outline-danger {\n  color: #dc3545;\n  background-color: transparent;\n  background-image: none;\n  border-color: #dc3545; }\n  .btn-outline-danger:hover {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545; }\n  .btn-outline-danger:focus, .btn-outline-danger.focus {\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n  .btn-outline-danger.disabled, .btn-outline-danger:disabled {\n    color: #dc3545;\n    background-color: transparent; }\n  .btn-outline-danger:not(:disabled):not(.disabled):active, .btn-outline-danger:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545; }\n    .btn-outline-danger:not(:disabled):not(.disabled):active:focus, .btn-outline-danger:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-danger.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n\n.btn-outline-light {\n  color: #f8f9fa;\n  background-color: transparent;\n  background-image: none;\n  border-color: #f8f9fa; }\n  .btn-outline-light:hover {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa; }\n  .btn-outline-light:focus, .btn-outline-light.focus {\n    box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n  .btn-outline-light.disabled, .btn-outline-light:disabled {\n    color: #f8f9fa;\n    background-color: transparent; }\n  .btn-outline-light:not(:disabled):not(.disabled):active, .btn-outline-light:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-light.dropdown-toggle {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa; }\n    .btn-outline-light:not(:disabled):not(.disabled):active:focus, .btn-outline-light:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-light.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n\n.btn-outline-dark {\n  color: #343a40;\n  background-color: transparent;\n  background-image: none;\n  border-color: #343a40; }\n  .btn-outline-dark:hover {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40; }\n  .btn-outline-dark:focus, .btn-outline-dark.focus {\n    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n  .btn-outline-dark.disabled, .btn-outline-dark:disabled {\n    color: #343a40;\n    background-color: transparent; }\n  .btn-outline-dark:not(:disabled):not(.disabled):active, .btn-outline-dark:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-dark.dropdown-toggle {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40; }\n    .btn-outline-dark:not(:disabled):not(.disabled):active:focus, .btn-outline-dark:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-dark.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n\n.btn-link {\n  font-weight: 400;\n  color: #007bff;\n  background-color: transparent; }\n  .btn-link:hover {\n    color: #0056b3;\n    text-decoration: underline;\n    background-color: transparent;\n    border-color: transparent; }\n  .btn-link:focus, .btn-link.focus {\n    text-decoration: underline;\n    border-color: transparent;\n    box-shadow: none; }\n  .btn-link:disabled, .btn-link.disabled {\n    color: #6c757d;\n    pointer-events: none; }\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem; }\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem; }\n\n.btn-block {\n  display: block;\n  width: 100%; }\n  .btn-block + .btn-block {\n    margin-top: 0.5rem; }\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%; }\n\n.fade {\n  transition: opacity 0.15s linear; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .fade {\n      transition: none; } }\n  .fade:not(.show) {\n    opacity: 0; }\n\n.collapse:not(.show) {\n  display: none; }\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  transition: height 0.35s ease; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .collapsing {\n      transition: none; } }\n\n.dropup,\n.dropright,\n.dropdown,\n.dropleft {\n  position: relative; }\n\n.dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0;\n  border-left: 0.3em solid transparent; }\n\n.dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 10rem;\n  padding: 0.5rem 0;\n  margin: 0.125rem 0 0;\n  font-size: 1rem;\n  color: #212529;\n  text-align: left;\n  list-style: none;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem; }\n\n.dropdown-menu-right {\n  right: 0;\n  left: auto; }\n\n.dropup .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-top: 0;\n  margin-bottom: 0.125rem; }\n\n.dropup .dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0.3em solid;\n  border-left: 0.3em solid transparent; }\n\n.dropup .dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropright .dropdown-menu {\n  top: 0;\n  right: auto;\n  left: 100%;\n  margin-top: 0;\n  margin-left: 0.125rem; }\n\n.dropright .dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0;\n  border-bottom: 0.3em solid transparent;\n  border-left: 0.3em solid; }\n\n.dropright .dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropright .dropdown-toggle::after {\n  vertical-align: 0; }\n\n.dropleft .dropdown-menu {\n  top: 0;\n  right: 100%;\n  left: auto;\n  margin-top: 0;\n  margin-right: 0.125rem; }\n\n.dropleft .dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\"; }\n\n.dropleft .dropdown-toggle::after {\n  display: none; }\n\n.dropleft .dropdown-toggle::before {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-right: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0.3em solid;\n  border-bottom: 0.3em solid transparent; }\n\n.dropleft .dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropleft .dropdown-toggle::before {\n  vertical-align: 0; }\n\n.dropdown-menu[x-placement^=\"top\"], .dropdown-menu[x-placement^=\"right\"], .dropdown-menu[x-placement^=\"bottom\"], .dropdown-menu[x-placement^=\"left\"] {\n  right: auto;\n  bottom: auto; }\n\n.dropdown-divider {\n  height: 0;\n  margin: 0.5rem 0;\n  overflow: hidden;\n  border-top: 1px solid #e9ecef; }\n\n.dropdown-item {\n  display: block;\n  width: 100%;\n  padding: 0.25rem 1.5rem;\n  clear: both;\n  font-weight: 400;\n  color: #212529;\n  text-align: inherit;\n  white-space: nowrap;\n  background-color: transparent;\n  border: 0; }\n  .dropdown-item:hover, .dropdown-item:focus {\n    color: #16181b;\n    text-decoration: none;\n    background-color: #f8f9fa; }\n  .dropdown-item.active, .dropdown-item:active {\n    color: #fff;\n    text-decoration: none;\n    background-color: #007bff; }\n  .dropdown-item.disabled, .dropdown-item:disabled {\n    color: #6c757d;\n    background-color: transparent; }\n\n.dropdown-menu.show {\n  display: block; }\n\n.dropdown-header {\n  display: block;\n  padding: 0.5rem 1.5rem;\n  margin-bottom: 0;\n  font-size: 0.875rem;\n  color: #6c757d;\n  white-space: nowrap; }\n\n.dropdown-item-text {\n  display: block;\n  padding: 0.25rem 1.5rem;\n  color: #212529; }\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle; }\n  .btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    flex: 0 1 auto; }\n    .btn-group > .btn:hover,\n    .btn-group-vertical > .btn:hover {\n      z-index: 1; }\n    .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 1; }\n  .btn-group .btn + .btn,\n  .btn-group .btn + .btn-group,\n  .btn-group .btn-group + .btn,\n  .btn-group .btn-group + .btn-group,\n  .btn-group-vertical .btn + .btn,\n  .btn-group-vertical .btn + .btn-group,\n  .btn-group-vertical .btn-group + .btn,\n  .btn-group-vertical .btn-group + .btn-group {\n    margin-left: -1px; }\n\n.btn-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start; }\n  .btn-toolbar .input-group {\n    width: auto; }\n\n.btn-group > .btn:first-child {\n  margin-left: 0; }\n\n.btn-group > .btn:not(:last-child):not(.dropdown-toggle),\n.btn-group > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.btn-group > .btn:not(:first-child),\n.btn-group > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.dropdown-toggle-split {\n  padding-right: 0.5625rem;\n  padding-left: 0.5625rem; }\n  .dropdown-toggle-split::after,\n  .dropup .dropdown-toggle-split::after,\n  .dropright .dropdown-toggle-split::after {\n    margin-left: 0; }\n  .dropleft .dropdown-toggle-split::before {\n    margin-right: 0; }\n\n.btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split {\n  padding-right: 0.375rem;\n  padding-left: 0.375rem; }\n\n.btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n\n.btn-group-vertical {\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center; }\n  .btn-group-vertical .btn,\n  .btn-group-vertical .btn-group {\n    width: 100%; }\n  .btn-group-vertical > .btn + .btn,\n  .btn-group-vertical > .btn + .btn-group,\n  .btn-group-vertical > .btn-group + .btn,\n  .btn-group-vertical > .btn-group + .btn-group {\n    margin-top: -1px;\n    margin-left: 0; }\n  .btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle),\n  .btn-group-vertical > .btn-group:not(:last-child) > .btn {\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0; }\n  .btn-group-vertical > .btn:not(:first-child),\n  .btn-group-vertical > .btn-group:not(:first-child) > .btn {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.btn-group-toggle > .btn,\n.btn-group-toggle > .btn-group > .btn {\n  margin-bottom: 0; }\n  .btn-group-toggle > .btn input[type=\"radio\"],\n  .btn-group-toggle > .btn input[type=\"checkbox\"],\n  .btn-group-toggle > .btn-group > .btn input[type=\"radio\"],\n  .btn-group-toggle > .btn-group > .btn input[type=\"checkbox\"] {\n    position: absolute;\n    clip: rect(0, 0, 0, 0);\n    pointer-events: none; }\n\n.input-group {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  width: 100%; }\n  .input-group > .form-control,\n  .input-group > .custom-select,\n  .input-group > .custom-file {\n    position: relative;\n    flex: 1 1 auto;\n    width: 1%;\n    margin-bottom: 0; }\n    .input-group > .form-control + .form-control,\n    .input-group > .form-control + .custom-select,\n    .input-group > .form-control + .custom-file,\n    .input-group > .custom-select + .form-control,\n    .input-group > .custom-select + .custom-select,\n    .input-group > .custom-select + .custom-file,\n    .input-group > .custom-file + .form-control,\n    .input-group > .custom-file + .custom-select,\n    .input-group > .custom-file + .custom-file {\n      margin-left: -1px; }\n  .input-group > .form-control:focus,\n  .input-group > .custom-select:focus,\n  .input-group > .custom-file .custom-file-input:focus ~ .custom-file-label {\n    z-index: 3; }\n  .input-group > .custom-file .custom-file-input:focus {\n    z-index: 4; }\n  .input-group > .form-control:not(:last-child),\n  .input-group > .custom-select:not(:last-child) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0; }\n  .input-group > .form-control:not(:first-child),\n  .input-group > .custom-select:not(:first-child) {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0; }\n  .input-group > .custom-file {\n    display: flex;\n    align-items: center; }\n    .input-group > .custom-file:not(:last-child) .custom-file-label,\n    .input-group > .custom-file:not(:last-child) .custom-file-label::after {\n      border-top-right-radius: 0;\n      border-bottom-right-radius: 0; }\n    .input-group > .custom-file:not(:first-child) .custom-file-label {\n      border-top-left-radius: 0;\n      border-bottom-left-radius: 0; }\n\n.input-group-prepend,\n.input-group-append {\n  display: flex; }\n  .input-group-prepend .btn,\n  .input-group-append .btn {\n    position: relative;\n    z-index: 2; }\n  .input-group-prepend .btn + .btn,\n  .input-group-prepend .btn + .input-group-text,\n  .input-group-prepend .input-group-text + .input-group-text,\n  .input-group-prepend .input-group-text + .btn,\n  .input-group-append .btn + .btn,\n  .input-group-append .btn + .input-group-text,\n  .input-group-append .input-group-text + .input-group-text,\n  .input-group-append .input-group-text + .btn {\n    margin-left: -1px; }\n\n.input-group-prepend {\n  margin-right: -1px; }\n\n.input-group-append {\n  margin-left: -1px; }\n\n.input-group-text {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #495057;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #e9ecef;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem; }\n  .input-group-text input[type=\"radio\"],\n  .input-group-text input[type=\"checkbox\"] {\n    margin-top: 0; }\n\n.input-group-lg > .form-control,\n.input-group-lg > .input-group-prepend > .input-group-text,\n.input-group-lg > .input-group-append > .input-group-text,\n.input-group-lg > .input-group-prepend > .btn,\n.input-group-lg > .input-group-append > .btn {\n  height: calc(2.875rem + 2px);\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem; }\n\n.input-group-sm > .form-control,\n.input-group-sm > .input-group-prepend > .input-group-text,\n.input-group-sm > .input-group-append > .input-group-text,\n.input-group-sm > .input-group-prepend > .btn,\n.input-group-sm > .input-group-append > .btn {\n  height: calc(1.8125rem + 2px);\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem; }\n\n.input-group > .input-group-prepend > .btn,\n.input-group > .input-group-prepend > .input-group-text,\n.input-group > .input-group-append:not(:last-child) > .btn,\n.input-group > .input-group-append:not(:last-child) > .input-group-text,\n.input-group > .input-group-append:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group > .input-group-append:last-child > .input-group-text:not(:last-child) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.input-group > .input-group-append > .btn,\n.input-group > .input-group-append > .input-group-text,\n.input-group > .input-group-prepend:not(:first-child) > .btn,\n.input-group > .input-group-prepend:not(:first-child) > .input-group-text,\n.input-group > .input-group-prepend:first-child > .btn:not(:first-child),\n.input-group > .input-group-prepend:first-child > .input-group-text:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.nav {\n  display: flex;\n  flex-wrap: wrap;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none; }\n\n.nav-link {\n  display: block;\n  padding: 0.5rem 1rem; }\n  .nav-link:hover, .nav-link:focus {\n    text-decoration: none; }\n  .nav-link.disabled {\n    color: #6c757d; }\n\n.nav-tabs {\n  border-bottom: 1px solid #dee2e6; }\n  .nav-tabs .nav-item {\n    margin-bottom: -1px; }\n  .nav-tabs .nav-link {\n    border: 1px solid transparent;\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {\n      border-color: #e9ecef #e9ecef #dee2e6; }\n    .nav-tabs .nav-link.disabled {\n      color: #6c757d;\n      background-color: transparent;\n      border-color: transparent; }\n  .nav-tabs .nav-link.active,\n  .nav-tabs .nav-item.show .nav-link {\n    color: #495057;\n    background-color: #fff;\n    border-color: #dee2e6 #dee2e6 #fff; }\n  .nav-tabs .dropdown-menu {\n    margin-top: -1px;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.nav-pills .nav-link {\n  border-radius: 0.25rem; }\n\n.nav-pills .nav-link.active,\n.nav-pills .show > .nav-link {\n  color: #fff;\n  background-color: #007bff; }\n\n.nav-fill .nav-item {\n  flex: 1 1 auto;\n  text-align: center; }\n\n.nav-justified .nav-item {\n  flex-basis: 0;\n  flex-grow: 1;\n  text-align: center; }\n\n.tab-content > .tab-pane {\n  display: none; }\n\n.tab-content > .active {\n  display: block; }\n\n.navbar {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.5rem 1rem; }\n  .navbar > .container,\n  .navbar > .container-fluid {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    justify-content: space-between; }\n\n.navbar-brand {\n  display: inline-block;\n  padding-top: 0.3125rem;\n  padding-bottom: 0.3125rem;\n  margin-right: 1rem;\n  font-size: 1.25rem;\n  line-height: inherit;\n  white-space: nowrap; }\n  .navbar-brand:hover, .navbar-brand:focus {\n    text-decoration: none; }\n\n.navbar-nav {\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none; }\n  .navbar-nav .nav-link {\n    padding-right: 0;\n    padding-left: 0; }\n  .navbar-nav .dropdown-menu {\n    position: static;\n    float: none; }\n\n.navbar-text {\n  display: inline-block;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem; }\n\n.navbar-collapse {\n  flex-basis: 100%;\n  flex-grow: 1;\n  align-items: center; }\n\n.navbar-toggler {\n  padding: 0.25rem 0.75rem;\n  font-size: 1.25rem;\n  line-height: 1;\n  background-color: transparent;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n  .navbar-toggler:hover, .navbar-toggler:focus {\n    text-decoration: none; }\n  .navbar-toggler:not(:disabled):not(.disabled) {\n    cursor: pointer; }\n\n.navbar-toggler-icon {\n  display: inline-block;\n  width: 1.5em;\n  height: 1.5em;\n  vertical-align: middle;\n  content: \"\";\n  background: no-repeat center center;\n  background-size: 100% 100%; }\n\n@media (max-width: 575.98px) {\n  .navbar-expand-sm > .container,\n  .navbar-expand-sm > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 576px) {\n  .navbar-expand-sm {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-sm .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-sm .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-sm .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-sm > .container,\n    .navbar-expand-sm > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-sm .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-sm .navbar-toggler {\n      display: none; } }\n\n@media (max-width: 767.98px) {\n  .navbar-expand-md > .container,\n  .navbar-expand-md > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 768px) {\n  .navbar-expand-md {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-md .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-md .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-md .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-md > .container,\n    .navbar-expand-md > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-md .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-md .navbar-toggler {\n      display: none; } }\n\n@media (max-width: 991.98px) {\n  .navbar-expand-lg > .container,\n  .navbar-expand-lg > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 992px) {\n  .navbar-expand-lg {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-lg .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-lg .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-lg .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-lg > .container,\n    .navbar-expand-lg > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-lg .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-lg .navbar-toggler {\n      display: none; } }\n\n@media (max-width: 1199.98px) {\n  .navbar-expand-xl > .container,\n  .navbar-expand-xl > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 1200px) {\n  .navbar-expand-xl {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-xl .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-xl .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-xl .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-xl > .container,\n    .navbar-expand-xl > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-xl .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-xl .navbar-toggler {\n      display: none; } }\n\n.navbar-expand {\n  flex-flow: row nowrap;\n  justify-content: flex-start; }\n  .navbar-expand > .container,\n  .navbar-expand > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; }\n  .navbar-expand .navbar-nav {\n    flex-direction: row; }\n    .navbar-expand .navbar-nav .dropdown-menu {\n      position: absolute; }\n    .navbar-expand .navbar-nav .nav-link {\n      padding-right: 0.5rem;\n      padding-left: 0.5rem; }\n  .navbar-expand > .container,\n  .navbar-expand > .container-fluid {\n    flex-wrap: nowrap; }\n  .navbar-expand .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto; }\n  .navbar-expand .navbar-toggler {\n    display: none; }\n\n.navbar-light .navbar-brand {\n  color: rgba(0, 0, 0, 0.9); }\n  .navbar-light .navbar-brand:hover, .navbar-light .navbar-brand:focus {\n    color: rgba(0, 0, 0, 0.9); }\n\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, 0.5); }\n  .navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link:focus {\n    color: rgba(0, 0, 0, 0.7); }\n  .navbar-light .navbar-nav .nav-link.disabled {\n    color: rgba(0, 0, 0, 0.3); }\n\n.navbar-light .navbar-nav .show > .nav-link,\n.navbar-light .navbar-nav .active > .nav-link,\n.navbar-light .navbar-nav .nav-link.show,\n.navbar-light .navbar-nav .nav-link.active {\n  color: rgba(0, 0, 0, 0.9); }\n\n.navbar-light .navbar-toggler {\n  color: rgba(0, 0, 0, 0.5);\n  border-color: rgba(0, 0, 0, 0.1); }\n\n.navbar-light .navbar-toggler-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(0, 0, 0, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\"); }\n\n.navbar-light .navbar-text {\n  color: rgba(0, 0, 0, 0.5); }\n  .navbar-light .navbar-text a {\n    color: rgba(0, 0, 0, 0.9); }\n    .navbar-light .navbar-text a:hover, .navbar-light .navbar-text a:focus {\n      color: rgba(0, 0, 0, 0.9); }\n\n.navbar-dark .navbar-brand {\n  color: #fff; }\n  .navbar-dark .navbar-brand:hover, .navbar-dark .navbar-brand:focus {\n    color: #fff; }\n\n.navbar-dark .navbar-nav .nav-link {\n  color: rgba(255, 255, 255, 0.5); }\n  .navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus {\n    color: rgba(255, 255, 255, 0.75); }\n  .navbar-dark .navbar-nav .nav-link.disabled {\n    color: rgba(255, 255, 255, 0.25); }\n\n.navbar-dark .navbar-nav .show > .nav-link,\n.navbar-dark .navbar-nav .active > .nav-link,\n.navbar-dark .navbar-nav .nav-link.show,\n.navbar-dark .navbar-nav .nav-link.active {\n  color: #fff; }\n\n.navbar-dark .navbar-toggler {\n  color: rgba(255, 255, 255, 0.5);\n  border-color: rgba(255, 255, 255, 0.1); }\n\n.navbar-dark .navbar-toggler-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\"); }\n\n.navbar-dark .navbar-text {\n  color: rgba(255, 255, 255, 0.5); }\n  .navbar-dark .navbar-text a {\n    color: #fff; }\n    .navbar-dark .navbar-text a:hover, .navbar-dark .navbar-text a:focus {\n      color: #fff; }\n\n.card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: border-box;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n  border-radius: 0.25rem; }\n  .card > hr {\n    margin-right: 0;\n    margin-left: 0; }\n  .card > .list-group:first-child .list-group-item:first-child {\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n  .card > .list-group:last-child .list-group-item:last-child {\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem; }\n\n.card-body {\n  flex: 1 1 auto;\n  padding: 1.25rem; }\n\n.card-title {\n  margin-bottom: 0.75rem; }\n\n.card-subtitle {\n  margin-top: -0.375rem;\n  margin-bottom: 0; }\n\n.card-text:last-child {\n  margin-bottom: 0; }\n\n.card-link:hover {\n  text-decoration: none; }\n\n.card-link + .card-link {\n  margin-left: 1.25rem; }\n\n.card-header {\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 0;\n  background-color: rgba(0, 0, 0, 0.03);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125); }\n  .card-header:first-child {\n    border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0; }\n  .card-header + .list-group .list-group-item:first-child {\n    border-top: 0; }\n\n.card-footer {\n  padding: 0.75rem 1.25rem;\n  background-color: rgba(0, 0, 0, 0.03);\n  border-top: 1px solid rgba(0, 0, 0, 0.125); }\n  .card-footer:last-child {\n    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px); }\n\n.card-header-tabs {\n  margin-right: -0.625rem;\n  margin-bottom: -0.75rem;\n  margin-left: -0.625rem;\n  border-bottom: 0; }\n\n.card-header-pills {\n  margin-right: -0.625rem;\n  margin-left: -0.625rem; }\n\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 1.25rem; }\n\n.card-img {\n  width: 100%;\n  border-radius: calc(0.25rem - 1px); }\n\n.card-img-top {\n  width: 100%;\n  border-top-left-radius: calc(0.25rem - 1px);\n  border-top-right-radius: calc(0.25rem - 1px); }\n\n.card-img-bottom {\n  width: 100%;\n  border-bottom-right-radius: calc(0.25rem - 1px);\n  border-bottom-left-radius: calc(0.25rem - 1px); }\n\n.card-deck {\n  display: flex;\n  flex-direction: column; }\n  .card-deck .card {\n    margin-bottom: 15px; }\n  @media (min-width: 576px) {\n    .card-deck {\n      flex-flow: row wrap;\n      margin-right: -15px;\n      margin-left: -15px; }\n      .card-deck .card {\n        display: flex;\n        flex: 1 0 0%;\n        flex-direction: column;\n        margin-right: 15px;\n        margin-bottom: 0;\n        margin-left: 15px; } }\n\n.card-group {\n  display: flex;\n  flex-direction: column; }\n  .card-group > .card {\n    margin-bottom: 15px; }\n  @media (min-width: 576px) {\n    .card-group {\n      flex-flow: row wrap; }\n      .card-group > .card {\n        flex: 1 0 0%;\n        margin-bottom: 0; }\n        .card-group > .card + .card {\n          margin-left: 0;\n          border-left: 0; }\n        .card-group > .card:first-child {\n          border-top-right-radius: 0;\n          border-bottom-right-radius: 0; }\n          .card-group > .card:first-child .card-img-top,\n          .card-group > .card:first-child .card-header {\n            border-top-right-radius: 0; }\n          .card-group > .card:first-child .card-img-bottom,\n          .card-group > .card:first-child .card-footer {\n            border-bottom-right-radius: 0; }\n        .card-group > .card:last-child {\n          border-top-left-radius: 0;\n          border-bottom-left-radius: 0; }\n          .card-group > .card:last-child .card-img-top,\n          .card-group > .card:last-child .card-header {\n            border-top-left-radius: 0; }\n          .card-group > .card:last-child .card-img-bottom,\n          .card-group > .card:last-child .card-footer {\n            border-bottom-left-radius: 0; }\n        .card-group > .card:only-child {\n          border-radius: 0.25rem; }\n          .card-group > .card:only-child .card-img-top,\n          .card-group > .card:only-child .card-header {\n            border-top-left-radius: 0.25rem;\n            border-top-right-radius: 0.25rem; }\n          .card-group > .card:only-child .card-img-bottom,\n          .card-group > .card:only-child .card-footer {\n            border-bottom-right-radius: 0.25rem;\n            border-bottom-left-radius: 0.25rem; }\n        .card-group > .card:not(:first-child):not(:last-child):not(:only-child) {\n          border-radius: 0; }\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-img-top,\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-img-bottom,\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-header,\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-footer {\n            border-radius: 0; } }\n\n.card-columns .card {\n  margin-bottom: 0.75rem; }\n\n@media (min-width: 576px) {\n  .card-columns {\n    -webkit-column-count: 3;\n            column-count: 3;\n    -webkit-column-gap: 1.25rem;\n            column-gap: 1.25rem;\n    orphans: 1;\n    widows: 1; }\n    .card-columns .card {\n      display: inline-block;\n      width: 100%; } }\n\n.accordion .card:not(:first-of-type):not(:last-of-type) {\n  border-bottom: 0;\n  border-radius: 0; }\n\n.accordion .card:not(:first-of-type) .card-header:first-child {\n  border-radius: 0; }\n\n.accordion .card:first-of-type {\n  border-bottom: 0;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.accordion .card:last-of-type {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0; }\n\n.badge {\n  display: inline-block;\n  padding: 0.25em 0.4em;\n  font-size: 75%;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25rem; }\n  .badge:empty {\n    display: none; }\n\n.btn .badge {\n  position: relative;\n  top: -1px; }\n\n.badge-pill {\n  padding-right: 0.6em;\n  padding-left: 0.6em;\n  border-radius: 10rem; }\n\n.badge-primary {\n  color: #fff;\n  background-color: #007bff; }\n  .badge-primary[href]:hover, .badge-primary[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #0062cc; }\n\n.badge-secondary {\n  color: #fff;\n  background-color: #6c757d; }\n  .badge-secondary[href]:hover, .badge-secondary[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #545b62; }\n\n.badge-success {\n  color: #fff;\n  background-color: #28a745; }\n  .badge-success[href]:hover, .badge-success[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #1e7e34; }\n\n.badge-info {\n  color: #fff;\n  background-color: #17a2b8; }\n  .badge-info[href]:hover, .badge-info[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #117a8b; }\n\n.badge-warning {\n  color: #212529;\n  background-color: #ffc107; }\n  .badge-warning[href]:hover, .badge-warning[href]:focus {\n    color: #212529;\n    text-decoration: none;\n    background-color: #d39e00; }\n\n.badge-danger {\n  color: #fff;\n  background-color: #dc3545; }\n  .badge-danger[href]:hover, .badge-danger[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #bd2130; }\n\n.badge-light {\n  color: #212529;\n  background-color: #f8f9fa; }\n  .badge-light[href]:hover, .badge-light[href]:focus {\n    color: #212529;\n    text-decoration: none;\n    background-color: #dae0e5; }\n\n.badge-dark {\n  color: #fff;\n  background-color: #343a40; }\n  .badge-dark[href]:hover, .badge-dark[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #1d2124; }\n\n.jumbotron {\n  padding: 2rem 1rem;\n  margin-bottom: 2rem;\n  background-color: #e9ecef;\n  border-radius: 0.3rem; }\n  @media (min-width: 576px) {\n    .jumbotron {\n      padding: 4rem 2rem; } }\n\n.jumbotron-fluid {\n  padding-right: 0;\n  padding-left: 0;\n  border-radius: 0; }\n\n.alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n\n.alert-heading {\n  color: inherit; }\n\n.alert-link {\n  font-weight: 700; }\n\n.alert-dismissible {\n  padding-right: 4rem; }\n  .alert-dismissible .close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    padding: 0.75rem 1.25rem;\n    color: inherit; }\n\n.alert-primary {\n  color: #004085;\n  background-color: #cce5ff;\n  border-color: #b8daff; }\n  .alert-primary hr {\n    border-top-color: #9fcdff; }\n  .alert-primary .alert-link {\n    color: #002752; }\n\n.alert-secondary {\n  color: #383d41;\n  background-color: #e2e3e5;\n  border-color: #d6d8db; }\n  .alert-secondary hr {\n    border-top-color: #c8cbcf; }\n  .alert-secondary .alert-link {\n    color: #202326; }\n\n.alert-success {\n  color: #155724;\n  background-color: #d4edda;\n  border-color: #c3e6cb; }\n  .alert-success hr {\n    border-top-color: #b1dfbb; }\n  .alert-success .alert-link {\n    color: #0b2e13; }\n\n.alert-info {\n  color: #0c5460;\n  background-color: #d1ecf1;\n  border-color: #bee5eb; }\n  .alert-info hr {\n    border-top-color: #abdde5; }\n  .alert-info .alert-link {\n    color: #062c33; }\n\n.alert-warning {\n  color: #856404;\n  background-color: #fff3cd;\n  border-color: #ffeeba; }\n  .alert-warning hr {\n    border-top-color: #ffe8a1; }\n  .alert-warning .alert-link {\n    color: #533f03; }\n\n.alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb; }\n  .alert-danger hr {\n    border-top-color: #f1b0b7; }\n  .alert-danger .alert-link {\n    color: #491217; }\n\n.alert-light {\n  color: #818182;\n  background-color: #fefefe;\n  border-color: #fdfdfe; }\n  .alert-light hr {\n    border-top-color: #ececf6; }\n  .alert-light .alert-link {\n    color: #686868; }\n\n.alert-dark {\n  color: #1b1e21;\n  background-color: #d6d8d9;\n  border-color: #c6c8ca; }\n  .alert-dark hr {\n    border-top-color: #b9bbbe; }\n  .alert-dark .alert-link {\n    color: #040505; }\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0; }\n  to {\n    background-position: 0 0; } }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0; }\n  to {\n    background-position: 0 0; } }\n\n.progress {\n  display: flex;\n  height: 1rem;\n  overflow: hidden;\n  font-size: 0.75rem;\n  background-color: #e9ecef;\n  border-radius: 0.25rem; }\n\n.progress-bar {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #007bff;\n  transition: width 0.6s ease; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .progress-bar {\n      transition: none; } }\n\n.progress-bar-striped {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem; }\n\n.progress-bar-animated {\n  -webkit-animation: progress-bar-stripes 1s linear infinite;\n          animation: progress-bar-stripes 1s linear infinite; }\n\n.list-group {\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0; }\n\n.list-group-item-action {\n  width: 100%;\n  color: #495057;\n  text-align: inherit; }\n  .list-group-item-action:hover, .list-group-item-action:focus {\n    color: #495057;\n    text-decoration: none;\n    background-color: #f8f9fa; }\n  .list-group-item-action:active {\n    color: #212529;\n    background-color: #e9ecef; }\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.125); }\n  .list-group-item:first-child {\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n  .list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem; }\n  .list-group-item:hover, .list-group-item:focus {\n    z-index: 1;\n    text-decoration: none; }\n  .list-group-item.disabled, .list-group-item:disabled {\n    color: #6c757d;\n    background-color: #fff; }\n  .list-group-item.active {\n    z-index: 2;\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n\n.list-group-flush .list-group-item {\n  border-right: 0;\n  border-left: 0;\n  border-radius: 0; }\n\n.list-group-flush:first-child .list-group-item:first-child {\n  border-top: 0; }\n\n.list-group-flush:last-child .list-group-item:last-child {\n  border-bottom: 0; }\n\n.list-group-item-primary {\n  color: #004085;\n  background-color: #b8daff; }\n  .list-group-item-primary.list-group-item-action:hover, .list-group-item-primary.list-group-item-action:focus {\n    color: #004085;\n    background-color: #9fcdff; }\n  .list-group-item-primary.list-group-item-action.active {\n    color: #fff;\n    background-color: #004085;\n    border-color: #004085; }\n\n.list-group-item-secondary {\n  color: #383d41;\n  background-color: #d6d8db; }\n  .list-group-item-secondary.list-group-item-action:hover, .list-group-item-secondary.list-group-item-action:focus {\n    color: #383d41;\n    background-color: #c8cbcf; }\n  .list-group-item-secondary.list-group-item-action.active {\n    color: #fff;\n    background-color: #383d41;\n    border-color: #383d41; }\n\n.list-group-item-success {\n  color: #155724;\n  background-color: #c3e6cb; }\n  .list-group-item-success.list-group-item-action:hover, .list-group-item-success.list-group-item-action:focus {\n    color: #155724;\n    background-color: #b1dfbb; }\n  .list-group-item-success.list-group-item-action.active {\n    color: #fff;\n    background-color: #155724;\n    border-color: #155724; }\n\n.list-group-item-info {\n  color: #0c5460;\n  background-color: #bee5eb; }\n  .list-group-item-info.list-group-item-action:hover, .list-group-item-info.list-group-item-action:focus {\n    color: #0c5460;\n    background-color: #abdde5; }\n  .list-group-item-info.list-group-item-action.active {\n    color: #fff;\n    background-color: #0c5460;\n    border-color: #0c5460; }\n\n.list-group-item-warning {\n  color: #856404;\n  background-color: #ffeeba; }\n  .list-group-item-warning.list-group-item-action:hover, .list-group-item-warning.list-group-item-action:focus {\n    color: #856404;\n    background-color: #ffe8a1; }\n  .list-group-item-warning.list-group-item-action.active {\n    color: #fff;\n    background-color: #856404;\n    border-color: #856404; }\n\n.list-group-item-danger {\n  color: #721c24;\n  background-color: #f5c6cb; }\n  .list-group-item-danger.list-group-item-action:hover, .list-group-item-danger.list-group-item-action:focus {\n    color: #721c24;\n    background-color: #f1b0b7; }\n  .list-group-item-danger.list-group-item-action.active {\n    color: #fff;\n    background-color: #721c24;\n    border-color: #721c24; }\n\n.list-group-item-light {\n  color: #818182;\n  background-color: #fdfdfe; }\n  .list-group-item-light.list-group-item-action:hover, .list-group-item-light.list-group-item-action:focus {\n    color: #818182;\n    background-color: #ececf6; }\n  .list-group-item-light.list-group-item-action.active {\n    color: #fff;\n    background-color: #818182;\n    border-color: #818182; }\n\n.list-group-item-dark {\n  color: #1b1e21;\n  background-color: #c6c8ca; }\n  .list-group-item-dark.list-group-item-action:hover, .list-group-item-dark.list-group-item-action:focus {\n    color: #1b1e21;\n    background-color: #b9bbbe; }\n  .list-group-item-dark.list-group-item-action.active {\n    color: #fff;\n    background-color: #1b1e21;\n    border-color: #1b1e21; }\n\n.modal-open {\n  overflow: hidden; }\n  .modal-open .modal {\n    overflow-x: hidden;\n    overflow-y: auto; }\n\n.modal {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  display: none;\n  overflow: hidden;\n  outline: 0; }\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 0.5rem;\n  pointer-events: none; }\n  .modal.fade .modal-dialog {\n    transition: -webkit-transform 0.3s ease-out;\n    transition: transform 0.3s ease-out;\n    transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;\n    -webkit-transform: translate(0, -25%);\n            transform: translate(0, -25%); }\n    @media screen and (prefers-reduced-motion: reduce) {\n      .modal.fade .modal-dialog {\n        transition: none; } }\n  .modal.show .modal-dialog {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.modal-dialog-centered {\n  display: flex;\n  align-items: center;\n  min-height: calc(100% - (0.5rem * 2)); }\n  .modal-dialog-centered::before {\n    display: block;\n    height: calc(100vh - (0.5rem * 2));\n    content: \"\"; }\n\n.modal-content {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  pointer-events: auto;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem;\n  outline: 0; }\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000; }\n  .modal-backdrop.fade {\n    opacity: 0; }\n  .modal-backdrop.show {\n    opacity: 0.5; }\n\n.modal-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 1rem;\n  border-bottom: 1px solid #e9ecef;\n  border-top-left-radius: 0.3rem;\n  border-top-right-radius: 0.3rem; }\n  .modal-header .close {\n    padding: 1rem;\n    margin: -1rem -1rem -1rem auto; }\n\n.modal-title {\n  margin-bottom: 0;\n  line-height: 1.5; }\n\n.modal-body {\n  position: relative;\n  flex: 1 1 auto;\n  padding: 1rem; }\n\n.modal-footer {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 1rem;\n  border-top: 1px solid #e9ecef; }\n  .modal-footer > :not(:first-child) {\n    margin-left: .25rem; }\n  .modal-footer > :not(:last-child) {\n    margin-right: .25rem; }\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n@media (min-width: 576px) {\n  .modal-dialog {\n    max-width: 500px;\n    margin: 1.75rem auto; }\n  .modal-dialog-centered {\n    min-height: calc(100% - (1.75rem * 2)); }\n    .modal-dialog-centered::before {\n      height: calc(100vh - (1.75rem * 2)); }\n  .modal-sm {\n    max-width: 300px; } }\n\n@media (min-width: 992px) {\n  .modal-lg {\n    max-width: 800px; } }\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left; }\n\n[dir=\"ltr\"] .tooltip {\n  text-align: left; }\n\n[dir=\"rtl\"] .tooltip {\n  text-align: right; }\n\n.tooltip {\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  white-space: normal;\n  line-break: auto;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  opacity: 0; }\n  .tooltip.show {\n    opacity: 0.9; }\n  .tooltip .arrow {\n    position: absolute;\n    display: block;\n    width: 0.8rem;\n    height: 0.4rem; }\n    .tooltip .arrow::before {\n      position: absolute;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid; }\n\n.bs-tooltip-top, .bs-tooltip-auto[x-placement^=\"top\"] {\n  padding: 0.4rem 0; }\n  .bs-tooltip-top .arrow, .bs-tooltip-auto[x-placement^=\"top\"] .arrow {\n    bottom: 0; }\n    .bs-tooltip-top .arrow::before, .bs-tooltip-auto[x-placement^=\"top\"] .arrow::before {\n      top: 0;\n      border-width: 0.4rem 0.4rem 0;\n      border-top-color: #000; }\n\n.bs-tooltip-right, .bs-tooltip-auto[x-placement^=\"right\"] {\n  padding: 0 0.4rem; }\n  .bs-tooltip-right .arrow, .bs-tooltip-auto[x-placement^=\"right\"] .arrow {\n    left: 0;\n    width: 0.4rem;\n    height: 0.8rem; }\n    .bs-tooltip-right .arrow::before, .bs-tooltip-auto[x-placement^=\"right\"] .arrow::before {\n      right: 0;\n      border-width: 0.4rem 0.4rem 0.4rem 0;\n      border-right-color: #000; }\n\n.bs-tooltip-bottom, .bs-tooltip-auto[x-placement^=\"bottom\"] {\n  padding: 0.4rem 0; }\n  .bs-tooltip-bottom .arrow, .bs-tooltip-auto[x-placement^=\"bottom\"] .arrow {\n    top: 0; }\n    .bs-tooltip-bottom .arrow::before, .bs-tooltip-auto[x-placement^=\"bottom\"] .arrow::before {\n      bottom: 0;\n      border-width: 0 0.4rem 0.4rem;\n      border-bottom-color: #000; }\n\n.bs-tooltip-left, .bs-tooltip-auto[x-placement^=\"left\"] {\n  padding: 0 0.4rem; }\n  .bs-tooltip-left .arrow, .bs-tooltip-auto[x-placement^=\"left\"] .arrow {\n    right: 0;\n    width: 0.4rem;\n    height: 0.8rem; }\n    .bs-tooltip-left .arrow::before, .bs-tooltip-auto[x-placement^=\"left\"] .arrow::before {\n      left: 0;\n      border-width: 0.4rem 0 0.4rem 0.4rem;\n      border-left-color: #000; }\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 0.25rem 0.5rem;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 0.25rem; }\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: block;\n  max-width: 276px;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left; }\n\n[dir=\"ltr\"] .popover {\n  text-align: left; }\n\n[dir=\"rtl\"] .popover {\n  text-align: right; }\n\n.popover {\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  white-space: normal;\n  line-break: auto;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem; }\n  .popover .arrow {\n    position: absolute;\n    display: block;\n    width: 1rem;\n    height: 0.5rem;\n    margin: 0 0.3rem; }\n    .popover .arrow::before, .popover .arrow::after {\n      position: absolute;\n      display: block;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid; }\n\n.bs-popover-top, .bs-popover-auto[x-placement^=\"top\"] {\n  margin-bottom: 0.5rem; }\n  .bs-popover-top .arrow, .bs-popover-auto[x-placement^=\"top\"] .arrow {\n    bottom: calc((0.5rem + 1px) * -1); }\n  .bs-popover-top .arrow::before, .bs-popover-auto[x-placement^=\"top\"] .arrow::before,\n  .bs-popover-top .arrow::after,\n  .bs-popover-auto[x-placement^=\"top\"] .arrow::after {\n    border-width: 0.5rem 0.5rem 0; }\n  .bs-popover-top .arrow::before, .bs-popover-auto[x-placement^=\"top\"] .arrow::before {\n    bottom: 0;\n    border-top-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-top .arrow::after,\n  .bs-popover-auto[x-placement^=\"top\"] .arrow::after {\n    bottom: 1px;\n    border-top-color: #fff; }\n\n.bs-popover-right, .bs-popover-auto[x-placement^=\"right\"] {\n  margin-left: 0.5rem; }\n  .bs-popover-right .arrow, .bs-popover-auto[x-placement^=\"right\"] .arrow {\n    left: calc((0.5rem + 1px) * -1);\n    width: 0.5rem;\n    height: 1rem;\n    margin: 0.3rem 0; }\n  .bs-popover-right .arrow::before, .bs-popover-auto[x-placement^=\"right\"] .arrow::before,\n  .bs-popover-right .arrow::after,\n  .bs-popover-auto[x-placement^=\"right\"] .arrow::after {\n    border-width: 0.5rem 0.5rem 0.5rem 0; }\n  .bs-popover-right .arrow::before, .bs-popover-auto[x-placement^=\"right\"] .arrow::before {\n    left: 0;\n    border-right-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-right .arrow::after,\n  .bs-popover-auto[x-placement^=\"right\"] .arrow::after {\n    left: 1px;\n    border-right-color: #fff; }\n\n.bs-popover-bottom, .bs-popover-auto[x-placement^=\"bottom\"] {\n  margin-top: 0.5rem; }\n  .bs-popover-bottom .arrow, .bs-popover-auto[x-placement^=\"bottom\"] .arrow {\n    top: calc((0.5rem + 1px) * -1); }\n  .bs-popover-bottom .arrow::before, .bs-popover-auto[x-placement^=\"bottom\"] .arrow::before,\n  .bs-popover-bottom .arrow::after,\n  .bs-popover-auto[x-placement^=\"bottom\"] .arrow::after {\n    border-width: 0 0.5rem 0.5rem 0.5rem; }\n  .bs-popover-bottom .arrow::before, .bs-popover-auto[x-placement^=\"bottom\"] .arrow::before {\n    top: 0;\n    border-bottom-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-bottom .arrow::after,\n  .bs-popover-auto[x-placement^=\"bottom\"] .arrow::after {\n    top: 1px;\n    border-bottom-color: #fff; }\n  .bs-popover-bottom .popover-header::before, .bs-popover-auto[x-placement^=\"bottom\"] .popover-header::before {\n    position: absolute;\n    top: 0;\n    left: 50%;\n    display: block;\n    width: 1rem;\n    margin-left: -0.5rem;\n    content: \"\";\n    border-bottom: 1px solid #f7f7f7; }\n\n.bs-popover-left, .bs-popover-auto[x-placement^=\"left\"] {\n  margin-right: 0.5rem; }\n  .bs-popover-left .arrow, .bs-popover-auto[x-placement^=\"left\"] .arrow {\n    right: calc((0.5rem + 1px) * -1);\n    width: 0.5rem;\n    height: 1rem;\n    margin: 0.3rem 0; }\n  .bs-popover-left .arrow::before, .bs-popover-auto[x-placement^=\"left\"] .arrow::before,\n  .bs-popover-left .arrow::after,\n  .bs-popover-auto[x-placement^=\"left\"] .arrow::after {\n    border-width: 0.5rem 0 0.5rem 0.5rem; }\n  .bs-popover-left .arrow::before, .bs-popover-auto[x-placement^=\"left\"] .arrow::before {\n    right: 0;\n    border-left-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-left .arrow::after,\n  .bs-popover-auto[x-placement^=\"left\"] .arrow::after {\n    right: 1px;\n    border-left-color: #fff; }\n\n.popover-header {\n  padding: 0.5rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  color: inherit;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-top-left-radius: calc(0.3rem - 1px);\n  border-top-right-radius: calc(0.3rem - 1px); }\n  .popover-header:empty {\n    display: none; }\n\n.popover-body {\n  padding: 0.5rem 0.75rem;\n  color: #212529; }\n\n.carousel {\n  position: relative; }\n\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden; }\n\n.carousel-item {\n  position: relative;\n  display: none;\n  align-items: center;\n  width: 100%;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-perspective: 1000px;\n          perspective: 1000px; }\n\n.carousel-item.active,\n.carousel-item-next,\n.carousel-item-prev {\n  display: block;\n  transition: -webkit-transform 0.6s ease;\n  transition: transform 0.6s ease;\n  transition: transform 0.6s ease, -webkit-transform 0.6s ease; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .carousel-item.active,\n    .carousel-item-next,\n    .carousel-item-prev {\n      transition: none; } }\n\n.carousel-item-next,\n.carousel-item-prev {\n  position: absolute;\n  top: 0; }\n\n.carousel-item-next.carousel-item-left,\n.carousel-item-prev.carousel-item-right {\n  -webkit-transform: translateX(0);\n          transform: translateX(0); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-item-next.carousel-item-left,\n    .carousel-item-prev.carousel-item-right {\n      -webkit-transform: translate3d(0, 0, 0);\n              transform: translate3d(0, 0, 0); } }\n\n.carousel-item-next,\n.active.carousel-item-right {\n  -webkit-transform: translateX(100%);\n          transform: translateX(100%); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-item-next,\n    .active.carousel-item-right {\n      -webkit-transform: translate3d(100%, 0, 0);\n              transform: translate3d(100%, 0, 0); } }\n\n.carousel-item-prev,\n.active.carousel-item-left {\n  -webkit-transform: translateX(-100%);\n          transform: translateX(-100%); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-item-prev,\n    .active.carousel-item-left {\n      -webkit-transform: translate3d(-100%, 0, 0);\n              transform: translate3d(-100%, 0, 0); } }\n\n.carousel-fade .carousel-item {\n  opacity: 0;\n  transition-duration: .6s;\n  transition-property: opacity; }\n\n.carousel-fade .carousel-item.active,\n.carousel-fade .carousel-item-next.carousel-item-left,\n.carousel-fade .carousel-item-prev.carousel-item-right {\n  opacity: 1; }\n\n.carousel-fade .active.carousel-item-left,\n.carousel-fade .active.carousel-item-right {\n  opacity: 0; }\n\n.carousel-fade .carousel-item-next,\n.carousel-fade .carousel-item-prev,\n.carousel-fade .carousel-item.active,\n.carousel-fade .active.carousel-item-left,\n.carousel-fade .active.carousel-item-prev {\n  -webkit-transform: translateX(0);\n          transform: translateX(0); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-fade .carousel-item-next,\n    .carousel-fade .carousel-item-prev,\n    .carousel-fade .carousel-item.active,\n    .carousel-fade .active.carousel-item-left,\n    .carousel-fade .active.carousel-item-prev {\n      -webkit-transform: translate3d(0, 0, 0);\n              transform: translate3d(0, 0, 0); } }\n\n.carousel-control-prev,\n.carousel-control-next {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 15%;\n  color: #fff;\n  text-align: center;\n  opacity: 0.5; }\n  .carousel-control-prev:hover, .carousel-control-prev:focus,\n  .carousel-control-next:hover,\n  .carousel-control-next:focus {\n    color: #fff;\n    text-decoration: none;\n    outline: 0;\n    opacity: .9; }\n\n.carousel-control-prev {\n  left: 0; }\n\n.carousel-control-next {\n  right: 0; }\n\n.carousel-control-prev-icon,\n.carousel-control-next-icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background: transparent no-repeat center center;\n  background-size: 100% 100%; }\n\n.carousel-control-prev-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E\"); }\n\n.carousel-control-next-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E\"); }\n\n.carousel-indicators {\n  position: absolute;\n  right: 0;\n  bottom: 10px;\n  left: 0;\n  z-index: 15;\n  display: flex;\n  justify-content: center;\n  padding-left: 0;\n  margin-right: 15%;\n  margin-left: 15%;\n  list-style: none; }\n  .carousel-indicators li {\n    position: relative;\n    flex: 0 1 auto;\n    width: 30px;\n    height: 3px;\n    margin-right: 3px;\n    margin-left: 3px;\n    text-indent: -999px;\n    cursor: pointer;\n    background-color: rgba(255, 255, 255, 0.5); }\n    .carousel-indicators li::before {\n      position: absolute;\n      top: -10px;\n      left: 0;\n      display: inline-block;\n      width: 100%;\n      height: 10px;\n      content: \"\"; }\n    .carousel-indicators li::after {\n      position: absolute;\n      bottom: -10px;\n      left: 0;\n      display: inline-block;\n      width: 100%;\n      height: 10px;\n      content: \"\"; }\n  .carousel-indicators .active {\n    background-color: #fff; }\n\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center; }\n\n.align-baseline {\n  vertical-align: baseline !important; }\n\n.align-top {\n  vertical-align: top !important; }\n\n.align-middle {\n  vertical-align: middle !important; }\n\n.align-bottom {\n  vertical-align: bottom !important; }\n\n.align-text-bottom {\n  vertical-align: text-bottom !important; }\n\n.align-text-top {\n  vertical-align: text-top !important; }\n\n.bg-primary {\n  background-color: #007bff !important; }\n\na.bg-primary:hover, a.bg-primary:focus,\nbutton.bg-primary:hover,\nbutton.bg-primary:focus {\n  background-color: #0062cc !important; }\n\n.bg-secondary {\n  background-color: #6c757d !important; }\n\na.bg-secondary:hover, a.bg-secondary:focus,\nbutton.bg-secondary:hover,\nbutton.bg-secondary:focus {\n  background-color: #545b62 !important; }\n\n.bg-success {\n  background-color: #28a745 !important; }\n\na.bg-success:hover, a.bg-success:focus,\nbutton.bg-success:hover,\nbutton.bg-success:focus {\n  background-color: #1e7e34 !important; }\n\n.bg-info {\n  background-color: #17a2b8 !important; }\n\na.bg-info:hover, a.bg-info:focus,\nbutton.bg-info:hover,\nbutton.bg-info:focus {\n  background-color: #117a8b !important; }\n\n.bg-warning {\n  background-color: #ffc107 !important; }\n\na.bg-warning:hover, a.bg-warning:focus,\nbutton.bg-warning:hover,\nbutton.bg-warning:focus {\n  background-color: #d39e00 !important; }\n\n.bg-danger {\n  background-color: #dc3545 !important; }\n\na.bg-danger:hover, a.bg-danger:focus,\nbutton.bg-danger:hover,\nbutton.bg-danger:focus {\n  background-color: #bd2130 !important; }\n\n.bg-light {\n  background-color: #f8f9fa !important; }\n\na.bg-light:hover, a.bg-light:focus,\nbutton.bg-light:hover,\nbutton.bg-light:focus {\n  background-color: #dae0e5 !important; }\n\n.bg-dark {\n  background-color: #343a40 !important; }\n\na.bg-dark:hover, a.bg-dark:focus,\nbutton.bg-dark:hover,\nbutton.bg-dark:focus {\n  background-color: #1d2124 !important; }\n\n.bg-white {\n  background-color: #fff !important; }\n\n.bg-transparent {\n  background-color: transparent !important; }\n\n.border {\n  border: 1px solid #dee2e6 !important; }\n\n.border-top {\n  border-top: 1px solid #dee2e6 !important; }\n\n.border-right {\n  border-right: 1px solid #dee2e6 !important; }\n\n.border-bottom {\n  border-bottom: 1px solid #dee2e6 !important; }\n\n.border-left {\n  border-left: 1px solid #dee2e6 !important; }\n\n.border-0 {\n  border: 0 !important; }\n\n.border-top-0 {\n  border-top: 0 !important; }\n\n.border-right-0 {\n  border-right: 0 !important; }\n\n.border-bottom-0 {\n  border-bottom: 0 !important; }\n\n.border-left-0 {\n  border-left: 0 !important; }\n\n.border-primary {\n  border-color: #007bff !important; }\n\n.border-secondary {\n  border-color: #6c757d !important; }\n\n.border-success {\n  border-color: #28a745 !important; }\n\n.border-info {\n  border-color: #17a2b8 !important; }\n\n.border-warning {\n  border-color: #ffc107 !important; }\n\n.border-danger {\n  border-color: #dc3545 !important; }\n\n.border-light {\n  border-color: #f8f9fa !important; }\n\n.border-dark {\n  border-color: #343a40 !important; }\n\n.border-white {\n  border-color: #fff !important; }\n\n.rounded {\n  border-radius: 0.25rem !important; }\n\n.rounded-top {\n  border-top-left-radius: 0.25rem !important;\n  border-top-right-radius: 0.25rem !important; }\n\n.rounded-right {\n  border-top-right-radius: 0.25rem !important;\n  border-bottom-right-radius: 0.25rem !important; }\n\n.rounded-bottom {\n  border-bottom-right-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important; }\n\n.rounded-left {\n  border-top-left-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important; }\n\n.rounded-circle {\n  border-radius: 50% !important; }\n\n.rounded-0 {\n  border-radius: 0 !important; }\n\n.clearfix::after {\n  display: block;\n  clear: both;\n  content: \"\"; }\n\n.d-none {\n  display: none !important; }\n\n.d-inline {\n  display: inline !important; }\n\n.d-inline-block {\n  display: inline-block !important; }\n\n.d-block {\n  display: block !important; }\n\n.d-table {\n  display: table !important; }\n\n.d-table-row {\n  display: table-row !important; }\n\n.d-table-cell {\n  display: table-cell !important; }\n\n.d-flex {\n  display: flex !important; }\n\n.d-inline-flex {\n  display: inline-flex !important; }\n\n@media (min-width: 576px) {\n  .d-sm-none {\n    display: none !important; }\n  .d-sm-inline {\n    display: inline !important; }\n  .d-sm-inline-block {\n    display: inline-block !important; }\n  .d-sm-block {\n    display: block !important; }\n  .d-sm-table {\n    display: table !important; }\n  .d-sm-table-row {\n    display: table-row !important; }\n  .d-sm-table-cell {\n    display: table-cell !important; }\n  .d-sm-flex {\n    display: flex !important; }\n  .d-sm-inline-flex {\n    display: inline-flex !important; } }\n\n@media (min-width: 768px) {\n  .d-md-none {\n    display: none !important; }\n  .d-md-inline {\n    display: inline !important; }\n  .d-md-inline-block {\n    display: inline-block !important; }\n  .d-md-block {\n    display: block !important; }\n  .d-md-table {\n    display: table !important; }\n  .d-md-table-row {\n    display: table-row !important; }\n  .d-md-table-cell {\n    display: table-cell !important; }\n  .d-md-flex {\n    display: flex !important; }\n  .d-md-inline-flex {\n    display: inline-flex !important; } }\n\n@media (min-width: 992px) {\n  .d-lg-none {\n    display: none !important; }\n  .d-lg-inline {\n    display: inline !important; }\n  .d-lg-inline-block {\n    display: inline-block !important; }\n  .d-lg-block {\n    display: block !important; }\n  .d-lg-table {\n    display: table !important; }\n  .d-lg-table-row {\n    display: table-row !important; }\n  .d-lg-table-cell {\n    display: table-cell !important; }\n  .d-lg-flex {\n    display: flex !important; }\n  .d-lg-inline-flex {\n    display: inline-flex !important; } }\n\n@media (min-width: 1200px) {\n  .d-xl-none {\n    display: none !important; }\n  .d-xl-inline {\n    display: inline !important; }\n  .d-xl-inline-block {\n    display: inline-block !important; }\n  .d-xl-block {\n    display: block !important; }\n  .d-xl-table {\n    display: table !important; }\n  .d-xl-table-row {\n    display: table-row !important; }\n  .d-xl-table-cell {\n    display: table-cell !important; }\n  .d-xl-flex {\n    display: flex !important; }\n  .d-xl-inline-flex {\n    display: inline-flex !important; } }\n\n@media print {\n  .d-print-none {\n    display: none !important; }\n  .d-print-inline {\n    display: inline !important; }\n  .d-print-inline-block {\n    display: inline-block !important; }\n  .d-print-block {\n    display: block !important; }\n  .d-print-table {\n    display: table !important; }\n  .d-print-table-row {\n    display: table-row !important; }\n  .d-print-table-cell {\n    display: table-cell !important; }\n  .d-print-flex {\n    display: flex !important; }\n  .d-print-inline-flex {\n    display: inline-flex !important; } }\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  width: 100%;\n  padding: 0;\n  overflow: hidden; }\n  .embed-responsive::before {\n    display: block;\n    content: \"\"; }\n  .embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    border: 0; }\n\n.embed-responsive-21by9::before {\n  padding-top: 42.85714%; }\n\n.embed-responsive-16by9::before {\n  padding-top: 56.25%; }\n\n.embed-responsive-4by3::before {\n  padding-top: 75%; }\n\n.embed-responsive-1by1::before {\n  padding-top: 100%; }\n\n.flex-row {\n  flex-direction: row !important; }\n\n.flex-column {\n  flex-direction: column !important; }\n\n.flex-row-reverse {\n  flex-direction: row-reverse !important; }\n\n.flex-column-reverse {\n  flex-direction: column-reverse !important; }\n\n.flex-wrap {\n  flex-wrap: wrap !important; }\n\n.flex-nowrap {\n  flex-wrap: nowrap !important; }\n\n.flex-wrap-reverse {\n  flex-wrap: wrap-reverse !important; }\n\n.flex-fill {\n  flex: 1 1 auto !important; }\n\n.flex-grow-0 {\n  flex-grow: 0 !important; }\n\n.flex-grow-1 {\n  flex-grow: 1 !important; }\n\n.flex-shrink-0 {\n  flex-shrink: 0 !important; }\n\n.flex-shrink-1 {\n  flex-shrink: 1 !important; }\n\n.justify-content-start {\n  justify-content: flex-start !important; }\n\n.justify-content-end {\n  justify-content: flex-end !important; }\n\n.justify-content-center {\n  justify-content: center !important; }\n\n.justify-content-between {\n  justify-content: space-between !important; }\n\n.justify-content-around {\n  justify-content: space-around !important; }\n\n.align-items-start {\n  align-items: flex-start !important; }\n\n.align-items-end {\n  align-items: flex-end !important; }\n\n.align-items-center {\n  align-items: center !important; }\n\n.align-items-baseline {\n  align-items: baseline !important; }\n\n.align-items-stretch {\n  align-items: stretch !important; }\n\n.align-content-start {\n  align-content: flex-start !important; }\n\n.align-content-end {\n  align-content: flex-end !important; }\n\n.align-content-center {\n  align-content: center !important; }\n\n.align-content-between {\n  align-content: space-between !important; }\n\n.align-content-around {\n  align-content: space-around !important; }\n\n.align-content-stretch {\n  align-content: stretch !important; }\n\n.align-self-auto {\n  align-self: auto !important; }\n\n.align-self-start {\n  align-self: flex-start !important; }\n\n.align-self-end {\n  align-self: flex-end !important; }\n\n.align-self-center {\n  align-self: center !important; }\n\n.align-self-baseline {\n  align-self: baseline !important; }\n\n.align-self-stretch {\n  align-self: stretch !important; }\n\n@media (min-width: 576px) {\n  .flex-sm-row {\n    flex-direction: row !important; }\n  .flex-sm-column {\n    flex-direction: column !important; }\n  .flex-sm-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-sm-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-sm-wrap {\n    flex-wrap: wrap !important; }\n  .flex-sm-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-sm-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-sm-fill {\n    flex: 1 1 auto !important; }\n  .flex-sm-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-sm-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-sm-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-sm-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-sm-start {\n    justify-content: flex-start !important; }\n  .justify-content-sm-end {\n    justify-content: flex-end !important; }\n  .justify-content-sm-center {\n    justify-content: center !important; }\n  .justify-content-sm-between {\n    justify-content: space-between !important; }\n  .justify-content-sm-around {\n    justify-content: space-around !important; }\n  .align-items-sm-start {\n    align-items: flex-start !important; }\n  .align-items-sm-end {\n    align-items: flex-end !important; }\n  .align-items-sm-center {\n    align-items: center !important; }\n  .align-items-sm-baseline {\n    align-items: baseline !important; }\n  .align-items-sm-stretch {\n    align-items: stretch !important; }\n  .align-content-sm-start {\n    align-content: flex-start !important; }\n  .align-content-sm-end {\n    align-content: flex-end !important; }\n  .align-content-sm-center {\n    align-content: center !important; }\n  .align-content-sm-between {\n    align-content: space-between !important; }\n  .align-content-sm-around {\n    align-content: space-around !important; }\n  .align-content-sm-stretch {\n    align-content: stretch !important; }\n  .align-self-sm-auto {\n    align-self: auto !important; }\n  .align-self-sm-start {\n    align-self: flex-start !important; }\n  .align-self-sm-end {\n    align-self: flex-end !important; }\n  .align-self-sm-center {\n    align-self: center !important; }\n  .align-self-sm-baseline {\n    align-self: baseline !important; }\n  .align-self-sm-stretch {\n    align-self: stretch !important; } }\n\n@media (min-width: 768px) {\n  .flex-md-row {\n    flex-direction: row !important; }\n  .flex-md-column {\n    flex-direction: column !important; }\n  .flex-md-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-md-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-md-wrap {\n    flex-wrap: wrap !important; }\n  .flex-md-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-md-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-md-fill {\n    flex: 1 1 auto !important; }\n  .flex-md-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-md-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-md-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-md-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-md-start {\n    justify-content: flex-start !important; }\n  .justify-content-md-end {\n    justify-content: flex-end !important; }\n  .justify-content-md-center {\n    justify-content: center !important; }\n  .justify-content-md-between {\n    justify-content: space-between !important; }\n  .justify-content-md-around {\n    justify-content: space-around !important; }\n  .align-items-md-start {\n    align-items: flex-start !important; }\n  .align-items-md-end {\n    align-items: flex-end !important; }\n  .align-items-md-center {\n    align-items: center !important; }\n  .align-items-md-baseline {\n    align-items: baseline !important; }\n  .align-items-md-stretch {\n    align-items: stretch !important; }\n  .align-content-md-start {\n    align-content: flex-start !important; }\n  .align-content-md-end {\n    align-content: flex-end !important; }\n  .align-content-md-center {\n    align-content: center !important; }\n  .align-content-md-between {\n    align-content: space-between !important; }\n  .align-content-md-around {\n    align-content: space-around !important; }\n  .align-content-md-stretch {\n    align-content: stretch !important; }\n  .align-self-md-auto {\n    align-self: auto !important; }\n  .align-self-md-start {\n    align-self: flex-start !important; }\n  .align-self-md-end {\n    align-self: flex-end !important; }\n  .align-self-md-center {\n    align-self: center !important; }\n  .align-self-md-baseline {\n    align-self: baseline !important; }\n  .align-self-md-stretch {\n    align-self: stretch !important; } }\n\n@media (min-width: 992px) {\n  .flex-lg-row {\n    flex-direction: row !important; }\n  .flex-lg-column {\n    flex-direction: column !important; }\n  .flex-lg-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-lg-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-lg-wrap {\n    flex-wrap: wrap !important; }\n  .flex-lg-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-lg-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-lg-fill {\n    flex: 1 1 auto !important; }\n  .flex-lg-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-lg-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-lg-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-lg-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-lg-start {\n    justify-content: flex-start !important; }\n  .justify-content-lg-end {\n    justify-content: flex-end !important; }\n  .justify-content-lg-center {\n    justify-content: center !important; }\n  .justify-content-lg-between {\n    justify-content: space-between !important; }\n  .justify-content-lg-around {\n    justify-content: space-around !important; }\n  .align-items-lg-start {\n    align-items: flex-start !important; }\n  .align-items-lg-end {\n    align-items: flex-end !important; }\n  .align-items-lg-center {\n    align-items: center !important; }\n  .align-items-lg-baseline {\n    align-items: baseline !important; }\n  .align-items-lg-stretch {\n    align-items: stretch !important; }\n  .align-content-lg-start {\n    align-content: flex-start !important; }\n  .align-content-lg-end {\n    align-content: flex-end !important; }\n  .align-content-lg-center {\n    align-content: center !important; }\n  .align-content-lg-between {\n    align-content: space-between !important; }\n  .align-content-lg-around {\n    align-content: space-around !important; }\n  .align-content-lg-stretch {\n    align-content: stretch !important; }\n  .align-self-lg-auto {\n    align-self: auto !important; }\n  .align-self-lg-start {\n    align-self: flex-start !important; }\n  .align-self-lg-end {\n    align-self: flex-end !important; }\n  .align-self-lg-center {\n    align-self: center !important; }\n  .align-self-lg-baseline {\n    align-self: baseline !important; }\n  .align-self-lg-stretch {\n    align-self: stretch !important; } }\n\n@media (min-width: 1200px) {\n  .flex-xl-row {\n    flex-direction: row !important; }\n  .flex-xl-column {\n    flex-direction: column !important; }\n  .flex-xl-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-xl-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-xl-wrap {\n    flex-wrap: wrap !important; }\n  .flex-xl-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-xl-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-xl-fill {\n    flex: 1 1 auto !important; }\n  .flex-xl-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-xl-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-xl-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-xl-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-xl-start {\n    justify-content: flex-start !important; }\n  .justify-content-xl-end {\n    justify-content: flex-end !important; }\n  .justify-content-xl-center {\n    justify-content: center !important; }\n  .justify-content-xl-between {\n    justify-content: space-between !important; }\n  .justify-content-xl-around {\n    justify-content: space-around !important; }\n  .align-items-xl-start {\n    align-items: flex-start !important; }\n  .align-items-xl-end {\n    align-items: flex-end !important; }\n  .align-items-xl-center {\n    align-items: center !important; }\n  .align-items-xl-baseline {\n    align-items: baseline !important; }\n  .align-items-xl-stretch {\n    align-items: stretch !important; }\n  .align-content-xl-start {\n    align-content: flex-start !important; }\n  .align-content-xl-end {\n    align-content: flex-end !important; }\n  .align-content-xl-center {\n    align-content: center !important; }\n  .align-content-xl-between {\n    align-content: space-between !important; }\n  .align-content-xl-around {\n    align-content: space-around !important; }\n  .align-content-xl-stretch {\n    align-content: stretch !important; }\n  .align-self-xl-auto {\n    align-self: auto !important; }\n  .align-self-xl-start {\n    align-self: flex-start !important; }\n  .align-self-xl-end {\n    align-self: flex-end !important; }\n  .align-self-xl-center {\n    align-self: center !important; }\n  .align-self-xl-baseline {\n    align-self: baseline !important; }\n  .align-self-xl-stretch {\n    align-self: stretch !important; } }\n\n.float-left {\n  float: left !important; }\n\n.float-right {\n  float: right !important; }\n\n.float-none {\n  float: none !important; }\n\n@media (min-width: 576px) {\n  .float-sm-left {\n    float: left !important; }\n  .float-sm-right {\n    float: right !important; }\n  .float-sm-none {\n    float: none !important; } }\n\n@media (min-width: 768px) {\n  .float-md-left {\n    float: left !important; }\n  .float-md-right {\n    float: right !important; }\n  .float-md-none {\n    float: none !important; } }\n\n@media (min-width: 992px) {\n  .float-lg-left {\n    float: left !important; }\n  .float-lg-right {\n    float: right !important; }\n  .float-lg-none {\n    float: none !important; } }\n\n@media (min-width: 1200px) {\n  .float-xl-left {\n    float: left !important; }\n  .float-xl-right {\n    float: right !important; }\n  .float-xl-none {\n    float: none !important; } }\n\n.position-static {\n  position: static !important; }\n\n.position-relative {\n  position: relative !important; }\n\n.position-absolute {\n  position: absolute !important; }\n\n.position-fixed {\n  position: fixed !important; }\n\n.position-sticky {\n  position: -webkit-sticky !important;\n  position: sticky !important; }\n\n.fixed-top {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n\n.fixed-bottom {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1030; }\n\n@supports ((position: -webkit-sticky) or (position: sticky)) {\n  .sticky-top {\n    position: -webkit-sticky;\n    position: sticky;\n    top: 0;\n    z-index: 1020; } }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  overflow: visible;\n  clip: auto;\n  white-space: normal; }\n\n.shadow-sm {\n  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important; }\n\n.shadow {\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; }\n\n.shadow-lg {\n  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important; }\n\n.shadow-none {\n  box-shadow: none !important; }\n\n.w-25 {\n  width: 25% !important; }\n\n.w-50 {\n  width: 50% !important; }\n\n.w-75 {\n  width: 75% !important; }\n\n.w-100 {\n  width: 100% !important; }\n\n.w-auto {\n  width: auto !important; }\n\n.h-25 {\n  height: 25% !important; }\n\n.h-50 {\n  height: 50% !important; }\n\n.h-75 {\n  height: 75% !important; }\n\n.h-100 {\n  height: 100% !important; }\n\n.h-auto {\n  height: auto !important; }\n\n.mw-100 {\n  max-width: 100% !important; }\n\n.mh-100 {\n  max-height: 100% !important; }\n\n.m-0 {\n  margin: 0 !important; }\n\n.mt-0,\n.my-0 {\n  margin-top: 0 !important; }\n\n.mr-0,\n.mx-0 {\n  margin-right: 0 !important; }\n\n.mb-0,\n.my-0 {\n  margin-bottom: 0 !important; }\n\n.ml-0,\n.mx-0 {\n  margin-left: 0 !important; }\n\n.m-1 {\n  margin: 0.25rem !important; }\n\n.mt-1,\n.my-1 {\n  margin-top: 0.25rem !important; }\n\n.mr-1,\n.mx-1 {\n  margin-right: 0.25rem !important; }\n\n.mb-1,\n.my-1 {\n  margin-bottom: 0.25rem !important; }\n\n.ml-1,\n.mx-1 {\n  margin-left: 0.25rem !important; }\n\n.m-2 {\n  margin: 0.5rem !important; }\n\n.mt-2,\n.my-2 {\n  margin-top: 0.5rem !important; }\n\n.mr-2,\n.mx-2 {\n  margin-right: 0.5rem !important; }\n\n.mb-2,\n.my-2 {\n  margin-bottom: 0.5rem !important; }\n\n.ml-2,\n.mx-2 {\n  margin-left: 0.5rem !important; }\n\n.m-3 {\n  margin: 1rem !important; }\n\n.mt-3,\n.my-3 {\n  margin-top: 1rem !important; }\n\n.mr-3,\n.mx-3 {\n  margin-right: 1rem !important; }\n\n.mb-3,\n.my-3 {\n  margin-bottom: 1rem !important; }\n\n.ml-3,\n.mx-3 {\n  margin-left: 1rem !important; }\n\n.m-4 {\n  margin: 1.5rem !important; }\n\n.mt-4,\n.my-4 {\n  margin-top: 1.5rem !important; }\n\n.mr-4,\n.mx-4 {\n  margin-right: 1.5rem !important; }\n\n.mb-4,\n.my-4 {\n  margin-bottom: 1.5rem !important; }\n\n.ml-4,\n.mx-4 {\n  margin-left: 1.5rem !important; }\n\n.m-5 {\n  margin: 3rem !important; }\n\n.mt-5,\n.my-5 {\n  margin-top: 3rem !important; }\n\n.mr-5,\n.mx-5 {\n  margin-right: 3rem !important; }\n\n.mb-5,\n.my-5 {\n  margin-bottom: 3rem !important; }\n\n.ml-5,\n.mx-5 {\n  margin-left: 3rem !important; }\n\n.p-0 {\n  padding: 0 !important; }\n\n.pt-0,\n.py-0 {\n  padding-top: 0 !important; }\n\n.pr-0,\n.px-0 {\n  padding-right: 0 !important; }\n\n.pb-0,\n.py-0 {\n  padding-bottom: 0 !important; }\n\n.pl-0,\n.px-0 {\n  padding-left: 0 !important; }\n\n.p-1 {\n  padding: 0.25rem !important; }\n\n.pt-1,\n.py-1 {\n  padding-top: 0.25rem !important; }\n\n.pr-1,\n.px-1 {\n  padding-right: 0.25rem !important; }\n\n.pb-1,\n.py-1 {\n  padding-bottom: 0.25rem !important; }\n\n.pl-1,\n.px-1 {\n  padding-left: 0.25rem !important; }\n\n.p-2 {\n  padding: 0.5rem !important; }\n\n.pt-2,\n.py-2 {\n  padding-top: 0.5rem !important; }\n\n.pr-2,\n.px-2 {\n  padding-right: 0.5rem !important; }\n\n.pb-2,\n.py-2 {\n  padding-bottom: 0.5rem !important; }\n\n.pl-2,\n.px-2 {\n  padding-left: 0.5rem !important; }\n\n.p-3 {\n  padding: 1rem !important; }\n\n.pt-3,\n.py-3 {\n  padding-top: 1rem !important; }\n\n.pr-3,\n.px-3 {\n  padding-right: 1rem !important; }\n\n.pb-3,\n.py-3 {\n  padding-bottom: 1rem !important; }\n\n.pl-3,\n.px-3 {\n  padding-left: 1rem !important; }\n\n.p-4 {\n  padding: 1.5rem !important; }\n\n.pt-4,\n.py-4 {\n  padding-top: 1.5rem !important; }\n\n.pr-4,\n.px-4 {\n  padding-right: 1.5rem !important; }\n\n.pb-4,\n.py-4 {\n  padding-bottom: 1.5rem !important; }\n\n.pl-4,\n.px-4 {\n  padding-left: 1.5rem !important; }\n\n.p-5 {\n  padding: 3rem !important; }\n\n.pt-5,\n.py-5 {\n  padding-top: 3rem !important; }\n\n.pr-5,\n.px-5 {\n  padding-right: 3rem !important; }\n\n.pb-5,\n.py-5 {\n  padding-bottom: 3rem !important; }\n\n.pl-5,\n.px-5 {\n  padding-left: 3rem !important; }\n\n.m-auto {\n  margin: auto !important; }\n\n.mt-auto,\n.my-auto {\n  margin-top: auto !important; }\n\n.mr-auto,\n.mx-auto {\n  margin-right: auto !important; }\n\n.mb-auto,\n.my-auto {\n  margin-bottom: auto !important; }\n\n.ml-auto,\n.mx-auto {\n  margin-left: auto !important; }\n\n@media (min-width: 576px) {\n  .m-sm-0 {\n    margin: 0 !important; }\n  .mt-sm-0,\n  .my-sm-0 {\n    margin-top: 0 !important; }\n  .mr-sm-0,\n  .mx-sm-0 {\n    margin-right: 0 !important; }\n  .mb-sm-0,\n  .my-sm-0 {\n    margin-bottom: 0 !important; }\n  .ml-sm-0,\n  .mx-sm-0 {\n    margin-left: 0 !important; }\n  .m-sm-1 {\n    margin: 0.25rem !important; }\n  .mt-sm-1,\n  .my-sm-1 {\n    margin-top: 0.25rem !important; }\n  .mr-sm-1,\n  .mx-sm-1 {\n    margin-right: 0.25rem !important; }\n  .mb-sm-1,\n  .my-sm-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-sm-1,\n  .mx-sm-1 {\n    margin-left: 0.25rem !important; }\n  .m-sm-2 {\n    margin: 0.5rem !important; }\n  .mt-sm-2,\n  .my-sm-2 {\n    margin-top: 0.5rem !important; }\n  .mr-sm-2,\n  .mx-sm-2 {\n    margin-right: 0.5rem !important; }\n  .mb-sm-2,\n  .my-sm-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-sm-2,\n  .mx-sm-2 {\n    margin-left: 0.5rem !important; }\n  .m-sm-3 {\n    margin: 1rem !important; }\n  .mt-sm-3,\n  .my-sm-3 {\n    margin-top: 1rem !important; }\n  .mr-sm-3,\n  .mx-sm-3 {\n    margin-right: 1rem !important; }\n  .mb-sm-3,\n  .my-sm-3 {\n    margin-bottom: 1rem !important; }\n  .ml-sm-3,\n  .mx-sm-3 {\n    margin-left: 1rem !important; }\n  .m-sm-4 {\n    margin: 1.5rem !important; }\n  .mt-sm-4,\n  .my-sm-4 {\n    margin-top: 1.5rem !important; }\n  .mr-sm-4,\n  .mx-sm-4 {\n    margin-right: 1.5rem !important; }\n  .mb-sm-4,\n  .my-sm-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-sm-4,\n  .mx-sm-4 {\n    margin-left: 1.5rem !important; }\n  .m-sm-5 {\n    margin: 3rem !important; }\n  .mt-sm-5,\n  .my-sm-5 {\n    margin-top: 3rem !important; }\n  .mr-sm-5,\n  .mx-sm-5 {\n    margin-right: 3rem !important; }\n  .mb-sm-5,\n  .my-sm-5 {\n    margin-bottom: 3rem !important; }\n  .ml-sm-5,\n  .mx-sm-5 {\n    margin-left: 3rem !important; }\n  .p-sm-0 {\n    padding: 0 !important; }\n  .pt-sm-0,\n  .py-sm-0 {\n    padding-top: 0 !important; }\n  .pr-sm-0,\n  .px-sm-0 {\n    padding-right: 0 !important; }\n  .pb-sm-0,\n  .py-sm-0 {\n    padding-bottom: 0 !important; }\n  .pl-sm-0,\n  .px-sm-0 {\n    padding-left: 0 !important; }\n  .p-sm-1 {\n    padding: 0.25rem !important; }\n  .pt-sm-1,\n  .py-sm-1 {\n    padding-top: 0.25rem !important; }\n  .pr-sm-1,\n  .px-sm-1 {\n    padding-right: 0.25rem !important; }\n  .pb-sm-1,\n  .py-sm-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-sm-1,\n  .px-sm-1 {\n    padding-left: 0.25rem !important; }\n  .p-sm-2 {\n    padding: 0.5rem !important; }\n  .pt-sm-2,\n  .py-sm-2 {\n    padding-top: 0.5rem !important; }\n  .pr-sm-2,\n  .px-sm-2 {\n    padding-right: 0.5rem !important; }\n  .pb-sm-2,\n  .py-sm-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-sm-2,\n  .px-sm-2 {\n    padding-left: 0.5rem !important; }\n  .p-sm-3 {\n    padding: 1rem !important; }\n  .pt-sm-3,\n  .py-sm-3 {\n    padding-top: 1rem !important; }\n  .pr-sm-3,\n  .px-sm-3 {\n    padding-right: 1rem !important; }\n  .pb-sm-3,\n  .py-sm-3 {\n    padding-bottom: 1rem !important; }\n  .pl-sm-3,\n  .px-sm-3 {\n    padding-left: 1rem !important; }\n  .p-sm-4 {\n    padding: 1.5rem !important; }\n  .pt-sm-4,\n  .py-sm-4 {\n    padding-top: 1.5rem !important; }\n  .pr-sm-4,\n  .px-sm-4 {\n    padding-right: 1.5rem !important; }\n  .pb-sm-4,\n  .py-sm-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-sm-4,\n  .px-sm-4 {\n    padding-left: 1.5rem !important; }\n  .p-sm-5 {\n    padding: 3rem !important; }\n  .pt-sm-5,\n  .py-sm-5 {\n    padding-top: 3rem !important; }\n  .pr-sm-5,\n  .px-sm-5 {\n    padding-right: 3rem !important; }\n  .pb-sm-5,\n  .py-sm-5 {\n    padding-bottom: 3rem !important; }\n  .pl-sm-5,\n  .px-sm-5 {\n    padding-left: 3rem !important; }\n  .m-sm-auto {\n    margin: auto !important; }\n  .mt-sm-auto,\n  .my-sm-auto {\n    margin-top: auto !important; }\n  .mr-sm-auto,\n  .mx-sm-auto {\n    margin-right: auto !important; }\n  .mb-sm-auto,\n  .my-sm-auto {\n    margin-bottom: auto !important; }\n  .ml-sm-auto,\n  .mx-sm-auto {\n    margin-left: auto !important; } }\n\n@media (min-width: 768px) {\n  .m-md-0 {\n    margin: 0 !important; }\n  .mt-md-0,\n  .my-md-0 {\n    margin-top: 0 !important; }\n  .mr-md-0,\n  .mx-md-0 {\n    margin-right: 0 !important; }\n  .mb-md-0,\n  .my-md-0 {\n    margin-bottom: 0 !important; }\n  .ml-md-0,\n  .mx-md-0 {\n    margin-left: 0 !important; }\n  .m-md-1 {\n    margin: 0.25rem !important; }\n  .mt-md-1,\n  .my-md-1 {\n    margin-top: 0.25rem !important; }\n  .mr-md-1,\n  .mx-md-1 {\n    margin-right: 0.25rem !important; }\n  .mb-md-1,\n  .my-md-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-md-1,\n  .mx-md-1 {\n    margin-left: 0.25rem !important; }\n  .m-md-2 {\n    margin: 0.5rem !important; }\n  .mt-md-2,\n  .my-md-2 {\n    margin-top: 0.5rem !important; }\n  .mr-md-2,\n  .mx-md-2 {\n    margin-right: 0.5rem !important; }\n  .mb-md-2,\n  .my-md-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-md-2,\n  .mx-md-2 {\n    margin-left: 0.5rem !important; }\n  .m-md-3 {\n    margin: 1rem !important; }\n  .mt-md-3,\n  .my-md-3 {\n    margin-top: 1rem !important; }\n  .mr-md-3,\n  .mx-md-3 {\n    margin-right: 1rem !important; }\n  .mb-md-3,\n  .my-md-3 {\n    margin-bottom: 1rem !important; }\n  .ml-md-3,\n  .mx-md-3 {\n    margin-left: 1rem !important; }\n  .m-md-4 {\n    margin: 1.5rem !important; }\n  .mt-md-4,\n  .my-md-4 {\n    margin-top: 1.5rem !important; }\n  .mr-md-4,\n  .mx-md-4 {\n    margin-right: 1.5rem !important; }\n  .mb-md-4,\n  .my-md-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-md-4,\n  .mx-md-4 {\n    margin-left: 1.5rem !important; }\n  .m-md-5 {\n    margin: 3rem !important; }\n  .mt-md-5,\n  .my-md-5 {\n    margin-top: 3rem !important; }\n  .mr-md-5,\n  .mx-md-5 {\n    margin-right: 3rem !important; }\n  .mb-md-5,\n  .my-md-5 {\n    margin-bottom: 3rem !important; }\n  .ml-md-5,\n  .mx-md-5 {\n    margin-left: 3rem !important; }\n  .p-md-0 {\n    padding: 0 !important; }\n  .pt-md-0,\n  .py-md-0 {\n    padding-top: 0 !important; }\n  .pr-md-0,\n  .px-md-0 {\n    padding-right: 0 !important; }\n  .pb-md-0,\n  .py-md-0 {\n    padding-bottom: 0 !important; }\n  .pl-md-0,\n  .px-md-0 {\n    padding-left: 0 !important; }\n  .p-md-1 {\n    padding: 0.25rem !important; }\n  .pt-md-1,\n  .py-md-1 {\n    padding-top: 0.25rem !important; }\n  .pr-md-1,\n  .px-md-1 {\n    padding-right: 0.25rem !important; }\n  .pb-md-1,\n  .py-md-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-md-1,\n  .px-md-1 {\n    padding-left: 0.25rem !important; }\n  .p-md-2 {\n    padding: 0.5rem !important; }\n  .pt-md-2,\n  .py-md-2 {\n    padding-top: 0.5rem !important; }\n  .pr-md-2,\n  .px-md-2 {\n    padding-right: 0.5rem !important; }\n  .pb-md-2,\n  .py-md-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-md-2,\n  .px-md-2 {\n    padding-left: 0.5rem !important; }\n  .p-md-3 {\n    padding: 1rem !important; }\n  .pt-md-3,\n  .py-md-3 {\n    padding-top: 1rem !important; }\n  .pr-md-3,\n  .px-md-3 {\n    padding-right: 1rem !important; }\n  .pb-md-3,\n  .py-md-3 {\n    padding-bottom: 1rem !important; }\n  .pl-md-3,\n  .px-md-3 {\n    padding-left: 1rem !important; }\n  .p-md-4 {\n    padding: 1.5rem !important; }\n  .pt-md-4,\n  .py-md-4 {\n    padding-top: 1.5rem !important; }\n  .pr-md-4,\n  .px-md-4 {\n    padding-right: 1.5rem !important; }\n  .pb-md-4,\n  .py-md-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-md-4,\n  .px-md-4 {\n    padding-left: 1.5rem !important; }\n  .p-md-5 {\n    padding: 3rem !important; }\n  .pt-md-5,\n  .py-md-5 {\n    padding-top: 3rem !important; }\n  .pr-md-5,\n  .px-md-5 {\n    padding-right: 3rem !important; }\n  .pb-md-5,\n  .py-md-5 {\n    padding-bottom: 3rem !important; }\n  .pl-md-5,\n  .px-md-5 {\n    padding-left: 3rem !important; }\n  .m-md-auto {\n    margin: auto !important; }\n  .mt-md-auto,\n  .my-md-auto {\n    margin-top: auto !important; }\n  .mr-md-auto,\n  .mx-md-auto {\n    margin-right: auto !important; }\n  .mb-md-auto,\n  .my-md-auto {\n    margin-bottom: auto !important; }\n  .ml-md-auto,\n  .mx-md-auto {\n    margin-left: auto !important; } }\n\n@media (min-width: 992px) {\n  .m-lg-0 {\n    margin: 0 !important; }\n  .mt-lg-0,\n  .my-lg-0 {\n    margin-top: 0 !important; }\n  .mr-lg-0,\n  .mx-lg-0 {\n    margin-right: 0 !important; }\n  .mb-lg-0,\n  .my-lg-0 {\n    margin-bottom: 0 !important; }\n  .ml-lg-0,\n  .mx-lg-0 {\n    margin-left: 0 !important; }\n  .m-lg-1 {\n    margin: 0.25rem !important; }\n  .mt-lg-1,\n  .my-lg-1 {\n    margin-top: 0.25rem !important; }\n  .mr-lg-1,\n  .mx-lg-1 {\n    margin-right: 0.25rem !important; }\n  .mb-lg-1,\n  .my-lg-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-lg-1,\n  .mx-lg-1 {\n    margin-left: 0.25rem !important; }\n  .m-lg-2 {\n    margin: 0.5rem !important; }\n  .mt-lg-2,\n  .my-lg-2 {\n    margin-top: 0.5rem !important; }\n  .mr-lg-2,\n  .mx-lg-2 {\n    margin-right: 0.5rem !important; }\n  .mb-lg-2,\n  .my-lg-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-lg-2,\n  .mx-lg-2 {\n    margin-left: 0.5rem !important; }\n  .m-lg-3 {\n    margin: 1rem !important; }\n  .mt-lg-3,\n  .my-lg-3 {\n    margin-top: 1rem !important; }\n  .mr-lg-3,\n  .mx-lg-3 {\n    margin-right: 1rem !important; }\n  .mb-lg-3,\n  .my-lg-3 {\n    margin-bottom: 1rem !important; }\n  .ml-lg-3,\n  .mx-lg-3 {\n    margin-left: 1rem !important; }\n  .m-lg-4 {\n    margin: 1.5rem !important; }\n  .mt-lg-4,\n  .my-lg-4 {\n    margin-top: 1.5rem !important; }\n  .mr-lg-4,\n  .mx-lg-4 {\n    margin-right: 1.5rem !important; }\n  .mb-lg-4,\n  .my-lg-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-lg-4,\n  .mx-lg-4 {\n    margin-left: 1.5rem !important; }\n  .m-lg-5 {\n    margin: 3rem !important; }\n  .mt-lg-5,\n  .my-lg-5 {\n    margin-top: 3rem !important; }\n  .mr-lg-5,\n  .mx-lg-5 {\n    margin-right: 3rem !important; }\n  .mb-lg-5,\n  .my-lg-5 {\n    margin-bottom: 3rem !important; }\n  .ml-lg-5,\n  .mx-lg-5 {\n    margin-left: 3rem !important; }\n  .p-lg-0 {\n    padding: 0 !important; }\n  .pt-lg-0,\n  .py-lg-0 {\n    padding-top: 0 !important; }\n  .pr-lg-0,\n  .px-lg-0 {\n    padding-right: 0 !important; }\n  .pb-lg-0,\n  .py-lg-0 {\n    padding-bottom: 0 !important; }\n  .pl-lg-0,\n  .px-lg-0 {\n    padding-left: 0 !important; }\n  .p-lg-1 {\n    padding: 0.25rem !important; }\n  .pt-lg-1,\n  .py-lg-1 {\n    padding-top: 0.25rem !important; }\n  .pr-lg-1,\n  .px-lg-1 {\n    padding-right: 0.25rem !important; }\n  .pb-lg-1,\n  .py-lg-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-lg-1,\n  .px-lg-1 {\n    padding-left: 0.25rem !important; }\n  .p-lg-2 {\n    padding: 0.5rem !important; }\n  .pt-lg-2,\n  .py-lg-2 {\n    padding-top: 0.5rem !important; }\n  .pr-lg-2,\n  .px-lg-2 {\n    padding-right: 0.5rem !important; }\n  .pb-lg-2,\n  .py-lg-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-lg-2,\n  .px-lg-2 {\n    padding-left: 0.5rem !important; }\n  .p-lg-3 {\n    padding: 1rem !important; }\n  .pt-lg-3,\n  .py-lg-3 {\n    padding-top: 1rem !important; }\n  .pr-lg-3,\n  .px-lg-3 {\n    padding-right: 1rem !important; }\n  .pb-lg-3,\n  .py-lg-3 {\n    padding-bottom: 1rem !important; }\n  .pl-lg-3,\n  .px-lg-3 {\n    padding-left: 1rem !important; }\n  .p-lg-4 {\n    padding: 1.5rem !important; }\n  .pt-lg-4,\n  .py-lg-4 {\n    padding-top: 1.5rem !important; }\n  .pr-lg-4,\n  .px-lg-4 {\n    padding-right: 1.5rem !important; }\n  .pb-lg-4,\n  .py-lg-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-lg-4,\n  .px-lg-4 {\n    padding-left: 1.5rem !important; }\n  .p-lg-5 {\n    padding: 3rem !important; }\n  .pt-lg-5,\n  .py-lg-5 {\n    padding-top: 3rem !important; }\n  .pr-lg-5,\n  .px-lg-5 {\n    padding-right: 3rem !important; }\n  .pb-lg-5,\n  .py-lg-5 {\n    padding-bottom: 3rem !important; }\n  .pl-lg-5,\n  .px-lg-5 {\n    padding-left: 3rem !important; }\n  .m-lg-auto {\n    margin: auto !important; }\n  .mt-lg-auto,\n  .my-lg-auto {\n    margin-top: auto !important; }\n  .mr-lg-auto,\n  .mx-lg-auto {\n    margin-right: auto !important; }\n  .mb-lg-auto,\n  .my-lg-auto {\n    margin-bottom: auto !important; }\n  .ml-lg-auto,\n  .mx-lg-auto {\n    margin-left: auto !important; } }\n\n@media (min-width: 1200px) {\n  .m-xl-0 {\n    margin: 0 !important; }\n  .mt-xl-0,\n  .my-xl-0 {\n    margin-top: 0 !important; }\n  .mr-xl-0,\n  .mx-xl-0 {\n    margin-right: 0 !important; }\n  .mb-xl-0,\n  .my-xl-0 {\n    margin-bottom: 0 !important; }\n  .ml-xl-0,\n  .mx-xl-0 {\n    margin-left: 0 !important; }\n  .m-xl-1 {\n    margin: 0.25rem !important; }\n  .mt-xl-1,\n  .my-xl-1 {\n    margin-top: 0.25rem !important; }\n  .mr-xl-1,\n  .mx-xl-1 {\n    margin-right: 0.25rem !important; }\n  .mb-xl-1,\n  .my-xl-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-xl-1,\n  .mx-xl-1 {\n    margin-left: 0.25rem !important; }\n  .m-xl-2 {\n    margin: 0.5rem !important; }\n  .mt-xl-2,\n  .my-xl-2 {\n    margin-top: 0.5rem !important; }\n  .mr-xl-2,\n  .mx-xl-2 {\n    margin-right: 0.5rem !important; }\n  .mb-xl-2,\n  .my-xl-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-xl-2,\n  .mx-xl-2 {\n    margin-left: 0.5rem !important; }\n  .m-xl-3 {\n    margin: 1rem !important; }\n  .mt-xl-3,\n  .my-xl-3 {\n    margin-top: 1rem !important; }\n  .mr-xl-3,\n  .mx-xl-3 {\n    margin-right: 1rem !important; }\n  .mb-xl-3,\n  .my-xl-3 {\n    margin-bottom: 1rem !important; }\n  .ml-xl-3,\n  .mx-xl-3 {\n    margin-left: 1rem !important; }\n  .m-xl-4 {\n    margin: 1.5rem !important; }\n  .mt-xl-4,\n  .my-xl-4 {\n    margin-top: 1.5rem !important; }\n  .mr-xl-4,\n  .mx-xl-4 {\n    margin-right: 1.5rem !important; }\n  .mb-xl-4,\n  .my-xl-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-xl-4,\n  .mx-xl-4 {\n    margin-left: 1.5rem !important; }\n  .m-xl-5 {\n    margin: 3rem !important; }\n  .mt-xl-5,\n  .my-xl-5 {\n    margin-top: 3rem !important; }\n  .mr-xl-5,\n  .mx-xl-5 {\n    margin-right: 3rem !important; }\n  .mb-xl-5,\n  .my-xl-5 {\n    margin-bottom: 3rem !important; }\n  .ml-xl-5,\n  .mx-xl-5 {\n    margin-left: 3rem !important; }\n  .p-xl-0 {\n    padding: 0 !important; }\n  .pt-xl-0,\n  .py-xl-0 {\n    padding-top: 0 !important; }\n  .pr-xl-0,\n  .px-xl-0 {\n    padding-right: 0 !important; }\n  .pb-xl-0,\n  .py-xl-0 {\n    padding-bottom: 0 !important; }\n  .pl-xl-0,\n  .px-xl-0 {\n    padding-left: 0 !important; }\n  .p-xl-1 {\n    padding: 0.25rem !important; }\n  .pt-xl-1,\n  .py-xl-1 {\n    padding-top: 0.25rem !important; }\n  .pr-xl-1,\n  .px-xl-1 {\n    padding-right: 0.25rem !important; }\n  .pb-xl-1,\n  .py-xl-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-xl-1,\n  .px-xl-1 {\n    padding-left: 0.25rem !important; }\n  .p-xl-2 {\n    padding: 0.5rem !important; }\n  .pt-xl-2,\n  .py-xl-2 {\n    padding-top: 0.5rem !important; }\n  .pr-xl-2,\n  .px-xl-2 {\n    padding-right: 0.5rem !important; }\n  .pb-xl-2,\n  .py-xl-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-xl-2,\n  .px-xl-2 {\n    padding-left: 0.5rem !important; }\n  .p-xl-3 {\n    padding: 1rem !important; }\n  .pt-xl-3,\n  .py-xl-3 {\n    padding-top: 1rem !important; }\n  .pr-xl-3,\n  .px-xl-3 {\n    padding-right: 1rem !important; }\n  .pb-xl-3,\n  .py-xl-3 {\n    padding-bottom: 1rem !important; }\n  .pl-xl-3,\n  .px-xl-3 {\n    padding-left: 1rem !important; }\n  .p-xl-4 {\n    padding: 1.5rem !important; }\n  .pt-xl-4,\n  .py-xl-4 {\n    padding-top: 1.5rem !important; }\n  .pr-xl-4,\n  .px-xl-4 {\n    padding-right: 1.5rem !important; }\n  .pb-xl-4,\n  .py-xl-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-xl-4,\n  .px-xl-4 {\n    padding-left: 1.5rem !important; }\n  .p-xl-5 {\n    padding: 3rem !important; }\n  .pt-xl-5,\n  .py-xl-5 {\n    padding-top: 3rem !important; }\n  .pr-xl-5,\n  .px-xl-5 {\n    padding-right: 3rem !important; }\n  .pb-xl-5,\n  .py-xl-5 {\n    padding-bottom: 3rem !important; }\n  .pl-xl-5,\n  .px-xl-5 {\n    padding-left: 3rem !important; }\n  .m-xl-auto {\n    margin: auto !important; }\n  .mt-xl-auto,\n  .my-xl-auto {\n    margin-top: auto !important; }\n  .mr-xl-auto,\n  .mx-xl-auto {\n    margin-right: auto !important; }\n  .mb-xl-auto,\n  .my-xl-auto {\n    margin-bottom: auto !important; }\n  .ml-xl-auto,\n  .mx-xl-auto {\n    margin-left: auto !important; } }\n\n.text-monospace {\n  font-family: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; }\n\n.text-justify {\n  text-align: justify !important; }\n\n.text-nowrap {\n  white-space: nowrap !important; }\n\n.text-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n.text-left {\n  text-align: left !important; }\n\n.text-right {\n  text-align: right !important; }\n\n.text-center {\n  text-align: center !important; }\n\n@media (min-width: 576px) {\n  .text-sm-left {\n    text-align: left !important; }\n  .text-sm-right {\n    text-align: right !important; }\n  .text-sm-center {\n    text-align: center !important; } }\n\n@media (min-width: 768px) {\n  .text-md-left {\n    text-align: left !important; }\n  .text-md-right {\n    text-align: right !important; }\n  .text-md-center {\n    text-align: center !important; } }\n\n@media (min-width: 992px) {\n  .text-lg-left {\n    text-align: left !important; }\n  .text-lg-right {\n    text-align: right !important; }\n  .text-lg-center {\n    text-align: center !important; } }\n\n@media (min-width: 1200px) {\n  .text-xl-left {\n    text-align: left !important; }\n  .text-xl-right {\n    text-align: right !important; }\n  .text-xl-center {\n    text-align: center !important; } }\n\n.text-lowercase {\n  text-transform: lowercase !important; }\n\n.text-uppercase {\n  text-transform: uppercase !important; }\n\n.text-capitalize {\n  text-transform: capitalize !important; }\n\n.font-weight-light {\n  font-weight: 300 !important; }\n\n.font-weight-normal {\n  font-weight: 400 !important; }\n\n.font-weight-bold {\n  font-weight: 700 !important; }\n\n.font-italic {\n  font-style: italic !important; }\n\n.text-white {\n  color: #fff !important; }\n\n.text-primary {\n  color: #007bff !important; }\n\na.text-primary:hover, a.text-primary:focus {\n  color: #0062cc !important; }\n\n.text-secondary {\n  color: #6c757d !important; }\n\na.text-secondary:hover, a.text-secondary:focus {\n  color: #545b62 !important; }\n\n.text-success {\n  color: #28a745 !important; }\n\na.text-success:hover, a.text-success:focus {\n  color: #1e7e34 !important; }\n\n.text-info {\n  color: #17a2b8 !important; }\n\na.text-info:hover, a.text-info:focus {\n  color: #117a8b !important; }\n\n.text-warning {\n  color: #ffc107 !important; }\n\na.text-warning:hover, a.text-warning:focus {\n  color: #d39e00 !important; }\n\n.text-danger {\n  color: #dc3545 !important; }\n\na.text-danger:hover, a.text-danger:focus {\n  color: #bd2130 !important; }\n\n.text-light {\n  color: #f8f9fa !important; }\n\na.text-light:hover, a.text-light:focus {\n  color: #dae0e5 !important; }\n\n.text-dark {\n  color: #343a40 !important; }\n\na.text-dark:hover, a.text-dark:focus {\n  color: #1d2124 !important; }\n\n.text-body {\n  color: #212529 !important; }\n\n.text-muted {\n  color: #6c757d !important; }\n\n.text-black-50 {\n  color: rgba(0, 0, 0, 0.5) !important; }\n\n.text-white-50 {\n  color: rgba(255, 255, 255, 0.5) !important; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0; }\n\n.visible {\n  visibility: visible !important; }\n\n.invisible {\n  visibility: hidden !important; }\n", ""]);

// exports


/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(181);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./fontawesome.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./fontawesome.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(119);
exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(" + escape(__webpack_require__(182)) + ");\n  src: url(" + escape(__webpack_require__(183)) + "?#iefix&v=4.7.0) format(\"embedded-opentype\"), url(" + escape(__webpack_require__(184)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(185)) + ") format(\"woff\"), url(" + escape(__webpack_require__(186)) + ") format(\"truetype\"), url(" + escape(__webpack_require__(187)) + "#fontawesomeregular) format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -15%; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-fw {\n  width: 1.28571em;\n  text-align: center; }\n\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14286em;\n  list-style-type: none; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  position: absolute;\n  left: -2.14286em;\n  width: 2.14286em;\n  top: 0.14286em;\n  text-align: center; }\n  .fa-li.fa-lg {\n    left: -1.85714em; }\n\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right {\n  margin-left: .3em; }\n\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right; }\n\n.pull-left {\n  float: left; }\n\n.fa.pull-left {\n  margin-right: .3em; }\n\n.fa.pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8); }\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  transform: scale(1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  -webkit-filter: none;\n          filter: none; }\n\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle; }\n\n.fa-stack-1x, .fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.fa-stack-1x {\n  line-height: inherit; }\n\n.fa-stack-2x {\n  font-size: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\"; }\n\n.fa-music:before {\n  content: \"\\F001\"; }\n\n.fa-search:before {\n  content: \"\\F002\"; }\n\n.fa-envelope-o:before {\n  content: \"\\F003\"; }\n\n.fa-heart:before {\n  content: \"\\F004\"; }\n\n.fa-star:before {\n  content: \"\\F005\"; }\n\n.fa-star-o:before {\n  content: \"\\F006\"; }\n\n.fa-user:before {\n  content: \"\\F007\"; }\n\n.fa-film:before {\n  content: \"\\F008\"; }\n\n.fa-th-large:before {\n  content: \"\\F009\"; }\n\n.fa-th:before {\n  content: \"\\F00A\"; }\n\n.fa-th-list:before {\n  content: \"\\F00B\"; }\n\n.fa-check:before {\n  content: \"\\F00C\"; }\n\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\"; }\n\n.fa-search-plus:before {\n  content: \"\\F00E\"; }\n\n.fa-search-minus:before {\n  content: \"\\F010\"; }\n\n.fa-power-off:before {\n  content: \"\\F011\"; }\n\n.fa-signal:before {\n  content: \"\\F012\"; }\n\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\"; }\n\n.fa-trash-o:before {\n  content: \"\\F014\"; }\n\n.fa-home:before {\n  content: \"\\F015\"; }\n\n.fa-file-o:before {\n  content: \"\\F016\"; }\n\n.fa-clock-o:before {\n  content: \"\\F017\"; }\n\n.fa-road:before {\n  content: \"\\F018\"; }\n\n.fa-download:before {\n  content: \"\\F019\"; }\n\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\"; }\n\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\"; }\n\n.fa-inbox:before {\n  content: \"\\F01C\"; }\n\n.fa-play-circle-o:before {\n  content: \"\\F01D\"; }\n\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\"; }\n\n.fa-refresh:before {\n  content: \"\\F021\"; }\n\n.fa-list-alt:before {\n  content: \"\\F022\"; }\n\n.fa-lock:before {\n  content: \"\\F023\"; }\n\n.fa-flag:before {\n  content: \"\\F024\"; }\n\n.fa-headphones:before {\n  content: \"\\F025\"; }\n\n.fa-volume-off:before {\n  content: \"\\F026\"; }\n\n.fa-volume-down:before {\n  content: \"\\F027\"; }\n\n.fa-volume-up:before {\n  content: \"\\F028\"; }\n\n.fa-qrcode:before {\n  content: \"\\F029\"; }\n\n.fa-barcode:before {\n  content: \"\\F02A\"; }\n\n.fa-tag:before {\n  content: \"\\F02B\"; }\n\n.fa-tags:before {\n  content: \"\\F02C\"; }\n\n.fa-book:before {\n  content: \"\\F02D\"; }\n\n.fa-bookmark:before {\n  content: \"\\F02E\"; }\n\n.fa-print:before {\n  content: \"\\F02F\"; }\n\n.fa-camera:before {\n  content: \"\\F030\"; }\n\n.fa-font:before {\n  content: \"\\F031\"; }\n\n.fa-bold:before {\n  content: \"\\F032\"; }\n\n.fa-italic:before {\n  content: \"\\F033\"; }\n\n.fa-text-height:before {\n  content: \"\\F034\"; }\n\n.fa-text-width:before {\n  content: \"\\F035\"; }\n\n.fa-align-left:before {\n  content: \"\\F036\"; }\n\n.fa-align-center:before {\n  content: \"\\F037\"; }\n\n.fa-align-right:before {\n  content: \"\\F038\"; }\n\n.fa-align-justify:before {\n  content: \"\\F039\"; }\n\n.fa-list:before {\n  content: \"\\F03A\"; }\n\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\"; }\n\n.fa-indent:before {\n  content: \"\\F03C\"; }\n\n.fa-video-camera:before {\n  content: \"\\F03D\"; }\n\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\"; }\n\n.fa-pencil:before {\n  content: \"\\F040\"; }\n\n.fa-map-marker:before {\n  content: \"\\F041\"; }\n\n.fa-adjust:before {\n  content: \"\\F042\"; }\n\n.fa-tint:before {\n  content: \"\\F043\"; }\n\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\"; }\n\n.fa-share-square-o:before {\n  content: \"\\F045\"; }\n\n.fa-check-square-o:before {\n  content: \"\\F046\"; }\n\n.fa-arrows:before {\n  content: \"\\F047\"; }\n\n.fa-step-backward:before {\n  content: \"\\F048\"; }\n\n.fa-fast-backward:before {\n  content: \"\\F049\"; }\n\n.fa-backward:before {\n  content: \"\\F04A\"; }\n\n.fa-play:before {\n  content: \"\\F04B\"; }\n\n.fa-pause:before {\n  content: \"\\F04C\"; }\n\n.fa-stop:before {\n  content: \"\\F04D\"; }\n\n.fa-forward:before {\n  content: \"\\F04E\"; }\n\n.fa-fast-forward:before {\n  content: \"\\F050\"; }\n\n.fa-step-forward:before {\n  content: \"\\F051\"; }\n\n.fa-eject:before {\n  content: \"\\F052\"; }\n\n.fa-chevron-left:before {\n  content: \"\\F053\"; }\n\n.fa-chevron-right:before {\n  content: \"\\F054\"; }\n\n.fa-plus-circle:before {\n  content: \"\\F055\"; }\n\n.fa-minus-circle:before {\n  content: \"\\F056\"; }\n\n.fa-times-circle:before {\n  content: \"\\F057\"; }\n\n.fa-check-circle:before {\n  content: \"\\F058\"; }\n\n.fa-question-circle:before {\n  content: \"\\F059\"; }\n\n.fa-info-circle:before {\n  content: \"\\F05A\"; }\n\n.fa-crosshairs:before {\n  content: \"\\F05B\"; }\n\n.fa-times-circle-o:before {\n  content: \"\\F05C\"; }\n\n.fa-check-circle-o:before {\n  content: \"\\F05D\"; }\n\n.fa-ban:before {\n  content: \"\\F05E\"; }\n\n.fa-arrow-left:before {\n  content: \"\\F060\"; }\n\n.fa-arrow-right:before {\n  content: \"\\F061\"; }\n\n.fa-arrow-up:before {\n  content: \"\\F062\"; }\n\n.fa-arrow-down:before {\n  content: \"\\F063\"; }\n\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\"; }\n\n.fa-expand:before {\n  content: \"\\F065\"; }\n\n.fa-compress:before {\n  content: \"\\F066\"; }\n\n.fa-plus:before {\n  content: \"\\F067\"; }\n\n.fa-minus:before {\n  content: \"\\F068\"; }\n\n.fa-asterisk:before {\n  content: \"\\F069\"; }\n\n.fa-exclamation-circle:before {\n  content: \"\\F06A\"; }\n\n.fa-gift:before {\n  content: \"\\F06B\"; }\n\n.fa-leaf:before {\n  content: \"\\F06C\"; }\n\n.fa-fire:before {\n  content: \"\\F06D\"; }\n\n.fa-eye:before {\n  content: \"\\F06E\"; }\n\n.fa-eye-slash:before {\n  content: \"\\F070\"; }\n\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\"; }\n\n.fa-plane:before {\n  content: \"\\F072\"; }\n\n.fa-calendar:before {\n  content: \"\\F073\"; }\n\n.fa-random:before {\n  content: \"\\F074\"; }\n\n.fa-comment:before {\n  content: \"\\F075\"; }\n\n.fa-magnet:before {\n  content: \"\\F076\"; }\n\n.fa-chevron-up:before {\n  content: \"\\F077\"; }\n\n.fa-chevron-down:before {\n  content: \"\\F078\"; }\n\n.fa-retweet:before {\n  content: \"\\F079\"; }\n\n.fa-shopping-cart:before {\n  content: \"\\F07A\"; }\n\n.fa-folder:before {\n  content: \"\\F07B\"; }\n\n.fa-folder-open:before {\n  content: \"\\F07C\"; }\n\n.fa-arrows-v:before {\n  content: \"\\F07D\"; }\n\n.fa-arrows-h:before {\n  content: \"\\F07E\"; }\n\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\"; }\n\n.fa-twitter-square:before {\n  content: \"\\F081\"; }\n\n.fa-facebook-square:before {\n  content: \"\\F082\"; }\n\n.fa-camera-retro:before {\n  content: \"\\F083\"; }\n\n.fa-key:before {\n  content: \"\\F084\"; }\n\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\"; }\n\n.fa-comments:before {\n  content: \"\\F086\"; }\n\n.fa-thumbs-o-up:before {\n  content: \"\\F087\"; }\n\n.fa-thumbs-o-down:before {\n  content: \"\\F088\"; }\n\n.fa-star-half:before {\n  content: \"\\F089\"; }\n\n.fa-heart-o:before {\n  content: \"\\F08A\"; }\n\n.fa-sign-out:before {\n  content: \"\\F08B\"; }\n\n.fa-linkedin-square:before {\n  content: \"\\F08C\"; }\n\n.fa-thumb-tack:before {\n  content: \"\\F08D\"; }\n\n.fa-external-link:before {\n  content: \"\\F08E\"; }\n\n.fa-sign-in:before {\n  content: \"\\F090\"; }\n\n.fa-trophy:before {\n  content: \"\\F091\"; }\n\n.fa-github-square:before {\n  content: \"\\F092\"; }\n\n.fa-upload:before {\n  content: \"\\F093\"; }\n\n.fa-lemon-o:before {\n  content: \"\\F094\"; }\n\n.fa-phone:before {\n  content: \"\\F095\"; }\n\n.fa-square-o:before {\n  content: \"\\F096\"; }\n\n.fa-bookmark-o:before {\n  content: \"\\F097\"; }\n\n.fa-phone-square:before {\n  content: \"\\F098\"; }\n\n.fa-twitter:before {\n  content: \"\\F099\"; }\n\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\"; }\n\n.fa-github:before {\n  content: \"\\F09B\"; }\n\n.fa-unlock:before {\n  content: \"\\F09C\"; }\n\n.fa-credit-card:before {\n  content: \"\\F09D\"; }\n\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\F09E\"; }\n\n.fa-hdd-o:before {\n  content: \"\\F0A0\"; }\n\n.fa-bullhorn:before {\n  content: \"\\F0A1\"; }\n\n.fa-bell:before {\n  content: \"\\F0F3\"; }\n\n.fa-certificate:before {\n  content: \"\\F0A3\"; }\n\n.fa-hand-o-right:before {\n  content: \"\\F0A4\"; }\n\n.fa-hand-o-left:before {\n  content: \"\\F0A5\"; }\n\n.fa-hand-o-up:before {\n  content: \"\\F0A6\"; }\n\n.fa-hand-o-down:before {\n  content: \"\\F0A7\"; }\n\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\"; }\n\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\"; }\n\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\"; }\n\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\"; }\n\n.fa-globe:before {\n  content: \"\\F0AC\"; }\n\n.fa-wrench:before {\n  content: \"\\F0AD\"; }\n\n.fa-tasks:before {\n  content: \"\\F0AE\"; }\n\n.fa-filter:before {\n  content: \"\\F0B0\"; }\n\n.fa-briefcase:before {\n  content: \"\\F0B1\"; }\n\n.fa-arrows-alt:before {\n  content: \"\\F0B2\"; }\n\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\"; }\n\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\"; }\n\n.fa-cloud:before {\n  content: \"\\F0C2\"; }\n\n.fa-flask:before {\n  content: \"\\F0C3\"; }\n\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\"; }\n\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\"; }\n\n.fa-paperclip:before {\n  content: \"\\F0C6\"; }\n\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\"; }\n\n.fa-square:before {\n  content: \"\\F0C8\"; }\n\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\"; }\n\n.fa-list-ul:before {\n  content: \"\\F0CA\"; }\n\n.fa-list-ol:before {\n  content: \"\\F0CB\"; }\n\n.fa-strikethrough:before {\n  content: \"\\F0CC\"; }\n\n.fa-underline:before {\n  content: \"\\F0CD\"; }\n\n.fa-table:before {\n  content: \"\\F0CE\"; }\n\n.fa-magic:before {\n  content: \"\\F0D0\"; }\n\n.fa-truck:before {\n  content: \"\\F0D1\"; }\n\n.fa-pinterest:before {\n  content: \"\\F0D2\"; }\n\n.fa-pinterest-square:before {\n  content: \"\\F0D3\"; }\n\n.fa-google-plus-square:before {\n  content: \"\\F0D4\"; }\n\n.fa-google-plus:before {\n  content: \"\\F0D5\"; }\n\n.fa-money:before {\n  content: \"\\F0D6\"; }\n\n.fa-caret-down:before {\n  content: \"\\F0D7\"; }\n\n.fa-caret-up:before {\n  content: \"\\F0D8\"; }\n\n.fa-caret-left:before {\n  content: \"\\F0D9\"; }\n\n.fa-caret-right:before {\n  content: \"\\F0DA\"; }\n\n.fa-columns:before {\n  content: \"\\F0DB\"; }\n\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\"; }\n\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\"; }\n\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\"; }\n\n.fa-envelope:before {\n  content: \"\\F0E0\"; }\n\n.fa-linkedin:before {\n  content: \"\\F0E1\"; }\n\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\"; }\n\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\"; }\n\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\"; }\n\n.fa-comment-o:before {\n  content: \"\\F0E5\"; }\n\n.fa-comments-o:before {\n  content: \"\\F0E6\"; }\n\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\"; }\n\n.fa-sitemap:before {\n  content: \"\\F0E8\"; }\n\n.fa-umbrella:before {\n  content: \"\\F0E9\"; }\n\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\"; }\n\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\"; }\n\n.fa-exchange:before {\n  content: \"\\F0EC\"; }\n\n.fa-cloud-download:before {\n  content: \"\\F0ED\"; }\n\n.fa-cloud-upload:before {\n  content: \"\\F0EE\"; }\n\n.fa-user-md:before {\n  content: \"\\F0F0\"; }\n\n.fa-stethoscope:before {\n  content: \"\\F0F1\"; }\n\n.fa-suitcase:before {\n  content: \"\\F0F2\"; }\n\n.fa-bell-o:before {\n  content: \"\\F0A2\"; }\n\n.fa-coffee:before {\n  content: \"\\F0F4\"; }\n\n.fa-cutlery:before {\n  content: \"\\F0F5\"; }\n\n.fa-file-text-o:before {\n  content: \"\\F0F6\"; }\n\n.fa-building-o:before {\n  content: \"\\F0F7\"; }\n\n.fa-hospital-o:before {\n  content: \"\\F0F8\"; }\n\n.fa-ambulance:before {\n  content: \"\\F0F9\"; }\n\n.fa-medkit:before {\n  content: \"\\F0FA\"; }\n\n.fa-fighter-jet:before {\n  content: \"\\F0FB\"; }\n\n.fa-beer:before {\n  content: \"\\F0FC\"; }\n\n.fa-h-square:before {\n  content: \"\\F0FD\"; }\n\n.fa-plus-square:before {\n  content: \"\\F0FE\"; }\n\n.fa-angle-double-left:before {\n  content: \"\\F100\"; }\n\n.fa-angle-double-right:before {\n  content: \"\\F101\"; }\n\n.fa-angle-double-up:before {\n  content: \"\\F102\"; }\n\n.fa-angle-double-down:before {\n  content: \"\\F103\"; }\n\n.fa-angle-left:before {\n  content: \"\\F104\"; }\n\n.fa-angle-right:before {\n  content: \"\\F105\"; }\n\n.fa-angle-up:before {\n  content: \"\\F106\"; }\n\n.fa-angle-down:before {\n  content: \"\\F107\"; }\n\n.fa-desktop:before {\n  content: \"\\F108\"; }\n\n.fa-laptop:before {\n  content: \"\\F109\"; }\n\n.fa-tablet:before {\n  content: \"\\F10A\"; }\n\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\"; }\n\n.fa-circle-o:before {\n  content: \"\\F10C\"; }\n\n.fa-quote-left:before {\n  content: \"\\F10D\"; }\n\n.fa-quote-right:before {\n  content: \"\\F10E\"; }\n\n.fa-spinner:before {\n  content: \"\\F110\"; }\n\n.fa-circle:before {\n  content: \"\\F111\"; }\n\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\"; }\n\n.fa-github-alt:before {\n  content: \"\\F113\"; }\n\n.fa-folder-o:before {\n  content: \"\\F114\"; }\n\n.fa-folder-open-o:before {\n  content: \"\\F115\"; }\n\n.fa-smile-o:before {\n  content: \"\\F118\"; }\n\n.fa-frown-o:before {\n  content: \"\\F119\"; }\n\n.fa-meh-o:before {\n  content: \"\\F11A\"; }\n\n.fa-gamepad:before {\n  content: \"\\F11B\"; }\n\n.fa-keyboard-o:before {\n  content: \"\\F11C\"; }\n\n.fa-flag-o:before {\n  content: \"\\F11D\"; }\n\n.fa-flag-checkered:before {\n  content: \"\\F11E\"; }\n\n.fa-terminal:before {\n  content: \"\\F120\"; }\n\n.fa-code:before {\n  content: \"\\F121\"; }\n\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\"; }\n\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\"; }\n\n.fa-location-arrow:before {\n  content: \"\\F124\"; }\n\n.fa-crop:before {\n  content: \"\\F125\"; }\n\n.fa-code-fork:before {\n  content: \"\\F126\"; }\n\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\"; }\n\n.fa-question:before {\n  content: \"\\F128\"; }\n\n.fa-info:before {\n  content: \"\\F129\"; }\n\n.fa-exclamation:before {\n  content: \"\\F12A\"; }\n\n.fa-superscript:before {\n  content: \"\\F12B\"; }\n\n.fa-subscript:before {\n  content: \"\\F12C\"; }\n\n.fa-eraser:before {\n  content: \"\\F12D\"; }\n\n.fa-puzzle-piece:before {\n  content: \"\\F12E\"; }\n\n.fa-microphone:before {\n  content: \"\\F130\"; }\n\n.fa-microphone-slash:before {\n  content: \"\\F131\"; }\n\n.fa-shield:before {\n  content: \"\\F132\"; }\n\n.fa-calendar-o:before {\n  content: \"\\F133\"; }\n\n.fa-fire-extinguisher:before {\n  content: \"\\F134\"; }\n\n.fa-rocket:before {\n  content: \"\\F135\"; }\n\n.fa-maxcdn:before {\n  content: \"\\F136\"; }\n\n.fa-chevron-circle-left:before {\n  content: \"\\F137\"; }\n\n.fa-chevron-circle-right:before {\n  content: \"\\F138\"; }\n\n.fa-chevron-circle-up:before {\n  content: \"\\F139\"; }\n\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\"; }\n\n.fa-html5:before {\n  content: \"\\F13B\"; }\n\n.fa-css3:before {\n  content: \"\\F13C\"; }\n\n.fa-anchor:before {\n  content: \"\\F13D\"; }\n\n.fa-unlock-alt:before {\n  content: \"\\F13E\"; }\n\n.fa-bullseye:before {\n  content: \"\\F140\"; }\n\n.fa-ellipsis-h:before {\n  content: \"\\F141\"; }\n\n.fa-ellipsis-v:before {\n  content: \"\\F142\"; }\n\n.fa-rss-square:before {\n  content: \"\\F143\"; }\n\n.fa-play-circle:before {\n  content: \"\\F144\"; }\n\n.fa-ticket:before {\n  content: \"\\F145\"; }\n\n.fa-minus-square:before {\n  content: \"\\F146\"; }\n\n.fa-minus-square-o:before {\n  content: \"\\F147\"; }\n\n.fa-level-up:before {\n  content: \"\\F148\"; }\n\n.fa-level-down:before {\n  content: \"\\F149\"; }\n\n.fa-check-square:before {\n  content: \"\\F14A\"; }\n\n.fa-pencil-square:before {\n  content: \"\\F14B\"; }\n\n.fa-external-link-square:before {\n  content: \"\\F14C\"; }\n\n.fa-share-square:before {\n  content: \"\\F14D\"; }\n\n.fa-compass:before {\n  content: \"\\F14E\"; }\n\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\"; }\n\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\"; }\n\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\"; }\n\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\"; }\n\n.fa-gbp:before {\n  content: \"\\F154\"; }\n\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\"; }\n\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\"; }\n\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\"; }\n\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\"; }\n\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\"; }\n\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\"; }\n\n.fa-file:before {\n  content: \"\\F15B\"; }\n\n.fa-file-text:before {\n  content: \"\\F15C\"; }\n\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\"; }\n\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\"; }\n\n.fa-sort-amount-asc:before {\n  content: \"\\F160\"; }\n\n.fa-sort-amount-desc:before {\n  content: \"\\F161\"; }\n\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\"; }\n\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\"; }\n\n.fa-thumbs-up:before {\n  content: \"\\F164\"; }\n\n.fa-thumbs-down:before {\n  content: \"\\F165\"; }\n\n.fa-youtube-square:before {\n  content: \"\\F166\"; }\n\n.fa-youtube:before {\n  content: \"\\F167\"; }\n\n.fa-xing:before {\n  content: \"\\F168\"; }\n\n.fa-xing-square:before {\n  content: \"\\F169\"; }\n\n.fa-youtube-play:before {\n  content: \"\\F16A\"; }\n\n.fa-dropbox:before {\n  content: \"\\F16B\"; }\n\n.fa-stack-overflow:before {\n  content: \"\\F16C\"; }\n\n.fa-instagram:before {\n  content: \"\\F16D\"; }\n\n.fa-flickr:before {\n  content: \"\\F16E\"; }\n\n.fa-adn:before {\n  content: \"\\F170\"; }\n\n.fa-bitbucket:before {\n  content: \"\\F171\"; }\n\n.fa-bitbucket-square:before {\n  content: \"\\F172\"; }\n\n.fa-tumblr:before {\n  content: \"\\F173\"; }\n\n.fa-tumblr-square:before {\n  content: \"\\F174\"; }\n\n.fa-long-arrow-down:before {\n  content: \"\\F175\"; }\n\n.fa-long-arrow-up:before {\n  content: \"\\F176\"; }\n\n.fa-long-arrow-left:before {\n  content: \"\\F177\"; }\n\n.fa-long-arrow-right:before {\n  content: \"\\F178\"; }\n\n.fa-apple:before {\n  content: \"\\F179\"; }\n\n.fa-windows:before {\n  content: \"\\F17A\"; }\n\n.fa-android:before {\n  content: \"\\F17B\"; }\n\n.fa-linux:before {\n  content: \"\\F17C\"; }\n\n.fa-dribbble:before {\n  content: \"\\F17D\"; }\n\n.fa-skype:before {\n  content: \"\\F17E\"; }\n\n.fa-foursquare:before {\n  content: \"\\F180\"; }\n\n.fa-trello:before {\n  content: \"\\F181\"; }\n\n.fa-female:before {\n  content: \"\\F182\"; }\n\n.fa-male:before {\n  content: \"\\F183\"; }\n\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\"; }\n\n.fa-sun-o:before {\n  content: \"\\F185\"; }\n\n.fa-moon-o:before {\n  content: \"\\F186\"; }\n\n.fa-archive:before {\n  content: \"\\F187\"; }\n\n.fa-bug:before {\n  content: \"\\F188\"; }\n\n.fa-vk:before {\n  content: \"\\F189\"; }\n\n.fa-weibo:before {\n  content: \"\\F18A\"; }\n\n.fa-renren:before {\n  content: \"\\F18B\"; }\n\n.fa-pagelines:before {\n  content: \"\\F18C\"; }\n\n.fa-stack-exchange:before {\n  content: \"\\F18D\"; }\n\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\"; }\n\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\"; }\n\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\"; }\n\n.fa-dot-circle-o:before {\n  content: \"\\F192\"; }\n\n.fa-wheelchair:before {\n  content: \"\\F193\"; }\n\n.fa-vimeo-square:before {\n  content: \"\\F194\"; }\n\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\"; }\n\n.fa-plus-square-o:before {\n  content: \"\\F196\"; }\n\n.fa-space-shuttle:before {\n  content: \"\\F197\"; }\n\n.fa-slack:before {\n  content: \"\\F198\"; }\n\n.fa-envelope-square:before {\n  content: \"\\F199\"; }\n\n.fa-wordpress:before {\n  content: \"\\F19A\"; }\n\n.fa-openid:before {\n  content: \"\\F19B\"; }\n\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\"; }\n\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\"; }\n\n.fa-yahoo:before {\n  content: \"\\F19E\"; }\n\n.fa-google:before {\n  content: \"\\F1A0\"; }\n\n.fa-reddit:before {\n  content: \"\\F1A1\"; }\n\n.fa-reddit-square:before {\n  content: \"\\F1A2\"; }\n\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\"; }\n\n.fa-stumbleupon:before {\n  content: \"\\F1A4\"; }\n\n.fa-delicious:before {\n  content: \"\\F1A5\"; }\n\n.fa-digg:before {\n  content: \"\\F1A6\"; }\n\n.fa-pied-piper-pp:before {\n  content: \"\\F1A7\"; }\n\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\"; }\n\n.fa-drupal:before {\n  content: \"\\F1A9\"; }\n\n.fa-joomla:before {\n  content: \"\\F1AA\"; }\n\n.fa-language:before {\n  content: \"\\F1AB\"; }\n\n.fa-fax:before {\n  content: \"\\F1AC\"; }\n\n.fa-building:before {\n  content: \"\\F1AD\"; }\n\n.fa-child:before {\n  content: \"\\F1AE\"; }\n\n.fa-paw:before {\n  content: \"\\F1B0\"; }\n\n.fa-spoon:before {\n  content: \"\\F1B1\"; }\n\n.fa-cube:before {\n  content: \"\\F1B2\"; }\n\n.fa-cubes:before {\n  content: \"\\F1B3\"; }\n\n.fa-behance:before {\n  content: \"\\F1B4\"; }\n\n.fa-behance-square:before {\n  content: \"\\F1B5\"; }\n\n.fa-steam:before {\n  content: \"\\F1B6\"; }\n\n.fa-steam-square:before {\n  content: \"\\F1B7\"; }\n\n.fa-recycle:before {\n  content: \"\\F1B8\"; }\n\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\"; }\n\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\"; }\n\n.fa-tree:before {\n  content: \"\\F1BB\"; }\n\n.fa-spotify:before {\n  content: \"\\F1BC\"; }\n\n.fa-deviantart:before {\n  content: \"\\F1BD\"; }\n\n.fa-soundcloud:before {\n  content: \"\\F1BE\"; }\n\n.fa-database:before {\n  content: \"\\F1C0\"; }\n\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\"; }\n\n.fa-file-word-o:before {\n  content: \"\\F1C2\"; }\n\n.fa-file-excel-o:before {\n  content: \"\\F1C3\"; }\n\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\"; }\n\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\"; }\n\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\"; }\n\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\"; }\n\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\"; }\n\n.fa-file-code-o:before {\n  content: \"\\F1C9\"; }\n\n.fa-vine:before {\n  content: \"\\F1CA\"; }\n\n.fa-codepen:before {\n  content: \"\\F1CB\"; }\n\n.fa-jsfiddle:before {\n  content: \"\\F1CC\"; }\n\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\"; }\n\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\"; }\n\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\\F1D0\"; }\n\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\"; }\n\n.fa-git-square:before {\n  content: \"\\F1D2\"; }\n\n.fa-git:before {\n  content: \"\\F1D3\"; }\n\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\F1D4\"; }\n\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\"; }\n\n.fa-qq:before {\n  content: \"\\F1D6\"; }\n\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\"; }\n\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\"; }\n\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\"; }\n\n.fa-history:before {\n  content: \"\\F1DA\"; }\n\n.fa-circle-thin:before {\n  content: \"\\F1DB\"; }\n\n.fa-header:before {\n  content: \"\\F1DC\"; }\n\n.fa-paragraph:before {\n  content: \"\\F1DD\"; }\n\n.fa-sliders:before {\n  content: \"\\F1DE\"; }\n\n.fa-share-alt:before {\n  content: \"\\F1E0\"; }\n\n.fa-share-alt-square:before {\n  content: \"\\F1E1\"; }\n\n.fa-bomb:before {\n  content: \"\\F1E2\"; }\n\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\"; }\n\n.fa-tty:before {\n  content: \"\\F1E4\"; }\n\n.fa-binoculars:before {\n  content: \"\\F1E5\"; }\n\n.fa-plug:before {\n  content: \"\\F1E6\"; }\n\n.fa-slideshare:before {\n  content: \"\\F1E7\"; }\n\n.fa-twitch:before {\n  content: \"\\F1E8\"; }\n\n.fa-yelp:before {\n  content: \"\\F1E9\"; }\n\n.fa-newspaper-o:before {\n  content: \"\\F1EA\"; }\n\n.fa-wifi:before {\n  content: \"\\F1EB\"; }\n\n.fa-calculator:before {\n  content: \"\\F1EC\"; }\n\n.fa-paypal:before {\n  content: \"\\F1ED\"; }\n\n.fa-google-wallet:before {\n  content: \"\\F1EE\"; }\n\n.fa-cc-visa:before {\n  content: \"\\F1F0\"; }\n\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\"; }\n\n.fa-cc-discover:before {\n  content: \"\\F1F2\"; }\n\n.fa-cc-amex:before {\n  content: \"\\F1F3\"; }\n\n.fa-cc-paypal:before {\n  content: \"\\F1F4\"; }\n\n.fa-cc-stripe:before {\n  content: \"\\F1F5\"; }\n\n.fa-bell-slash:before {\n  content: \"\\F1F6\"; }\n\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\"; }\n\n.fa-trash:before {\n  content: \"\\F1F8\"; }\n\n.fa-copyright:before {\n  content: \"\\F1F9\"; }\n\n.fa-at:before {\n  content: \"\\F1FA\"; }\n\n.fa-eyedropper:before {\n  content: \"\\F1FB\"; }\n\n.fa-paint-brush:before {\n  content: \"\\F1FC\"; }\n\n.fa-birthday-cake:before {\n  content: \"\\F1FD\"; }\n\n.fa-area-chart:before {\n  content: \"\\F1FE\"; }\n\n.fa-pie-chart:before {\n  content: \"\\F200\"; }\n\n.fa-line-chart:before {\n  content: \"\\F201\"; }\n\n.fa-lastfm:before {\n  content: \"\\F202\"; }\n\n.fa-lastfm-square:before {\n  content: \"\\F203\"; }\n\n.fa-toggle-off:before {\n  content: \"\\F204\"; }\n\n.fa-toggle-on:before {\n  content: \"\\F205\"; }\n\n.fa-bicycle:before {\n  content: \"\\F206\"; }\n\n.fa-bus:before {\n  content: \"\\F207\"; }\n\n.fa-ioxhost:before {\n  content: \"\\F208\"; }\n\n.fa-angellist:before {\n  content: \"\\F209\"; }\n\n.fa-cc:before {\n  content: \"\\F20A\"; }\n\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\"; }\n\n.fa-meanpath:before {\n  content: \"\\F20C\"; }\n\n.fa-buysellads:before {\n  content: \"\\F20D\"; }\n\n.fa-connectdevelop:before {\n  content: \"\\F20E\"; }\n\n.fa-dashcube:before {\n  content: \"\\F210\"; }\n\n.fa-forumbee:before {\n  content: \"\\F211\"; }\n\n.fa-leanpub:before {\n  content: \"\\F212\"; }\n\n.fa-sellsy:before {\n  content: \"\\F213\"; }\n\n.fa-shirtsinbulk:before {\n  content: \"\\F214\"; }\n\n.fa-simplybuilt:before {\n  content: \"\\F215\"; }\n\n.fa-skyatlas:before {\n  content: \"\\F216\"; }\n\n.fa-cart-plus:before {\n  content: \"\\F217\"; }\n\n.fa-cart-arrow-down:before {\n  content: \"\\F218\"; }\n\n.fa-diamond:before {\n  content: \"\\F219\"; }\n\n.fa-ship:before {\n  content: \"\\F21A\"; }\n\n.fa-user-secret:before {\n  content: \"\\F21B\"; }\n\n.fa-motorcycle:before {\n  content: \"\\F21C\"; }\n\n.fa-street-view:before {\n  content: \"\\F21D\"; }\n\n.fa-heartbeat:before {\n  content: \"\\F21E\"; }\n\n.fa-venus:before {\n  content: \"\\F221\"; }\n\n.fa-mars:before {\n  content: \"\\F222\"; }\n\n.fa-mercury:before {\n  content: \"\\F223\"; }\n\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\F224\"; }\n\n.fa-transgender-alt:before {\n  content: \"\\F225\"; }\n\n.fa-venus-double:before {\n  content: \"\\F226\"; }\n\n.fa-mars-double:before {\n  content: \"\\F227\"; }\n\n.fa-venus-mars:before {\n  content: \"\\F228\"; }\n\n.fa-mars-stroke:before {\n  content: \"\\F229\"; }\n\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\"; }\n\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\"; }\n\n.fa-neuter:before {\n  content: \"\\F22C\"; }\n\n.fa-genderless:before {\n  content: \"\\F22D\"; }\n\n.fa-facebook-official:before {\n  content: \"\\F230\"; }\n\n.fa-pinterest-p:before {\n  content: \"\\F231\"; }\n\n.fa-whatsapp:before {\n  content: \"\\F232\"; }\n\n.fa-server:before {\n  content: \"\\F233\"; }\n\n.fa-user-plus:before {\n  content: \"\\F234\"; }\n\n.fa-user-times:before {\n  content: \"\\F235\"; }\n\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\"; }\n\n.fa-viacoin:before {\n  content: \"\\F237\"; }\n\n.fa-train:before {\n  content: \"\\F238\"; }\n\n.fa-subway:before {\n  content: \"\\F239\"; }\n\n.fa-medium:before {\n  content: \"\\F23A\"; }\n\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\F23B\"; }\n\n.fa-optin-monster:before {\n  content: \"\\F23C\"; }\n\n.fa-opencart:before {\n  content: \"\\F23D\"; }\n\n.fa-expeditedssl:before {\n  content: \"\\F23E\"; }\n\n.fa-battery-4:before,\n.fa-battery:before,\n.fa-battery-full:before {\n  content: \"\\F240\"; }\n\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\F241\"; }\n\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\F242\"; }\n\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\F243\"; }\n\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\F244\"; }\n\n.fa-mouse-pointer:before {\n  content: \"\\F245\"; }\n\n.fa-i-cursor:before {\n  content: \"\\F246\"; }\n\n.fa-object-group:before {\n  content: \"\\F247\"; }\n\n.fa-object-ungroup:before {\n  content: \"\\F248\"; }\n\n.fa-sticky-note:before {\n  content: \"\\F249\"; }\n\n.fa-sticky-note-o:before {\n  content: \"\\F24A\"; }\n\n.fa-cc-jcb:before {\n  content: \"\\F24B\"; }\n\n.fa-cc-diners-club:before {\n  content: \"\\F24C\"; }\n\n.fa-clone:before {\n  content: \"\\F24D\"; }\n\n.fa-balance-scale:before {\n  content: \"\\F24E\"; }\n\n.fa-hourglass-o:before {\n  content: \"\\F250\"; }\n\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\F251\"; }\n\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\F252\"; }\n\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\F253\"; }\n\n.fa-hourglass:before {\n  content: \"\\F254\"; }\n\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\F255\"; }\n\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\F256\"; }\n\n.fa-hand-scissors-o:before {\n  content: \"\\F257\"; }\n\n.fa-hand-lizard-o:before {\n  content: \"\\F258\"; }\n\n.fa-hand-spock-o:before {\n  content: \"\\F259\"; }\n\n.fa-hand-pointer-o:before {\n  content: \"\\F25A\"; }\n\n.fa-hand-peace-o:before {\n  content: \"\\F25B\"; }\n\n.fa-trademark:before {\n  content: \"\\F25C\"; }\n\n.fa-registered:before {\n  content: \"\\F25D\"; }\n\n.fa-creative-commons:before {\n  content: \"\\F25E\"; }\n\n.fa-gg:before {\n  content: \"\\F260\"; }\n\n.fa-gg-circle:before {\n  content: \"\\F261\"; }\n\n.fa-tripadvisor:before {\n  content: \"\\F262\"; }\n\n.fa-odnoklassniki:before {\n  content: \"\\F263\"; }\n\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\"; }\n\n.fa-get-pocket:before {\n  content: \"\\F265\"; }\n\n.fa-wikipedia-w:before {\n  content: \"\\F266\"; }\n\n.fa-safari:before {\n  content: \"\\F267\"; }\n\n.fa-chrome:before {\n  content: \"\\F268\"; }\n\n.fa-firefox:before {\n  content: \"\\F269\"; }\n\n.fa-opera:before {\n  content: \"\\F26A\"; }\n\n.fa-internet-explorer:before {\n  content: \"\\F26B\"; }\n\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\F26C\"; }\n\n.fa-contao:before {\n  content: \"\\F26D\"; }\n\n.fa-500px:before {\n  content: \"\\F26E\"; }\n\n.fa-amazon:before {\n  content: \"\\F270\"; }\n\n.fa-calendar-plus-o:before {\n  content: \"\\F271\"; }\n\n.fa-calendar-minus-o:before {\n  content: \"\\F272\"; }\n\n.fa-calendar-times-o:before {\n  content: \"\\F273\"; }\n\n.fa-calendar-check-o:before {\n  content: \"\\F274\"; }\n\n.fa-industry:before {\n  content: \"\\F275\"; }\n\n.fa-map-pin:before {\n  content: \"\\F276\"; }\n\n.fa-map-signs:before {\n  content: \"\\F277\"; }\n\n.fa-map-o:before {\n  content: \"\\F278\"; }\n\n.fa-map:before {\n  content: \"\\F279\"; }\n\n.fa-commenting:before {\n  content: \"\\F27A\"; }\n\n.fa-commenting-o:before {\n  content: \"\\F27B\"; }\n\n.fa-houzz:before {\n  content: \"\\F27C\"; }\n\n.fa-vimeo:before {\n  content: \"\\F27D\"; }\n\n.fa-black-tie:before {\n  content: \"\\F27E\"; }\n\n.fa-fonticons:before {\n  content: \"\\F280\"; }\n\n.fa-reddit-alien:before {\n  content: \"\\F281\"; }\n\n.fa-edge:before {\n  content: \"\\F282\"; }\n\n.fa-credit-card-alt:before {\n  content: \"\\F283\"; }\n\n.fa-codiepie:before {\n  content: \"\\F284\"; }\n\n.fa-modx:before {\n  content: \"\\F285\"; }\n\n.fa-fort-awesome:before {\n  content: \"\\F286\"; }\n\n.fa-usb:before {\n  content: \"\\F287\"; }\n\n.fa-product-hunt:before {\n  content: \"\\F288\"; }\n\n.fa-mixcloud:before {\n  content: \"\\F289\"; }\n\n.fa-scribd:before {\n  content: \"\\F28A\"; }\n\n.fa-pause-circle:before {\n  content: \"\\F28B\"; }\n\n.fa-pause-circle-o:before {\n  content: \"\\F28C\"; }\n\n.fa-stop-circle:before {\n  content: \"\\F28D\"; }\n\n.fa-stop-circle-o:before {\n  content: \"\\F28E\"; }\n\n.fa-shopping-bag:before {\n  content: \"\\F290\"; }\n\n.fa-shopping-basket:before {\n  content: \"\\F291\"; }\n\n.fa-hashtag:before {\n  content: \"\\F292\"; }\n\n.fa-bluetooth:before {\n  content: \"\\F293\"; }\n\n.fa-bluetooth-b:before {\n  content: \"\\F294\"; }\n\n.fa-percent:before {\n  content: \"\\F295\"; }\n\n.fa-gitlab:before {\n  content: \"\\F296\"; }\n\n.fa-wpbeginner:before {\n  content: \"\\F297\"; }\n\n.fa-wpforms:before {\n  content: \"\\F298\"; }\n\n.fa-envira:before {\n  content: \"\\F299\"; }\n\n.fa-universal-access:before {\n  content: \"\\F29A\"; }\n\n.fa-wheelchair-alt:before {\n  content: \"\\F29B\"; }\n\n.fa-question-circle-o:before {\n  content: \"\\F29C\"; }\n\n.fa-blind:before {\n  content: \"\\F29D\"; }\n\n.fa-audio-description:before {\n  content: \"\\F29E\"; }\n\n.fa-volume-control-phone:before {\n  content: \"\\F2A0\"; }\n\n.fa-braille:before {\n  content: \"\\F2A1\"; }\n\n.fa-assistive-listening-systems:before {\n  content: \"\\F2A2\"; }\n\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\\F2A3\"; }\n\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\\F2A4\"; }\n\n.fa-glide:before {\n  content: \"\\F2A5\"; }\n\n.fa-glide-g:before {\n  content: \"\\F2A6\"; }\n\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\\F2A7\"; }\n\n.fa-low-vision:before {\n  content: \"\\F2A8\"; }\n\n.fa-viadeo:before {\n  content: \"\\F2A9\"; }\n\n.fa-viadeo-square:before {\n  content: \"\\F2AA\"; }\n\n.fa-snapchat:before {\n  content: \"\\F2AB\"; }\n\n.fa-snapchat-ghost:before {\n  content: \"\\F2AC\"; }\n\n.fa-snapchat-square:before {\n  content: \"\\F2AD\"; }\n\n.fa-pied-piper:before {\n  content: \"\\F2AE\"; }\n\n.fa-first-order:before {\n  content: \"\\F2B0\"; }\n\n.fa-yoast:before {\n  content: \"\\F2B1\"; }\n\n.fa-themeisle:before {\n  content: \"\\F2B2\"; }\n\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\\F2B3\"; }\n\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\\F2B4\"; }\n\n.fa-handshake-o:before {\n  content: \"\\F2B5\"; }\n\n.fa-envelope-open:before {\n  content: \"\\F2B6\"; }\n\n.fa-envelope-open-o:before {\n  content: \"\\F2B7\"; }\n\n.fa-linode:before {\n  content: \"\\F2B8\"; }\n\n.fa-address-book:before {\n  content: \"\\F2B9\"; }\n\n.fa-address-book-o:before {\n  content: \"\\F2BA\"; }\n\n.fa-vcard:before,\n.fa-address-card:before {\n  content: \"\\F2BB\"; }\n\n.fa-vcard-o:before,\n.fa-address-card-o:before {\n  content: \"\\F2BC\"; }\n\n.fa-user-circle:before {\n  content: \"\\F2BD\"; }\n\n.fa-user-circle-o:before {\n  content: \"\\F2BE\"; }\n\n.fa-user-o:before {\n  content: \"\\F2C0\"; }\n\n.fa-id-badge:before {\n  content: \"\\F2C1\"; }\n\n.fa-drivers-license:before,\n.fa-id-card:before {\n  content: \"\\F2C2\"; }\n\n.fa-drivers-license-o:before,\n.fa-id-card-o:before {\n  content: \"\\F2C3\"; }\n\n.fa-quora:before {\n  content: \"\\F2C4\"; }\n\n.fa-free-code-camp:before {\n  content: \"\\F2C5\"; }\n\n.fa-telegram:before {\n  content: \"\\F2C6\"; }\n\n.fa-thermometer-4:before,\n.fa-thermometer:before,\n.fa-thermometer-full:before {\n  content: \"\\F2C7\"; }\n\n.fa-thermometer-3:before,\n.fa-thermometer-three-quarters:before {\n  content: \"\\F2C8\"; }\n\n.fa-thermometer-2:before,\n.fa-thermometer-half:before {\n  content: \"\\F2C9\"; }\n\n.fa-thermometer-1:before,\n.fa-thermometer-quarter:before {\n  content: \"\\F2CA\"; }\n\n.fa-thermometer-0:before,\n.fa-thermometer-empty:before {\n  content: \"\\F2CB\"; }\n\n.fa-shower:before {\n  content: \"\\F2CC\"; }\n\n.fa-bathtub:before,\n.fa-s15:before,\n.fa-bath:before {\n  content: \"\\F2CD\"; }\n\n.fa-podcast:before {\n  content: \"\\F2CE\"; }\n\n.fa-window-maximize:before {\n  content: \"\\F2D0\"; }\n\n.fa-window-minimize:before {\n  content: \"\\F2D1\"; }\n\n.fa-window-restore:before {\n  content: \"\\F2D2\"; }\n\n.fa-times-rectangle:before,\n.fa-window-close:before {\n  content: \"\\F2D3\"; }\n\n.fa-times-rectangle-o:before,\n.fa-window-close-o:before {\n  content: \"\\F2D4\"; }\n\n.fa-bandcamp:before {\n  content: \"\\F2D5\"; }\n\n.fa-grav:before {\n  content: \"\\F2D6\"; }\n\n.fa-etsy:before {\n  content: \"\\F2D7\"; }\n\n.fa-imdb:before {\n  content: \"\\F2D8\"; }\n\n.fa-ravelry:before {\n  content: \"\\F2D9\"; }\n\n.fa-eercast:before {\n  content: \"\\F2DA\"; }\n\n.fa-microchip:before {\n  content: \"\\F2DB\"; }\n\n.fa-snowflake-o:before {\n  content: \"\\F2DC\"; }\n\n.fa-superpowers:before {\n  content: \"\\F2DD\"; }\n\n.fa-wpexplorer:before {\n  content: \"\\F2DE\"; }\n\n.fa-meetup:before {\n  content: \"\\F2E0\"; }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n", ""]);

// exports


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./base.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./base.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "html,\nbody {\n  height: 100%;\n  background-color: #333333;\n  font-family: 'Roboto', sans-serif;\n  font-size: 1em; }\n\nbody {\n  display: flex;\n  flex-direction: column; }\n\nmain {\n  flex: 1;\n  margin-top: 60px;\n  display: flex;\n  flex-direction: column; }\n\n.container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  border: solid blue;\n  margin: 0;\n  margin-top: 60px;\n  max-width: none;\n  background-attachment: fixed;\n  background-position: top;\n  background-repeat: no-repeat;\n  background-size: cover; }\n\n.row {\n  flex: 1;\n  display: flex;\n  flex-direction: row;\n  max-width: none; }\n\n.col {\n  overflow: auto; }\n\n.card-1 {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }\n\n.card-1:hover {\n  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }\n\n.card-2 {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n\n.card-3 {\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n\n.card-4 {\n  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }\n\n.card-5 {\n  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22); }\n\n.ag-theme-dark .current-track {\n  background-color: rgba(74, 112, 139, 0.5) !important; }\n\n.buffer-color {\n  background-color: #8CBDC9 !important; }\n\n.progress-color {\n  background-color: #4A708B !important; }\n\n.bg-dark-transparent {\n  background-color: rgba(0, 0, 0, 0.45) !important; }\n\n.ag-theme-dark .current-track {\n  background-color: rgba(74, 112, 139, 0.5) !important; }\n\n.OverlayScroller-thumb {\n  min-height: 50px;\n  border: 1px solid transparent;\n  border-radius: 5px;\n  background-color: #9ea4b9;\n  background-clip: padding-box; }\n\n.Label-label {\n  display: inline-block;\n  margin: 2px;\n  border: 1px solid;\n  border-radius: 2px;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  line-height: 1;\n  cursor: default; }\n\n.Label-default {\n  border-color: #1d563d;\n  background-color: #1d563d; }\n\n.Label-large {\n  padding: 3px 7px;\n  font-weight: bold;\n  font-size: 14px; }\n\n.IconButton-button {\n  margin: 0 2px;\n  width: 22px;\n  border-radius: 4px;\n  background-color: transparent;\n  text-align: center;\n  font-size: inherit; }\n\n.Icon-default {\n  color: inherit; }\n\n.Link-to {\n  color: #0b8750; }\n\n.Link-link {\n  margin: 0;\n  padding: 0;\n  outline: none;\n  border: 0;\n  background: none;\n  color: inherit;\n  text-align: center;\n  text-decoration: none;\n  cursor: pointer; }\n\n.coverflowImage {\n  min-width: 100px;\n  min-height: 100px;\n  width: 100px;\n  height: 100px;\n  max-width: 100px;\n  max-height: 100px; }\n\n.slider {\n  -webkit-appearance: none;\n  width: 100%;\n  height: 15px;\n  border-radius: 5px;\n  background: #d3d3d3;\n  outline: none;\n  opacity: 0.7;\n  transition: opacity .2s; }\n\n.slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 25px;\n  height: 25px;\n  border-radius: 50%;\n  background: #4A708B;\n  cursor: pointer; }\n\n.slider::-moz-range-thumb {\n  width: 25px;\n  height: 25px;\n  border-radius: 50%;\n  background: #4A708B;\n  cursor: pointer; }\n\n.animate-fade {\n  position: relative;\n  -webkit-animation-name: animatefading;\n  -webkit-animation-duration: 1s;\n  animation-name: animatefading;\n  animation-duration: 1s; }\n\n@-webkit-keyframes animatefading {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@keyframes animatefading {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@-webkit-keyframes spin {\n  0% {\n    -webkit-transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg); } }\n\n@keyframes spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n", ""]);

// exports


/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(197);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./mixins.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./mixins.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "::-webkit-scrollbar {\n  width: 0.5em;\n  height: 0.5em; }\n\n::-webkit-scrollbar-thumb {\n  background: #333333; }\n\n::-webkit-scrollbar-track {\n  background: #999999; }\n\nbody {\n  scrollbar-face-color: #333333;\n  scrollbar-track-color: #999999; }\n", ""]);

// exports


/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(199);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./loader.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./loader.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".loader {\n  position: absolute;\n  margin-top: 60px;\n  margin-bottom: 60px;\n  left: calc(50vw + 230px - 75px);\n  top: 50%;\n  z-index: 1;\n  width: 150px;\n  height: 150px;\n  margin: -75px 0 0 -75px;\n  border: 16px solid #666666;\n  border-radius: 50%;\n  border-top: 16px solid #4A708B;\n  width: 120px;\n  height: 120px;\n  -webkit-animation: spin 2s linear infinite;\n  animation: spin 2s linear infinite; }\n", ""]);

// exports


/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(201);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./toolbar.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./toolbar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 201:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".pageToolbar-toolbar {\n  position: absolute;\n  padding: 0;\n  left: 0;\n  right: 0; }\n\n.pageToolbar-toolbar {\n  display: flex;\n  justify-content: space-between;\n  flex: 0 0 auto;\n  height: 60px;\n  line-height: 60px; }\n\n.PageToolbarSection-sectionContainer {\n  display: flex;\n  flex: 1 1 10%; }\n\n.PageToolbarSection-section {\n  display: flex;\n  align-items: center;\n  flex-grow: 1; }\n\n.PageToolbarSection-left {\n  justify-content: flex-start; }\n\n.PageToolbarButton-toolbarButton {\n  width: 60px;\n  text-align: center;\n  line-height: 1.528571429; }\n\n.PageToolbarButton-labelContainer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 16px; }\n\n.PageToolbarButton-label {\n  padding: 0 3px;\n  color: #8895aa;\n  font-size: 11px;\n  line-height: calc(11px + 1px); }\n\n.PageContentBody-contentBody {\n  /* 1px for flex-basis so the div grows correctly in Edge/Firefox */\n  flex: 1 0 1px; }\n\n.PageToolbarSeparator-separator {\n  margin: 10px 20px;\n  height: 40px;\n  border-right: 1px solid #e5e5e5;\n  opacity: 0.35; }\n\n.PageToolbarSection-sectionContainer {\n  display: flex;\n  flex: 1 1 10%; }\n\n.PageToolbarSection-section {\n  display: flex;\n  align-items: center;\n  flex-grow: 1; }\n\n.PageToolbarSection-right {\n  justify-content: flex-end; }\n", ""]);

// exports


/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(203);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./sidebar.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./sidebar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".sidebar {\n  background-color: #333;\n  overflow: auto;\n  max-width: 230px;\n  padding: 0; }\n\n.list-group-item-dark {\n  color: #ffffff;\n  background-color: #343a40; }\n\n.list-group-item-dark .active {\n  color: #ffffff;\n  background-color: #343a40; }\n\n.list-group-item-dark-no-select {\n  color: #ffffff !important;\n  background-color: #343a40 !important; }\n\n.sub-list-group-item-dark {\n  color: #ffffff !important;\n  background-color: #1a1b1d !important; }\n\n.sidebar-expanded {\n  width: 230px; }\n\n.sidebar-collapsed {\n  width: 60px; }\n\n.list-group-item {\n  color: #ffffff !important;\n  cursor: pointer; }\n", ""]);

// exports


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(205);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./header.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./header.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 205:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(207);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./footer.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./footer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "footer {\n  height: 60px; }\n\n.track-progress {\n  height: 10px;\n  width: 100vw; }\n\n#mainProgress {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  min-height: 10px; }\n\n#subProgress {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  opacity: 0.33; }\n\n#mainTimeDisplay {\n  font-size: 0.9em;\n  text-align: center; }\n\n.nowPlayingBarInfoContainer {\n  display: flex;\n  margin: 15px 0 0 0;\n  height: 100%;\n  height: 100%;\n  align-items: center;\n  height: 100%;\n  flex-grow: 1;\n  overflow: hidden; }\n\n.nowPlayingBar {\n  text-align: center;\n  will-change: transform;\n  contain: layout style;\n  transition: -webkit-transform .2s ease-out;\n  transition: transform .2s ease-out;\n  transition: transform .2s ease-out, -webkit-transform .2s ease-out; }\n\n.nowPlayingBar-hidden {\n  -webkit-transform: translate3d(0, 100%, 0);\n  transform: translate3d(0, 100%, 0); }\n\n.nowPlayingBarTop {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 60px;\n  position: relative;\n  justify-content: center; }\n\n.mediaButton,\n.nowPlayingBarUserDataButtons .btnUserItemRating {\n  vertical-align: middle;\n  margin: 0;\n  text-align: center; }\n\n.mediaButton {\n  font-size: 120%; }\n\n.appfooter {\n  position: fixed;\n  left: 0;\n  right: 0;\n  z-index: 2147483647;\n  bottom: 0;\n  transition: -webkit-transform 180ms linear;\n  transition: transform 180ms linear;\n  transition: transform 180ms linear, -webkit-transform 180ms linear;\n  contain: layout style; }\n\n.appfooter.headroom--unpinned {\n  -webkit-transform: translateY(100%) !important;\n  transform: translateY(100%) !important; }\n\n.nowPlayingBar .nowPlayingImage {\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: contain;\n  height: 100%;\n  width: 60px;\n  flex-shrink: 0; }\n\n.nowPlayingBarText {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n  text-align: left;\n  flex-grow: 1;\n  font-size: 92%;\n  margin-right: 2.4em;\n  margin-left: 1em; }\n\n.nowPlayingBarTimeContainer {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n  text-align: left;\n  flex-grow: 1;\n  padding-bottom: 10px; }\n\n.mediaControlButton {\n  height: 10px;\n  margin: 0px;\n  padding-top: 0px;\n  padding-bottom: 10px; }\n\n.nowPlayingBarCenter {\n  vertical-align: middle;\n  text-align: center;\n  z-index: 2;\n  margin: 10px 10px 0 auto;\n  height: 100%;\n  flex-grow: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute; }\n\n.nowPlayingBarPositionContainer {\n  position: absolute !important;\n  left: 0;\n  top: -.56em;\n  right: 0;\n  z-index: 1; }\n\n.headroom--unpinned .nowPlayingBarPositionContainer,\n.noMediaProgress .nowPlayingBarPositionContainer {\n  display: none; }\n\n.nowPlayingBarRight {\n  position: relative;\n  margin: 15px 0 0 auto;\n  height: 100%;\n  z-index: 2;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  display: flex;\n  align-items: center;\n  flex-shrink: 0; }\n\n.nowPlayingBarCurrentTime {\n  vertical-align: middle;\n  text-align: center;\n  display: inline-block;\n  padding-left: 1.5em; }\n\n.nowPlayingBarVolumeSliderContainer {\n  margin-right: 2em; }\n\n.nowPlayingBarUserDataButtons {\n  display: inline-block;\n  margin-left: 1em;\n  margin-right: 1em; }\n\n.nowPlayingBarPositionSlider::-webkit-slider-thumb {\n  width: 1.2em !important;\n  height: 1.2em !important; }\n\n@media all and (max-width: 87.5em) {\n  .nowPlayingBarUserDataButtons {\n    display: none; } }\n\n@media all and (max-width: 68.75em) {\n  .nowPlayingBar .muteButton,\n  .nowPlayingBar .unmuteButton,\n  .nowPlayingBarVolumeSliderContainer {\n    display: none !important; } }\n\n@media all and (max-width: 50em) {\n  .nowPlayingBarCenter {\n    display: none !important; }\n  .toggleRepeatButton {\n    display: none; } }\n\n@media all and (min-width: 50em) {\n  .nowPlayingBarRight .playPauseButton {\n    display: none; }\n  .nowPlayingBarInfoContainer {\n    max-width: 40%; } }\n", ""]);

// exports


/***/ }),

/***/ 208:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(209);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./artist.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./artist.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".artistWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.artistBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#artistHeader {\n  flex: 0.2 0; }\n\n#artistAlbums {\n  flex: 0.25 0;\n  max-height: 100px; }\n\n#artistTracksGrid {\n  flex: 1 0; }\n\n.bio-text {\n  font-size: 0.7em;\n  float: left;\n  color: white;\n  font-family: Candara, Trebuchet MS, sans-serif;\n  font-size: 12px;\n  font-weight: bold;\n  border-right: thin dotted #666666;\n  line-height: 18px;\n  max-height: 75px;\n  overflow: auto; }\n", ""]);

// exports


/***/ }),

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(211);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./artists.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./artists.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "#artistsGrid > .ag-root-wrapper.ag-layout-normal {\n  position: absolute;\n  padding: 0;\n  left: 0;\n  right: 0; }\n\n.jumpBar {\n  display: flex;\n  align-content: stretch;\n  align-items: stretch;\n  align-self: stretch;\n  justify-content: center;\n  flex: 0 0 30px; }\n\n.jumpBarItems {\n  display: flex;\n  justify-content: space-around;\n  flex: 0 0 100%;\n  flex-direction: column;\n  overflow: hidden; }\n\n@media only screen and (max-width: 480px) {\n  .jumpBar {\n    display: none; } }\n", ""]);

// exports


/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(213);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./index-view.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./index-view.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".indexWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.indexBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#indexBody {\n  flex: 0.2 0; }\n", ""]);

// exports


/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(215);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./playlist.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./playlist.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "#playlistsGrid > .ag-root-wrapper {\n  position: absolute;\n  padding: 0;\n  left: 0;\n  right: 0; }\n\n#playlistGrid > div {\n  position: absolute;\n  padding: 0;\n  left: 0;\n  right: 0; }\n", ""]);

// exports


/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(217);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./playing.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./playing.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".playingWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0;\n  background-color: lime; }\n\n#playlistTrackGrid {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0; }\n", ""]);

// exports


/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(219);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./fresh.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./fresh.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".freshWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.freshBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#freshAlbums {\n  height: 100px;\n  background-color: black; }\n\n#freshTracksGrid {\n  flex: 1 0; }\n", ""]);

// exports


/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(221);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./genre.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./genre.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 221:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".genreWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n#genreTrackGrid {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0; }\n", ""]);

// exports


/***/ }),

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(223);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./genres.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./genres.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "#genresGrid > .ag-root-wrapper.ag-layout-normal {\n  position: absolute;\n  padding: 0;\n  left: 0;\n  right: 0; }\n", ""]);

// exports


/***/ }),

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(225);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./starred.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./starred.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 225:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".starredWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.starredBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#starredHeader {\n  flex: 0.2 0; }\n\n#starredAlbums {\n  flex: 0.25 0;\n  max-height: 100px; }\n\n#starredTracksGrid {\n  flex: 1 0; }\n", ""]);

// exports


/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(227);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./status.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./status.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".statusWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n", ""]);

// exports


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(229);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./subsonicSettings.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./subsonicSettings.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".settingsWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.settingsBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 60px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#settingsBody {\n  flex: 1 0; }\n", ""]);

// exports


/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(231);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./debug.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--5-2!../../../node_modules/sass-loader/lib/loader.js!./debug.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".card {\n  box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  border: 0px orange; }\n\n.row {\n  border: 0px pink; }\n\n.col {\n  border: 0px blue; }\n\n.container {\n  border: 0px pink; }\n\n.sidebar {\n  border: 0px blue; }\n\n* {\n  border: 0px lime; }\n", ""]);

// exports


/***/ }),

/***/ 288:
/***/ (function(module, exports) {

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

window.SubsonicAPI = function () {
  function md5cycle(x, k) {
    var a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32(a << s | a >>> 32 - s, b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn(b & c | ~b & d, a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn(b & d | c & ~d, a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md51(s) {
    var txt = '';
    var n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878],
      i = void 0;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    }
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) {
        tail[i] = 0;
      }
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  /* there needs to be support for Unicode here,
   * unless we pretend that we can redefine the MD-5
   * algorithm for multi-byte characters (perhaps
   * by adding every four 16-bit characters and
   * shortening the sum to 32 bits). Otherwise
   * I suggest performing MD-5 as if every character
   * was two bytes--e.g., 0040 0025 = @%--but then
   * how will an ordinary MD-5 sum be matched?
   * There is no way to standardize text to something
   * like UTF-8 before transformation; speed cost is
   * utterly prohibitive. The JavaScript standard
   * itself needs to look at this: it should start
   * providing access to strings as preformed UTF-8
   * 8-bit unsigned value arrays.
   */
  function md5blk(s) {
    /* I figured global was faster.   */
    var md5blks = [],
      i = void 0; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  var hex_chr = '0123456789abcdef'.split('');

  function rhex(n) {
    var s = '',
      j = 0;
    for (; j < 4; j++) {
      s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
    }
    return s;
  }

  function hex(x) {
    for (var i = 0; i < x.length; i++) {
      x[i] = rhex(x[i]);
    }
    return x.join('');
  }

  function md5(s) {
    return hex(md51(s));
  }

  /* this function is much faster,
  so if possible we use it. Some IEs
  are the only ones I know of that
  need the idiotic second function,
  generated by an if clause.  */

  function add32(a, b) {
    return a + b & 0xFFFFFFFF;
  }

  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    (function () {
      function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xFFFF;
      }
    })();
  }

  String.prototype.hexEncode = function () {
    var r = '';
    var i = 0;
    var h = void 0;
    while (i < this.length) {
      h = this.charCodeAt(i++).toString(16);
      while (h.length < 2) {
        h = h;
      }
      r += h;
    }
    return 'enc:' + r;
  };

  var SubsonicAPI = function () {
    function SubsonicAPI(obj) {
      var _this = this;

      _classCallCheck(this, SubsonicAPI);

      if (typeof obj !== 'object') {
        throw new Error('Input must be an object & contain url, user, password & appName fields');
        return;
      }
      if (obj.hasOwnProperty('ip') && obj.hasOwnProperty('port') && obj.hasOwnProperty('user') && obj.hasOwnProperty('password') && obj.hasOwnProperty('appName') && obj.hasOwnProperty('https')) {
        if (!obj.md5Auth) {
          obj.md5Auth = true;
        }
        this.params = {
          u: obj.user,
          f: 'json',
          c: obj.appName
        };
        this._user = obj.user;
        this._md5Auth = obj.md5Auth;
        this._url = function () {
          var portString = void 0;
          switch (obj.port) {
            case 80:
              portString = '';
              break;
            case 443:
              portString = '';
              break;
            default:
              portString = '';
              break;
          }
          if (obj.https) {
            return 'https://' + obj.ip + portString;
          } else {
            return 'http://' + obj.ip + portString;
          }
        }();
        this._password = obj.password;
        this._fishVersion(this._url).then(function (version) {
          _this.params.v = version;
          _this.ping().then(function (res) {
            if (res.status === 'ok') {
              _this.getUserInfo().then(function (userInfo) {
                var responseEvent = new CustomEvent('subsonicApi-ready', {
                  detail: {
                    status: res.status,
                    user: userInfo
                  }
                });
                document.dispatchEvent(responseEvent);
              });
            } else {
              var responseEvent = new CustomEvent('subsonicApi-ready', {
                detail: {
                  status: res.status,
                  error: res.error.messsage
                }
              });
              document.dispatchEvent(responseEvent);
            }
          });
        }, function () {
          throw new TypeError('Error attempting to fetch subsonic version from given address');
        });
      } else {
        throw new TypeError('Input must be an object & contain url, user, password & appName fields');
        return;
      }
    }

    /**
     * conver object to url query string
     */


    _createClass(SubsonicAPI, [{
      key: '_toQueryString',
      value: function _toQueryString(params) {
        var r = [];
        for (var n in params) {
          n = encodeURIComponent(n);
          r.push(params[n] === null ? n : n + '=' + encodeURIComponent(params[n]));
        }
        return r.join('&');
      }

      /**
       * return subsonic api url
       *
       * @param {String} method
       * @param {Object} options
       */

    }, {
      key: '_buildUrl',
      value: function _buildUrl(method, options) {
        if (options !== null && typeof options === 'object') {
          options = '&' + this._toQueryString(options);
        }
        if (!options) {
          options = '';
        }

        if (this._versionCompare(this.params.v, '1.13.0') >= 0 && this._md5Auth) {
          if (this.params.p) {
            delete this.params.p;
          }
          this.params.s = this._makeSalt(6);
          this.params.t = md5(this._password + this.params.s);
          return this._url + '/rest/' + method + '.view?' + this._toQueryString(this.params) + options;
        } else {
          if (this.params.t) {
            delete this.params.t;
          }
          if (this.params.s) {
            delete this.params.s;
          }
          this.params.p = this._password.hexEncode();
          return this._url + '/rest/' + method + '.view?' + this._toQueryString(this.params) + options;
        }
      }

      /**
       * send xmlHttpRequest to the given url
       *
       * @param {String} url
       */

    }, {
      key: '_xhr',
      value: function _xhr(url, dataType) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = dataType || 'json';
          xhr.onload = resolve;
          xhr.onerror = reject;
          xhr.send();
          _this2._lastXhr = xhr;
        });
      }

      /**
       * generates a string of the given length
       *
       * @param {Number} length
       */

    }, {
      key: '_makeSalt',
      value: function _makeSalt(length) {
        var text = "";
        var possible = "ABCD/EFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

      /**
       * ping given url to detect api version
       *
       * @param {String} url
       */

    }, {
      key: '_fishVersion',
      value: function _fishVersion(url) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          _this3._xhr(url + '/rest/ping.view?f=json').then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res.version);
          }, reject);
        });
      }

      /**
       * compare 2 api versions ** I did not write this function **
       */

    }, {
      key: '_versionCompare',
      value: function _versionCompare(v1, v2, options) {
        if (v1 === undefined || v1 === '' || v2 === undefined || v2 === '') return 0;
        var lexicographical = options && options.lexicographical,
          zeroExtend = options && options.zeroExtend,
          v1parts = v1.split('.'),
          v2parts = v2.split('.');

        function isValidPart(x) {
          return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }
        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
          return NaN;
        }
        if (zeroExtend) {
          while (v1parts.length < v2parts.length) {
            v1parts.push("0");
          }
          while (v2parts.length < v1parts.length) {
            v2parts.push("0");
          }
        }
        if (!lexicographical) {
          v1parts = v1parts.map(Number);
          v2parts = v2parts.map(Number);
        }
        for (var i = 0; i < v1parts.length; ++i) {
          if (v2parts.length == i) {
            return 1;
          }
          if (v1parts[i] == v2parts[i]) {
            continue;
          } else if (v1parts[i] > v2parts[i]) {
            return 1;
          } else {
            return -1;
          }
        }
        if (v1parts.length != v2parts.length) {
          return -1;
        }
        return 0;
      }

      /**
       * Get details about the user, including which authorization roles and folder access it has.
       * Can be used to enable/disable certain features in the client, such as jukebox control.
       */

    }, {
      key: 'getUserInfo',
      value: function getUserInfo() {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          var url = _this4._buildUrl('getUser', {
            username: _this4._user
          });
          _this4._xhr(url).then(function (e) {
            _this4.userPermissions = e.target.response['subsonic-response'].user;
            resolve(_this4.userPermissions);
          });
        });
      }

      /**
       * abort the last api call
       */

    }, {
      key: 'abort',
      value: function abort() {
        if (this._lastXhr) {
          this._lastXhr.abort();
        }
      }

      /**
       * Used to test connectivity with the server. Takes no extra parameters.
       */

    }, {
      key: 'ping',
      value: function ping() {
        var _this5 = this;

        return new Promise(function (resolve, reject) {
          var url = _this5._buildUrl('ping');
          _this5._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }

      /**
       *  without ID: Returns all playlists a user is allowed to play.
       * with ID: Returns a listing of files in a saved playlist.
       *
       * @param {Number} id
       */

    }, {
      key: 'getPlaylist',
      value: function getPlaylist(id) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
          var url = _this6._buildUrl(function () {
            if (id) {
              return 'getPlaylist';
            } else {
              return 'getPlaylists';
            }
          }(), function () {
            if (id) {
              return {
                id: id
              };
            } else {
              return;
            }
          }());
          _this6._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].playlists;
            resolve(function () {
              if (res.hasOwnProperty('playlist')) {
                return res.playlist;
              } else {
                return [];
              }
            }());
          }, reject);
        });
      }

      /**
       * Returns all configured top-level music folders. Takes no extra parameters.
       */

    }, {
      key: 'getMusicFolders',
      value: function getMusicFolders() {
        var _this7 = this;

        return new Promise(function (resolve, reject) {
          var url = _this7._buildUrl('getMusicFolders');
          _this7._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].musicFolders.musicFolder;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns an indexed structure of all artists.
       *
       * @param {Number} id
       */

    }, {
      key: 'getIndexes',
      value: function getIndexes(id) {
        var _this8 = this;

        return new Promise(function (resolve, reject) {
          var url = _this8._buildUrl('getIndexes', function (id) {
            if (id) {
              return {
                musicFolderId: id
              };
            } else {
              return;
            }
          }(id));
          _this8._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].indexes.index;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a listing of all files in a music directory.
       * Typically used to get list of albums for an artist, or list of songs for an album.
       *
       * @param {Number} id
       */

    }, {
      key: 'getMusicDirectory',
      value: function getMusicDirectory(id) {
        var _this9 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            throw new Error('id required');
            return;
          }
          var url = _this9._buildUrl('getMusicDirectory', {
            id: id
          });
          _this9._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].directory;
            resolve(res);
          }, reject);
        });
      }
    }, {
      key: 'getArtists',
      value: function getArtists() {
        var _this10 = this;

        return new Promise(function (resolve, reject) {
          var url = _this10._buildUrl('getArtists');
          _this10._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artists.index;
            resolve(res);
          });
        });
      }

      /**
       * without id: Similar to getIndexes, but organizes music according to ID3 tags.
       * with id: Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
       *
       * @param {Number} id
       */

    }, {
      key: 'getArtist',
      value: function getArtist(id) {
        var _this11 = this;

        return new Promise(function (resolve, reject) {
          var url = _this11._buildUrl('getArtist', {
            id: id
          });
          _this11._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artist;
            if (res.album) {
              res.album.sort(function sorting(a, b) {
                return a.discNumber - b.discNumber || a.track - b.track;
              });
            }
            resolve(res);
          });
        });
      }

      /**
       * Streams a given media file.
       *
       * @param {Number} id
       * @param {Number} bitRate
       */

    }, {
      key: 'streamUrl',
      value: function streamUrl(id, bitRate) {
        if (!id) {
          throw new Error('id required');
          return;
        }
        return this._buildUrl('stream', {
          id: id,
          maxBitRate: bitRate || 320,
          estimateContentLength: false
        });
      }

      /**
       * Downloads a given media file.
       * Similar to stream, but this method returns the original media data without transcoding or downsampling.
       *
       * @param {Number} id
       */

    }, {
      key: 'downloadUrl',
      value: function downloadUrl(id) {
        if (!id) {
          throw new Error('id required');
          return;
        }
        return this._buildUrl('download', {
          id: id
        });
      }

      /**
       * Returns top songs for the given artist, using data from last.fm.
       *
       * @param {Number} count
       * @param {String} artist
       */

    }, {
      key: 'getTopSongs',
      value: function getTopSongs(artist, count) {
        var _this12 = this;

        return new Promise(function (resolve, reject) {
          if (!artist) throw new Error('artist name is required');
          var url = _this12._buildUrl('getTopSongs', {
            count: count || 50,
            artist: artist
          });
          _this12._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].topSongs.song;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns all genres.
       */

    }, {
      key: 'getGenres',
      value: function getGenres() {
        var _this13 = this;

        return new Promise(function (resolve, reject) {
          var url = _this13._buildUrl('getGenres');
          _this13._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].genres.genre;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns details for an album, including a list of songs.
       * This method organizes music according to ID3 tags.
       *
       * @param {Number} id
       */

    }, {
      key: 'getAlbum',
      value: function getAlbum(id) {
        var _this14 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            throw new Error('id required');
            return;
          }
          var url = _this14._buildUrl('getAlbum', {
            id: id
          });
          _this14._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].album;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a list of random, newest, highest rated etc. albums.
       * Similar to the album lists on the home page of the Subsonic web interface.
       *
       * @param {String} sort
       * @param {Number} count
       * @param {Number} offset
       * @param {Number} folderId
       */

    }, {
      key: 'getAlbumList',
      value: function getAlbumList(sort, count, offset, folderId) {
        var _this15 = this;

        return new Promise(function (resolve, reject) {
          if (sort) {
            var reqObj = {
              size: count || 60,
              offset: offset || 0,
              type: sort
            };
            if (folderId) reqObj.musicFolderId = folderId;
            var url = _this15._buildUrl('getAlbumList', reqObj);
            _this15._xhr(url).then(function (e) {
              var res = e.target.response['subsonic-response'].albumList.album;
              resolve(res);
            }, reject);
          } else {
            throw new Error('sort method required');
          }
        });
      }

      /**
       * Similar to getAlbumList, but organizes music according to ID3 tags.
       *
       * @param {String} sort
       * @param {Number} count
       * @param {Number} offset
       * @param {Number} folderId
       */

    }, {
      key: 'getAlbumList2',
      value: function getAlbumList2(sort, count, offset, folderId) {
        var _this16 = this;

        return new Promise(function (resolve, reject) {
          if (sort) {
            var reqObj = {
              size: count || 60,
              offset: offset || 0,
              type: sort
            };
            if (folderId) reqObj.musicFolderId = folderId;
            var url = _this16._buildUrl('getAlbumList2', reqObj);
            _this16._xhr(url).then(function (e) {
              var res = e.target.response['subsonic-response'].albumList2.album;
              resolve(res);
            }, reject);
          } else {
            throw new Error('sort method required');
          }
        });
      }

      /**
       *  Returns artist info with biography, image URLs and similar artists, using data from last.fm.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getArtistInfo',
      value: function getArtistInfo(id, count) {
        var _this17 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this17._buildUrl('getArtistInfo', {
            id: id,
            count: count || 60
          });
          _this17._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artistInfo;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Similar to getArtistInfo, but organizes music according to ID3 tags.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getArtistInfo2',
      value: function getArtistInfo2(id, count) {
        var _this18 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          };
          var url = _this18._buildUrl('getArtistInfo2', {
            id: id,
            count: count || 60
          });
          _this18._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artistInfo2;
            resolve(res);
          }, reject);
        });
      }

      /**
       *  Returns a random collection of songs from the given artist and similar artists, using data from last.fm.
       *  Typically used for artist radio features.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getSimilarSongs',
      value: function getSimilarSongs(id, count) {
        var _this19 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this19._buildUrl('getSimilarSongs', {
            id: id,
            count: count || 60
          });
          _this19._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].similarSongs;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Similar to getSimilarSongs, but organizes music according to ID3 tags.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getSimilarSongs2',
      value: function getSimilarSongs2(id, count) {
        var _this20 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this20._buildUrl('getSimilarSongs2', {
            id: id,
            count: count || 60
          });
          _this20._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].similarSongs2;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns details for a song.
       *
       * @param {Number} id
       */

    }, {
      key: 'getSong',
      value: function getSong(id) {
        var _this21 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this21._buildUrl('getSong', {
            id: id
          });
          _this21._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns starred songs, albums and artists.
       *
       * @param {Number} folderId
       */

    }, {
      key: 'getStarred',
      value: function getStarred(folderId) {
        var _this11 = this;

        return new Promise(function (resolve, reject) {
          var url = _this11._buildUrl('getStarred');
          _this11._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].starred;

            resolve(res);
          }, reject);
        });


      }

      /**
       * Similar to getStarred, but organizes music according to ID3 tags.
       *
       * @param {Number} folderId
       */

    }, {
      key: 'getStarred2',
      value: function getStarred2(folderId) {
        var _this23 = this;

        return new Promise(function (resolve, reject) {
          var url = _this23._buildUrl('getStarred2', function () {
            if (folderId) {
              return {
                musicFolderId: folderId
              };
            } else {
              return;
            }
          }());
          _this23._xhr(url).then(function (e) {
            var res = e.target.resolve['subsonic-response'].starred2;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns cover art as a blob
       *
       * @param {Number} id
       * @param {Number} size - max image size in px
       */

    }, {
      key: 'getCoverArt',
      value: function getCoverArt(id, size) {
        var _this24 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this24._buildUrl('getCoverArt', {
            id: id,
            size: size || 500
          });
          resolve(url);
        });
      }

      /**
       * Attaches a star to a song, album or artist.
       *
       * @param {Number} id
       */

    }, {
      key: 'star',
      value: function star(id) {
        var _this25 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this25._buildUrl('star', {
            id: id
          });
          _this25._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Removes the star from a song, album or artist.
       *
       * @param {Number} id
       */

    }, {
      key: 'unstar',
      value: function unstar(id) {
        var _this26 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this26._buildUrl('unstar', {
            id: id
          });
          _this26._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Sets the rating for a music file.
       *
       * @param {Number} id
       * @param {Number} rating
       */

    }, {
      key: 'setRating',
      value: function setRating(id, rating) {
        var _this27 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this27._buildUrl('setRating', {
            id: id,
            rating: rating
          });
          _this27._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * "Scrobbles" a given music file on last.fm.
       * Requires that the user has configured his/her last.fm credentials on the Subsonic server (Settings > Personal).
       *
       * @param {Number} id
       */

    }, {
      key: 'scrobble',
      value: function scrobble(id) {
        var _this28 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this28._buildUrl('scrobble', {
            id: id,
            time: new Date().getTime()
          });
          _this28._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a listing of files matching the given search criteria. Supports paging through the result.
       *
       * @param {Object} obj - a object wihsearch params
       */

    }, {
      key: 'search',
      value: function search(obj) {
        var _this29 = this;

        return new Promise(function (resolve, reject) {
          if (!obj) {
            var err = new Error('search object required');
            reject(err);
            return;
          }
          var url = _this29._buildUrl('search', obj);
          _this29._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].searchResult.match;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns albums, artists and songs matching the given search criteria. Supports paging through the result.
       *
       * @param {Object} obj - a object wihsearch params
       */

    }, {
      key: 'search2',
      value: function search2(obj) {
        var _this30 = this;

        return new Promise(function (resolve, reject) {
          if (!obj) {
            var err = new Error('search object required');
            reject(err);
            return;
          }
          var url = _this30._buildUrl('search2', obj);
          _this30._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].search2Result.match;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    }, {
      key: 'search3',
      value: function search3(obj) {
        var _this31 = this;

        return new Promise(function (resolve, reject) {
          if (!obj) {
            var err = new Error('search object required');
            reject(err);
            return;
          }
          var url = _this31._buildUrl('search3', obj);
          _this31._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].search3Result.match;
            resolve(res);
          }, reject);
        });
      }
    },
    {
      key: 'startScan',
      value: function startScan() {
        var _this32 = this;

        return new Promise(function (resolve, reject) {
          var url = _this32._buildUrl('startScan');
          _this32._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].scanStatus;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'getScanStatus',
      value: function getScanStatus() {
        var _this33 = this;

        return new Promise(function (resolve, reject) {
          var url = _this33._buildUrl('getScanStatus');
          _this33._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].scanStatus;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'createShare',
      value: function createShare(id, description, expires) {
        var _this33 = this;
        if (!id) {
          throw new Error('id required');
          return;
        }
        return new Promise(function (resolve, reject) {
          var url = _this33._buildUrl('createShare', {
            id: id,
            description: description || '',
            expires: expires || null
          });
          _this33._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].shares.share[0];
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'getSongsByGenre',
      value: function getSongsByGenre(genre, count, offset) {
        var _this34 = this;
        if (!genre) {
          throw new Error('genre required');
          return;
        }
        return new Promise(function (resolve, reject) {
          var url = _this34._buildUrl('getSongsByGenre', {
            genre: genre,
            count: count || 500,
            offset: offset || 0
          });
          _this34._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].songsByGenre;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'getRandomSongs',
      value: function getRandomSongs(size, genre, fromYear, toYear) {
        var _this35 = this;

        return new Promise(function (resolve, reject) {
          var url = _this35._buildUrl('getRandomSongs', {
            size: size || 10

          });
          _this35._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].randomSongs;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    }
    ]);

    return SubsonicAPI;
  }();

  return SubsonicAPI;
}();
//# sourceMappingURL=subsonic-api.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__artist_component__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__artists_component__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fresh_component__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__genre_component__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__genres_component__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__home_component__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__index_component__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__playing_component__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__playlist_component__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__playlists_component__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__podcasts_component__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__subsonic_settings_component__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__starred_component__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__status_component__ = __webpack_require__(326);

















/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.components', [])
  .component('artist', __WEBPACK_IMPORTED_MODULE_1__artist_component__["a" /* default */])
  .component('artists', __WEBPACK_IMPORTED_MODULE_2__artists_component__["a" /* default */])
  .component('fresh', __WEBPACK_IMPORTED_MODULE_3__fresh_component__["a" /* default */])
  .component('genre', __WEBPACK_IMPORTED_MODULE_4__genre_component__["a" /* default */])
  .component('genres', __WEBPACK_IMPORTED_MODULE_5__genres_component__["a" /* default */])
  .component('home', __WEBPACK_IMPORTED_MODULE_6__home_component__["a" /* default */])
  .component('index', __WEBPACK_IMPORTED_MODULE_7__index_component__["a" /* default */])
  .component('playing', __WEBPACK_IMPORTED_MODULE_8__playing_component__["a" /* default */])
  .component('playlist', __WEBPACK_IMPORTED_MODULE_9__playlist_component__["a" /* default */])
  .component('playlists', __WEBPACK_IMPORTED_MODULE_10__playlists_component__["a" /* default */])
  .component('podcasts', __WEBPACK_IMPORTED_MODULE_11__podcasts_component__["a" /* default */])
  .component('subsonicsettings', __WEBPACK_IMPORTED_MODULE_12__subsonic_settings_component__["a" /* default */])
  .component('starred', __WEBPACK_IMPORTED_MODULE_13__starred_component__["a" /* default */])
  .component('status', __WEBPACK_IMPORTED_MODULE_14__status_component__["a" /* default */]));


/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_, $) {class ArtistController {
  constructor($scope, $rootScope, $routeParams) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('artist-controller');
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';

    var columnDefs = [{
      headerName: "#",
      field: "track",
      width: 75,
      suppressSizeToFit: true
    },
    {
      headerName: "Title",
      field: "title"
    },
    {
      headerName: "Album",
      field: "album"
    },
    {
      headerName: "Genre",
      field: "genre"
    },
    {
      headerName: "Plays",
      field: "playCount",
      width: 75,
      suppressSizeToFit: true
    },
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          $rootScope.tracks = $scope.tracks;

          var index = _.findIndex($rootScope.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          $rootScope.loadTrack(index);
          $rootScope.$digest();
        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
        $scope.api.showLoadingOverlay();
      }
    };

    $scope.getArtist = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getArtist($routeParams.id).then(function (artist) {
          $scope.artist = artist;
          $scope.artistName = artist.name;

          $rootScope.subsonic.getArtistInfo2($routeParams.id, 50).then(function (result) {
            if (result) {
              if (result.biography) {
                $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
              }
              if (result.similarArtist) {
                $scope.similarArtists = result.similarArtist.slice(0, 5);
              }
              if (result.largeImageUrl) {
                $rootScope.setContentBackground(result.largeImageUrl.replace('300x300', '1280x800'));
              }
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            }
          });

          if (artist.album && artist.album.length > 0) {
            $scope.albums = [];
            $scope.tracks = [];
            artist.album.forEach(album => {

              if (album.coverArt) {
                $rootScope.subsonic.getCoverArt(album.coverArt, 100).then(function (result) {
                  album.artUrl = result;
                  $scope.albums.push(album);
                  if (!$scope.$$phase) {
                    $scope.$apply();
                  }
                  $("#coverflow").flipster();
                });
              }


              $rootScope.subsonic.getAlbum(album.id).then(function (result) {
                if (result) {
                  result.song.forEach(function (song) {
                    $scope.tracks.push(song);
                    if (!$scope.$$phase) {
                      $scope.$apply();
                    }
                  });

                  if ($scope.gridOptions && $scope.gridOptions.api) {
                    $scope.gridOptions.api.setRowData($scope.tracks);
                    $scope.gridOptions.api.doLayout();
                    $scope.gridOptions.api.sizeColumnsToFit();
                  }
                  if (!$scope.$$phase) {
                    $scope.$apply();
                  }
                  $("#coverflow").flipster();
                  $rootScope.hideLoader();
                }
              });
            });
          } else {
            if ($scope.gridOptions.api)
              $scope.gridOptions.api.showNoRowsOverlay();
          }

          $("#coverflow").flipster();
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $rootScope.hideLoader();
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    };

    $scope.refresh = function () {
      console.log('refresh artist');
      $scope.getArtist();
    };

    $scope.startRadio = function () {
      $rootScope.subsonic.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
        console.log('starting radio');
        $rootScope.tracks = similarSongs.song;
        $rootScope.loadTrack(0);
        $rootScope.$digest();
      });
    };

    $scope.shuffle = function () {
      console.log('shuffle play');
      $rootScope.tracks = $rootScope.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      $scope.api.redrawRows({
        force: true
      });
      if ($scope.gridOptions && $scope.gridOptions.api) {

        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('artist reloading on subsonic ready');
      $scope.getArtist();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $scope.getArtist();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29), __webpack_require__(18)))

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {class ArtistsController {
  constructor($scope, $rootScope, $location) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('artists-controller')

    var columnDefs = [{
      headerName: "Name",
      field: "name"
    },
    {
      headerName: "Albums",
      field: "albumCount",
      width: 150,
      suppressSizeToFit: false
    }
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: false,
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
        console.log("onGridReady");
        $scope.reloadArtists();
        $scope.gridOptions.api.sizeColumnsToFit();
        $scope.gridOptions.api.addGlobalListener(
          function (foo) {
            _.debounce(function () {
              $scope.gridOptions.api.sizeColumnsToFit();
            }, 300);

          }
        );
      },
      onSelectionChanged: function (data) {
        console.log('onSelectionChanged')
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/artist/" + selectedRow.id.toString());
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        console.log("/artist/" + selectedRow.id.toString());
      }
    };

    $scope.getArtists = function (artistsCollection, callback) {
      var artists = [];
      artistsCollection.forEach(artistHolder => {
        artistHolder.artist.forEach(artist => {
          artists.push(artist);
        });
      });

      Promise.all(artists).then(function (artistsResult) {
        callback(artistsResult);
      });
    }

    $scope.reloadArtists = function () {
      if ($rootScope.isLoggedIn) {
        $scope.artists = [];
        $rootScope.subsonic.getArtists().then(function (artistsCollection) {
          $scope.getArtists(artistsCollection, function (result) {
            $scope.artists = result;
            if ($scope.gridOptions.api) {
              $scope.gridOptions.api.setRowData($scope.artists);
              $scope.gridOptions.api.sizeColumnsToFit();
              if (!$scope.$$phase) {
                $scope.$apply();
              }
              $rootScope.hideLoader();
            }
          });
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready')
      $scope.reloadArtists();
    });

    document.addEventListener("DOMContentLoaded", function () {
      var eGridDiv = document.querySelector('#artistsGrid');
      new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }


    });

    if ($rootScope.isMenuCollapsed === true) {
    }

  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ArtistsController,
  templateUrl: '/template/artists.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29)))

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_, $) {class FreshController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('fresh-controller');
    $scope.albums = [];
    $scope.tracks = [];
    $scope.continousPlay = true;

    var columnDefs = [{
      headerName: "#",
      field: "track",
      width: 75,
      suppressSizeToFit: true
    },
    {
      headerName: "Title",
      field: "title"
    },
    {
      headerName: "Artist",
      field: "artist"
    },
    {
      headerName: "Album",
      field: "album"
    },
    {
      headerName: "Genre",
      field: "genre"
    },
    {
      headerName: "Plays",
      field: "playCount",
      width: 75,
      suppressSizeToFit: true
    },
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
        console.log("onGridReady");
        setTimeout(function () {
          $scope.reloadAll();
          $scope.gridOptions.api.sizeColumnsToFit();
          $scope.gridOptions.api.addGlobalListener(
            function (foo) {
              _.debounce(function () {
                $scope.gridOptions.api.sizeColumnsToFit();
              }, 300);
            }
          );
        }, 750);
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          $rootScope.tracks = $scope.tracks;
          var index = _.findIndex($rootScope.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          $rootScope.loadTrack(index);
          $rootScope.$digest();
        }
      },
    };

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    }

    $scope.reloadAll = function () {
      if ($rootScope.isLoggedIn) {
        $scope.albums = [];
        $rootScope.subsonic.getAlbumList2("newest").then(function (newestCollection) {
          $scope.albums = newestCollection;
          $scope.albums.forEach(album => {
            if (album.coverArt) {
              $rootScope.subsonic.getCoverArt(album.coverArt, 100).then(function (result) {
                album.artUrl = result;
                if (!$scope.$$phase) {
                  $scope.$apply();
                }
              });
            } else {
              album.artUrl = '/content/no-art.png';
            }
          });

          setTimeout(function () {
            $scope.flip = $("#coverflow").flipster({
              start: 0,
              fadeIn: 500,
              autoplay: false,
              style: 'coverflow',
              spacing: -0.6,
              onItemSwitch: function (currentItem, previousItem) {
                var id = currentItem.dataset.flipTitle;
                $rootScope.subsonic.getAlbum(id).then(function (result) {
                  if (result) {
                    $scope.tracks = [];
                    result.song.forEach(function (song) {
                      $scope.tracks.push(song);
                    });
                    if ($scope.gridOptions && $scope.gridOptions.api) {
                      $scope.gridOptions.api.setRowData($scope.tracks);
                      $scope.gridOptions.api.doLayout();
                      $scope.gridOptions.api.sizeColumnsToFit();
                    }
                    if (!$scope.$$phase) {
                      $scope.$apply();
                    }
                  }
                });
              }
            });
            if (!$scope.$$phase) {
              $scope.$apply();
            }
            $scope.flip.flipster('index');
            $scope.flip.flipster('next');
            $rootScope.hideLoader();
          }, 750);
        });
      } else {
        if ($scope.gridOptions.api) {
          $scope.gridOptions.api.showNoRowsOverlay();
        }
        $rootScope.hideLoader();
      }
    };

    $scope.startRadio = function () {
      var track = $rootScope.selectedTrack();
      if (!track || !track.artistId) {
        track = $scope.tracks[0];
      }

      $rootScope.subsonic.getSimilarSongs2(track.artistId).then(function (similarSongs) {
        console.log('starting radio');
        if (similarSongs && similarSongs.song) {
          $rootScope.tracks = similarSongs.song;
          $rootScope.loadTrack(0);
        };
      });
    };

    $scope.shuffle = function () {
      console.log('shuffle play');
      $rootScope.tracks = $rootScope.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('playlistEndEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.flip.flipster('next');
        setTimeout(function () {
          $rootScope.tracks = $scope.tracks;
          $rootScope.loadTrack(0);
        }, 500);
      };
    });

    $rootScope.$on('trackChangedEvent', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.redrawRows({
          force: true
        });
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready');
      $scope.reloadAll();
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: FreshController,
  templateUrl: '/template/fresh.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29), __webpack_require__(18)))

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {class GenreController {
  constructor($scope, $rootScope, $routeParams) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('genre-controller')
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';
    $scope.genre = $routeParams.id;
    var columnDefs = [
      {
        headerName: "Artist",
        field: "artist"
      },
      {
        headerName: "Title",
        field: "title"
      },
      {
        headerName: "Album",
        field: "album"
      },
      {
        headerName: "Plays",
        field: "playCount",
        width: 60,
        suppressSizeToFit: true
      },
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowMultiSelectWithClick: true,
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onSelectionChanged: function (data) {
        var selectedRow = $scope.api.getSelectedRows()[0];
        if (selectedRow) {
          if ($scope.tracks) {
            $rootScope.tracks = $scope.tracks;

            var index = _.findIndex($rootScope.tracks, function (track) {
              if (track && selectedRow) {
                return track.id === selectedRow.id
              } else return false;
            })
            $rootScope.loadTrack(index);
            $rootScope.$digest();
          }
        }

      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
      },
    };

    $scope.getGenre = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getSongsByGenre($routeParams.id, 500, 0).then(function (result) {
          $scope.tracks = result.song;
          if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.setRowData($scope.tracks);
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
          }
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $rootScope.hideLoader();
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $scope.refresh = function () {
      console.log('refresh genre')
      $scope.getGenre();
    };

    $scope.shuffle = function () {
      console.log('shuffle play')
      $rootScope.tracks = $rootScope.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('genre reloading on subsonic ready')
      $scope.getGenre();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {

      //$('#genreTrackGrid').width($('.main-content').width());
      //$('#genreTrackGrid').height($('.main-content').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      //$('#genreTrackGrid').width($('.main-content').width());
      //$('#genreTrackGrid').height($('.main-content').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $scope.getGenre();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: GenreController,
  templateUrl: '/template/genre.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29)))

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {class GenresController {
  constructor($scope, $rootScope, $location) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('genres-controller')

    $scope.genres = [];

    var columnDefs = [{
        headerName: "Genre",
        field: "value"
      },
      {
        headerName: "Albums",
        field: "albumCount"
      },
      {
        headerName: "Songs",
        field: "songCount"
      }
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      getRowNodeId: function (data) {
        return data.value;
      },
      rowMultiSelectWithClick: false,
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
        console.log("onGridReady");
        $scope.gridOptions.api.sizeColumnsToFit();
        $scope.gridOptions.api.addGlobalListener(
          function (foo) {
            _.debounce(function () {
              $scope.gridOptions.api.sizeColumnsToFit();
            }, 300);

          }
        );
      },
      onSelectionChanged: function (data) {
        console.log('selection changed')
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/genre/" + selectedRow.value.toString());
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        console.log("/genre/" + selectedRow.value.toString());
      }
    };

    $scope.getGenres = function (genreCollection, callback) {
      var genres = [];
      genreCollection.forEach(genreHolder => {
        genreHolder.genre.forEach(genre => {
          genres.push(genre);
        });
      });

      Promise.all(genres).then(function (genreResult) {
        callback(genreResult);
      });
    }

    $scope.reloadGenres = function () {
      if ($rootScope.isLoggedIn) {
        $scope.genres = [];
        $rootScope.subsonic.getGenres().then(function (result) {

          $scope.genres = result;
          $scope.gridOptions.api.setRowData($scope.genres);
          $scope.gridOptions.api.sizeColumnsToFit();
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $rootScope.hideLoader();
        });


      } else {
        if ($scope.gridOptions.api)
        $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('genres reloading on subsonic ready')
      $scope.reloadGenres();
    });



    $scope.reloadGenres();

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: GenresController,
  templateUrl: '/template/genres.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29)))

/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {class HomeController {
  constructor($scope, $rootScope) {
    "ngInject";
    console.log('home-controller')
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    $scope.processTracks = function (songCollection, callback) {
      var songs = [];
      songCollection.forEach(song => {

        if (song.coverArt) {
          $rootScope.subsonic.getCoverArt(song.coverArt, 200).then(function (art) {
            // song.artworkUrl = art;
            // $scope.random.push(song);
          });
        }



      });

      Promise.all(songs).then(function (songsResult) {
        callback(songsResult);
      });
    }


    $scope.reloadRandomTracks = function () {
      if ($rootScope.isLoggedIn) {
        $scope.random = [];
        $rootScope.subsonic.getRandomSongs().then(function (result) {
          $scope.processTracks(result.song, function (results) {
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });

        });


      }
    };




    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('home reloading on subsonic ready')
      $scope.reloadRandomTracks();
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {


    });

    $rootScope.$on('windowResized', function (event, data) {


    });


    $scope.reloadRandomTracks();

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $rootScope.hideLoader();

  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(18)))

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class IndexController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('index-controller')
    $scope.artists = [];


    $scope.getArtists = function (artistsCollection, callback) {
      var artists = [];
      artistsCollection.forEach(artistHolder => {
        artistHolder.artist.forEach(artist => {
          artists.push(artist);
        });
      });

      Promise.all(artists).then(function (artistsResult) {
        callback(artistsResult);
      });
    }

    $scope.reloadArtists = function () {
      if ($rootScope.isLoggedIn) {
        $scope.artists = [];
        $rootScope.subsonic.getArtists().then(function (result) {
          $scope.artists = result;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $rootScope.hideLoader();

        });
      } else {
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.showNoRowsOverlay();
        }
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready')
      $scope.reloadArtists();
    });

    $scope.reloadArtists();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: IndexController,
  templateUrl: '/template/index-view.jade'
});

/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {class PlayingController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('playing-controller')

    $scope.getSong = function () {
      if ($rootScope.isLoggedIn) {
        var track = $rootScope.selectedTrack();
        if (track) {
          $rootScope.subsonic.getSong(track.id).then(function (song) {
            $scope.song = song.song;
            $scope.artistName = $scope.song.artist;
            $scope.trackTitle = $scope.song.title;
            $scope.year = $scope.song.year;
            $scope.contentType = $scope.song.contentType;
            $scope.bitrate = $scope.song.bitrate;
            $scope.playCount = $scope.song.playCount;
            $rootScope.subsonic.getArtistInfo2($scope.song.artistId, 50).then(function (result) {
              if (result) {
                $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                if (result.similarArtist && result.similarArtist.length > 0)
                  $scope.similarArtists = result.similarArtist;
                if (result.largeImageUrl) {
                  var bgUrl = result.largeImageUrl.replace('300x300', Math.round($('.main-content').width()) + 'x' + Math.round($('.main-content').height()));
                  console.log('getting image ' + bgUrl);
                  $rootScope.setContentBackground(bgUrl);
                }

                if (!$scope.$$phase) {
                  $scope.$apply();
                }
                $rootScope.hideLoader();
              }
            });
          });
        }
      } else {
        if ($scope.gridOptions && $scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('trackChangedEvent', function (event, data) {
      console.log('Track Changed reloading now playing')
      $scope.getSong();
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('login changed reloading now playing')
      $scope.getSong();
    });

    $scope.getSong();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PlayingController,
  templateUrl: '/template/playing.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(18)))

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {class PlaylistController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('playlist-controller')

    var columnDefs = [{
      headerName: "Title",
      field: "title"
    },
    {
      headerName: "Artist",
      field: "artist"
    },
    {
      headerName: "Album",
      field: "album"
    },
    {
      headerName: "Title",
      field: "title"
    },
    {
      headerName: "Genre",
      field: "genre"
    },
    {
      headerName: "Plays",
      field: "playCount",
      width: 75,
      suppressSizeToFit: true
    },
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: true,
      rowClassRules: {
        'current-track': function (params) {
          if($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onRowDoubleClicked: function (e) {
        if ($scope.gridOptions && $scope.gridOptions.api) {
          var selectedRow = e.data;
          if (selectedRow) {
            console.log('selection changed')
            var index = _.findIndex($rootScope.tracks, function (track) {
              return track.id === selectedRow.id
            })
            $rootScope.loadTrack(index);
            $rootScope.$digest();
          }
        }
      },
      onGridReady: function (event) {
        $scope.api = event.api;
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.setRowData($rootScope.tracks);
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
          $rootScope.hideLoader();
        }
      },
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      $scope.api.redrawRows({
        force: true
      });
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.gridOptions.api.setRowData($rootScope.tracks);
    });

    $rootScope.$on('menuSizeChange', function (event, data) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }

    });

    $rootScope.$on('windowResized', function (event, data) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29)))

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PlaylistsController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('playlists-controller')

    $rootScope.hideLoader();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PlaylistsController,
  templateUrl: '/template/playlists.jade'
});

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PodcastsController {
  constructor($scope, $rootScope) {
    "ngInject";
    console.log('podcasts-controller')
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    $rootScope.hideLoader();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PodcastsController,
  templateUrl: '/template/podcasts.jade'
});

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto_js__);


class SubsonicSettingsController {
  constructor($scope, $rootScope, SubsonicService) {
    "ngInject";

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('settings-controller')
    $scope.settings = {};

    $scope.saveSettings = function () {
      console.log('save settings');
      $rootScope.settings.subsonic_address = $scope.settings.subsonic_address;
      $rootScope.settings.subsonic_port = $scope.settings.subsonic_port;
      $rootScope.settings.subsonic_use_ssl = $scope.settings.subsonic_use_ssl;
      $rootScope.settings.subsonic_include_port_in_url = $scope.settings.subsonic_include_port_in_url;
      $rootScope.settings.subsonic_username = $scope.settings.subsonic_username;
      $rootScope.settings.subsonic_password = __WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.AES.encrypt($scope.settings.subsonic_password, "12345").toString();
      $rootScope.socket.emit('save_settings', $rootScope.settings);
      SubsonicService.login();
    }

    $rootScope.$on('settingsReloadedEvent', function (event, data) {
      console.log('settings reloading');
      $scope.settings.subsonic_address = $rootScope.settings.subsonic_address;
      $scope.settings.subsonic_port = $rootScope.settings.subsonic_port;
      $scope.settings.subsonic_use_ssl = !!+$rootScope.settings.subsonic_use_ssl;
      $scope.settings.subsonic_include_port_in_url = !!+$rootScope.settings.subsonic_include_port_in_url;
      $scope.settings.subsonic_username = $rootScope.settings.subsonic_username;
      if ($rootScope.settings.subsonic_password) {
        $scope.settings.subsonic_password = __WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.AES.decrypt($rootScope.settings.subsonic_password.toString(), "12345").toString(__WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.enc.Utf8);
      }
      $scope.previewConnectionString();
      $rootScope.hideLoader();
    });

    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($scope.settings.subsonic_use_ssl)
        url = 'https://';
      url += $scope.settings.subsonic_address;
      if ($scope.settings.subsonic_include_port_in_url)
        url += ':' + $scope.settings.subsonic_port;

      return url;
    }

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    }

    $rootScope.socket.emit('load_settings');
    
    $rootScope.$on('menuSizeChange', function (event, currentState) {
      
    });

    $rootScope.$on('windowResized', function (event, data) {

    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: SubsonicSettingsController,
  templateUrl: '/template/subsonicSettings.jade',
  
});

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {class StarredController {
  constructor($scope, $rootScope, $location) {
    "ngInject";
    console.log('starred-controller')
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    var columnDefs = [{
      headerName: "Id",
      field: "id",
      width: 75,
      suppressSizeToFit: true
    },
    {
      headerName: "#",
      field: "track",
      width: 75,
      suppressSizeToFit: true
    },
    {
      headerName: "Title",
      field: "title"
    },
    {
      headerName: "Artist",
      field: "artist"
    },
    {
      headerName: "Album",
      field: "album"
    },
    {
      headerName: "Genre",
      field: "genre"
    },
    {
      headerName: "Plays",
      field: "playCount",
      width: 75,
      suppressSizeToFit: true
    },
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: true,
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          $rootScope.tracks = $scope.tracks;

          var index = _.findIndex($rootScope.tracks, function (track) {
            return track.id === selectedRow.id
          })
          $rootScope.loadTrack(index);
          $rootScope.$digest();
        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
        $scope.api.showLoadingOverlay();
      }
    };

    $scope.reloadStarred = function () {
      if ($rootScope.isLoggedIn) {
        $scope.albums = [];
        $scope.tracks = [];
        $rootScope.subsonic.getStarred().then(function (result) {

          result.album.forEach(album => {

            if (album.coverArt) {
              $rootScope.subsonic.getCoverArt(album.coverArt, 128).then(function (result) {
                album.artUrl = result;
                $scope.albums.push(album);
                if (!$scope.$$phase) {
                  $scope.$apply();
                }
              });
            }
          });
          $scope.tracks = result.song;

          if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.setRowData($scope.tracks);
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
          }
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $rootScope.hideLoader();
        }, function (reject) {
          console.log(reject)
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $scope.shuffle = function () {
      console.log('shuffle play')
      $rootScope.tracks = $rootScope.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('starred reloading on subsonic ready')
      $scope.reloadStarred();
    });

    document.addEventListener("DOMContentLoaded", function () {
      var eGridDiv = document.querySelector('#starredGrid');
      new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('trackChangedEvent', function (event, data) {
      if (data && data.largeImageUrl) {
        $rootScope.setContentBackground(data.largeImageUrl.replace('300x300', '1280x800'));
      }
      $scope.api.redrawRows({
        force: true
      });
      if ($scope.gridOptions && $scope.gridOptions.api) {

        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $scope.reloadStarred();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(29)))

/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class StatusController {
  constructor($scope, $rootScope, SubsonicService) {
    "ngInject";
    console.log('status-controller')
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    $scope.ping = function () {
      if ($rootScope.isLoggedIn) {
        var ping = SubsonicService.ping();
        if (ping) {
          ping.then(function (data) {
            console.log('ping ' + data);
            $scope.server = data;
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });
        }
      }
    };

    $scope.getUserInfo = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getUserInfo().then(function (userInfo) {
          console.log('ping ' + userInfo);
          $scope.userInfo = userInfo;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      }
    };

    $scope.getMediaFolders = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getMusicFolders().then(function (data) {

          $scope.folders = data;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      }
    };

    $scope.startScan = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.startScan().then(function (data) {
          $scope.scanStatus = data;
          $scope.scanStatusTotalFiles = data.count;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $scope.rescanInterval = setInterval(function () {
            $scope.getScanStatus();
          }, 500);
        });
      }
    };

    $scope.getScanStatus = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getScanStatus().then(function (data) {
          $scope.scanStatus = data;
          if ($scope.scanStatus.count === $scope.scanStatusTotalFiles) {
            clearInterval($scope.rescanInterval);
          }
          $scope.$apply();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
      $scope.getUserInfo();
      $scope.getMediaFolders();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
      $scope.getUserInfo();
      $scope.getMediaFolders();
    }, 5000);


    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.rescanInterval);
    });
    $scope.ping();
    $scope.getUserInfo();
    $scope.getMediaFolders();
    $rootScope.hideLoader();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: StatusController,
  templateUrl: '/template/status.jade'
});

/***/ }),

/***/ 327:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__subsonicService_service__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mediaService_service__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__chromecastService_service__ = __webpack_require__(330);






/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.services', [])
  .service('SubsonicService', __WEBPACK_IMPORTED_MODULE_1__subsonicService_service__["a" /* default */])
  .service('MediaService', __WEBPACK_IMPORTED_MODULE_2__mediaService_service__["a" /* default */])
  .service('ChromecastService', __WEBPACK_IMPORTED_MODULE_3__chromecastService_service__["a" /* default */]));

/***/ }),

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto_js__);


class SubsonicService {
  constructor($rootScope) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.$rootScope.isLoggingIn = true;
    this.$rootScope.isLoggedIn = false;
  }

  generateConnectionString() {
    var url = 'http://';
    if ($rootScope.settings.subsonic_use_ssl)
      url = 'https://';
    url += $rootScope.settings.subsonic_address;
    if ($rootScope.settings.subsonic_include_port_in_url)
      url += ':' + $rootScope.settings.subsonic_port;

    return url;
  }

  doLogin() {

    if (this.$rootScope.settings && this.$rootScope.settings.subsonic_username && this.$rootScope.settings.subsonic_password) {
      if (!this.$rootScope.isLoggedIn) {
        console.log('logging into subsonic')

        var ip = this.$rootScope.settings.subsonic_address;
        if (this.$rootScope.settings.subsonic_include_port_in_url === true)
          ip = ':' + this.$rootScope.settings.subsonic_port;
          this.$rootScope.subsonic = new SubsonicAPI({
          https: this.$rootScope.settings.subsonic_use_ssl,
          ip: ip,
          port: this.$rootScope.settings.subsonic_port,
          user: this.$rootScope.settings.subsonic_username,
          password: __WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.AES.decrypt(this.$rootScope.settings.subsonic_password.toString(), "12345").toString(__WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.enc.Utf8),
          appName: 'MediaServerUI',
          md5Auth: true
        });

        document.addEventListener('subsonicApi-ready', event => {
          if (event.detail.status === 'ok') {
            console.log('connected to subsonic')
            this.$rootScope.isLoggingIn = false;
            this.$rootScope.isLoggedIn = true;
          } else {
            console.log('failed to connect to subsonic')
            this.$rootScope.isLoggingIn = false;
            this.$rootScope.isLoggedIn = false;
          }
          this.$rootScope.$broadcast('loginStatusChange', this.$rootScope.isLoggedIn);
        });
      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    this.doLogin();
    if (this.$rootScope.isLoggedIn)
      return this.$rootScope.subsonic.ping();
    else return false;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SubsonicService;


/***/ }),

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MediaService {
  constructor($document) {
    "ngInject";
    var media = $document[0].getElementById('media-player');
    return media;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MediaService;


/***/ }),

/***/ 330:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__API_cast_framework__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__API_cast_framework___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__API_cast_framework__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__API_cast_v1__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__API_cast_v1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__API_cast_v1__);


var isCastAvailable = false;
window.__onGCastApiAvailable = function (isAvailable) {
  console.log('cast status ' + isAvailable);
  isCastAvailable = isAvailable;
};

class ChromecastService {
  constructor($rootScope) {
    "ngInject";
    this.$rootScope = $rootScope;
  }

  castStatus() {
    return isCastAvailable;
  }

  initializeCast(caller) {
    if (isCastAvailable) {
      var options = {};
      options.receiverApplicationId = 'DAB06F7C';
      options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
      cast.framework.CastContext.getInstance().setOptions(options);
      this.$rootScope.remotePlayer = new cast.framework.RemotePlayer();
      this.$rootScope.remotePlayerController = new cast.framework.RemotePlayerController(this.$rootScope.remotePlayer);
      this.$rootScope.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        this.$rootScope.switchPlayer
      );

      this.$rootScope.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChromecastService;


/***/ }),

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);



/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.factories', []));

/***/ }),

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ApplicationConfig {
  constructor($routeProvider, $locationProvider) {
    "ngInject";
    $routeProvider.when('/', {
      template: '<home></home>',
    }).when('/fresh', {
      template: '<fresh></fresh>',
    }).when('/status', {
      template: '<status></status>',
    }).when('/index', {
      template: '<index></index>',
    }).when('/starred', {
      template: '<starred></starred>',
    }).when('/playlist', {
      template: '<playlist></playlist>',
    }).when('/playlists', {
      template: '<playlists></playlists>',
    }).when('/genres', {
      template: '<genres></genres>',
    }).when('/genre/:id', {
      template: '<genre></genre>',
    }).when('/podcasts', {
      template: '<podcasts></podcasts>',
    }).when('/playing', {
      template: '<playing></playing>',
    }).when('/settings/subsonic', {
      template: '<subsonicSettings></subsonicSettings>',
    }).when('/artists', {
      template: '<artists></artists>',
    }).when('/artist/:id', {
      template: '<artist></artist>',
    }).otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('');
    }
  }

/* harmony default export */ __webpack_exports__["a"] = (ApplicationConfig);

/***/ }),

/***/ 333:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io_client__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io_client__);


class ApplicationRun {
  constructor($window, $rootScope, MediaService, ChromecastService, SubsonicService) {
    "ngInject";
    console.log('starting application');
    var myWindow = angular.element($window);
    myWindow.on('__onGCastApiAvailable', function (isAvailable) {
      console.log('constructor cast is ' + isAvailable);
      $rootScope.isCastAvailable = isAvailable;
    });
    $rootScope.isLoggedIn = false;
    $rootScope.activeSong = "";
    $rootScope.playing = false;
    $rootScope.currentVolume = MediaService.volume;
    $rootScope.selectedIndex = 0;
    $rootScope.repeatEnabled = false;
    $rootScope.tracks = [];
    $rootScope.settings = [];

    $rootScope.apply = function () {
      if (!$rootScope.$$phase) {
        //$digest or $apply
      }
    };

    $rootScope.castSession = function () {
      return cast.framework.CastContext.getInstance().getCurrentSession();
    };

    $rootScope.trackCount = function () {
      return $rootScope.tracks.length;
    };

    $rootScope.showTrackCount = function () {
      return $rootScope.tracks.length > 0;
    };

    $rootScope.selectedTrack = function () {
      return $rootScope.tracks[$rootScope.selectedIndex];
    };

    $rootScope.remotePlayerConnected = function () {
      if (!$rootScope.remotePlayer) return false;
      return $rootScope.remotePlayer.isConnected;
    };

    $rootScope.checkStarred = function (source) {
      if (source.starred) {
        $("#likeButtonIcon").removeClass('fa-heart-o');
        $("#likeButtonIcon").addClass('fa-heart');
      } else {
        $("#likeButtonIcon").removeClass('fa-heart');
        $("#likeButtonIcon").addClass('fa-heart-o');
      }
    };

    $rootScope.checkArtistInfo = function (source) {
      $('#artistInfo').html(source.artist);
      $('#artistInfo').attr("href", source.artistUrl);
      $('#trackInfo').html(source.title);
      $('#trackInfo').attr("href", "/playing");
    };

    $rootScope.checkVolume = function () {
      $('#volumeSlider').val($rootScope.currentVolume * 100);
    };

    $rootScope.checkNowPlayingImage = function (source) {
      $rootScope.subsonic.getArtistInfo2(source.artistId, 50).then(function (result) {
        $('#nowPlayingImageHolder').attr('src', result.smallImageUrl);
      });
    };

    $rootScope.togglePlayPause = function () {
      var playing = false;
      if ($rootScope.remotePlayerConnected()) {
        playing = $rootScope.remotePlayer.playerState === 'PLAYING';
      } else {
        playing = $rootScope.playing;
      }

      if (playing) {
        $("#playPauseIcon").addClass("fa-pause");
        $("#playPauseIcon").removeClass("fa-play");
      } else {
        $("#playPauseIcon").addClass("fa-play");
        $("#playPauseIcon").removeClass("fa-pause");
      }
    };

    $rootScope.loadTrack = function (index) {
      $rootScope.selectedIndex = index;
      console.log('loadTrack');
      $('#mainTimeDisplay').html("Loading...");

      var source = $rootScope.selectedTrack();
      console.log(source);
      source.artistUrl = "/artist/" + source.artistId;
      source.albumUrl = "/album/" + source.albumId;
      if (source && source.id) {
        source.url = $rootScope.subsonic.streamUrl(source.id, 320);

        $rootScope.checkVolume();

        if (source.artistId) {
          $rootScope.checkStarred(source);
          $rootScope.checkArtistInfo(source);
          $rootScope.checkNowPlayingImage(source);

          if ($rootScope.remotePlayerConnected()) {
            $rootScope.setupRemotePlayer();


            var mediaInfo = new chrome.cast.media.MediaInfo(source.url, source.transcodedContentType);

            mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
            //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
            //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MOVIE;
            //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.TV_SHOW;
            //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
            mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
            mediaInfo.customData = JSON.stringify(source);
            mediaInfo.metadata.title = source.title;
            mediaInfo.metadata.images = [{
              'url': result.largeImageUrl.replace('300x300', '1280x400')
            }];

            var request = new chrome.cast.media.LoadRequest(mediaInfo);
            cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request);
            $rootScope.subsonic.scrobble(source.id).then(function (scrobbleResult) {
              if (scrobbleResult) console.log('scrobble success: ' + scrobbleResult.status);
            });
            $rootScope.togglePlayPause();

          } else {

            MediaService.src = source.url;
            MediaService.load();
            if ($rootScope.shouldSeek) {
              $rootScope.shouldSeek = false;
              MediaService.currentTime = $rootScope.prePlannedSeek;
            }
            var playPromise = MediaService.play();

            if (playPromise !== undefined) {
              playPromise.then(_ => {
                $rootScope.subsonic.scrobble(source.id).then(function (scrobbleResult) {
                  if (scrobbleResult) console.log('scrobble success: ' + scrobbleResult.status);
                });
                $rootScope.togglePlayPause();
                $rootScope.$broadcast('trackChangedEvent', source);
                $rootScope.$digest();
              }).catch(error => {
                console.log('playing failed ' + error);
                $rootScope.next();
              });
            } else {
              $rootScope.next();
            }
          }
        } else {
          $rootScope.next();
        }
      } else {
        $rootScope.next();
      }
    };

    $rootScope.play = function () {
      if ($rootScope.remotePlayerConnected()) {
        if ($rootScope.remotePlayer.isPaused) {
          $rootScope.remotePlayerController.playOrPause();
        }

      } else {
        var playPromise = MediaService.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            console.log('success playing');
          }).catch(error => {
            console.log('playing failed ' + error);
          });
        }
      }
    };

    $rootScope.pause = function () {
      if ($rootScope.remotePlayerConnected()) {
        if (!$rootScope.remotePlayer.isPaused) {
          $rootScope.remotePlayerController.playOrPause();
        }
      } else {
        MediaService.pause();
      }
    };

    $rootScope.stop = function () {
      MediaService.stop();
    };

    $rootScope.previous = function () {
      $rootScope.selectedIndex--;
      $rootScope.selectedIndex = ($rootScope.selectedIndex < 0 ? $rootScope.tracks.length - 1 : $rootScope.selectedIndex);
      $rootScope.loadTrack($rootScope.selectedIndex);
    };
    $rootScope.next = function () {
      if (!$rootScope.repeatEnabled) $rootScope.selectedIndex++;
      $rootScope.selectedIndex = ($rootScope.selectedIndex >= $rootScope.tracks.length ? 0 : $rootScope.selectedIndex);
      $rootScope.loadTrack($rootScope.selectedIndex);
    };

    $rootScope.formatTime = function (seconds) {
      var minutes = Math.floor(seconds / 60);
      minutes = (minutes >= 10) ? minutes : "0" + minutes;
      seconds = Math.floor(seconds % 60);
      seconds = (seconds >= 10) ? seconds : "0" + seconds;
      return minutes + ":" + seconds;
    };

    $('#media-player').on('error', function failed(e) {
      // audio playback failed - show a message saying why
      // to get the source of the audio element use $(this).src
      console.log('player error ' + e.target.error);
      switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
          alert('You aborted the video playback.');
          break;
        case e.target.error.MEDIA_ERR_NETWORK:
          alert('A network error caused the audio download to fail.');
          break;
        case e.target.error.MEDIA_ERR_DECODE:
          alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
          break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
          break;
        default:
          alert('An unknown error occurred.');
          break;
      }
    });

    $rootScope.setContentBackground = function (img) {
      $('.container').css('background-image', 'url(' + img + ')');
    };

    $rootScope.resetContentBackground = function (img) {
      $('.container').css('background-image', 'url("")');
    };

    $("#media-player").on("play", function () {
      $rootScope.$apply(function () {
        $rootScope.playing = true;
        $rootScope.togglePlayPause();
      });
    });

    $("#media-player").on("pause", function () {
      $rootScope.$apply(function () {
        $rootScope.playing = false;
        $rootScope.togglePlayPause();
      });
    });

    $("#media-player").on("ended", function () {
      if (($rootScope.selectedIndex + 1) === $rootScope.tracks.length) {
        $rootScope.playing = false;
        $rootScope.selectedIndex = 0;
        $rootScope.togglePlayPause();
        $('#media-player').src = $rootScope.selectedTrack();
        $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainTimeDisplay').html("");
        console.log('playlist ended');
        $rootScope.$broadcast('playlistEndEvent');
      } else {
        $rootScope.playing = true;
        $rootScope.next();
      }
    });

    $("#media-player").on("canplaythrough", function () {
      $('#mainTimeDisplay').html("0:00 / " + $rootScope.formatTime(MediaService.duration));
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      $rootScope.togglePlayPause();
    });

    $("#media-player").on("timeupdate", function () {

      var duration = MediaService.duration;
      if (!isFinite(duration))
        duration = $rootScope.selectedTrack().duration;

      var playPercent = 100 * (MediaService.currentTime / duration);
      if (!isNaN(playPercent)) {
        var buffered = MediaService.buffered;
        var loaded;


        if (buffered.length) {
          loaded = 100 * buffered.end(0) / duration;
        }


        $('#subProgress').attr('aria-valuenow', loaded).css('width', loaded + "%");
        $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
        $('#mainTimeDisplay').html($rootScope.formatTime(MediaService.currentTime) + " / " + $rootScope.formatTime(duration));
      }
    });

    $("#muteButton").click(function () {
      var vol = 0;
      if ($rootScope.remotePlayerConnected()) {
        $rootScope.remotePlayerController.muteOrUnmute();
        $rootScope.isMuted = $rootScope.remotePlayer.isMuted;
        if ($rootScope.isMuted) {
          vol = 0;
          $('#volumeSlider').val(vol);
        } else {
          vol = $rootScope.remotePlayer.volumeLevel;
          $('#volumeSlider').val(vol * 100);
        }
      } else {
        $rootScope.isMuted = !$rootScope.isMuted;
        if ($rootScope.isMuted) {
          MediaService.volume = 0;
          $('#volumeSlider').val(0);
        } else {
          MediaService.volume = $rootScope.currentVolume;
          $('#volumeSlider').val($rootScope.currentVolume * 100);
        }
      }
    });

    $("#skipBackButton").click(function () {
      $rootScope.previous();
    });

    $("#playPauseButton").click(function () {

      if ($rootScope.remotePlayerConnected()) {
        if (!$rootScope.remotePlayer.isPaused) $rootScope.pause();
        else $rootScope.play();

      } else {
        if ($rootScope.playing) $rootScope.pause();
        else $rootScope.play();
      }


    });

    $("#skipNextButton").click(function () {
      $rootScope.next();
    });

    $("#repeatButton").click(function () {
      $rootScope.repeatEnabled = !$rootScope.repeatEnabled;
      $("#repeatButton").toggleClass('button-selected');
    });

    $("#downloadButton").click(function () {
      var dlUrl = $rootScope.subsonic.downloadUrl($rootScope.selectedTrack().id);
      var win = window.open(dlUrl, '_blank');
    });

    $("#likeButton").click(function () {
      console.log('liking track');
      console.log($rootScope.selectedTrack());
      var track = $rootScope.selectedTrack();
      if (track.starred) {
        $rootScope.subsonic.unstar($rootScope.selectedTrack().id).then(function (result) {
          console.log('UnStarred');
          $rootScope.selectedTrack().starred = undefined;
          console.log(result);
          $("#likeButtonIcon").addClass('fa-heart-o');
          $("#likeButtonIcon").removeClass('fa-heart');
          $rootScope.$digest();
        });
      } else {
        $rootScope.subsonic.star($rootScope.selectedTrack().id).then(function (result) {
          console.log('starred');
          $rootScope.selectedTrack().starred = 1;
          $("#likeButtonIcon").removeClass('fa-heart-o');
          $("#likeButtonIcon").addClass('fa-heart');
          $rootScope.$digest();
          console.log(result);
        });
      }

    });

    $rootScope.$on('$routeChangeStart', function ($event, next, current) {
      $(".main-content").css("display", "none");
      $(".loader").css("display", "block");

    });

    $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
      console.log('routeChangeSuccess');
      $rootScope.$broadcast('windowResized');
      $rootScope.$broadcast('menuSizeChange');
    });

    $rootScope.hideLoader = function () {
      $(".loader").css("display", "none");
      $(".main-content").css("display", "block");
    };

    $rootScope.fallbackCopyTextToClipboard = function (text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea);
    };
    $rootScope.copyTextToClipboard = function (text) {
      if (!navigator.clipboard) {
        $rootScope.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
      }, function (err) {
        console.error('Async: Could not copy text: ', err);
      });
    };

    $("#shareButton").click(function () {
      console.log('shareButton');
      $rootScope.subsonic.createShare($rootScope.selectedTrack().id, 'Shared from MediaCenterUI').then(function (result) {
        $('#shareButton').popover({
          animation: true,
          content: 'Success! Url Copied to Clipboard.',
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: 'top'
        }).popover('show');
        var url = result.url.toString();
        $rootScope.copyTextToClipboard(url);
        setTimeout(() => {
          $('#shareButton').popover('hide');
        }, 5000);
      });

    });

    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });

    $("#volumeSlider").on('change', function () {

    });

    $("#volumeSlider").on('input change', function () {
      var level = $rootScope.currentVolume = $('#volumeSlider').val() / 100;
      if ($rootScope.remotePlayerConnected()) {
        $rootScope.remotePlayer.volumeLevel = level;
        $rootScope.remotePlayerController.setVolumeLevel();
      } else {
        MediaService.volume = level;
      }
    });

    $("#clickProgress").click(function (e) {
      var seekto = NaN;

      if ($rootScope.remotePlayerConnected()) {
        var currentMediaDuration = $rootScope.remotePlayer.duration;
        seekto = currentMediaDuration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          $rootScope.remotePlayer.currentTime = seekto;
          $rootScope.remotePlayerController.seek();
        }
      } else {
        var duration = MediaService.duration;
        if (!isFinite(duration))
          duration = $rootScope.selectedTrack().duration;
        seekto = duration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          MediaService.currentTime = seekto;
        }
      }
    });


    $rootScope.socket = __WEBPACK_IMPORTED_MODULE_0_socket_io_client___default()('//' + document.location.hostname + ':' + document.location.port);
    $rootScope.socket.on('ping', function (data) {
      if (data)
        $('#ping').html("<code>Connected: " + JSON.parse(data).date + "</code>");
    });
    $rootScope.socket.on('settings_event', function (data) {
      if (data) {
        console.log('settings event');
        var d = data[0];
        if (d) {
          $rootScope.settings = {
            "subsonic_username": d.subsonic_username,
            "subsonic_password": d.subsonic_password,
            "subsonic_address": d.subsonic_address,
            "subsonic_port": d.subsonic_port,
            "subsonic_use_ssl": d.subsonic_use_ssl,
            "subsonic_include_port_in_url": d.subsonic_include_port_in_url
          };
          $rootScope.$broadcast('settingsReloadedEvent');
          $rootScope.$digest();
          SubsonicService.login();
        }
      }
    });



    $('#body-row .collapse').collapse('hide');

    // Collapse/Expand icon
    $('#collapse-icon').addClass('fa-angle-double-left');

    // Collapse click
    $('[data-toggle=sidebar-colapse]').click(function () {
      $rootScope.SidebarCollapse();
    });

    $rootScope.SidebarCollapse = function () {
      $rootScope.isMenuCollapsed = !$rootScope.isMenuCollapsed;
      $('.menu-collapsed').toggleClass('d-none');
      $('.sidebar-submenu').toggleClass('d-none');
      $('.submenu-icon').toggleClass('d-none');
      $('.list-group').toggleClass('card-5');
      $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');

      // Treating d-flex/d-none on separators with title
      var SeparatorTitle = $('.sidebar-separator-title');
      if (SeparatorTitle.hasClass('d-flex')) {
        SeparatorTitle.removeClass('d-flex');
      } else {
        SeparatorTitle.addClass('d-flex');
      }

      // Collapse/Expand icon
      $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');

      $rootScope.$broadcast('menuSizeChange');
    };

    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $('.list-group li').click(function (e) {
      e.preventDefault();

      $that = $(this);

      $that.parent().find('li').removeClass('active');
      $that.addClass('active');
    });

    jQuery(".list-group").hover(function () {
      jQuery(this).addClass("active");
    },
      function () {
        jQuery(this).removeClass("active");
      });
    $rootScope.socket.emit('load_settings');

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    var windowResized = debounce(function () {
      $rootScope.$broadcast('windowResized');
    }, 25);

    $(window).on('resize', windowResized);


    $rootScope.remoteUpdateInfo = function () {
      if ($rootScope.remotePlayerConnected()) {
        var currentMediaTime = $rootScope.remotePlayer.currentTime;
        var currentMediaDuration = $rootScope.remotePlayer.duration;

        var playPercent = 100 * (currentMediaTime / currentMediaDuration);
        if (!isNaN(playPercent)) {
          $('#subProgress').attr('aria-valuenow', "100").css('width', "100%");
          $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
          $('#mainTimeDisplay').html($rootScope.formatTime(currentMediaTime) + " / " + $rootScope.formatTime(currentMediaDuration));
        }


      }
    };

    $rootScope.startProgressTimer = function () {
      $rootScope.stopProgressTimer();
      $rootScope.timer = setInterval($rootScope.remoteUpdateInfo, 250);
    };

    /**
     * Stops the timer to increment the media progress bar
     */
    $rootScope.stopProgressTimer = function () {
      if ($rootScope.timer) {
        clearInterval($rootScope.timer);
        $rootScope.timer = null;
      }
    };

    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      get: function () {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
      }
    });

    $rootScope.setupRemotePlayer = function () {

      if (!$rootScope.remoteConfigured) {
        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
          function () {
            $rootScope.togglePlayPause($rootScope.remotePlayer.isPaused);
          }
        );

        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
          function () {
            $rootScope.isMuted = $rootScope.remotePlayer.isMuted;
            if ($rootScope.isMuted) {
              vol = 0;
              $('#volumeSlider').val(vol);
            } else {
              vol = $rootScope.remotePlayer.volumeLevel;
              $('#volumeSlider').val(vol * 100);
            }
          }
        );

        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
          function () {
            $('#volumeSlider').val($rootScope.remotePlayer.volumeLevel * 100);
          }
        );

        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
          function () {
            console.log('state change ');
            console.log($rootScope.remotePlayer.playerState);

            if ($rootScope.remotePlayer.playerState === null) {
              if ($rootScope.remotePlayer.savedPlayerState) {
                $rootScope.shouldSeek = true;
                $rootScope.prePlannedSeek = $rootScope.remotePlayer.savedPlayerState.currentTime;
                $rootScope.loadTrack($rootScope.selectedIndex);
                console.log('saved state');
              } else {
                $rootScope.next();
              }
            }
            if ($rootScope.remotePlayer.playerState === 'BUFFERING') {
              $('#mainTimeDisplay').html("Buffering...");
            }
            if ($rootScope.remotePlayer.playerState === 'PLAYING' && $rootScope.shouldSeek) {
              $rootScope.shouldSeek = false;
              $rootScope.remotePlayer.currentTime = $rootScope.prePlannedSeek;
              $rootScope.remotePlayerController.seek();

            }


            if (MediaService.playing) {
              $rootScope.shouldSeek = true;
              $rootScope.prePlannedSeek = MediaService.currentTime;
              MediaService.pause();
              $rootScope.loadTrack($rootScope.selectedIndex);
            }
            $rootScope.isMuted = $rootScope.remotePlayer.isMuted;
            if ($rootScope.isMuted) {
              $('#volumeSlider').val(0);
            } else {
              $('#volumeSlider').val($rootScope.remotePlayer.volumeLevel * 100);
            }

            $rootScope.togglePlayPause();
            // TODO fix resume support
            if ($rootScope.remotePlayer.mediaInfo && $rootScope.remotePlayer.mediaInfo.metadata) {
              //id = $rootScope.remotePlayer.mediaInfo.contentId;

              //id = id.split("&")[6];
              //id = id.substring(3,id.length - 1);

              //$rootScope.subsonic.getSong2(id).then(function (result) {
              //    console.log("getArtistDetails result")
              //    console.log(result)

              //    if (result) {

              //       

              //        $('#artistInfo').html(source.artist);
              //        $('#artistInfo').attr("href", source.artistUrl);
              //        $('#trackInfo').html(source.title);
              //        $('#trackInfo').attr("href", source.albumUrl);

              //        if (source.starred) {
              //            $("#likeButtonIcon").removeClass('heart-o');
              //            $("#likeButtonIcon").addClass('heart');
              //        } else {
              //            $("#likeButtonIcon").removeClass('heart');
              //            $("#likeButtonIcon").addClass('heart-o');
              //        }

              //        $rootScope.togglePlayPause();




              //        $('#nowPlayingImageHolder').attr('src', result.smallImageUrl);
              //        $rootScope.$digest();
              //    }
              //});
            }
          }
        );
        $rootScope.startProgressTimer();
        $rootScope.remoteConfigured = true;
      }
      if ($rootScope.remotePlayerConnected()) {
        if (MediaService.playing) {
          $rootScope.shouldSeek = true;
          $rootScope.prePlannedSeek = MediaService.currentTime;
          MediaService.pause();
          $rootScope.loadTrack($rootScope.selectedIndex);
        }
      }

    };

    $rootScope.setupLocalPlayer = function () {
      $rootScope.stopProgressTimer();
      $rootScope.remoteConfigured = false;
    };

    $rootScope.switchPlayer = function () {
      console.log('switchPlayer');


      if (cast && cast.framework) {
        if ($rootScope.remotePlayerConnected()) {

          $rootScope.setupRemotePlayer();
          return;
        }
      }


      $rootScope.setupLocalPlayer();
    };

    $rootScope.goBack = function () {
      window.history.back();
    };

    $rootScope.checkIfNowPlaying = function (track) {
      var selected = $rootScope.selectedTrack();
      if (selected && track) {
        return track.id === selected.id;
      }
      return false;
    };


    //$rootScope.shuffle = function (array) {
    //  var currentIndex = array.length, temporaryValue, randomIndex;
    //  while (0 !== currentIndex) {
    //    randomIndex = Math.floor(Math.random() * currentIndex);
    //    var existing = array[currentIndex];
    //    var existing2 = array[randomIndex];
    //    if (existing && existing2) {

    //      while (true) {
    //        if (array[randomIndex].artist === array[currentIndex].artist)
    //          randomIndex = Math.floor(Math.random() * currentIndex);
    //        else break;
    //      }
    //    }
    //    currentIndex -= 1;
    //    temporaryValue = array[currentIndex];
    //    array[currentIndex] = array[randomIndex];
    //    array[randomIndex] = temporaryValue;
    //  }
    //  return array;
    //};

    $rootScope.shuffle = function (a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    setTimeout(() => {
      if (ChromecastService.castStatus()) {
        ChromecastService.initializeCast();
      }
    }, 1000);

  }
}

/* harmony default export */ __webpack_exports__["a"] = (ApplicationRun);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(18), __webpack_require__(18)))

/***/ }),

/***/ 358:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[169]);
//# sourceMappingURL=app.js.map