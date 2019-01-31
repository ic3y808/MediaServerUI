webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports) {


var idCounter = 0;

var _ = {

	hasFlash: ((typeof navigator.plugins != 'undefined' &&
		typeof navigator.plugins['Shockwave Flash'] == 'object') ||
		(window.ActiveXObject && (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) !== false)),

	isIE: !!navigator.userAgent.match(/msie/i) ||
		!!navigator.userAgent.match(/Trident\/7\./),

	uniqueId: function(prefix) {
		var id = idCounter++;
		return prefix ? prefix + id : id;
	},

	bind: function(fn, context) {
		return function() { fn.apply(context); };
	},

	on: function(el, type, fn) {
		if (!el) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	off: function(el, type, fn) {
		if (!el) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
			}
		}
	},

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	addClass: function(el, classname) {
		if (el.className.indexOf(classname) === -1) {
			el.className += ' ' + classname;
		}
	},

	css: function(el, props) {
		if (el) {
			for (var key in props) {
				if (typeof props[key] === 'undefined') {
					continue;
				} else if (typeof props[key] == 'number' && !(key == 'zIndex' || key == 'opacity')) {
					if (isNaN(props[key])) {
						continue;
					}
					props[key] = Math.ceil(props[key]) + 'px';
				}
				try {
					el.style[key] = props[key];
				} catch (e) {}
			}
		}
	},

	hexToRgb: function(hex) {
		// Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},

	ajax: function(xmldocpath, completecallback, errorcallback) {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			// IE>7, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else {
			// IE6
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					if (completecallback) {
						completecallback(xmlhttp);
					}
				} else {
					if (errorcallback) {
						errorcallback(xmldocpath);
					}
				}
			}
		};
		try {
			xmlhttp.open('GET', xmldocpath, true);
			xmlhttp.send(null);
		} catch (error) {
			if (errorcallback) {
				errorcallback(xmldocpath);
			}
		}
		return xmlhttp;
	},

	jsonp: function(url, callback, params) {
		
		var query = url.indexOf('?') === -1 ? '?' : '&';
		params = params || {};
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
			}
		}
		
		var jsonp = _.uniqueId('json_call');
		window[jsonp] = function(data) {
			callback(data);
			window[jsonp] = null;
		};
 
		var script = document.createElement('script');
		if (url.indexOf('callback=?') !== -1) {
			script.src = url.replace('callback=?', 'callback='+jsonp) + query.slice(0, -1);
		} else {
			script.src = url + query + 'callback=' + jsonp;
		}
		script.async = true;
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				script.onload = script.onreadystatechange = null;
				if (script && script.parentNode) {
					script.parentNode.removeChild(script);
				}
			}
		};
		
		var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
		// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
		// This arises when a base node is used (#2709 and #4378).
		head.insertBefore(script, head.firstChild);
	},

	getResizeDimensions: function(wid, hei, maxWid, maxHei) {

		var ratio = Math.min(maxWid / wid, maxHei / hei);
		return { width: wid*ratio, height: hei*ratio, ratio: ratio };
	},

	getCropOffsets: function(wid, hei, newWid, newHei) {

		var ratio = [newWid / wid, newHei / hei];
		return ratio[0] < ratio[1] ?
			{ left: (wid - newWid / ratio[1]) * 0.5, top: 0, ratio: ratio[1] } :
			{ top: (hei - newHei / ratio[0]) * 0.5, left: 0, ratio: ratio[0] } ;
	},

	getChildIndex: function(node) {
		var i = 0;
		while ((node = node.previousSibling) !== null) {
			if (node.nodeType === 1) ++i;
		}
		return i;
	}
};

module.exports = _;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


var Signal = __webpack_require__(23);
var _ = __webpack_require__(8);
var Html5 = __webpack_require__(36);
var Modernizr = __webpack_require__(41);

var Api = function (id) {

  var _this = this;
  var player;
  var readyFlag;

  this.id = id;
  this.el = document.getElementById(id);
  this.config = null;

  this.setup = function (options) {

    player = null;
    readyFlag = false;

    var defaultConfig = {
      mode: 'html5',
      flash: 'coverflow.swf',
      width: 480,
      height: 270,
      item: 0,
      backgroundcolor: '000000',
      backgroundopacity: 1,
      wmode: 'window',
      gradientcolor: undefined,
      coverwidth: 150,
      coverheight: 'auto',
      covergap: 40,
      coverangle: 70,
      coverdepth: 170,
      coveroffset: 130,
      fixedsize: false,
      opacitydecrease: 0.1,	//is not enabled in HTML5, too slow on iOS
      reflectionopacity: 0.3,
      reflectionratio: 155,
      reflectionoffset: 0,
      showtext: true,
      textstyle: '.coverflow-text{text-align:center;} .coverflow-text h1{font-size:14px;font-weight:normal;line-height:21px;} .coverflow-text h2{font-size:11px;font-weight:normal;} .coverflow-text a{color:#0000EE;}',
      textoffset: 75,
      tweentime: 0.8,
      rotatedelay: 0,
      focallength: 250,
      framerate: 60,
      mousewheel: true,
      x: 0,
      y: 0
    };

    this.events = {
      ready: new Signal(),
      playlist: new Signal(),
      focus: new Signal(),
      click: new Signal()
    };

    this.config = _.extend(defaultConfig, options);
    this.config.id = this.id;

    this.el = document.getElementById(id);
    this.el.innerHTML = '';
    this.el.tabIndex = 0;
    _.addClass(this.el, 'coverflow');

    if (String(this.config.width).indexOf('%') !== -1) {
      _.off(window, 'resize', resizeHandler);
      _.on(window, 'resize', resizeHandler);
    }

    this.resize(this.config.width, this.config.height);

    if (this.getMode() === 'html5') {
      player = new Html5(this);
    } else if (this.getMode() === 'flash') {
      player = new Flash(this);
    }

    this.left = player.left;
    this.right = player.right;
    this.prev = player.prev;
    this.next = player.next;
    this.to = player.to;

    return this;
  };

  this.remove = function () {
    var replacement = document.createElement('div');
    replacement.id = this.id;
    this.el.parentNode.replaceChild(replacement, this.el);
    this.el = replacement;

    _.off(window, 'resize', resizeHandler);
    if (player) player.destroy();

    delete players[this.id];
  };

  function resizeHandler() {
    _this.resize();
  }

  this.resize = function (wid, hei) {

    _.css(this.el, {
      width: wid,
      height: hei
    });

    this.config.width = this.el.clientWidth;
    this.config.height = this.el.clientHeight;

    if (player) {
      player.resize(this.config.width, this.config.height);
    }
  };

  this.getMode = function () {
    if (_.hasFlash && this.config.mode === 'flash') {
      return 'flash';
    }
    if (!_.isIE && Modernizr.csstransforms3d && Modernizr.csstransitions && Modernizr.canvas) {
      return 'html5';
    }
    return 'flash';
  };

  this.on = function (event, func) {
    this.events[event].on(func);
    if (readyFlag && event === 'ready') {
      this.events.ready.trigger.apply(this);
    }
    return this;
  };

  this.off = function (event, func) {
    this.events[event].off(func);
    return this;
  };

  this.trigger = function (event) {
    readyFlag = true;
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    this.events[event].trigger.apply(this, args);
  };
};

module.exports = Api;

/***/ }),
/* 23 */
/***/ (function(module, exports) {


var Signal = function() {
	var callbacks = [];

	this.on = function(func) {
		callbacks.push(func);
		return this;
	};

	this.trigger = function() {
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0; i < callbacks.length; i++) {
			if (typeof callbacks[i] === 'function') {
				callbacks[i].apply(this, args);
			}
		}
		return this;
	};

	this.off = function(func) {
		if (func) {
			for (var i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === func) {
					callbacks.splice(i, 1);
					i--;
				}
			}
		} else {
			callbacks = [];
		}
		return this;
	};
};
module.exports = Signal;

/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 35 */
/***/ (function(module, exports) {

(function() {var e=function(a){return!!document.currentScript&&(-1!=document.currentScript.src.indexOf("?"+a)||-1!=document.currentScript.src.indexOf("&"+a))},f=e("loadGamesSDK")?"/cast_game_sender.js":"/cast_sender.js",g=e("loadCastFramework")||e("loadCastApplicationFramework"),h=function(){return"function"==typeof window.__onGCastApiAvailable?window.__onGCastApiAvailable:null},k=["pkedcjkdefgpdelpbcmbmeomcjbeemfm","enhhojjnijigcajfphajepfemndkmdlo"],m=function(a){a.length?l(a.shift(),function(){m(a)}):n()},
p=function(a){return"chrome-extension://"+a+f},l=function(a,c,b){var d=document.createElement("script");d.onerror=c;b&&(d.onload=b);d.src=a;(document.head||document.documentElement).appendChild(d)},q=function(a){return 0<=window.navigator.userAgent.indexOf(a)},n=function(){var a=h();a&&a(!1,"No cast extension found")},r=function(){if(g){var a=2,c=h(),b=function(){a--;0==a&&c&&c(!0)};window.__onGCastApiAvailable=b;l("//www.gstatic.com/cast/sdk/libs/sender/1.0/cast_framework.js",n,b)}};if(q("CriOS")){var t=window.__gCrWeb&&window.__gCrWeb.message&&window.__gCrWeb.message.invokeOnHost;t&&(r(),t({command:"cast.sender.init"}))}else if(q("Android")&&q("Chrome/")&&window.navigator.presentation){r();var u=window.navigator.userAgent.match(/Chrome\/([0-9]+)/);m(["//www.gstatic.com/eureka/clank/"+(u?parseInt(u[1],10):0)+f,"//www.gstatic.com/eureka/clank"+f])}else window.chrome&&window.navigator.presentation&&!q("Edge")?(r(),m(k.map(p))):n();})();

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {


var _ = __webpack_require__(8);
var PlaylistLoader = __webpack_require__(37);
var CoverFlow = __webpack_require__(142);

var Html5 = function(api) {

	var _this = this;

	var div = api.el;
	var config = api.config;
	var playlist;
	var coverFlow;
	var textField;

	var rotateInterval;

	function setup() {
		
		var styleElement = document.createElement('style');
		styleElement.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleElement);
		styleElement.appendChild(document.createTextNode(config.textstyle));

		var rgb = _.hexToRgb(config.backgroundcolor);
		config.backgroundcolor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + config.backgroundopacity + ')';
		div.style.backgroundColor = config.backgroundcolor;

		if (config.gradientcolor !== undefined) {
			rgb = _.hexToRgb(config.gradientcolor);
			config.gradientcolor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + config.backgroundopacity + ')';
			div.style.background = '-webkit-gradient(linear, left top, left bottom, from(' + config.gradientcolor + '), to(' + config.backgroundcolor + '))';
		}

		api.trigger('ready');
		
		api.events.playlist.on(playlistLoaded);
		var loader = new PlaylistLoader(api);
		loader.load(api.config.playlist);
	}

	function playlistLoaded(p) {
		playlist = p;

		if (config.rotatedelay > 0) {
			//must be before coverFlow is created, event order
			div.addEventListener('touchstart', _this.stopRotation, true);
			div.addEventListener('mousedown', _this.stopRotation, true);
			div.addEventListener('keydown', _this.stopRotation, true);
		}
		
		config.coverheight = config.coverheight == 'auto' ? config.height : config.coverheight;
		
    if (coverFlow) coverFlow.destroy();

    if (textField) div.removeChild(textField);
		if (config.showtext === true) {
			textField = document.createElement('div');
			_.addClass(textField, 'coverflow-text');
			div.appendChild(textField);
    }
    
		coverFlow = new CoverFlow(div, playlist, config);
		div.appendChild(coverFlow.el);

	

		coverFlow.on('focus', coverFocus);
		coverFlow.on('click', coverClick);
		coverFlow.to(config.item);

		_this.resize(config.width, config.height);

		if (config.rotatedelay > 0) {
			_this.stopRotation();
			rotateInterval = setInterval(rotateHandler, config.rotatedelay);
		}

		if (config.mousewheel) {
			div.addEventListener('mousewheel', scrollOnMousewheel);
			div.addEventListener('DOMMouseScroll', scrollOnMousewheel);
		}
	}

	function scrollOnMousewheel(e) {
		e.preventDefault();

		_this.stopRotation();
		
		var delta = e.detail ? e.detail * (-120) : e.wheelDelta;
		var count = Math.ceil(Math.abs(delta) / 120);
		if (count > 0) {
			var sign = Math.abs(delta) / delta;
			var func = null;
			if (sign > 0) func = _this.left;
			else if (sign < 0) func = _this.right;
			if (typeof func === 'function') {
				for (var i = 0; i < count; i++) func();
			}
		}
	}

	function coverFocus(index) {
		if (config.showtext === true) {
			var d = playlist[index];
			if (d) {
				textField.innerHTML = '<h1>' + (d.title === undefined ? '' : d.title) + 
				'</h1><h2>' + (d.description === undefined ? '' : d.description) + '</h2>';
			}
		}

		api.trigger('focus', index, playlist[index] ? playlist[index].link : undefined);
	}

	function coverClick(index) {
		_this.stopRotation();
		
		api.trigger('click', index, playlist[index] ? playlist[index].link : undefined);
	}

	this.stopRotation = function() {
		if (rotateInterval) {
			div.removeEventListener('touchstart', _this.stopRotation, true);
			div.removeEventListener('mousedown', _this.stopRotation, true);
			div.removeEventListener('keydown', _this.stopRotation, true);
			clearInterval(rotateInterval);
			rotateInterval = false;
		}
	};
		
	function rotateHandler() {
		coverFlow.next();
	}

	this.resize = function(wid, hei) {

		if (coverFlow) {
			coverFlow.resize(wid, hei);
		}

		if (textField) {
		//	textField.style.top = (hei - config.textoffset) + 'px';
		}
	};

	this.left = function() {
		_this.stopRotation();
		coverFlow.left();
	};
	this.right = function() {
		_this.stopRotation();
		coverFlow.right();
	};
	this.prev = function() {
		_this.stopRotation();
		coverFlow.prev();
	};
	this.next = function() {
		_this.stopRotation();
		coverFlow.next();
	};
	this.to = function(index) {
		_this.stopRotation();
		coverFlow.to(index);
	};
	this.destroy = function() {
		if (coverFlow) coverFlow.destroy();
	};

	setup();
};

module.exports = Html5;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(_) {

var PlaylistLoader = function(api) {

	var config = api.config;

	this.load = function(p) {
		if (typeof p === 'string') {
			if (p.indexOf('callback=?') !== -1) {
				_.jsonp(p, jsonpLoaded);
			} else {
				_.ajax(p, ajaxLoaded);
			}
		} else if (typeof p === 'object') {
			api.events.playlist.trigger(p);
			api.events.playlist.off();
		}
	};

	function jsonpLoaded(json) {

		var playlist = [];
		if (config.hasOwnProperty('route')) {
			if (config.route.hasOwnProperty('playlist')) {
				json = json[config.route.playlist];
			}

			for (var i = 0; i < json.length; i++) {
				playlist[i] = {
					image: findJsonValue(json[i], 'image'),
					title: findJsonValue(json[i], 'title'),
					description: findJsonValue(json[i], 'description'),
					link: findJsonValue(json[i], 'link'),
					duration: findJsonValue(json[i], 'duration')
				};
			}
		}

		api.events.playlist.trigger(playlist);
		api.events.playlist.off();
	}

	function findJsonValue(obj, type) {
		if (config.route.hasOwnProperty(type)) {
			var value = obj;
			var keys = config.route[type].split('.');
			for (var i = 0; i < keys.length; i++) {
				value = value[keys[i]];
			}
			return value;
		} else {
			return obj[type];
		}
	}
	
	function ajaxLoaded(xmlhttp) {
		var playlist = JSON.parse(xmlhttp.responseText);
		api.events.playlist.trigger(playlist);
		api.events.playlist.off();
	}
};

module.exports = PlaylistLoader;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 38 */
/***/ (function(module, exports) {


var Controller = function(flow, elem, config) {
	this.flow = flow;
	this.elem = elem;
	this.config = config;
	
	this.currentX = 0;
	this.currentY = 0;
	//this.transformProp = Modernizr.prefixed('transitionDuration');
};

Controller.prototype.handleEvent = function(e) {
	this[e.type](e);
};

Controller.prototype.touchstart = function(e) {
	e.stopImmediatePropagation();
	this.startX = e.touches[0].pageX - this.currentX;
	this.startY = e.touches[0].pageY - this.currentY;
	this.pageY = e.touches[0].pageY;
	this.moved = false;
	window.addEventListener('touchmove', this, true);
	window.addEventListener('touchend', this, true);
	this.elem.style[this.transformProp] = '0s';
};

Controller.prototype.touchmove = function(e) {
	e.stopImmediatePropagation();

	this.lastX = this.currentX;
	this.lastY = this.currentY;
	this.currentX = e.touches[0].pageX - this.startX;
	this.currentY = e.touches[0].pageY - this.startY;

	if (Math.abs(this.currentX - this.lastX) > Math.abs(this.currentY - this.lastY)) {
		e.preventDefault();
		this.moved = true;

		this.lastMoveTime = new Date().getTime();
		this.flow.update(this.currentX);
	} else {
		window.removeEventListener('touchmove', this, true);
		window.removeEventListener('touchend', this, true);	
	}
};

Controller.prototype.touchend = function(e) {
	e.stopImmediatePropagation();
	e.preventDefault();

	window.removeEventListener('touchmove', this, true);
	window.removeEventListener('touchend', this, true);

	this.elem.style[this.transformProp] = this.config.tweentime + 's';

	if (this.moved) {
		var delta = this.currentX - this.lastX;
		var dt = new Date().getTime() - this.lastMoveTime + 1;
		
		this.currentX = this.currentX + delta * 50 / dt;
		this.flow.updateTouchEnd(this);
	} else {
		this.flow.tap(e, this.currentX);
	}
};

Controller.prototype.to = function(index) {
	this.currentX = -index * this.config.covergap;
	this.flow.update(this.currentX);
};

module.exports = Controller;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(8);

var Cover = function(flow, index, url, config) {

	var _this = this;

	var newWidth;
	var newHeight;
	
	this.index = index;
	this.halfHeight = 0;
	
	this.el = document.createElement('div');
	this.el.className = Cover.getClassName();
	var cellStyle = this.el.style;
	if (config.backgroundopacity === 1) {
		cellStyle.backgroundColor = config.backgroundcolor;
	}
	
	var bitmap = document.createElement('canvas');
	this.el.appendChild(bitmap);

	var image = new Image();
	image.onload = onComplete;
	image.src = url;
	
	function onComplete() {

		var wid = image.width;
		var hei = image.height;
			
		var cropTop = 0;
		var cropLeft = 0;
		
		// calculate the image size, ratio values
		if (config.fixedsize) {
			newWidth = Math.round(config.coverwidth);
			newHeight = Math.round(config.coverheight);
			var off = _.getCropOffsets(wid, hei, newWidth, newHeight);
			cropLeft = Math.round(off.left);
			cropTop = Math.round(off.top);
		} else {
			var fit = _.getResizeDimensions(wid, hei, config.coverwidth, config.coverheight);
			newWidth = Math.round(fit.width);
			newHeight = Math.round(fit.height);
		}
		
		_this.width = newWidth;
		_this.height = newHeight;
		_this.halfHeight = newHeight;
		
		cellStyle.top = -(newHeight * 0.5) + 'px';
		cellStyle.left = -(newWidth * 0.5) + 'px';
		cellStyle.width = newWidth + 'px';
		cellStyle.height = newHeight + 'px';

		bitmap.width = newWidth;
		bitmap.height = newHeight * 2;
		var ctx = bitmap.getContext('2d');
		ctx.drawImage(image, cropLeft, cropTop, wid-2*cropLeft, hei-2*cropTop, 0, 0, newWidth, newHeight);

		if (config.reflectionopacity > 0) {
			cellStyle.height = (newHeight * 2) + 'px';
			Cover.reflect(bitmap, newWidth, newHeight, config.reflectionopacity, config.reflectionratio, config.reflectionoffset);
		}
	
		flow.itemComplete(newHeight);
	}
	
	this.setY = function(maxCoverHeight) {
		var offsetY = maxCoverHeight * 0.5 - (maxCoverHeight - newHeight);
		this.el.style.top = -offsetY + 'px';
	};
};

Cover.getClassName = function() {
	return 'coverflow-cell';
};

Cover.reflect = function(bitmap, wid, hei, reflectOpacity, reflectRatio, reflectOffset) {

	var ctx = bitmap.getContext('2d');
	ctx.save();
	ctx.scale(1, -1);
	ctx.drawImage(bitmap, 0, -hei*2 - reflectOffset);
	ctx.restore();
	ctx.globalCompositeOperation = 'destination-out';

	var gradient = ctx.createLinearGradient(0, 0, 0, hei);
	gradient.addColorStop(reflectRatio/255, 'rgba(255, 255, 255, 1.0)');
	gradient.addColorStop(0, 'rgba(255, 255, 255, ' + (1 - reflectOpacity) + ')');
	ctx.translate(0, hei + reflectOffset);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, wid, hei);
};

module.exports = Cover;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


var _ = __webpack_require__(8);

var Hit = function(flow, index, config) {
	
	this.index = index;
	
	this.el = document.createElement('div');
	this.el.className = Hit.getClassName();

	this.resize(config.coverwidth, config.coverheight);

	this.setY = function(maxCoverHeight) {
		var offsetY = maxCoverHeight * 0.5 - (maxCoverHeight - this.height);
		this.el.style.top = -offsetY + 'px';
	};
};

Hit.prototype.resize = function(wid, hei) {

	this.height = hei;

	_.css(this.el, {
		backgroundColor: '#00ff00',
		width: wid,
		height: hei,
		top: -hei * 0.5,
		left: -wid * 0.5
	});
};

Hit.getClassName = function() {
	return 'coverflow-hit';
};

module.exports = Hit;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

/*** IMPORTS FROM imports-loader ***/
(function() {

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms3d-csstransitions-canvas-canvastext-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},p.canvastext=function(){return!!e.canvas&&!!A(b.createElement("canvas").getContext("2d").fillText,"function")},p.csstransforms3d=function(){var a=!!E("perspective");return a&&"webkitPerspective"in f.style&&v("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},p.csstransitions=function(){return E("transition")};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document);


/*** EXPORTS FROM exports-loader ***/
module.exports = window.Modernizr;
}.call(window));

/***/ }),
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto_js__);


class AppUtilities {
  constructor($rootScope, $timeout) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$rootScope.goBack = this.goBack;
    this.$rootScope.getBackgroundStyle = this.getBackgroundStyle;
    this.$rootScope.apply = this.apply;
    this.$rootScope.updateGridRows = this.updateGridRows;

    this.$rootScope.decryptPassword = this.decryptPassword;
    this.$rootScope.formatTime = this.formatTime;
  }

  broadcast(e, d) {
    this.$rootScope.$broadcast(e, d);
  }

  apply() {
    if (!this.$rootScope.$$phase) {
      //$digest or $apply
      this.$rootScope.$digest();
    }
  }

  goBack() {
    window.history.back();
  }

  getBackgroundStyle(imagepath) {
    return {
      'background-image': 'url(' + imagepath + ')'
    }
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  showLoader() {
    $("#root.root").css("display", "none");
    $(".loader").css("display", "block");
  }

  hideLoader() {
    $(".loader").css("display", "none");
    $("#root.root").css("display", "initial");
  }

  setContentBackground(img) {
    if (img) {
      var bgUrl = img.replace('300x300', Math.round($('.art-backdrop').width()) + 'x' + Math.round($('.art-backdrop').height()));
      $('.art-backdrop').css('background-image', 'url(' + bgUrl + ')');
      this.apply();
    }
  }

  resetContentBackground() {
    $('.art-backdrop').css('background-image', 'url("")');
  }

  updateGridRows(gridOptions) {
    this.$timeout(function () {
      if (gridOptions && gridOptions.api) {
        gridOptions.api.redrawRows({
          force: true
        });
        gridOptions.api.doLayout();
        gridOptions.api.sizeColumnsToFit();
      }
    });
  }

  showNoRows(gridOptions) {
    if (gridOptions && gridOptions.api) {
      gridOptions.api.showNoRowsOverlay();
    }
  }

  setRowData(gridOptions, data) {
    if (gridOptions && gridOptions.api) {
      gridOptions.api.setRowData(data);
      this.updateGridRows(gridOptions);
    }
  }

  fallbackCopyTextToClipboard(text) {
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
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

  msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  debounce(func, wait, immediate) {
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

  encryptPassword(pass) {
    return __WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.AES.encrypt(pass, "12345").toString();

  }

  decryptPassword(pass) {
    return __WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.AES.decrypt(pass, "12345").toString(__WEBPACK_IMPORTED_MODULE_0_crypto_js___default.a.enc.Utf8);
  }

  //shuffle(array) {
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
  //}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AppUtilities;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_route__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_route___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_route__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_index__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_popper_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_tooltip_js__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angular_bootstrap_contextmenu_contextMenu__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angular_bootstrap_contextmenu_contextMenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_angular_bootstrap_contextmenu_contextMenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jquery_flipster__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jquery_flipster___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_jquery_flipster__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_moment__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_typeface_roboto__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_typeface_roboto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_typeface_roboto__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_angular_sanitize__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_angular_sanitize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_angular_sanitize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_bootstrap_js_dist_carousel__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_bootstrap_js_dist_carousel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_bootstrap_js_dist_carousel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_bootstrap_js_dist_collapse__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_bootstrap_js_dist_collapse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_bootstrap_js_dist_collapse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_bootstrap_js_dist_popover__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_bootstrap_js_dist_popover___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_bootstrap_js_dist_popover__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_bootstrap_js_dist_tooltip__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_bootstrap_js_dist_tooltip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_bootstrap_js_dist_tooltip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_bootstrap_js_dist_util__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_bootstrap_js_dist_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_bootstrap_js_dist_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__API_alloy_db__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__API_alloy_db___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__API_alloy_db__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__API_cast_framework__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__API_cast_framework___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__API_cast_framework__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__API_cast_v1__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__API_cast_v1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__API_cast_v1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__API_angular_auto_complete__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__API_angular_auto_complete___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__API_angular_auto_complete__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__API_coverflow_index__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__API_coverflow_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__API_coverflow_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__directives__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__services__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__factories__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__config_js__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__run_js__ = __webpack_require__(284);


__webpack_require__.p = "http://localhost:" + 3000 + "/";









  







 









$('[data-toggle="popover"]').popover();

__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('alloy', [__WEBPACK_IMPORTED_MODULE_1_angular_route___default.a, 'ngSanitize', 'autoCompleteModule', 'ui.bootstrap.contextMenu', __WEBPACK_IMPORTED_MODULE_21__directives__["a" /* default */].name, __WEBPACK_IMPORTED_MODULE_22__components__["a" /* default */].name, __WEBPACK_IMPORTED_MODULE_24__factories__["a" /* default */].name, __WEBPACK_IMPORTED_MODULE_23__services__["a" /* default */].name])
  .config(__WEBPACK_IMPORTED_MODULE_25__config_js__["a" /* default */])
  .run(__WEBPACK_IMPORTED_MODULE_26__run_js__["a" /* default */]);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap_scss__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bootstrap_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fontawesome_scss__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fontawesome_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__fontawesome_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery_flipster_dist_jquery_flipster_min_css__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery_flipster_dist_jquery_flipster_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery_flipster_dist_jquery_flipster_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__glidejs_glide_dist_css_glide_core_min_css__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__glidejs_glide_dist_css_glide_core_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__glidejs_glide_dist_css_glide_core_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_autocomplete_scss__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_autocomplete_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__angular_autocomplete_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_scss__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__base_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_scss__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__mixins_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__loader_scss__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__loader_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__loader_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__debug_scss__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__debug_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__debug_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ui_pagecontainer_scss__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ui_pagecontainer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__ui_pagecontainer_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ui_pageheader_scss__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ui_pageheader_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__ui_pageheader_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ui_pagecontent_scss__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ui_pagecontent_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__ui_pagecontent_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ui_pagetoolbar_scss__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ui_pagetoolbar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__ui_pagetoolbar_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ui_tables_scss__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ui_tables_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__ui_tables_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ui_jumpbar_scss__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ui_jumpbar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__ui_jumpbar_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ui_detaillabel_scss__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ui_detaillabel_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__ui_detaillabel_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ui_expander_scss__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ui_expander_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__ui_expander_scss__);
//import 'bootstrap/dist/css/bootstrap.min.css';











//ui components









/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./bootstrap.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./bootstrap.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n:root {\n  --blue: #007bff;\n  --indigo: #6610f2;\n  --purple: #6f42c1;\n  --pink: #e83e8c;\n  --red: #dc3545;\n  --orange: #fd7e14;\n  --yellow: #ffc107;\n  --green: #28a745;\n  --teal: #20c997;\n  --cyan: #17a2b8;\n  --white: #fff;\n  --gray: #6c757d;\n  --gray-dark: #343a40;\n  --primary: #007bff;\n  --secondary: #6c757d;\n  --success: #28a745;\n  --info: #17a2b8;\n  --warning: #ffc107;\n  --danger: #dc3545;\n  --light: #f8f9fa;\n  --dark: #343a40;\n  --breakpoint-xs: 0;\n  --breakpoint-sm: 576px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 992px;\n  --breakpoint-xl: 1200px;\n  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\nhtml {\n  font-family: sans-serif;\n  line-height: 1.15;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -ms-overflow-style: scrollbar;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }\n\n@-ms-viewport {\n  width: device-width; }\n\narticle, aside, figcaption, figure, footer, header, hgroup, main, nav, section {\n  display: block; }\n\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  text-align: left;\n  background-color: #fff; }\n\n[tabindex=\"-1\"]:focus {\n  outline: 0 !important; }\n\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: 0.5rem; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nabbr[title],\nabbr[data-original-title] {\n  text-decoration: underline;\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  cursor: help;\n  border-bottom: 0; }\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit; }\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0; }\n\ndt {\n  font-weight: 700; }\n\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0; }\n\nblockquote {\n  margin: 0 0 1rem; }\n\ndfn {\n  font-style: italic; }\n\nb,\nstrong {\n  font-weight: bolder; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -.25em; }\n\nsup {\n  top: -.5em; }\n\na {\n  color: #007bff;\n  text-decoration: none;\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects; }\n  a:hover {\n    color: #0056b3;\n    text-decoration: underline; }\n\na:not([href]):not([tabindex]) {\n  color: inherit;\n  text-decoration: none; }\n  a:not([href]):not([tabindex]):hover, a:not([href]):not([tabindex]):focus {\n    color: inherit;\n    text-decoration: none; }\n  a:not([href]):not([tabindex]):focus {\n    outline: 0; }\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n  font-size: 1em; }\n\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto;\n  -ms-overflow-style: scrollbar; }\n\nfigure {\n  margin: 0 0 1rem; }\n\nimg {\n  vertical-align: middle;\n  border-style: none; }\n\nsvg {\n  overflow: hidden;\n  vertical-align: middle; }\n\ntable {\n  border-collapse: collapse; }\n\ncaption {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: #6c757d;\n  text-align: left;\n  caption-side: bottom; }\n\nth {\n  text-align: inherit; }\n\nlabel {\n  display: inline-block;\n  margin-bottom: 0.5rem; }\n\nbutton {\n  border-radius: 0; }\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color; }\n\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\nbutton,\ninput {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  padding: 0;\n  border-style: none; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  -webkit-appearance: listbox; }\n\ntextarea {\n  overflow: auto;\n  resize: vertical; }\n\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit;\n  color: inherit;\n  white-space: normal; }\n\nprogress {\n  vertical-align: baseline; }\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n[type=\"search\"] {\n  outline-offset: -2px;\n  -webkit-appearance: none; }\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n::-webkit-file-upload-button {\n  font: inherit;\n  -webkit-appearance: button; }\n\noutput {\n  display: inline-block; }\n\nsummary {\n  display: list-item;\n  cursor: pointer; }\n\ntemplate {\n  display: none; }\n\n[hidden] {\n  display: none !important; }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.2;\n  color: inherit; }\n\nh1, .h1 {\n  font-size: 2.5rem; }\n\nh2, .h2 {\n  font-size: 2rem; }\n\nh3, .h3 {\n  font-size: 1.75rem; }\n\nh4, .h4 {\n  font-size: 1.5rem; }\n\nh5, .h5 {\n  font-size: 1.25rem; }\n\nh6, .h6 {\n  font-size: 1rem; }\n\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300; }\n\n.display-1 {\n  font-size: 6rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\n.display-2 {\n  font-size: 5.5rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\n.display-3 {\n  font-size: 4.5rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\n.display-4 {\n  font-size: 3.5rem;\n  font-weight: 300;\n  line-height: 1.2; }\n\nhr {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1); }\n\nsmall,\n.small {\n  font-size: 80%;\n  font-weight: 400; }\n\nmark,\n.mark {\n  padding: 0.2em;\n  background-color: #fcf8e3; }\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline-item {\n  display: inline-block; }\n  .list-inline-item:not(:last-child) {\n    margin-right: 0.5rem; }\n\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase; }\n\n.blockquote {\n  margin-bottom: 1rem;\n  font-size: 1.25rem; }\n\n.blockquote-footer {\n  display: block;\n  font-size: 80%;\n  color: #6c757d; }\n  .blockquote-footer::before {\n    content: \"\\2014   \\A0\"; }\n\n.img-fluid {\n  max-width: 100%;\n  height: auto; }\n\n.img-thumbnail {\n  padding: 0.25rem;\n  background-color: #fff;\n  border: 1px solid #dee2e6;\n  border-radius: 0.25rem;\n  max-width: 100%;\n  height: auto; }\n\n.figure {\n  display: inline-block; }\n\n.figure-img {\n  margin-bottom: 0.5rem;\n  line-height: 1; }\n\n.figure-caption {\n  font-size: 90%;\n  color: #6c757d; }\n\ncode {\n  font-size: 87.5%;\n  color: #e83e8c;\n  word-break: break-word; }\n  a > code {\n    color: inherit; }\n\nkbd {\n  padding: 0.2rem 0.4rem;\n  font-size: 87.5%;\n  color: #fff;\n  background-color: #212529;\n  border-radius: 0.2rem; }\n  kbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: 700; }\n\npre {\n  display: block;\n  font-size: 87.5%;\n  color: #212529; }\n  pre code {\n    font-size: inherit;\n    color: inherit;\n    word-break: normal; }\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll; }\n\n.container {\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto; }\n  @media (min-width: 576px) {\n    .container {\n      max-width: 540px; } }\n  @media (min-width: 768px) {\n    .container {\n      max-width: 720px; } }\n  @media (min-width: 992px) {\n    .container {\n      max-width: 960px; } }\n  @media (min-width: 1200px) {\n    .container {\n      max-width: 1140px; } }\n\n.container-fluid {\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto; }\n\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -15px;\n  margin-left: -15px; }\n\n.no-gutters {\n  margin-right: 0;\n  margin-left: 0; }\n  .no-gutters > .col,\n  .no-gutters > [class*=\"col-\"] {\n    padding-right: 0;\n    padding-left: 0; }\n\n.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,\n.col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,\n.col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,\n.col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,\n.col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,\n.col-xl-auto {\n  position: relative;\n  width: 100%;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px; }\n\n.col {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%; }\n\n.col-auto {\n  flex: 0 0 auto;\n  width: auto;\n  max-width: none; }\n\n.col-1 {\n  flex: 0 0 8.33333%;\n  max-width: 8.33333%; }\n\n.col-2 {\n  flex: 0 0 16.66667%;\n  max-width: 16.66667%; }\n\n.col-3 {\n  flex: 0 0 25%;\n  max-width: 25%; }\n\n.col-4 {\n  flex: 0 0 33.33333%;\n  max-width: 33.33333%; }\n\n.col-5 {\n  flex: 0 0 41.66667%;\n  max-width: 41.66667%; }\n\n.col-6 {\n  flex: 0 0 50%;\n  max-width: 50%; }\n\n.col-7 {\n  flex: 0 0 58.33333%;\n  max-width: 58.33333%; }\n\n.col-8 {\n  flex: 0 0 66.66667%;\n  max-width: 66.66667%; }\n\n.col-9 {\n  flex: 0 0 75%;\n  max-width: 75%; }\n\n.col-10 {\n  flex: 0 0 83.33333%;\n  max-width: 83.33333%; }\n\n.col-11 {\n  flex: 0 0 91.66667%;\n  max-width: 91.66667%; }\n\n.col-12 {\n  flex: 0 0 100%;\n  max-width: 100%; }\n\n.order-first {\n  order: -1; }\n\n.order-last {\n  order: 13; }\n\n.order-0 {\n  order: 0; }\n\n.order-1 {\n  order: 1; }\n\n.order-2 {\n  order: 2; }\n\n.order-3 {\n  order: 3; }\n\n.order-4 {\n  order: 4; }\n\n.order-5 {\n  order: 5; }\n\n.order-6 {\n  order: 6; }\n\n.order-7 {\n  order: 7; }\n\n.order-8 {\n  order: 8; }\n\n.order-9 {\n  order: 9; }\n\n.order-10 {\n  order: 10; }\n\n.order-11 {\n  order: 11; }\n\n.order-12 {\n  order: 12; }\n\n.offset-1 {\n  margin-left: 8.33333%; }\n\n.offset-2 {\n  margin-left: 16.66667%; }\n\n.offset-3 {\n  margin-left: 25%; }\n\n.offset-4 {\n  margin-left: 33.33333%; }\n\n.offset-5 {\n  margin-left: 41.66667%; }\n\n.offset-6 {\n  margin-left: 50%; }\n\n.offset-7 {\n  margin-left: 58.33333%; }\n\n.offset-8 {\n  margin-left: 66.66667%; }\n\n.offset-9 {\n  margin-left: 75%; }\n\n.offset-10 {\n  margin-left: 83.33333%; }\n\n.offset-11 {\n  margin-left: 91.66667%; }\n\n@media (min-width: 576px) {\n  .col-sm {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-sm-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-sm-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-sm-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-sm-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-sm-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-sm-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-sm-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-sm-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-sm-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-sm-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-sm-first {\n    order: -1; }\n  .order-sm-last {\n    order: 13; }\n  .order-sm-0 {\n    order: 0; }\n  .order-sm-1 {\n    order: 1; }\n  .order-sm-2 {\n    order: 2; }\n  .order-sm-3 {\n    order: 3; }\n  .order-sm-4 {\n    order: 4; }\n  .order-sm-5 {\n    order: 5; }\n  .order-sm-6 {\n    order: 6; }\n  .order-sm-7 {\n    order: 7; }\n  .order-sm-8 {\n    order: 8; }\n  .order-sm-9 {\n    order: 9; }\n  .order-sm-10 {\n    order: 10; }\n  .order-sm-11 {\n    order: 11; }\n  .order-sm-12 {\n    order: 12; }\n  .offset-sm-0 {\n    margin-left: 0; }\n  .offset-sm-1 {\n    margin-left: 8.33333%; }\n  .offset-sm-2 {\n    margin-left: 16.66667%; }\n  .offset-sm-3 {\n    margin-left: 25%; }\n  .offset-sm-4 {\n    margin-left: 33.33333%; }\n  .offset-sm-5 {\n    margin-left: 41.66667%; }\n  .offset-sm-6 {\n    margin-left: 50%; }\n  .offset-sm-7 {\n    margin-left: 58.33333%; }\n  .offset-sm-8 {\n    margin-left: 66.66667%; }\n  .offset-sm-9 {\n    margin-left: 75%; }\n  .offset-sm-10 {\n    margin-left: 83.33333%; }\n  .offset-sm-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 768px) {\n  .col-md {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-md-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-md-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-md-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-md-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-md-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-md-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-md-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-md-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-md-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-md-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-md-first {\n    order: -1; }\n  .order-md-last {\n    order: 13; }\n  .order-md-0 {\n    order: 0; }\n  .order-md-1 {\n    order: 1; }\n  .order-md-2 {\n    order: 2; }\n  .order-md-3 {\n    order: 3; }\n  .order-md-4 {\n    order: 4; }\n  .order-md-5 {\n    order: 5; }\n  .order-md-6 {\n    order: 6; }\n  .order-md-7 {\n    order: 7; }\n  .order-md-8 {\n    order: 8; }\n  .order-md-9 {\n    order: 9; }\n  .order-md-10 {\n    order: 10; }\n  .order-md-11 {\n    order: 11; }\n  .order-md-12 {\n    order: 12; }\n  .offset-md-0 {\n    margin-left: 0; }\n  .offset-md-1 {\n    margin-left: 8.33333%; }\n  .offset-md-2 {\n    margin-left: 16.66667%; }\n  .offset-md-3 {\n    margin-left: 25%; }\n  .offset-md-4 {\n    margin-left: 33.33333%; }\n  .offset-md-5 {\n    margin-left: 41.66667%; }\n  .offset-md-6 {\n    margin-left: 50%; }\n  .offset-md-7 {\n    margin-left: 58.33333%; }\n  .offset-md-8 {\n    margin-left: 66.66667%; }\n  .offset-md-9 {\n    margin-left: 75%; }\n  .offset-md-10 {\n    margin-left: 83.33333%; }\n  .offset-md-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 992px) {\n  .col-lg {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-lg-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-lg-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-lg-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-lg-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-lg-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-lg-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-lg-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-lg-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-lg-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-lg-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-lg-first {\n    order: -1; }\n  .order-lg-last {\n    order: 13; }\n  .order-lg-0 {\n    order: 0; }\n  .order-lg-1 {\n    order: 1; }\n  .order-lg-2 {\n    order: 2; }\n  .order-lg-3 {\n    order: 3; }\n  .order-lg-4 {\n    order: 4; }\n  .order-lg-5 {\n    order: 5; }\n  .order-lg-6 {\n    order: 6; }\n  .order-lg-7 {\n    order: 7; }\n  .order-lg-8 {\n    order: 8; }\n  .order-lg-9 {\n    order: 9; }\n  .order-lg-10 {\n    order: 10; }\n  .order-lg-11 {\n    order: 11; }\n  .order-lg-12 {\n    order: 12; }\n  .offset-lg-0 {\n    margin-left: 0; }\n  .offset-lg-1 {\n    margin-left: 8.33333%; }\n  .offset-lg-2 {\n    margin-left: 16.66667%; }\n  .offset-lg-3 {\n    margin-left: 25%; }\n  .offset-lg-4 {\n    margin-left: 33.33333%; }\n  .offset-lg-5 {\n    margin-left: 41.66667%; }\n  .offset-lg-6 {\n    margin-left: 50%; }\n  .offset-lg-7 {\n    margin-left: 58.33333%; }\n  .offset-lg-8 {\n    margin-left: 66.66667%; }\n  .offset-lg-9 {\n    margin-left: 75%; }\n  .offset-lg-10 {\n    margin-left: 83.33333%; }\n  .offset-lg-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 1200px) {\n  .col-xl {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-xl-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-xl-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-xl-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-xl-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-xl-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-xl-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-xl-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-xl-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-xl-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-xl-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-xl-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-xl-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-xl-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-xl-first {\n    order: -1; }\n  .order-xl-last {\n    order: 13; }\n  .order-xl-0 {\n    order: 0; }\n  .order-xl-1 {\n    order: 1; }\n  .order-xl-2 {\n    order: 2; }\n  .order-xl-3 {\n    order: 3; }\n  .order-xl-4 {\n    order: 4; }\n  .order-xl-5 {\n    order: 5; }\n  .order-xl-6 {\n    order: 6; }\n  .order-xl-7 {\n    order: 7; }\n  .order-xl-8 {\n    order: 8; }\n  .order-xl-9 {\n    order: 9; }\n  .order-xl-10 {\n    order: 10; }\n  .order-xl-11 {\n    order: 11; }\n  .order-xl-12 {\n    order: 12; }\n  .offset-xl-0 {\n    margin-left: 0; }\n  .offset-xl-1 {\n    margin-left: 8.33333%; }\n  .offset-xl-2 {\n    margin-left: 16.66667%; }\n  .offset-xl-3 {\n    margin-left: 25%; }\n  .offset-xl-4 {\n    margin-left: 33.33333%; }\n  .offset-xl-5 {\n    margin-left: 41.66667%; }\n  .offset-xl-6 {\n    margin-left: 50%; }\n  .offset-xl-7 {\n    margin-left: 58.33333%; }\n  .offset-xl-8 {\n    margin-left: 66.66667%; }\n  .offset-xl-9 {\n    margin-left: 75%; }\n  .offset-xl-10 {\n    margin-left: 83.33333%; }\n  .offset-xl-11 {\n    margin-left: 91.66667%; } }\n\n.table {\n  width: 100%;\n  margin-bottom: 1rem;\n  background-color: transparent; }\n  .table th,\n  .table td {\n    padding: 0.75rem;\n    vertical-align: top;\n    border-top: 1px solid #dee2e6; }\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6; }\n  .table tbody + tbody {\n    border-top: 2px solid #dee2e6; }\n  .table .table {\n    background-color: #fff; }\n\n.table-sm th,\n.table-sm td {\n  padding: 0.3rem; }\n\n.table-bordered {\n  border: 1px solid #dee2e6; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #dee2e6; }\n  .table-bordered thead th,\n  .table-bordered thead td {\n    border-bottom-width: 2px; }\n\n.table-borderless th,\n.table-borderless td,\n.table-borderless thead th,\n.table-borderless tbody + tbody {\n  border: 0; }\n\n.table-striped tbody tr:nth-of-type(odd) {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.table-hover tbody tr:hover {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n.table-primary,\n.table-primary > th,\n.table-primary > td {\n  background-color: #b8daff; }\n\n.table-hover .table-primary:hover {\n  background-color: #9fcdff; }\n  .table-hover .table-primary:hover > td,\n  .table-hover .table-primary:hover > th {\n    background-color: #9fcdff; }\n\n.table-secondary,\n.table-secondary > th,\n.table-secondary > td {\n  background-color: #d6d8db; }\n\n.table-hover .table-secondary:hover {\n  background-color: #c8cbcf; }\n  .table-hover .table-secondary:hover > td,\n  .table-hover .table-secondary:hover > th {\n    background-color: #c8cbcf; }\n\n.table-success,\n.table-success > th,\n.table-success > td {\n  background-color: #c3e6cb; }\n\n.table-hover .table-success:hover {\n  background-color: #b1dfbb; }\n  .table-hover .table-success:hover > td,\n  .table-hover .table-success:hover > th {\n    background-color: #b1dfbb; }\n\n.table-info,\n.table-info > th,\n.table-info > td {\n  background-color: #bee5eb; }\n\n.table-hover .table-info:hover {\n  background-color: #abdde5; }\n  .table-hover .table-info:hover > td,\n  .table-hover .table-info:hover > th {\n    background-color: #abdde5; }\n\n.table-warning,\n.table-warning > th,\n.table-warning > td {\n  background-color: #ffeeba; }\n\n.table-hover .table-warning:hover {\n  background-color: #ffe8a1; }\n  .table-hover .table-warning:hover > td,\n  .table-hover .table-warning:hover > th {\n    background-color: #ffe8a1; }\n\n.table-danger,\n.table-danger > th,\n.table-danger > td {\n  background-color: #f5c6cb; }\n\n.table-hover .table-danger:hover {\n  background-color: #f1b0b7; }\n  .table-hover .table-danger:hover > td,\n  .table-hover .table-danger:hover > th {\n    background-color: #f1b0b7; }\n\n.table-light,\n.table-light > th,\n.table-light > td {\n  background-color: #fdfdfe; }\n\n.table-hover .table-light:hover {\n  background-color: #ececf6; }\n  .table-hover .table-light:hover > td,\n  .table-hover .table-light:hover > th {\n    background-color: #ececf6; }\n\n.table-dark,\n.table-dark > th,\n.table-dark > td {\n  background-color: #c6c8ca; }\n\n.table-hover .table-dark:hover {\n  background-color: #b9bbbe; }\n  .table-hover .table-dark:hover > td,\n  .table-hover .table-dark:hover > th {\n    background-color: #b9bbbe; }\n\n.table-active,\n.table-active > th,\n.table-active > td {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n.table-hover .table-active:hover {\n  background-color: rgba(0, 0, 0, 0.075); }\n  .table-hover .table-active:hover > td,\n  .table-hover .table-active:hover > th {\n    background-color: rgba(0, 0, 0, 0.075); }\n\n.table .thead-dark th {\n  color: #fff;\n  background-color: #212529;\n  border-color: #32383e; }\n\n.table .thead-light th {\n  color: #495057;\n  background-color: #e9ecef;\n  border-color: #dee2e6; }\n\n.table-dark {\n  color: #fff;\n  background-color: #212529; }\n  .table-dark th,\n  .table-dark td,\n  .table-dark thead th {\n    border-color: #32383e; }\n  .table-dark.table-bordered {\n    border: 0; }\n  .table-dark.table-striped tbody tr:nth-of-type(odd) {\n    background-color: rgba(255, 255, 255, 0.05); }\n  .table-dark.table-hover tbody tr:hover {\n    background-color: rgba(255, 255, 255, 0.075); }\n\n@media (max-width: 575.98px) {\n  .table-responsive-sm {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-sm > .table-bordered {\n      border: 0; } }\n\n@media (max-width: 767.98px) {\n  .table-responsive-md {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-md > .table-bordered {\n      border: 0; } }\n\n@media (max-width: 991.98px) {\n  .table-responsive-lg {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-lg > .table-bordered {\n      border: 0; } }\n\n@media (max-width: 1199.98px) {\n  .table-responsive-xl {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: -ms-autohiding-scrollbar; }\n    .table-responsive-xl > .table-bordered {\n      border: 0; } }\n\n.table-responsive {\n  display: block;\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n  -ms-overflow-style: -ms-autohiding-scrollbar; }\n  .table-responsive > .table-bordered {\n    border: 0; }\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: calc(2.25rem + 2px);\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  color: #495057;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .form-control {\n      transition: none; } }\n  .form-control::-ms-expand {\n    background-color: transparent;\n    border: 0; }\n  .form-control:focus {\n    color: #495057;\n    background-color: #fff;\n    border-color: #80bdff;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .form-control::-webkit-input-placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control:-ms-input-placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control::-ms-input-placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control::placeholder {\n    color: #6c757d;\n    opacity: 1; }\n  .form-control:disabled, .form-control[readonly] {\n    background-color: #e9ecef;\n    opacity: 1; }\n\nselect.form-control:focus::-ms-value {\n  color: #495057;\n  background-color: #fff; }\n\n.form-control-file,\n.form-control-range {\n  display: block;\n  width: 100%; }\n\n.col-form-label {\n  padding-top: calc(0.375rem + 1px);\n  padding-bottom: calc(0.375rem + 1px);\n  margin-bottom: 0;\n  font-size: inherit;\n  line-height: 1.5; }\n\n.col-form-label-lg {\n  padding-top: calc(0.5rem + 1px);\n  padding-bottom: calc(0.5rem + 1px);\n  font-size: 1.25rem;\n  line-height: 1.5; }\n\n.col-form-label-sm {\n  padding-top: calc(0.25rem + 1px);\n  padding-bottom: calc(0.25rem + 1px);\n  font-size: 0.875rem;\n  line-height: 1.5; }\n\n.form-control-plaintext {\n  display: block;\n  width: 100%;\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  margin-bottom: 0;\n  line-height: 1.5;\n  color: #212529;\n  background-color: transparent;\n  border: solid transparent;\n  border-width: 1px 0; }\n  .form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg {\n    padding-right: 0;\n    padding-left: 0; }\n\n.form-control-sm {\n  height: calc(1.8125rem + 2px);\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem; }\n\n.form-control-lg {\n  height: calc(2.875rem + 2px);\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem; }\n\nselect.form-control[size], select.form-control[multiple] {\n  height: auto; }\n\ntextarea.form-control {\n  height: auto; }\n\n.form-group {\n  margin-bottom: 1rem; }\n\n.form-text {\n  display: block;\n  margin-top: 0.25rem; }\n\n.form-row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -5px;\n  margin-left: -5px; }\n  .form-row > .col,\n  .form-row > [class*=\"col-\"] {\n    padding-right: 5px;\n    padding-left: 5px; }\n\n.form-check {\n  position: relative;\n  display: block;\n  padding-left: 1.25rem; }\n\n.form-check-input {\n  position: absolute;\n  margin-top: 0.3rem;\n  margin-left: -1.25rem; }\n  .form-check-input:disabled ~ .form-check-label {\n    color: #6c757d; }\n\n.form-check-label {\n  margin-bottom: 0; }\n\n.form-check-inline {\n  display: inline-flex;\n  align-items: center;\n  padding-left: 0;\n  margin-right: 0.75rem; }\n  .form-check-inline .form-check-input {\n    position: static;\n    margin-top: 0;\n    margin-right: 0.3125rem;\n    margin-left: 0; }\n\n.valid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 80%;\n  color: #28a745; }\n\n.valid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: .1rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #fff;\n  background-color: rgba(40, 167, 69, 0.9);\n  border-radius: 0.25rem; }\n\n.was-validated .form-control:valid, .form-control.is-valid, .was-validated\n.custom-select:valid,\n.custom-select.is-valid {\n  border-color: #28a745; }\n  .was-validated .form-control:valid:focus, .form-control.is-valid:focus, .was-validated\n  .custom-select:valid:focus,\n  .custom-select.is-valid:focus {\n    border-color: #28a745;\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); }\n  .was-validated .form-control:valid ~ .valid-feedback,\n  .was-validated .form-control:valid ~ .valid-tooltip, .form-control.is-valid ~ .valid-feedback,\n  .form-control.is-valid ~ .valid-tooltip, .was-validated\n  .custom-select:valid ~ .valid-feedback,\n  .was-validated\n  .custom-select:valid ~ .valid-tooltip,\n  .custom-select.is-valid ~ .valid-feedback,\n  .custom-select.is-valid ~ .valid-tooltip {\n    display: block; }\n\n.was-validated .form-control-file:valid ~ .valid-feedback,\n.was-validated .form-control-file:valid ~ .valid-tooltip, .form-control-file.is-valid ~ .valid-feedback,\n.form-control-file.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label {\n  color: #28a745; }\n\n.was-validated .form-check-input:valid ~ .valid-feedback,\n.was-validated .form-check-input:valid ~ .valid-tooltip, .form-check-input.is-valid ~ .valid-feedback,\n.form-check-input.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:valid ~ .custom-control-label, .custom-control-input.is-valid ~ .custom-control-label {\n  color: #28a745; }\n  .was-validated .custom-control-input:valid ~ .custom-control-label::before, .custom-control-input.is-valid ~ .custom-control-label::before {\n    background-color: #71dd8a; }\n\n.was-validated .custom-control-input:valid ~ .valid-feedback,\n.was-validated .custom-control-input:valid ~ .valid-tooltip, .custom-control-input.is-valid ~ .valid-feedback,\n.custom-control-input.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:valid:checked ~ .custom-control-label::before, .custom-control-input.is-valid:checked ~ .custom-control-label::before {\n  background-color: #34ce57; }\n\n.was-validated .custom-control-input:valid:focus ~ .custom-control-label::before, .custom-control-input.is-valid:focus ~ .custom-control-label::before {\n  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(40, 167, 69, 0.25); }\n\n.was-validated .custom-file-input:valid ~ .custom-file-label, .custom-file-input.is-valid ~ .custom-file-label {\n  border-color: #28a745; }\n  .was-validated .custom-file-input:valid ~ .custom-file-label::after, .custom-file-input.is-valid ~ .custom-file-label::after {\n    border-color: inherit; }\n\n.was-validated .custom-file-input:valid ~ .valid-feedback,\n.was-validated .custom-file-input:valid ~ .valid-tooltip, .custom-file-input.is-valid ~ .valid-feedback,\n.custom-file-input.is-valid ~ .valid-tooltip {\n  display: block; }\n\n.was-validated .custom-file-input:valid:focus ~ .custom-file-label, .custom-file-input.is-valid:focus ~ .custom-file-label {\n  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); }\n\n.invalid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 80%;\n  color: #dc3545; }\n\n.invalid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: .1rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #fff;\n  background-color: rgba(220, 53, 69, 0.9);\n  border-radius: 0.25rem; }\n\n.was-validated .form-control:invalid, .form-control.is-invalid, .was-validated\n.custom-select:invalid,\n.custom-select.is-invalid {\n  border-color: #dc3545; }\n  .was-validated .form-control:invalid:focus, .form-control.is-invalid:focus, .was-validated\n  .custom-select:invalid:focus,\n  .custom-select.is-invalid:focus {\n    border-color: #dc3545;\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25); }\n  .was-validated .form-control:invalid ~ .invalid-feedback,\n  .was-validated .form-control:invalid ~ .invalid-tooltip, .form-control.is-invalid ~ .invalid-feedback,\n  .form-control.is-invalid ~ .invalid-tooltip, .was-validated\n  .custom-select:invalid ~ .invalid-feedback,\n  .was-validated\n  .custom-select:invalid ~ .invalid-tooltip,\n  .custom-select.is-invalid ~ .invalid-feedback,\n  .custom-select.is-invalid ~ .invalid-tooltip {\n    display: block; }\n\n.was-validated .form-control-file:invalid ~ .invalid-feedback,\n.was-validated .form-control-file:invalid ~ .invalid-tooltip, .form-control-file.is-invalid ~ .invalid-feedback,\n.form-control-file.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label {\n  color: #dc3545; }\n\n.was-validated .form-check-input:invalid ~ .invalid-feedback,\n.was-validated .form-check-input:invalid ~ .invalid-tooltip, .form-check-input.is-invalid ~ .invalid-feedback,\n.form-check-input.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:invalid ~ .custom-control-label, .custom-control-input.is-invalid ~ .custom-control-label {\n  color: #dc3545; }\n  .was-validated .custom-control-input:invalid ~ .custom-control-label::before, .custom-control-input.is-invalid ~ .custom-control-label::before {\n    background-color: #efa2a9; }\n\n.was-validated .custom-control-input:invalid ~ .invalid-feedback,\n.was-validated .custom-control-input:invalid ~ .invalid-tooltip, .custom-control-input.is-invalid ~ .invalid-feedback,\n.custom-control-input.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .custom-control-input:invalid:checked ~ .custom-control-label::before, .custom-control-input.is-invalid:checked ~ .custom-control-label::before {\n  background-color: #e4606d; }\n\n.was-validated .custom-control-input:invalid:focus ~ .custom-control-label::before, .custom-control-input.is-invalid:focus ~ .custom-control-label::before {\n  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(220, 53, 69, 0.25); }\n\n.was-validated .custom-file-input:invalid ~ .custom-file-label, .custom-file-input.is-invalid ~ .custom-file-label {\n  border-color: #dc3545; }\n  .was-validated .custom-file-input:invalid ~ .custom-file-label::after, .custom-file-input.is-invalid ~ .custom-file-label::after {\n    border-color: inherit; }\n\n.was-validated .custom-file-input:invalid ~ .invalid-feedback,\n.was-validated .custom-file-input:invalid ~ .invalid-tooltip, .custom-file-input.is-invalid ~ .invalid-feedback,\n.custom-file-input.is-invalid ~ .invalid-tooltip {\n  display: block; }\n\n.was-validated .custom-file-input:invalid:focus ~ .custom-file-label, .custom-file-input.is-invalid:focus ~ .custom-file-label {\n  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25); }\n\n.form-inline {\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center; }\n  .form-inline .form-check {\n    width: 100%; }\n  @media (min-width: 576px) {\n    .form-inline label {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-bottom: 0; }\n    .form-inline .form-group {\n      display: flex;\n      flex: 0 0 auto;\n      flex-flow: row wrap;\n      align-items: center;\n      margin-bottom: 0; }\n    .form-inline .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle; }\n    .form-inline .form-control-plaintext {\n      display: inline-block; }\n    .form-inline .input-group,\n    .form-inline .custom-select {\n      width: auto; }\n    .form-inline .form-check {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: auto;\n      padding-left: 0; }\n    .form-inline .form-check-input {\n      position: relative;\n      margin-top: 0;\n      margin-right: 0.25rem;\n      margin-left: 0; }\n    .form-inline .custom-control {\n      align-items: center;\n      justify-content: center; }\n    .form-inline .custom-control-label {\n      margin-bottom: 0; } }\n\n.btn {\n  display: inline-block;\n  font-weight: 400;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border: 1px solid transparent;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .btn {\n      transition: none; } }\n  .btn:hover, .btn:focus {\n    text-decoration: none; }\n  .btn:focus, .btn.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .btn.disabled, .btn:disabled {\n    opacity: 0.65; }\n  .btn:not(:disabled):not(.disabled) {\n    cursor: pointer; }\n\na.btn.disabled,\nfieldset:disabled a.btn {\n  pointer-events: none; }\n\n.btn-primary {\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff; }\n  .btn-primary:hover {\n    color: #fff;\n    background-color: #0069d9;\n    border-color: #0062cc; }\n  .btn-primary:focus, .btn-primary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n  .btn-primary.disabled, .btn-primary:disabled {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n  .btn-primary:not(:disabled):not(.disabled):active, .btn-primary:not(:disabled):not(.disabled).active,\n  .show > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #0062cc;\n    border-color: #005cbf; }\n    .btn-primary:not(:disabled):not(.disabled):active:focus, .btn-primary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-primary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n\n.btn-secondary {\n  color: #fff;\n  background-color: #6c757d;\n  border-color: #6c757d; }\n  .btn-secondary:hover {\n    color: #fff;\n    background-color: #5a6268;\n    border-color: #545b62; }\n  .btn-secondary:focus, .btn-secondary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n  .btn-secondary.disabled, .btn-secondary:disabled {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d; }\n  .btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active,\n  .show > .btn-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #545b62;\n    border-color: #4e555b; }\n    .btn-secondary:not(:disabled):not(.disabled):active:focus, .btn-secondary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-secondary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n\n.btn-success {\n  color: #fff;\n  background-color: #28a745;\n  border-color: #28a745; }\n  .btn-success:hover {\n    color: #fff;\n    background-color: #218838;\n    border-color: #1e7e34; }\n  .btn-success:focus, .btn-success.focus {\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n  .btn-success.disabled, .btn-success:disabled {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745; }\n  .btn-success:not(:disabled):not(.disabled):active, .btn-success:not(:disabled):not(.disabled).active,\n  .show > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #1e7e34;\n    border-color: #1c7430; }\n    .btn-success:not(:disabled):not(.disabled):active:focus, .btn-success:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-success.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n\n.btn-info {\n  color: #fff;\n  background-color: #17a2b8;\n  border-color: #17a2b8; }\n  .btn-info:hover {\n    color: #fff;\n    background-color: #138496;\n    border-color: #117a8b; }\n  .btn-info:focus, .btn-info.focus {\n    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n  .btn-info.disabled, .btn-info:disabled {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8; }\n  .btn-info:not(:disabled):not(.disabled):active, .btn-info:not(:disabled):not(.disabled).active,\n  .show > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #117a8b;\n    border-color: #10707f; }\n    .btn-info:not(:disabled):not(.disabled):active:focus, .btn-info:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-info.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n\n.btn-warning {\n  color: #212529;\n  background-color: #ffc107;\n  border-color: #ffc107; }\n  .btn-warning:hover {\n    color: #212529;\n    background-color: #e0a800;\n    border-color: #d39e00; }\n  .btn-warning:focus, .btn-warning.focus {\n    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n  .btn-warning.disabled, .btn-warning:disabled {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107; }\n  .btn-warning:not(:disabled):not(.disabled):active, .btn-warning:not(:disabled):not(.disabled).active,\n  .show > .btn-warning.dropdown-toggle {\n    color: #212529;\n    background-color: #d39e00;\n    border-color: #c69500; }\n    .btn-warning:not(:disabled):not(.disabled):active:focus, .btn-warning:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-warning.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n\n.btn-danger {\n  color: #fff;\n  background-color: #dc3545;\n  border-color: #dc3545; }\n  .btn-danger:hover {\n    color: #fff;\n    background-color: #c82333;\n    border-color: #bd2130; }\n  .btn-danger:focus, .btn-danger.focus {\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n  .btn-danger.disabled, .btn-danger:disabled {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545; }\n  .btn-danger:not(:disabled):not(.disabled):active, .btn-danger:not(:disabled):not(.disabled).active,\n  .show > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #bd2130;\n    border-color: #b21f2d; }\n    .btn-danger:not(:disabled):not(.disabled):active:focus, .btn-danger:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-danger.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n\n.btn-light {\n  color: #212529;\n  background-color: #f8f9fa;\n  border-color: #f8f9fa; }\n  .btn-light:hover {\n    color: #212529;\n    background-color: #e2e6ea;\n    border-color: #dae0e5; }\n  .btn-light:focus, .btn-light.focus {\n    box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n  .btn-light.disabled, .btn-light:disabled {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa; }\n  .btn-light:not(:disabled):not(.disabled):active, .btn-light:not(:disabled):not(.disabled).active,\n  .show > .btn-light.dropdown-toggle {\n    color: #212529;\n    background-color: #dae0e5;\n    border-color: #d3d9df; }\n    .btn-light:not(:disabled):not(.disabled):active:focus, .btn-light:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-light.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n\n.btn-dark {\n  color: #fff;\n  background-color: #343a40;\n  border-color: #343a40; }\n  .btn-dark:hover {\n    color: #fff;\n    background-color: #23272b;\n    border-color: #1d2124; }\n  .btn-dark:focus, .btn-dark.focus {\n    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n  .btn-dark.disabled, .btn-dark:disabled {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40; }\n  .btn-dark:not(:disabled):not(.disabled):active, .btn-dark:not(:disabled):not(.disabled).active,\n  .show > .btn-dark.dropdown-toggle {\n    color: #fff;\n    background-color: #1d2124;\n    border-color: #171a1d; }\n    .btn-dark:not(:disabled):not(.disabled):active:focus, .btn-dark:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-dark.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n\n.btn-outline-primary {\n  color: #007bff;\n  background-color: transparent;\n  background-image: none;\n  border-color: #007bff; }\n  .btn-outline-primary:hover {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n  .btn-outline-primary:focus, .btn-outline-primary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n  .btn-outline-primary.disabled, .btn-outline-primary:disabled {\n    color: #007bff;\n    background-color: transparent; }\n  .btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n    .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-primary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); }\n\n.btn-outline-secondary {\n  color: #6c757d;\n  background-color: transparent;\n  background-image: none;\n  border-color: #6c757d; }\n  .btn-outline-secondary:hover {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d; }\n  .btn-outline-secondary:focus, .btn-outline-secondary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n  .btn-outline-secondary.disabled, .btn-outline-secondary:disabled {\n    color: #6c757d;\n    background-color: transparent; }\n  .btn-outline-secondary:not(:disabled):not(.disabled):active, .btn-outline-secondary:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d; }\n    .btn-outline-secondary:not(:disabled):not(.disabled):active:focus, .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-secondary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5); }\n\n.btn-outline-success {\n  color: #28a745;\n  background-color: transparent;\n  background-image: none;\n  border-color: #28a745; }\n  .btn-outline-success:hover {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745; }\n  .btn-outline-success:focus, .btn-outline-success.focus {\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n  .btn-outline-success.disabled, .btn-outline-success:disabled {\n    color: #28a745;\n    background-color: transparent; }\n  .btn-outline-success:not(:disabled):not(.disabled):active, .btn-outline-success:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-success.dropdown-toggle {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745; }\n    .btn-outline-success:not(:disabled):not(.disabled):active:focus, .btn-outline-success:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-success.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); }\n\n.btn-outline-info {\n  color: #17a2b8;\n  background-color: transparent;\n  background-image: none;\n  border-color: #17a2b8; }\n  .btn-outline-info:hover {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8; }\n  .btn-outline-info:focus, .btn-outline-info.focus {\n    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n  .btn-outline-info.disabled, .btn-outline-info:disabled {\n    color: #17a2b8;\n    background-color: transparent; }\n  .btn-outline-info:not(:disabled):not(.disabled):active, .btn-outline-info:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-info.dropdown-toggle {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8; }\n    .btn-outline-info:not(:disabled):not(.disabled):active:focus, .btn-outline-info:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-info.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5); }\n\n.btn-outline-warning {\n  color: #ffc107;\n  background-color: transparent;\n  background-image: none;\n  border-color: #ffc107; }\n  .btn-outline-warning:hover {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107; }\n  .btn-outline-warning:focus, .btn-outline-warning.focus {\n    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n  .btn-outline-warning.disabled, .btn-outline-warning:disabled {\n    color: #ffc107;\n    background-color: transparent; }\n  .btn-outline-warning:not(:disabled):not(.disabled):active, .btn-outline-warning:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-warning.dropdown-toggle {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107; }\n    .btn-outline-warning:not(:disabled):not(.disabled):active:focus, .btn-outline-warning:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-warning.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5); }\n\n.btn-outline-danger {\n  color: #dc3545;\n  background-color: transparent;\n  background-image: none;\n  border-color: #dc3545; }\n  .btn-outline-danger:hover {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545; }\n  .btn-outline-danger:focus, .btn-outline-danger.focus {\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n  .btn-outline-danger.disabled, .btn-outline-danger:disabled {\n    color: #dc3545;\n    background-color: transparent; }\n  .btn-outline-danger:not(:disabled):not(.disabled):active, .btn-outline-danger:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545; }\n    .btn-outline-danger:not(:disabled):not(.disabled):active:focus, .btn-outline-danger:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-danger.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); }\n\n.btn-outline-light {\n  color: #f8f9fa;\n  background-color: transparent;\n  background-image: none;\n  border-color: #f8f9fa; }\n  .btn-outline-light:hover {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa; }\n  .btn-outline-light:focus, .btn-outline-light.focus {\n    box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n  .btn-outline-light.disabled, .btn-outline-light:disabled {\n    color: #f8f9fa;\n    background-color: transparent; }\n  .btn-outline-light:not(:disabled):not(.disabled):active, .btn-outline-light:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-light.dropdown-toggle {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa; }\n    .btn-outline-light:not(:disabled):not(.disabled):active:focus, .btn-outline-light:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-light.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5); }\n\n.btn-outline-dark {\n  color: #343a40;\n  background-color: transparent;\n  background-image: none;\n  border-color: #343a40; }\n  .btn-outline-dark:hover {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40; }\n  .btn-outline-dark:focus, .btn-outline-dark.focus {\n    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n  .btn-outline-dark.disabled, .btn-outline-dark:disabled {\n    color: #343a40;\n    background-color: transparent; }\n  .btn-outline-dark:not(:disabled):not(.disabled):active, .btn-outline-dark:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-dark.dropdown-toggle {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40; }\n    .btn-outline-dark:not(:disabled):not(.disabled):active:focus, .btn-outline-dark:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-dark.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5); }\n\n.btn-link {\n  font-weight: 400;\n  color: #007bff;\n  background-color: transparent; }\n  .btn-link:hover {\n    color: #0056b3;\n    text-decoration: underline;\n    background-color: transparent;\n    border-color: transparent; }\n  .btn-link:focus, .btn-link.focus {\n    text-decoration: underline;\n    border-color: transparent;\n    box-shadow: none; }\n  .btn-link:disabled, .btn-link.disabled {\n    color: #6c757d;\n    pointer-events: none; }\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem; }\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem; }\n\n.btn-block {\n  display: block;\n  width: 100%; }\n  .btn-block + .btn-block {\n    margin-top: 0.5rem; }\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%; }\n\n.fade {\n  transition: opacity 0.15s linear; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .fade {\n      transition: none; } }\n  .fade:not(.show) {\n    opacity: 0; }\n\n.collapse:not(.show) {\n  display: none; }\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  transition: height 0.35s ease; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .collapsing {\n      transition: none; } }\n\n.dropup,\n.dropright,\n.dropdown,\n.dropleft {\n  position: relative; }\n\n.dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0;\n  border-left: 0.3em solid transparent; }\n\n.dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 10rem;\n  padding: 0.5rem 0;\n  margin: 0.125rem 0 0;\n  font-size: 1rem;\n  color: #212529;\n  text-align: left;\n  list-style: none;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem; }\n\n.dropdown-menu-right {\n  right: 0;\n  left: auto; }\n\n.dropup .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-top: 0;\n  margin-bottom: 0.125rem; }\n\n.dropup .dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0.3em solid;\n  border-left: 0.3em solid transparent; }\n\n.dropup .dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropright .dropdown-menu {\n  top: 0;\n  right: auto;\n  left: 100%;\n  margin-top: 0;\n  margin-left: 0.125rem; }\n\n.dropright .dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0;\n  border-bottom: 0.3em solid transparent;\n  border-left: 0.3em solid; }\n\n.dropright .dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropright .dropdown-toggle::after {\n  vertical-align: 0; }\n\n.dropleft .dropdown-menu {\n  top: 0;\n  right: 100%;\n  left: auto;\n  margin-top: 0;\n  margin-right: 0.125rem; }\n\n.dropleft .dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\"; }\n\n.dropleft .dropdown-toggle::after {\n  display: none; }\n\n.dropleft .dropdown-toggle::before {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-right: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0.3em solid;\n  border-bottom: 0.3em solid transparent; }\n\n.dropleft .dropdown-toggle:empty::after {\n  margin-left: 0; }\n\n.dropleft .dropdown-toggle::before {\n  vertical-align: 0; }\n\n.dropdown-menu[x-placement^=\"top\"], .dropdown-menu[x-placement^=\"right\"], .dropdown-menu[x-placement^=\"bottom\"], .dropdown-menu[x-placement^=\"left\"] {\n  right: auto;\n  bottom: auto; }\n\n.dropdown-divider {\n  height: 0;\n  margin: 0.5rem 0;\n  overflow: hidden;\n  border-top: 1px solid #e9ecef; }\n\n.dropdown-item {\n  display: block;\n  width: 100%;\n  padding: 0.25rem 1.5rem;\n  clear: both;\n  font-weight: 400;\n  color: #212529;\n  text-align: inherit;\n  white-space: nowrap;\n  background-color: transparent;\n  border: 0; }\n  .dropdown-item:hover, .dropdown-item:focus {\n    color: #16181b;\n    text-decoration: none;\n    background-color: #f8f9fa; }\n  .dropdown-item.active, .dropdown-item:active {\n    color: #fff;\n    text-decoration: none;\n    background-color: #007bff; }\n  .dropdown-item.disabled, .dropdown-item:disabled {\n    color: #6c757d;\n    background-color: transparent; }\n\n.dropdown-menu.show {\n  display: block; }\n\n.dropdown-header {\n  display: block;\n  padding: 0.5rem 1.5rem;\n  margin-bottom: 0;\n  font-size: 0.875rem;\n  color: #6c757d;\n  white-space: nowrap; }\n\n.dropdown-item-text {\n  display: block;\n  padding: 0.25rem 1.5rem;\n  color: #212529; }\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle; }\n  .btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    flex: 0 1 auto; }\n    .btn-group > .btn:hover,\n    .btn-group-vertical > .btn:hover {\n      z-index: 1; }\n    .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 1; }\n  .btn-group .btn + .btn,\n  .btn-group .btn + .btn-group,\n  .btn-group .btn-group + .btn,\n  .btn-group .btn-group + .btn-group,\n  .btn-group-vertical .btn + .btn,\n  .btn-group-vertical .btn + .btn-group,\n  .btn-group-vertical .btn-group + .btn,\n  .btn-group-vertical .btn-group + .btn-group {\n    margin-left: -1px; }\n\n.btn-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start; }\n  .btn-toolbar .input-group {\n    width: auto; }\n\n.btn-group > .btn:first-child {\n  margin-left: 0; }\n\n.btn-group > .btn:not(:last-child):not(.dropdown-toggle),\n.btn-group > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.btn-group > .btn:not(:first-child),\n.btn-group > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.dropdown-toggle-split {\n  padding-right: 0.5625rem;\n  padding-left: 0.5625rem; }\n  .dropdown-toggle-split::after,\n  .dropup .dropdown-toggle-split::after,\n  .dropright .dropdown-toggle-split::after {\n    margin-left: 0; }\n  .dropleft .dropdown-toggle-split::before {\n    margin-right: 0; }\n\n.btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split {\n  padding-right: 0.375rem;\n  padding-left: 0.375rem; }\n\n.btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n\n.btn-group-vertical {\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center; }\n  .btn-group-vertical .btn,\n  .btn-group-vertical .btn-group {\n    width: 100%; }\n  .btn-group-vertical > .btn + .btn,\n  .btn-group-vertical > .btn + .btn-group,\n  .btn-group-vertical > .btn-group + .btn,\n  .btn-group-vertical > .btn-group + .btn-group {\n    margin-top: -1px;\n    margin-left: 0; }\n  .btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle),\n  .btn-group-vertical > .btn-group:not(:last-child) > .btn {\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0; }\n  .btn-group-vertical > .btn:not(:first-child),\n  .btn-group-vertical > .btn-group:not(:first-child) > .btn {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.btn-group-toggle > .btn,\n.btn-group-toggle > .btn-group > .btn {\n  margin-bottom: 0; }\n  .btn-group-toggle > .btn input[type=\"radio\"],\n  .btn-group-toggle > .btn input[type=\"checkbox\"],\n  .btn-group-toggle > .btn-group > .btn input[type=\"radio\"],\n  .btn-group-toggle > .btn-group > .btn input[type=\"checkbox\"] {\n    position: absolute;\n    clip: rect(0, 0, 0, 0);\n    pointer-events: none; }\n\n.input-group {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  width: 100%; }\n  .input-group > .form-control,\n  .input-group > .custom-select,\n  .input-group > .custom-file {\n    position: relative;\n    flex: 1 1 auto;\n    width: 1%;\n    margin-bottom: 0; }\n    .input-group > .form-control + .form-control,\n    .input-group > .form-control + .custom-select,\n    .input-group > .form-control + .custom-file,\n    .input-group > .custom-select + .form-control,\n    .input-group > .custom-select + .custom-select,\n    .input-group > .custom-select + .custom-file,\n    .input-group > .custom-file + .form-control,\n    .input-group > .custom-file + .custom-select,\n    .input-group > .custom-file + .custom-file {\n      margin-left: -1px; }\n  .input-group > .form-control:focus,\n  .input-group > .custom-select:focus,\n  .input-group > .custom-file .custom-file-input:focus ~ .custom-file-label {\n    z-index: 3; }\n  .input-group > .custom-file .custom-file-input:focus {\n    z-index: 4; }\n  .input-group > .form-control:not(:last-child),\n  .input-group > .custom-select:not(:last-child) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0; }\n  .input-group > .form-control:not(:first-child),\n  .input-group > .custom-select:not(:first-child) {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0; }\n  .input-group > .custom-file {\n    display: flex;\n    align-items: center; }\n    .input-group > .custom-file:not(:last-child) .custom-file-label,\n    .input-group > .custom-file:not(:last-child) .custom-file-label::after {\n      border-top-right-radius: 0;\n      border-bottom-right-radius: 0; }\n    .input-group > .custom-file:not(:first-child) .custom-file-label {\n      border-top-left-radius: 0;\n      border-bottom-left-radius: 0; }\n\n.input-group-prepend,\n.input-group-append {\n  display: flex; }\n  .input-group-prepend .btn,\n  .input-group-append .btn {\n    position: relative;\n    z-index: 2; }\n  .input-group-prepend .btn + .btn,\n  .input-group-prepend .btn + .input-group-text,\n  .input-group-prepend .input-group-text + .input-group-text,\n  .input-group-prepend .input-group-text + .btn,\n  .input-group-append .btn + .btn,\n  .input-group-append .btn + .input-group-text,\n  .input-group-append .input-group-text + .input-group-text,\n  .input-group-append .input-group-text + .btn {\n    margin-left: -1px; }\n\n.input-group-prepend {\n  margin-right: -1px; }\n\n.input-group-append {\n  margin-left: -1px; }\n\n.input-group-text {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #495057;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #e9ecef;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem; }\n  .input-group-text input[type=\"radio\"],\n  .input-group-text input[type=\"checkbox\"] {\n    margin-top: 0; }\n\n.input-group-lg > .form-control,\n.input-group-lg > .input-group-prepend > .input-group-text,\n.input-group-lg > .input-group-append > .input-group-text,\n.input-group-lg > .input-group-prepend > .btn,\n.input-group-lg > .input-group-append > .btn {\n  height: calc(2.875rem + 2px);\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem; }\n\n.input-group-sm > .form-control,\n.input-group-sm > .input-group-prepend > .input-group-text,\n.input-group-sm > .input-group-append > .input-group-text,\n.input-group-sm > .input-group-prepend > .btn,\n.input-group-sm > .input-group-append > .btn {\n  height: calc(1.8125rem + 2px);\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem; }\n\n.input-group > .input-group-prepend > .btn,\n.input-group > .input-group-prepend > .input-group-text,\n.input-group > .input-group-append:not(:last-child) > .btn,\n.input-group > .input-group-append:not(:last-child) > .input-group-text,\n.input-group > .input-group-append:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group > .input-group-append:last-child > .input-group-text:not(:last-child) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.input-group > .input-group-append > .btn,\n.input-group > .input-group-append > .input-group-text,\n.input-group > .input-group-prepend:not(:first-child) > .btn,\n.input-group > .input-group-prepend:not(:first-child) > .input-group-text,\n.input-group > .input-group-prepend:first-child > .btn:not(:first-child),\n.input-group > .input-group-prepend:first-child > .input-group-text:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.custom-control {\n  position: relative;\n  display: block;\n  min-height: 1.5rem;\n  padding-left: 1.5rem; }\n\n.custom-control-inline {\n  display: inline-flex;\n  margin-right: 1rem; }\n\n.custom-control-input {\n  position: absolute;\n  z-index: -1;\n  opacity: 0; }\n  .custom-control-input:checked ~ .custom-control-label::before {\n    color: #fff;\n    background-color: #007bff; }\n  .custom-control-input:focus ~ .custom-control-label::before {\n    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .custom-control-input:active ~ .custom-control-label::before {\n    color: #fff;\n    background-color: #b3d7ff; }\n  .custom-control-input:disabled ~ .custom-control-label {\n    color: #6c757d; }\n    .custom-control-input:disabled ~ .custom-control-label::before {\n      background-color: #e9ecef; }\n\n.custom-control-label {\n  position: relative;\n  margin-bottom: 0; }\n  .custom-control-label::before {\n    position: absolute;\n    top: 0.25rem;\n    left: -1.5rem;\n    display: block;\n    width: 1rem;\n    height: 1rem;\n    pointer-events: none;\n    content: \"\";\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    background-color: #dee2e6; }\n  .custom-control-label::after {\n    position: absolute;\n    top: 0.25rem;\n    left: -1.5rem;\n    display: block;\n    width: 1rem;\n    height: 1rem;\n    content: \"\";\n    background-repeat: no-repeat;\n    background-position: center center;\n    background-size: 50% 50%; }\n\n.custom-checkbox .custom-control-label::before {\n  border-radius: 0.25rem; }\n\n.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #007bff; }\n\n.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\"); }\n\n.custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::before {\n  background-color: #007bff; }\n\n.custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'%3E%3Cpath stroke='%23fff' d='M0 2h4'/%3E%3C/svg%3E\"); }\n\n.custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before {\n  background-color: rgba(0, 123, 255, 0.5); }\n\n.custom-checkbox .custom-control-input:disabled:indeterminate ~ .custom-control-label::before {\n  background-color: rgba(0, 123, 255, 0.5); }\n\n.custom-radio .custom-control-label::before {\n  border-radius: 50%; }\n\n.custom-radio .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #007bff; }\n\n.custom-radio .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fff'/%3E%3C/svg%3E\"); }\n\n.custom-radio .custom-control-input:disabled:checked ~ .custom-control-label::before {\n  background-color: rgba(0, 123, 255, 0.5); }\n\n.custom-select {\n  display: inline-block;\n  width: 100%;\n  height: calc(2.25rem + 2px);\n  padding: 0.375rem 1.75rem 0.375rem 0.75rem;\n  line-height: 1.5;\n  color: #495057;\n  vertical-align: middle;\n  background: #fff url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E\") no-repeat right 0.75rem center;\n  background-size: 8px 10px;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none; }\n  .custom-select:focus {\n    border-color: #80bdff;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(128, 189, 255, 0.5); }\n    .custom-select:focus::-ms-value {\n      color: #495057;\n      background-color: #fff; }\n  .custom-select[multiple], .custom-select[size]:not([size=\"1\"]) {\n    height: auto;\n    padding-right: 0.75rem;\n    background-image: none; }\n  .custom-select:disabled {\n    color: #6c757d;\n    background-color: #e9ecef; }\n  .custom-select::-ms-expand {\n    opacity: 0; }\n\n.custom-select-sm {\n  height: calc(1.8125rem + 2px);\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  font-size: 75%; }\n\n.custom-select-lg {\n  height: calc(2.875rem + 2px);\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  font-size: 125%; }\n\n.custom-file {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  height: calc(2.25rem + 2px);\n  margin-bottom: 0; }\n\n.custom-file-input {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  height: calc(2.25rem + 2px);\n  margin: 0;\n  opacity: 0; }\n  .custom-file-input:focus ~ .custom-file-label {\n    border-color: #80bdff;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n    .custom-file-input:focus ~ .custom-file-label::after {\n      border-color: #80bdff; }\n  .custom-file-input:disabled ~ .custom-file-label {\n    background-color: #e9ecef; }\n  .custom-file-input:lang(en) ~ .custom-file-label::after {\n    content: \"Browse\"; }\n\n.custom-file-label {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1;\n  height: calc(2.25rem + 2px);\n  padding: 0.375rem 0.75rem;\n  line-height: 1.5;\n  color: #495057;\n  background-color: #fff;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem; }\n  .custom-file-label::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 3;\n    display: block;\n    height: 2.25rem;\n    padding: 0.375rem 0.75rem;\n    line-height: 1.5;\n    color: #495057;\n    content: \"Browse\";\n    background-color: #e9ecef;\n    border-left: 1px solid #ced4da;\n    border-radius: 0 0.25rem 0.25rem 0; }\n\n.custom-range {\n  width: 100%;\n  padding-left: 0;\n  background-color: transparent;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none; }\n  .custom-range:focus {\n    outline: none; }\n    .custom-range:focus::-webkit-slider-thumb {\n      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n    .custom-range:focus::-moz-range-thumb {\n      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n    .custom-range:focus::-ms-thumb {\n      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .custom-range::-moz-focus-outer {\n    border: 0; }\n  .custom-range::-webkit-slider-thumb {\n    width: 1rem;\n    height: 1rem;\n    margin-top: -0.25rem;\n    background-color: #007bff;\n    border: 0;\n    border-radius: 1rem;\n    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    -webkit-appearance: none;\n            appearance: none; }\n    @media screen and (prefers-reduced-motion: reduce) {\n      .custom-range::-webkit-slider-thumb {\n        transition: none; } }\n    .custom-range::-webkit-slider-thumb:active {\n      background-color: #b3d7ff; }\n  .custom-range::-webkit-slider-runnable-track {\n    width: 100%;\n    height: 0.5rem;\n    color: transparent;\n    cursor: pointer;\n    background-color: #dee2e6;\n    border-color: transparent;\n    border-radius: 1rem; }\n  .custom-range::-moz-range-thumb {\n    width: 1rem;\n    height: 1rem;\n    background-color: #007bff;\n    border: 0;\n    border-radius: 1rem;\n    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    -moz-appearance: none;\n         appearance: none; }\n    @media screen and (prefers-reduced-motion: reduce) {\n      .custom-range::-moz-range-thumb {\n        transition: none; } }\n    .custom-range::-moz-range-thumb:active {\n      background-color: #b3d7ff; }\n  .custom-range::-moz-range-track {\n    width: 100%;\n    height: 0.5rem;\n    color: transparent;\n    cursor: pointer;\n    background-color: #dee2e6;\n    border-color: transparent;\n    border-radius: 1rem; }\n  .custom-range::-ms-thumb {\n    width: 1rem;\n    height: 1rem;\n    margin-top: 0;\n    margin-right: 0.2rem;\n    margin-left: 0.2rem;\n    background-color: #007bff;\n    border: 0;\n    border-radius: 1rem;\n    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    appearance: none; }\n    @media screen and (prefers-reduced-motion: reduce) {\n      .custom-range::-ms-thumb {\n        transition: none; } }\n    .custom-range::-ms-thumb:active {\n      background-color: #b3d7ff; }\n  .custom-range::-ms-track {\n    width: 100%;\n    height: 0.5rem;\n    color: transparent;\n    cursor: pointer;\n    background-color: transparent;\n    border-color: transparent;\n    border-width: 0.5rem; }\n  .custom-range::-ms-fill-lower {\n    background-color: #dee2e6;\n    border-radius: 1rem; }\n  .custom-range::-ms-fill-upper {\n    margin-right: 15px;\n    background-color: #dee2e6;\n    border-radius: 1rem; }\n\n.custom-control-label::before,\n.custom-file-label,\n.custom-select {\n  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .custom-control-label::before,\n    .custom-file-label,\n    .custom-select {\n      transition: none; } }\n\n.nav {\n  display: flex;\n  flex-wrap: wrap;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none; }\n\n.nav-link {\n  display: block;\n  padding: 0.5rem 1rem; }\n  .nav-link:hover, .nav-link:focus {\n    text-decoration: none; }\n  .nav-link.disabled {\n    color: #6c757d; }\n\n.nav-tabs {\n  border-bottom: 1px solid #dee2e6; }\n  .nav-tabs .nav-item {\n    margin-bottom: -1px; }\n  .nav-tabs .nav-link {\n    border: 1px solid transparent;\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {\n      border-color: #e9ecef #e9ecef #dee2e6; }\n    .nav-tabs .nav-link.disabled {\n      color: #6c757d;\n      background-color: transparent;\n      border-color: transparent; }\n  .nav-tabs .nav-link.active,\n  .nav-tabs .nav-item.show .nav-link {\n    color: #495057;\n    background-color: #fff;\n    border-color: #dee2e6 #dee2e6 #fff; }\n  .nav-tabs .dropdown-menu {\n    margin-top: -1px;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.nav-pills .nav-link {\n  border-radius: 0.25rem; }\n\n.nav-pills .nav-link.active,\n.nav-pills .show > .nav-link {\n  color: #fff;\n  background-color: #007bff; }\n\n.nav-fill .nav-item {\n  flex: 1 1 auto;\n  text-align: center; }\n\n.nav-justified .nav-item {\n  flex-basis: 0;\n  flex-grow: 1;\n  text-align: center; }\n\n.tab-content > .tab-pane {\n  display: none; }\n\n.tab-content > .active {\n  display: block; }\n\n.navbar {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.5rem 1rem; }\n  .navbar > .container,\n  .navbar > .container-fluid {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    justify-content: space-between; }\n\n.navbar-brand {\n  display: inline-block;\n  padding-top: 0.3125rem;\n  padding-bottom: 0.3125rem;\n  margin-right: 1rem;\n  font-size: 1.25rem;\n  line-height: inherit;\n  white-space: nowrap; }\n  .navbar-brand:hover, .navbar-brand:focus {\n    text-decoration: none; }\n\n.navbar-nav {\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none; }\n  .navbar-nav .nav-link {\n    padding-right: 0;\n    padding-left: 0; }\n  .navbar-nav .dropdown-menu {\n    position: static;\n    float: none; }\n\n.navbar-text {\n  display: inline-block;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem; }\n\n.navbar-collapse {\n  flex-basis: 100%;\n  flex-grow: 1;\n  align-items: center; }\n\n.navbar-toggler {\n  padding: 0.25rem 0.75rem;\n  font-size: 1.25rem;\n  line-height: 1;\n  background-color: transparent;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n  .navbar-toggler:hover, .navbar-toggler:focus {\n    text-decoration: none; }\n  .navbar-toggler:not(:disabled):not(.disabled) {\n    cursor: pointer; }\n\n.navbar-toggler-icon {\n  display: inline-block;\n  width: 1.5em;\n  height: 1.5em;\n  vertical-align: middle;\n  content: \"\";\n  background: no-repeat center center;\n  background-size: 100% 100%; }\n\n@media (max-width: 575.98px) {\n  .navbar-expand-sm > .container,\n  .navbar-expand-sm > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 576px) {\n  .navbar-expand-sm {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-sm .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-sm .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-sm .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-sm > .container,\n    .navbar-expand-sm > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-sm .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-sm .navbar-toggler {\n      display: none; } }\n\n@media (max-width: 767.98px) {\n  .navbar-expand-md > .container,\n  .navbar-expand-md > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 768px) {\n  .navbar-expand-md {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-md .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-md .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-md .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-md > .container,\n    .navbar-expand-md > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-md .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-md .navbar-toggler {\n      display: none; } }\n\n@media (max-width: 991.98px) {\n  .navbar-expand-lg > .container,\n  .navbar-expand-lg > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 992px) {\n  .navbar-expand-lg {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-lg .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-lg .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-lg .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-lg > .container,\n    .navbar-expand-lg > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-lg .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-lg .navbar-toggler {\n      display: none; } }\n\n@media (max-width: 1199.98px) {\n  .navbar-expand-xl > .container,\n  .navbar-expand-xl > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; } }\n\n@media (min-width: 1200px) {\n  .navbar-expand-xl {\n    flex-flow: row nowrap;\n    justify-content: flex-start; }\n    .navbar-expand-xl .navbar-nav {\n      flex-direction: row; }\n      .navbar-expand-xl .navbar-nav .dropdown-menu {\n        position: absolute; }\n      .navbar-expand-xl .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem; }\n    .navbar-expand-xl > .container,\n    .navbar-expand-xl > .container-fluid {\n      flex-wrap: nowrap; }\n    .navbar-expand-xl .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto; }\n    .navbar-expand-xl .navbar-toggler {\n      display: none; } }\n\n.navbar-expand {\n  flex-flow: row nowrap;\n  justify-content: flex-start; }\n  .navbar-expand > .container,\n  .navbar-expand > .container-fluid {\n    padding-right: 0;\n    padding-left: 0; }\n  .navbar-expand .navbar-nav {\n    flex-direction: row; }\n    .navbar-expand .navbar-nav .dropdown-menu {\n      position: absolute; }\n    .navbar-expand .navbar-nav .nav-link {\n      padding-right: 0.5rem;\n      padding-left: 0.5rem; }\n  .navbar-expand > .container,\n  .navbar-expand > .container-fluid {\n    flex-wrap: nowrap; }\n  .navbar-expand .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto; }\n  .navbar-expand .navbar-toggler {\n    display: none; }\n\n.navbar-light .navbar-brand {\n  color: rgba(0, 0, 0, 0.9); }\n  .navbar-light .navbar-brand:hover, .navbar-light .navbar-brand:focus {\n    color: rgba(0, 0, 0, 0.9); }\n\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, 0.5); }\n  .navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link:focus {\n    color: rgba(0, 0, 0, 0.7); }\n  .navbar-light .navbar-nav .nav-link.disabled {\n    color: rgba(0, 0, 0, 0.3); }\n\n.navbar-light .navbar-nav .show > .nav-link,\n.navbar-light .navbar-nav .active > .nav-link,\n.navbar-light .navbar-nav .nav-link.show,\n.navbar-light .navbar-nav .nav-link.active {\n  color: rgba(0, 0, 0, 0.9); }\n\n.navbar-light .navbar-toggler {\n  color: rgba(0, 0, 0, 0.5);\n  border-color: rgba(0, 0, 0, 0.1); }\n\n.navbar-light .navbar-toggler-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(0, 0, 0, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\"); }\n\n.navbar-light .navbar-text {\n  color: rgba(0, 0, 0, 0.5); }\n  .navbar-light .navbar-text a {\n    color: rgba(0, 0, 0, 0.9); }\n    .navbar-light .navbar-text a:hover, .navbar-light .navbar-text a:focus {\n      color: rgba(0, 0, 0, 0.9); }\n\n.navbar-dark .navbar-brand {\n  color: #fff; }\n  .navbar-dark .navbar-brand:hover, .navbar-dark .navbar-brand:focus {\n    color: #fff; }\n\n.navbar-dark .navbar-nav .nav-link {\n  color: rgba(255, 255, 255, 0.5); }\n  .navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus {\n    color: rgba(255, 255, 255, 0.75); }\n  .navbar-dark .navbar-nav .nav-link.disabled {\n    color: rgba(255, 255, 255, 0.25); }\n\n.navbar-dark .navbar-nav .show > .nav-link,\n.navbar-dark .navbar-nav .active > .nav-link,\n.navbar-dark .navbar-nav .nav-link.show,\n.navbar-dark .navbar-nav .nav-link.active {\n  color: #fff; }\n\n.navbar-dark .navbar-toggler {\n  color: rgba(255, 255, 255, 0.5);\n  border-color: rgba(255, 255, 255, 0.1); }\n\n.navbar-dark .navbar-toggler-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\"); }\n\n.navbar-dark .navbar-text {\n  color: rgba(255, 255, 255, 0.5); }\n  .navbar-dark .navbar-text a {\n    color: #fff; }\n    .navbar-dark .navbar-text a:hover, .navbar-dark .navbar-text a:focus {\n      color: #fff; }\n\n.card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: border-box;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n  border-radius: 0.25rem; }\n  .card > hr {\n    margin-right: 0;\n    margin-left: 0; }\n  .card > .list-group:first-child .list-group-item:first-child {\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n  .card > .list-group:last-child .list-group-item:last-child {\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem; }\n\n.card-body {\n  flex: 1 1 auto;\n  padding: 1.25rem; }\n\n.card-title {\n  margin-bottom: 0.75rem; }\n\n.card-subtitle {\n  margin-top: -0.375rem;\n  margin-bottom: 0; }\n\n.card-text:last-child {\n  margin-bottom: 0; }\n\n.card-link:hover {\n  text-decoration: none; }\n\n.card-link + .card-link {\n  margin-left: 1.25rem; }\n\n.card-header {\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 0;\n  background-color: rgba(0, 0, 0, 0.03);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125); }\n  .card-header:first-child {\n    border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0; }\n  .card-header + .list-group .list-group-item:first-child {\n    border-top: 0; }\n\n.card-footer {\n  padding: 0.75rem 1.25rem;\n  background-color: rgba(0, 0, 0, 0.03);\n  border-top: 1px solid rgba(0, 0, 0, 0.125); }\n  .card-footer:last-child {\n    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px); }\n\n.card-header-tabs {\n  margin-right: -0.625rem;\n  margin-bottom: -0.75rem;\n  margin-left: -0.625rem;\n  border-bottom: 0; }\n\n.card-header-pills {\n  margin-right: -0.625rem;\n  margin-left: -0.625rem; }\n\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 1.25rem; }\n\n.card-img {\n  width: 100%;\n  border-radius: calc(0.25rem - 1px); }\n\n.card-img-top {\n  width: 100%;\n  border-top-left-radius: calc(0.25rem - 1px);\n  border-top-right-radius: calc(0.25rem - 1px); }\n\n.card-img-bottom {\n  width: 100%;\n  border-bottom-right-radius: calc(0.25rem - 1px);\n  border-bottom-left-radius: calc(0.25rem - 1px); }\n\n.card-deck {\n  display: flex;\n  flex-direction: column; }\n  .card-deck .card {\n    margin-bottom: 15px; }\n  @media (min-width: 576px) {\n    .card-deck {\n      flex-flow: row wrap;\n      margin-right: -15px;\n      margin-left: -15px; }\n      .card-deck .card {\n        display: flex;\n        flex: 1 0 0%;\n        flex-direction: column;\n        margin-right: 15px;\n        margin-bottom: 0;\n        margin-left: 15px; } }\n\n.card-group {\n  display: flex;\n  flex-direction: column; }\n  .card-group > .card {\n    margin-bottom: 15px; }\n  @media (min-width: 576px) {\n    .card-group {\n      flex-flow: row wrap; }\n      .card-group > .card {\n        flex: 1 0 0%;\n        margin-bottom: 0; }\n        .card-group > .card + .card {\n          margin-left: 0;\n          border-left: 0; }\n        .card-group > .card:first-child {\n          border-top-right-radius: 0;\n          border-bottom-right-radius: 0; }\n          .card-group > .card:first-child .card-img-top,\n          .card-group > .card:first-child .card-header {\n            border-top-right-radius: 0; }\n          .card-group > .card:first-child .card-img-bottom,\n          .card-group > .card:first-child .card-footer {\n            border-bottom-right-radius: 0; }\n        .card-group > .card:last-child {\n          border-top-left-radius: 0;\n          border-bottom-left-radius: 0; }\n          .card-group > .card:last-child .card-img-top,\n          .card-group > .card:last-child .card-header {\n            border-top-left-radius: 0; }\n          .card-group > .card:last-child .card-img-bottom,\n          .card-group > .card:last-child .card-footer {\n            border-bottom-left-radius: 0; }\n        .card-group > .card:only-child {\n          border-radius: 0.25rem; }\n          .card-group > .card:only-child .card-img-top,\n          .card-group > .card:only-child .card-header {\n            border-top-left-radius: 0.25rem;\n            border-top-right-radius: 0.25rem; }\n          .card-group > .card:only-child .card-img-bottom,\n          .card-group > .card:only-child .card-footer {\n            border-bottom-right-radius: 0.25rem;\n            border-bottom-left-radius: 0.25rem; }\n        .card-group > .card:not(:first-child):not(:last-child):not(:only-child) {\n          border-radius: 0; }\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-img-top,\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-img-bottom,\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-header,\n          .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-footer {\n            border-radius: 0; } }\n\n.card-columns .card {\n  margin-bottom: 0.75rem; }\n\n@media (min-width: 576px) {\n  .card-columns {\n    -webkit-column-count: 3;\n            column-count: 3;\n    -webkit-column-gap: 1.25rem;\n            column-gap: 1.25rem;\n    orphans: 1;\n    widows: 1; }\n    .card-columns .card {\n      display: inline-block;\n      width: 100%; } }\n\n.accordion .card:not(:first-of-type):not(:last-of-type) {\n  border-bottom: 0;\n  border-radius: 0; }\n\n.accordion .card:not(:first-of-type) .card-header:first-child {\n  border-radius: 0; }\n\n.accordion .card:first-of-type {\n  border-bottom: 0;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.accordion .card:last-of-type {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0; }\n\n.breadcrumb {\n  display: flex;\n  flex-wrap: wrap;\n  padding: 0.75rem 1rem;\n  margin-bottom: 1rem;\n  list-style: none;\n  background-color: #e9ecef;\n  border-radius: 0.25rem; }\n\n.breadcrumb-item + .breadcrumb-item {\n  padding-left: 0.5rem; }\n  .breadcrumb-item + .breadcrumb-item::before {\n    display: inline-block;\n    padding-right: 0.5rem;\n    color: #6c757d;\n    content: \"/\"; }\n\n.breadcrumb-item + .breadcrumb-item:hover::before {\n  text-decoration: underline; }\n\n.breadcrumb-item + .breadcrumb-item:hover::before {\n  text-decoration: none; }\n\n.breadcrumb-item.active {\n  color: #6c757d; }\n\n.pagination {\n  display: flex;\n  padding-left: 0;\n  list-style: none;\n  border-radius: 0.25rem; }\n\n.page-link {\n  position: relative;\n  display: block;\n  padding: 0.5rem 0.75rem;\n  margin-left: -1px;\n  line-height: 1.25;\n  color: #007bff;\n  background-color: #fff;\n  border: 1px solid #dee2e6; }\n  .page-link:hover {\n    z-index: 2;\n    color: #0056b3;\n    text-decoration: none;\n    background-color: #e9ecef;\n    border-color: #dee2e6; }\n  .page-link:focus {\n    z-index: 2;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }\n  .page-link:not(:disabled):not(.disabled) {\n    cursor: pointer; }\n\n.page-item:first-child .page-link {\n  margin-left: 0;\n  border-top-left-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem; }\n\n.page-item:last-child .page-link {\n  border-top-right-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem; }\n\n.page-item.active .page-link {\n  z-index: 1;\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff; }\n\n.page-item.disabled .page-link {\n  color: #6c757d;\n  pointer-events: none;\n  cursor: auto;\n  background-color: #fff;\n  border-color: #dee2e6; }\n\n.pagination-lg .page-link {\n  padding: 0.75rem 1.5rem;\n  font-size: 1.25rem;\n  line-height: 1.5; }\n\n.pagination-lg .page-item:first-child .page-link {\n  border-top-left-radius: 0.3rem;\n  border-bottom-left-radius: 0.3rem; }\n\n.pagination-lg .page-item:last-child .page-link {\n  border-top-right-radius: 0.3rem;\n  border-bottom-right-radius: 0.3rem; }\n\n.pagination-sm .page-link {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5; }\n\n.pagination-sm .page-item:first-child .page-link {\n  border-top-left-radius: 0.2rem;\n  border-bottom-left-radius: 0.2rem; }\n\n.pagination-sm .page-item:last-child .page-link {\n  border-top-right-radius: 0.2rem;\n  border-bottom-right-radius: 0.2rem; }\n\n.badge {\n  display: inline-block;\n  padding: 0.25em 0.4em;\n  font-size: 75%;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25rem; }\n  .badge:empty {\n    display: none; }\n\n.btn .badge {\n  position: relative;\n  top: -1px; }\n\n.badge-pill {\n  padding-right: 0.6em;\n  padding-left: 0.6em;\n  border-radius: 10rem; }\n\n.badge-primary {\n  color: #fff;\n  background-color: #007bff; }\n  .badge-primary[href]:hover, .badge-primary[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #0062cc; }\n\n.badge-secondary {\n  color: #fff;\n  background-color: #6c757d; }\n  .badge-secondary[href]:hover, .badge-secondary[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #545b62; }\n\n.badge-success {\n  color: #fff;\n  background-color: #28a745; }\n  .badge-success[href]:hover, .badge-success[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #1e7e34; }\n\n.badge-info {\n  color: #fff;\n  background-color: #17a2b8; }\n  .badge-info[href]:hover, .badge-info[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #117a8b; }\n\n.badge-warning {\n  color: #212529;\n  background-color: #ffc107; }\n  .badge-warning[href]:hover, .badge-warning[href]:focus {\n    color: #212529;\n    text-decoration: none;\n    background-color: #d39e00; }\n\n.badge-danger {\n  color: #fff;\n  background-color: #dc3545; }\n  .badge-danger[href]:hover, .badge-danger[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #bd2130; }\n\n.badge-light {\n  color: #212529;\n  background-color: #f8f9fa; }\n  .badge-light[href]:hover, .badge-light[href]:focus {\n    color: #212529;\n    text-decoration: none;\n    background-color: #dae0e5; }\n\n.badge-dark {\n  color: #fff;\n  background-color: #343a40; }\n  .badge-dark[href]:hover, .badge-dark[href]:focus {\n    color: #fff;\n    text-decoration: none;\n    background-color: #1d2124; }\n\n.jumbotron {\n  padding: 2rem 1rem;\n  margin-bottom: 2rem;\n  background-color: #e9ecef;\n  border-radius: 0.3rem; }\n  @media (min-width: 576px) {\n    .jumbotron {\n      padding: 4rem 2rem; } }\n\n.jumbotron-fluid {\n  padding-right: 0;\n  padding-left: 0;\n  border-radius: 0; }\n\n.alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n\n.alert-heading {\n  color: inherit; }\n\n.alert-link {\n  font-weight: 700; }\n\n.alert-dismissible {\n  padding-right: 4rem; }\n  .alert-dismissible .close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    padding: 0.75rem 1.25rem;\n    color: inherit; }\n\n.alert-primary {\n  color: #004085;\n  background-color: #cce5ff;\n  border-color: #b8daff; }\n  .alert-primary hr {\n    border-top-color: #9fcdff; }\n  .alert-primary .alert-link {\n    color: #002752; }\n\n.alert-secondary {\n  color: #383d41;\n  background-color: #e2e3e5;\n  border-color: #d6d8db; }\n  .alert-secondary hr {\n    border-top-color: #c8cbcf; }\n  .alert-secondary .alert-link {\n    color: #202326; }\n\n.alert-success {\n  color: #155724;\n  background-color: #d4edda;\n  border-color: #c3e6cb; }\n  .alert-success hr {\n    border-top-color: #b1dfbb; }\n  .alert-success .alert-link {\n    color: #0b2e13; }\n\n.alert-info {\n  color: #0c5460;\n  background-color: #d1ecf1;\n  border-color: #bee5eb; }\n  .alert-info hr {\n    border-top-color: #abdde5; }\n  .alert-info .alert-link {\n    color: #062c33; }\n\n.alert-warning {\n  color: #856404;\n  background-color: #fff3cd;\n  border-color: #ffeeba; }\n  .alert-warning hr {\n    border-top-color: #ffe8a1; }\n  .alert-warning .alert-link {\n    color: #533f03; }\n\n.alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb; }\n  .alert-danger hr {\n    border-top-color: #f1b0b7; }\n  .alert-danger .alert-link {\n    color: #491217; }\n\n.alert-light {\n  color: #818182;\n  background-color: #fefefe;\n  border-color: #fdfdfe; }\n  .alert-light hr {\n    border-top-color: #ececf6; }\n  .alert-light .alert-link {\n    color: #686868; }\n\n.alert-dark {\n  color: #1b1e21;\n  background-color: #d6d8d9;\n  border-color: #c6c8ca; }\n  .alert-dark hr {\n    border-top-color: #b9bbbe; }\n  .alert-dark .alert-link {\n    color: #040505; }\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0; }\n  to {\n    background-position: 0 0; } }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0; }\n  to {\n    background-position: 0 0; } }\n\n.progress {\n  display: flex;\n  height: 1rem;\n  overflow: hidden;\n  font-size: 0.75rem;\n  background-color: #e9ecef;\n  border-radius: 0.25rem; }\n\n.progress-bar {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #007bff;\n  transition: width 0.6s ease; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .progress-bar {\n      transition: none; } }\n\n.progress-bar-striped {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem; }\n\n.progress-bar-animated {\n  -webkit-animation: progress-bar-stripes 1s linear infinite;\n          animation: progress-bar-stripes 1s linear infinite; }\n\n.media {\n  display: flex;\n  align-items: flex-start; }\n\n.media-body {\n  flex: 1; }\n\n.list-group {\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0; }\n\n.list-group-item-action {\n  width: 100%;\n  color: #495057;\n  text-align: inherit; }\n  .list-group-item-action:hover, .list-group-item-action:focus {\n    color: #495057;\n    text-decoration: none;\n    background-color: #f8f9fa; }\n  .list-group-item-action:active {\n    color: #212529;\n    background-color: #e9ecef; }\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.125); }\n  .list-group-item:first-child {\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n  .list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem; }\n  .list-group-item:hover, .list-group-item:focus {\n    z-index: 1;\n    text-decoration: none; }\n  .list-group-item.disabled, .list-group-item:disabled {\n    color: #6c757d;\n    background-color: #fff; }\n  .list-group-item.active {\n    z-index: 2;\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff; }\n\n.list-group-flush .list-group-item {\n  border-right: 0;\n  border-left: 0;\n  border-radius: 0; }\n\n.list-group-flush:first-child .list-group-item:first-child {\n  border-top: 0; }\n\n.list-group-flush:last-child .list-group-item:last-child {\n  border-bottom: 0; }\n\n.list-group-item-primary {\n  color: #004085;\n  background-color: #b8daff; }\n  .list-group-item-primary.list-group-item-action:hover, .list-group-item-primary.list-group-item-action:focus {\n    color: #004085;\n    background-color: #9fcdff; }\n  .list-group-item-primary.list-group-item-action.active {\n    color: #fff;\n    background-color: #004085;\n    border-color: #004085; }\n\n.list-group-item-secondary {\n  color: #383d41;\n  background-color: #d6d8db; }\n  .list-group-item-secondary.list-group-item-action:hover, .list-group-item-secondary.list-group-item-action:focus {\n    color: #383d41;\n    background-color: #c8cbcf; }\n  .list-group-item-secondary.list-group-item-action.active {\n    color: #fff;\n    background-color: #383d41;\n    border-color: #383d41; }\n\n.list-group-item-success {\n  color: #155724;\n  background-color: #c3e6cb; }\n  .list-group-item-success.list-group-item-action:hover, .list-group-item-success.list-group-item-action:focus {\n    color: #155724;\n    background-color: #b1dfbb; }\n  .list-group-item-success.list-group-item-action.active {\n    color: #fff;\n    background-color: #155724;\n    border-color: #155724; }\n\n.list-group-item-info {\n  color: #0c5460;\n  background-color: #bee5eb; }\n  .list-group-item-info.list-group-item-action:hover, .list-group-item-info.list-group-item-action:focus {\n    color: #0c5460;\n    background-color: #abdde5; }\n  .list-group-item-info.list-group-item-action.active {\n    color: #fff;\n    background-color: #0c5460;\n    border-color: #0c5460; }\n\n.list-group-item-warning {\n  color: #856404;\n  background-color: #ffeeba; }\n  .list-group-item-warning.list-group-item-action:hover, .list-group-item-warning.list-group-item-action:focus {\n    color: #856404;\n    background-color: #ffe8a1; }\n  .list-group-item-warning.list-group-item-action.active {\n    color: #fff;\n    background-color: #856404;\n    border-color: #856404; }\n\n.list-group-item-danger {\n  color: #721c24;\n  background-color: #f5c6cb; }\n  .list-group-item-danger.list-group-item-action:hover, .list-group-item-danger.list-group-item-action:focus {\n    color: #721c24;\n    background-color: #f1b0b7; }\n  .list-group-item-danger.list-group-item-action.active {\n    color: #fff;\n    background-color: #721c24;\n    border-color: #721c24; }\n\n.list-group-item-light {\n  color: #818182;\n  background-color: #fdfdfe; }\n  .list-group-item-light.list-group-item-action:hover, .list-group-item-light.list-group-item-action:focus {\n    color: #818182;\n    background-color: #ececf6; }\n  .list-group-item-light.list-group-item-action.active {\n    color: #fff;\n    background-color: #818182;\n    border-color: #818182; }\n\n.list-group-item-dark {\n  color: #1b1e21;\n  background-color: #c6c8ca; }\n  .list-group-item-dark.list-group-item-action:hover, .list-group-item-dark.list-group-item-action:focus {\n    color: #1b1e21;\n    background-color: #b9bbbe; }\n  .list-group-item-dark.list-group-item-action.active {\n    color: #fff;\n    background-color: #1b1e21;\n    border-color: #1b1e21; }\n\n.close {\n  float: right;\n  font-size: 1.5rem;\n  font-weight: 700;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: .5; }\n  .close:not(:disabled):not(.disabled) {\n    cursor: pointer; }\n    .close:not(:disabled):not(.disabled):hover, .close:not(:disabled):not(.disabled):focus {\n      color: #000;\n      text-decoration: none;\n      opacity: .75; }\n\nbutton.close {\n  padding: 0;\n  background-color: transparent;\n  border: 0;\n  -webkit-appearance: none; }\n\n.modal-open {\n  overflow: hidden; }\n  .modal-open .modal {\n    overflow-x: hidden;\n    overflow-y: auto; }\n\n.modal {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  display: none;\n  overflow: hidden;\n  outline: 0; }\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 0.5rem;\n  pointer-events: none; }\n  .modal.fade .modal-dialog {\n    transition: -webkit-transform 0.3s ease-out;\n    transition: transform 0.3s ease-out;\n    transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;\n    -webkit-transform: translate(0, -25%);\n            transform: translate(0, -25%); }\n    @media screen and (prefers-reduced-motion: reduce) {\n      .modal.fade .modal-dialog {\n        transition: none; } }\n  .modal.show .modal-dialog {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0); }\n\n.modal-dialog-centered {\n  display: flex;\n  align-items: center;\n  min-height: calc(100% - (0.5rem * 2)); }\n  .modal-dialog-centered::before {\n    display: block;\n    height: calc(100vh - (0.5rem * 2));\n    content: \"\"; }\n\n.modal-content {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  pointer-events: auto;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem;\n  outline: 0; }\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000; }\n  .modal-backdrop.fade {\n    opacity: 0; }\n  .modal-backdrop.show {\n    opacity: 0.5; }\n\n.modal-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 1rem;\n  border-bottom: 1px solid #e9ecef;\n  border-top-left-radius: 0.3rem;\n  border-top-right-radius: 0.3rem; }\n  .modal-header .close {\n    padding: 1rem;\n    margin: -1rem -1rem -1rem auto; }\n\n.modal-title {\n  margin-bottom: 0;\n  line-height: 1.5; }\n\n.modal-body {\n  position: relative;\n  flex: 1 1 auto;\n  padding: 1rem; }\n\n.modal-footer {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 1rem;\n  border-top: 1px solid #e9ecef; }\n  .modal-footer > :not(:first-child) {\n    margin-left: .25rem; }\n  .modal-footer > :not(:last-child) {\n    margin-right: .25rem; }\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n@media (min-width: 576px) {\n  .modal-dialog {\n    max-width: 500px;\n    margin: 1.75rem auto; }\n  .modal-dialog-centered {\n    min-height: calc(100% - (1.75rem * 2)); }\n    .modal-dialog-centered::before {\n      height: calc(100vh - (1.75rem * 2)); }\n  .modal-sm {\n    max-width: 300px; } }\n\n@media (min-width: 992px) {\n  .modal-lg {\n    max-width: 800px; } }\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left; }\n\n[dir=\"ltr\"] .tooltip {\n  text-align: left; }\n\n[dir=\"rtl\"] .tooltip {\n  text-align: right; }\n\n.tooltip {\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  white-space: normal;\n  line-break: auto;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  opacity: 0; }\n  .tooltip.show {\n    opacity: 0.9; }\n  .tooltip .arrow {\n    position: absolute;\n    display: block;\n    width: 0.8rem;\n    height: 0.4rem; }\n    .tooltip .arrow::before {\n      position: absolute;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid; }\n\n.bs-tooltip-top, .bs-tooltip-auto[x-placement^=\"top\"] {\n  padding: 0.4rem 0; }\n  .bs-tooltip-top .arrow, .bs-tooltip-auto[x-placement^=\"top\"] .arrow {\n    bottom: 0; }\n    .bs-tooltip-top .arrow::before, .bs-tooltip-auto[x-placement^=\"top\"] .arrow::before {\n      top: 0;\n      border-width: 0.4rem 0.4rem 0;\n      border-top-color: #000; }\n\n.bs-tooltip-right, .bs-tooltip-auto[x-placement^=\"right\"] {\n  padding: 0 0.4rem; }\n  .bs-tooltip-right .arrow, .bs-tooltip-auto[x-placement^=\"right\"] .arrow {\n    left: 0;\n    width: 0.4rem;\n    height: 0.8rem; }\n    .bs-tooltip-right .arrow::before, .bs-tooltip-auto[x-placement^=\"right\"] .arrow::before {\n      right: 0;\n      border-width: 0.4rem 0.4rem 0.4rem 0;\n      border-right-color: #000; }\n\n.bs-tooltip-bottom, .bs-tooltip-auto[x-placement^=\"bottom\"] {\n  padding: 0.4rem 0; }\n  .bs-tooltip-bottom .arrow, .bs-tooltip-auto[x-placement^=\"bottom\"] .arrow {\n    top: 0; }\n    .bs-tooltip-bottom .arrow::before, .bs-tooltip-auto[x-placement^=\"bottom\"] .arrow::before {\n      bottom: 0;\n      border-width: 0 0.4rem 0.4rem;\n      border-bottom-color: #000; }\n\n.bs-tooltip-left, .bs-tooltip-auto[x-placement^=\"left\"] {\n  padding: 0 0.4rem; }\n  .bs-tooltip-left .arrow, .bs-tooltip-auto[x-placement^=\"left\"] .arrow {\n    right: 0;\n    width: 0.4rem;\n    height: 0.8rem; }\n    .bs-tooltip-left .arrow::before, .bs-tooltip-auto[x-placement^=\"left\"] .arrow::before {\n      left: 0;\n      border-width: 0.4rem 0 0.4rem 0.4rem;\n      border-left-color: #000; }\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 0.25rem 0.5rem;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 0.25rem; }\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: block;\n  max-width: 276px;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left; }\n\n[dir=\"ltr\"] .popover {\n  text-align: left; }\n\n[dir=\"rtl\"] .popover {\n  text-align: right; }\n\n.popover {\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  white-space: normal;\n  line-break: auto;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem; }\n  .popover .arrow {\n    position: absolute;\n    display: block;\n    width: 1rem;\n    height: 0.5rem;\n    margin: 0 0.3rem; }\n    .popover .arrow::before, .popover .arrow::after {\n      position: absolute;\n      display: block;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid; }\n\n.bs-popover-top, .bs-popover-auto[x-placement^=\"top\"] {\n  margin-bottom: 0.5rem; }\n  .bs-popover-top .arrow, .bs-popover-auto[x-placement^=\"top\"] .arrow {\n    bottom: calc((0.5rem + 1px) * -1); }\n  .bs-popover-top .arrow::before, .bs-popover-auto[x-placement^=\"top\"] .arrow::before,\n  .bs-popover-top .arrow::after,\n  .bs-popover-auto[x-placement^=\"top\"] .arrow::after {\n    border-width: 0.5rem 0.5rem 0; }\n  .bs-popover-top .arrow::before, .bs-popover-auto[x-placement^=\"top\"] .arrow::before {\n    bottom: 0;\n    border-top-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-top .arrow::after,\n  .bs-popover-auto[x-placement^=\"top\"] .arrow::after {\n    bottom: 1px;\n    border-top-color: #fff; }\n\n.bs-popover-right, .bs-popover-auto[x-placement^=\"right\"] {\n  margin-left: 0.5rem; }\n  .bs-popover-right .arrow, .bs-popover-auto[x-placement^=\"right\"] .arrow {\n    left: calc((0.5rem + 1px) * -1);\n    width: 0.5rem;\n    height: 1rem;\n    margin: 0.3rem 0; }\n  .bs-popover-right .arrow::before, .bs-popover-auto[x-placement^=\"right\"] .arrow::before,\n  .bs-popover-right .arrow::after,\n  .bs-popover-auto[x-placement^=\"right\"] .arrow::after {\n    border-width: 0.5rem 0.5rem 0.5rem 0; }\n  .bs-popover-right .arrow::before, .bs-popover-auto[x-placement^=\"right\"] .arrow::before {\n    left: 0;\n    border-right-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-right .arrow::after,\n  .bs-popover-auto[x-placement^=\"right\"] .arrow::after {\n    left: 1px;\n    border-right-color: #fff; }\n\n.bs-popover-bottom, .bs-popover-auto[x-placement^=\"bottom\"] {\n  margin-top: 0.5rem; }\n  .bs-popover-bottom .arrow, .bs-popover-auto[x-placement^=\"bottom\"] .arrow {\n    top: calc((0.5rem + 1px) * -1); }\n  .bs-popover-bottom .arrow::before, .bs-popover-auto[x-placement^=\"bottom\"] .arrow::before,\n  .bs-popover-bottom .arrow::after,\n  .bs-popover-auto[x-placement^=\"bottom\"] .arrow::after {\n    border-width: 0 0.5rem 0.5rem 0.5rem; }\n  .bs-popover-bottom .arrow::before, .bs-popover-auto[x-placement^=\"bottom\"] .arrow::before {\n    top: 0;\n    border-bottom-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-bottom .arrow::after,\n  .bs-popover-auto[x-placement^=\"bottom\"] .arrow::after {\n    top: 1px;\n    border-bottom-color: #fff; }\n  .bs-popover-bottom .popover-header::before, .bs-popover-auto[x-placement^=\"bottom\"] .popover-header::before {\n    position: absolute;\n    top: 0;\n    left: 50%;\n    display: block;\n    width: 1rem;\n    margin-left: -0.5rem;\n    content: \"\";\n    border-bottom: 1px solid #f7f7f7; }\n\n.bs-popover-left, .bs-popover-auto[x-placement^=\"left\"] {\n  margin-right: 0.5rem; }\n  .bs-popover-left .arrow, .bs-popover-auto[x-placement^=\"left\"] .arrow {\n    right: calc((0.5rem + 1px) * -1);\n    width: 0.5rem;\n    height: 1rem;\n    margin: 0.3rem 0; }\n  .bs-popover-left .arrow::before, .bs-popover-auto[x-placement^=\"left\"] .arrow::before,\n  .bs-popover-left .arrow::after,\n  .bs-popover-auto[x-placement^=\"left\"] .arrow::after {\n    border-width: 0.5rem 0 0.5rem 0.5rem; }\n  .bs-popover-left .arrow::before, .bs-popover-auto[x-placement^=\"left\"] .arrow::before {\n    right: 0;\n    border-left-color: rgba(0, 0, 0, 0.25); }\n  \n  .bs-popover-left .arrow::after,\n  .bs-popover-auto[x-placement^=\"left\"] .arrow::after {\n    right: 1px;\n    border-left-color: #fff; }\n\n.popover-header {\n  padding: 0.5rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  color: inherit;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-top-left-radius: calc(0.3rem - 1px);\n  border-top-right-radius: calc(0.3rem - 1px); }\n  .popover-header:empty {\n    display: none; }\n\n.popover-body {\n  padding: 0.5rem 0.75rem;\n  color: #212529; }\n\n.carousel {\n  position: relative; }\n\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden; }\n\n.carousel-item {\n  position: relative;\n  display: none;\n  align-items: center;\n  width: 100%;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-perspective: 1000px;\n          perspective: 1000px; }\n\n.carousel-item.active,\n.carousel-item-next,\n.carousel-item-prev {\n  display: block;\n  transition: -webkit-transform 0.6s ease;\n  transition: transform 0.6s ease;\n  transition: transform 0.6s ease, -webkit-transform 0.6s ease; }\n  @media screen and (prefers-reduced-motion: reduce) {\n    .carousel-item.active,\n    .carousel-item-next,\n    .carousel-item-prev {\n      transition: none; } }\n\n.carousel-item-next,\n.carousel-item-prev {\n  position: absolute;\n  top: 0; }\n\n.carousel-item-next.carousel-item-left,\n.carousel-item-prev.carousel-item-right {\n  -webkit-transform: translateX(0);\n          transform: translateX(0); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-item-next.carousel-item-left,\n    .carousel-item-prev.carousel-item-right {\n      -webkit-transform: translate3d(0, 0, 0);\n              transform: translate3d(0, 0, 0); } }\n\n.carousel-item-next,\n.active.carousel-item-right {\n  -webkit-transform: translateX(100%);\n          transform: translateX(100%); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-item-next,\n    .active.carousel-item-right {\n      -webkit-transform: translate3d(100%, 0, 0);\n              transform: translate3d(100%, 0, 0); } }\n\n.carousel-item-prev,\n.active.carousel-item-left {\n  -webkit-transform: translateX(-100%);\n          transform: translateX(-100%); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-item-prev,\n    .active.carousel-item-left {\n      -webkit-transform: translate3d(-100%, 0, 0);\n              transform: translate3d(-100%, 0, 0); } }\n\n.carousel-fade .carousel-item {\n  opacity: 0;\n  transition-duration: .6s;\n  transition-property: opacity; }\n\n.carousel-fade .carousel-item.active,\n.carousel-fade .carousel-item-next.carousel-item-left,\n.carousel-fade .carousel-item-prev.carousel-item-right {\n  opacity: 1; }\n\n.carousel-fade .active.carousel-item-left,\n.carousel-fade .active.carousel-item-right {\n  opacity: 0; }\n\n.carousel-fade .carousel-item-next,\n.carousel-fade .carousel-item-prev,\n.carousel-fade .carousel-item.active,\n.carousel-fade .active.carousel-item-left,\n.carousel-fade .active.carousel-item-prev {\n  -webkit-transform: translateX(0);\n          transform: translateX(0); }\n  @supports ((-webkit-transform-style: preserve-3d) or (transform-style: preserve-3d)) {\n    .carousel-fade .carousel-item-next,\n    .carousel-fade .carousel-item-prev,\n    .carousel-fade .carousel-item.active,\n    .carousel-fade .active.carousel-item-left,\n    .carousel-fade .active.carousel-item-prev {\n      -webkit-transform: translate3d(0, 0, 0);\n              transform: translate3d(0, 0, 0); } }\n\n.carousel-control-prev,\n.carousel-control-next {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 15%;\n  color: #fff;\n  text-align: center;\n  opacity: 0.5; }\n  .carousel-control-prev:hover, .carousel-control-prev:focus,\n  .carousel-control-next:hover,\n  .carousel-control-next:focus {\n    color: #fff;\n    text-decoration: none;\n    outline: 0;\n    opacity: .9; }\n\n.carousel-control-prev {\n  left: 0; }\n\n.carousel-control-next {\n  right: 0; }\n\n.carousel-control-prev-icon,\n.carousel-control-next-icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background: transparent no-repeat center center;\n  background-size: 100% 100%; }\n\n.carousel-control-prev-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E\"); }\n\n.carousel-control-next-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E\"); }\n\n.carousel-indicators {\n  position: absolute;\n  right: 0;\n  bottom: 10px;\n  left: 0;\n  z-index: 15;\n  display: flex;\n  justify-content: center;\n  padding-left: 0;\n  margin-right: 15%;\n  margin-left: 15%;\n  list-style: none; }\n  .carousel-indicators li {\n    position: relative;\n    flex: 0 1 auto;\n    width: 30px;\n    height: 3px;\n    margin-right: 3px;\n    margin-left: 3px;\n    text-indent: -999px;\n    cursor: pointer;\n    background-color: rgba(255, 255, 255, 0.5); }\n    .carousel-indicators li::before {\n      position: absolute;\n      top: -10px;\n      left: 0;\n      display: inline-block;\n      width: 100%;\n      height: 10px;\n      content: \"\"; }\n    .carousel-indicators li::after {\n      position: absolute;\n      bottom: -10px;\n      left: 0;\n      display: inline-block;\n      width: 100%;\n      height: 10px;\n      content: \"\"; }\n  .carousel-indicators .active {\n    background-color: #fff; }\n\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center; }\n\n.align-baseline {\n  vertical-align: baseline !important; }\n\n.align-top {\n  vertical-align: top !important; }\n\n.align-middle {\n  vertical-align: middle !important; }\n\n.align-bottom {\n  vertical-align: bottom !important; }\n\n.align-text-bottom {\n  vertical-align: text-bottom !important; }\n\n.align-text-top {\n  vertical-align: text-top !important; }\n\n.bg-primary {\n  background-color: #007bff !important; }\n\na.bg-primary:hover, a.bg-primary:focus,\nbutton.bg-primary:hover,\nbutton.bg-primary:focus {\n  background-color: #0062cc !important; }\n\n.bg-secondary {\n  background-color: #6c757d !important; }\n\na.bg-secondary:hover, a.bg-secondary:focus,\nbutton.bg-secondary:hover,\nbutton.bg-secondary:focus {\n  background-color: #545b62 !important; }\n\n.bg-success {\n  background-color: #28a745 !important; }\n\na.bg-success:hover, a.bg-success:focus,\nbutton.bg-success:hover,\nbutton.bg-success:focus {\n  background-color: #1e7e34 !important; }\n\n.bg-info {\n  background-color: #17a2b8 !important; }\n\na.bg-info:hover, a.bg-info:focus,\nbutton.bg-info:hover,\nbutton.bg-info:focus {\n  background-color: #117a8b !important; }\n\n.bg-warning {\n  background-color: #ffc107 !important; }\n\na.bg-warning:hover, a.bg-warning:focus,\nbutton.bg-warning:hover,\nbutton.bg-warning:focus {\n  background-color: #d39e00 !important; }\n\n.bg-danger {\n  background-color: #dc3545 !important; }\n\na.bg-danger:hover, a.bg-danger:focus,\nbutton.bg-danger:hover,\nbutton.bg-danger:focus {\n  background-color: #bd2130 !important; }\n\n.bg-light {\n  background-color: #f8f9fa !important; }\n\na.bg-light:hover, a.bg-light:focus,\nbutton.bg-light:hover,\nbutton.bg-light:focus {\n  background-color: #dae0e5 !important; }\n\n.bg-dark {\n  background-color: #343a40 !important; }\n\na.bg-dark:hover, a.bg-dark:focus,\nbutton.bg-dark:hover,\nbutton.bg-dark:focus {\n  background-color: #1d2124 !important; }\n\n.bg-white {\n  background-color: #fff !important; }\n\n.bg-transparent {\n  background-color: transparent !important; }\n\n.border {\n  border: 1px solid #ff6600 !important; }\n\n.border-top {\n  border-top: 1px solid #ff6600 !important; }\n\n.border-right {\n  border-right: 1px solid #ff6600 !important; }\n\n.border-bottom {\n  border-bottom: 1px solid #ff6600 !important; }\n\n.border-left {\n  border-left: 1px solid #ff6600 !important; }\n\n.border-0 {\n  border: 0 !important; }\n\n.border-top-0 {\n  border-top: 0 !important; }\n\n.border-right-0 {\n  border-right: 0 !important; }\n\n.border-bottom-0 {\n  border-bottom: 0 !important; }\n\n.border-left-0 {\n  border-left: 0 !important; }\n\n.border-primary {\n  border-color: #007bff !important; }\n\n.border-secondary {\n  border-color: #6c757d !important; }\n\n.border-success {\n  border-color: #28a745 !important; }\n\n.border-info {\n  border-color: #17a2b8 !important; }\n\n.border-warning {\n  border-color: #ffc107 !important; }\n\n.border-danger {\n  border-color: #dc3545 !important; }\n\n.border-light {\n  border-color: #f8f9fa !important; }\n\n.border-dark {\n  border-color: #343a40 !important; }\n\n.border-white {\n  border-color: #fff !important; }\n\n.rounded {\n  border-radius: 0.25rem !important; }\n\n.rounded-top {\n  border-top-left-radius: 0.25rem !important;\n  border-top-right-radius: 0.25rem !important; }\n\n.rounded-right {\n  border-top-right-radius: 0.25rem !important;\n  border-bottom-right-radius: 0.25rem !important; }\n\n.rounded-bottom {\n  border-bottom-right-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important; }\n\n.rounded-left {\n  border-top-left-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important; }\n\n.rounded-circle {\n  border-radius: 50% !important; }\n\n.rounded-0 {\n  border-radius: 0 !important; }\n\n.clearfix::after {\n  display: block;\n  clear: both;\n  content: \"\"; }\n\n.d-none {\n  display: none !important; }\n\n.d-inline {\n  display: inline !important; }\n\n.d-inline-block {\n  display: inline-block !important; }\n\n.d-block {\n  display: block !important; }\n\n.d-table {\n  display: table !important; }\n\n.d-table-row {\n  display: table-row !important; }\n\n.d-table-cell {\n  display: table-cell !important; }\n\n.d-flex {\n  display: flex !important; }\n\n.d-inline-flex {\n  display: inline-flex !important; }\n\n@media (min-width: 576px) {\n  .d-sm-none {\n    display: none !important; }\n  .d-sm-inline {\n    display: inline !important; }\n  .d-sm-inline-block {\n    display: inline-block !important; }\n  .d-sm-block {\n    display: block !important; }\n  .d-sm-table {\n    display: table !important; }\n  .d-sm-table-row {\n    display: table-row !important; }\n  .d-sm-table-cell {\n    display: table-cell !important; }\n  .d-sm-flex {\n    display: flex !important; }\n  .d-sm-inline-flex {\n    display: inline-flex !important; } }\n\n@media (min-width: 768px) {\n  .d-md-none {\n    display: none !important; }\n  .d-md-inline {\n    display: inline !important; }\n  .d-md-inline-block {\n    display: inline-block !important; }\n  .d-md-block {\n    display: block !important; }\n  .d-md-table {\n    display: table !important; }\n  .d-md-table-row {\n    display: table-row !important; }\n  .d-md-table-cell {\n    display: table-cell !important; }\n  .d-md-flex {\n    display: flex !important; }\n  .d-md-inline-flex {\n    display: inline-flex !important; } }\n\n@media (min-width: 992px) {\n  .d-lg-none {\n    display: none !important; }\n  .d-lg-inline {\n    display: inline !important; }\n  .d-lg-inline-block {\n    display: inline-block !important; }\n  .d-lg-block {\n    display: block !important; }\n  .d-lg-table {\n    display: table !important; }\n  .d-lg-table-row {\n    display: table-row !important; }\n  .d-lg-table-cell {\n    display: table-cell !important; }\n  .d-lg-flex {\n    display: flex !important; }\n  .d-lg-inline-flex {\n    display: inline-flex !important; } }\n\n@media (min-width: 1200px) {\n  .d-xl-none {\n    display: none !important; }\n  .d-xl-inline {\n    display: inline !important; }\n  .d-xl-inline-block {\n    display: inline-block !important; }\n  .d-xl-block {\n    display: block !important; }\n  .d-xl-table {\n    display: table !important; }\n  .d-xl-table-row {\n    display: table-row !important; }\n  .d-xl-table-cell {\n    display: table-cell !important; }\n  .d-xl-flex {\n    display: flex !important; }\n  .d-xl-inline-flex {\n    display: inline-flex !important; } }\n\n@media print {\n  .d-print-none {\n    display: none !important; }\n  .d-print-inline {\n    display: inline !important; }\n  .d-print-inline-block {\n    display: inline-block !important; }\n  .d-print-block {\n    display: block !important; }\n  .d-print-table {\n    display: table !important; }\n  .d-print-table-row {\n    display: table-row !important; }\n  .d-print-table-cell {\n    display: table-cell !important; }\n  .d-print-flex {\n    display: flex !important; }\n  .d-print-inline-flex {\n    display: inline-flex !important; } }\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  width: 100%;\n  padding: 0;\n  overflow: hidden; }\n  .embed-responsive::before {\n    display: block;\n    content: \"\"; }\n  .embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    border: 0; }\n\n.embed-responsive-21by9::before {\n  padding-top: 42.85714%; }\n\n.embed-responsive-16by9::before {\n  padding-top: 56.25%; }\n\n.embed-responsive-4by3::before {\n  padding-top: 75%; }\n\n.embed-responsive-1by1::before {\n  padding-top: 100%; }\n\n.flex-row {\n  flex-direction: row !important; }\n\n.flex-column {\n  flex-direction: column !important; }\n\n.flex-row-reverse {\n  flex-direction: row-reverse !important; }\n\n.flex-column-reverse {\n  flex-direction: column-reverse !important; }\n\n.flex-wrap {\n  flex-wrap: wrap !important; }\n\n.flex-nowrap {\n  flex-wrap: nowrap !important; }\n\n.flex-wrap-reverse {\n  flex-wrap: wrap-reverse !important; }\n\n.flex-fill {\n  flex: 1 1 auto !important; }\n\n.flex-grow-0 {\n  flex-grow: 0 !important; }\n\n.flex-grow-1 {\n  flex-grow: 1 !important; }\n\n.flex-shrink-0 {\n  flex-shrink: 0 !important; }\n\n.flex-shrink-1 {\n  flex-shrink: 1 !important; }\n\n.justify-content-start {\n  justify-content: flex-start !important; }\n\n.justify-content-end {\n  justify-content: flex-end !important; }\n\n.justify-content-center {\n  justify-content: center !important; }\n\n.justify-content-between {\n  justify-content: space-between !important; }\n\n.justify-content-around {\n  justify-content: space-around !important; }\n\n.align-items-start {\n  align-items: flex-start !important; }\n\n.align-items-end {\n  align-items: flex-end !important; }\n\n.align-items-center {\n  align-items: center !important; }\n\n.align-items-baseline {\n  align-items: baseline !important; }\n\n.align-items-stretch {\n  align-items: stretch !important; }\n\n.align-content-start {\n  align-content: flex-start !important; }\n\n.align-content-end {\n  align-content: flex-end !important; }\n\n.align-content-center {\n  align-content: center !important; }\n\n.align-content-between {\n  align-content: space-between !important; }\n\n.align-content-around {\n  align-content: space-around !important; }\n\n.align-content-stretch {\n  align-content: stretch !important; }\n\n.align-self-auto {\n  align-self: auto !important; }\n\n.align-self-start {\n  align-self: flex-start !important; }\n\n.align-self-end {\n  align-self: flex-end !important; }\n\n.align-self-center {\n  align-self: center !important; }\n\n.align-self-baseline {\n  align-self: baseline !important; }\n\n.align-self-stretch {\n  align-self: stretch !important; }\n\n@media (min-width: 576px) {\n  .flex-sm-row {\n    flex-direction: row !important; }\n  .flex-sm-column {\n    flex-direction: column !important; }\n  .flex-sm-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-sm-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-sm-wrap {\n    flex-wrap: wrap !important; }\n  .flex-sm-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-sm-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-sm-fill {\n    flex: 1 1 auto !important; }\n  .flex-sm-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-sm-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-sm-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-sm-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-sm-start {\n    justify-content: flex-start !important; }\n  .justify-content-sm-end {\n    justify-content: flex-end !important; }\n  .justify-content-sm-center {\n    justify-content: center !important; }\n  .justify-content-sm-between {\n    justify-content: space-between !important; }\n  .justify-content-sm-around {\n    justify-content: space-around !important; }\n  .align-items-sm-start {\n    align-items: flex-start !important; }\n  .align-items-sm-end {\n    align-items: flex-end !important; }\n  .align-items-sm-center {\n    align-items: center !important; }\n  .align-items-sm-baseline {\n    align-items: baseline !important; }\n  .align-items-sm-stretch {\n    align-items: stretch !important; }\n  .align-content-sm-start {\n    align-content: flex-start !important; }\n  .align-content-sm-end {\n    align-content: flex-end !important; }\n  .align-content-sm-center {\n    align-content: center !important; }\n  .align-content-sm-between {\n    align-content: space-between !important; }\n  .align-content-sm-around {\n    align-content: space-around !important; }\n  .align-content-sm-stretch {\n    align-content: stretch !important; }\n  .align-self-sm-auto {\n    align-self: auto !important; }\n  .align-self-sm-start {\n    align-self: flex-start !important; }\n  .align-self-sm-end {\n    align-self: flex-end !important; }\n  .align-self-sm-center {\n    align-self: center !important; }\n  .align-self-sm-baseline {\n    align-self: baseline !important; }\n  .align-self-sm-stretch {\n    align-self: stretch !important; } }\n\n@media (min-width: 768px) {\n  .flex-md-row {\n    flex-direction: row !important; }\n  .flex-md-column {\n    flex-direction: column !important; }\n  .flex-md-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-md-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-md-wrap {\n    flex-wrap: wrap !important; }\n  .flex-md-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-md-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-md-fill {\n    flex: 1 1 auto !important; }\n  .flex-md-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-md-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-md-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-md-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-md-start {\n    justify-content: flex-start !important; }\n  .justify-content-md-end {\n    justify-content: flex-end !important; }\n  .justify-content-md-center {\n    justify-content: center !important; }\n  .justify-content-md-between {\n    justify-content: space-between !important; }\n  .justify-content-md-around {\n    justify-content: space-around !important; }\n  .align-items-md-start {\n    align-items: flex-start !important; }\n  .align-items-md-end {\n    align-items: flex-end !important; }\n  .align-items-md-center {\n    align-items: center !important; }\n  .align-items-md-baseline {\n    align-items: baseline !important; }\n  .align-items-md-stretch {\n    align-items: stretch !important; }\n  .align-content-md-start {\n    align-content: flex-start !important; }\n  .align-content-md-end {\n    align-content: flex-end !important; }\n  .align-content-md-center {\n    align-content: center !important; }\n  .align-content-md-between {\n    align-content: space-between !important; }\n  .align-content-md-around {\n    align-content: space-around !important; }\n  .align-content-md-stretch {\n    align-content: stretch !important; }\n  .align-self-md-auto {\n    align-self: auto !important; }\n  .align-self-md-start {\n    align-self: flex-start !important; }\n  .align-self-md-end {\n    align-self: flex-end !important; }\n  .align-self-md-center {\n    align-self: center !important; }\n  .align-self-md-baseline {\n    align-self: baseline !important; }\n  .align-self-md-stretch {\n    align-self: stretch !important; } }\n\n@media (min-width: 992px) {\n  .flex-lg-row {\n    flex-direction: row !important; }\n  .flex-lg-column {\n    flex-direction: column !important; }\n  .flex-lg-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-lg-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-lg-wrap {\n    flex-wrap: wrap !important; }\n  .flex-lg-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-lg-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-lg-fill {\n    flex: 1 1 auto !important; }\n  .flex-lg-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-lg-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-lg-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-lg-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-lg-start {\n    justify-content: flex-start !important; }\n  .justify-content-lg-end {\n    justify-content: flex-end !important; }\n  .justify-content-lg-center {\n    justify-content: center !important; }\n  .justify-content-lg-between {\n    justify-content: space-between !important; }\n  .justify-content-lg-around {\n    justify-content: space-around !important; }\n  .align-items-lg-start {\n    align-items: flex-start !important; }\n  .align-items-lg-end {\n    align-items: flex-end !important; }\n  .align-items-lg-center {\n    align-items: center !important; }\n  .align-items-lg-baseline {\n    align-items: baseline !important; }\n  .align-items-lg-stretch {\n    align-items: stretch !important; }\n  .align-content-lg-start {\n    align-content: flex-start !important; }\n  .align-content-lg-end {\n    align-content: flex-end !important; }\n  .align-content-lg-center {\n    align-content: center !important; }\n  .align-content-lg-between {\n    align-content: space-between !important; }\n  .align-content-lg-around {\n    align-content: space-around !important; }\n  .align-content-lg-stretch {\n    align-content: stretch !important; }\n  .align-self-lg-auto {\n    align-self: auto !important; }\n  .align-self-lg-start {\n    align-self: flex-start !important; }\n  .align-self-lg-end {\n    align-self: flex-end !important; }\n  .align-self-lg-center {\n    align-self: center !important; }\n  .align-self-lg-baseline {\n    align-self: baseline !important; }\n  .align-self-lg-stretch {\n    align-self: stretch !important; } }\n\n@media (min-width: 1200px) {\n  .flex-xl-row {\n    flex-direction: row !important; }\n  .flex-xl-column {\n    flex-direction: column !important; }\n  .flex-xl-row-reverse {\n    flex-direction: row-reverse !important; }\n  .flex-xl-column-reverse {\n    flex-direction: column-reverse !important; }\n  .flex-xl-wrap {\n    flex-wrap: wrap !important; }\n  .flex-xl-nowrap {\n    flex-wrap: nowrap !important; }\n  .flex-xl-wrap-reverse {\n    flex-wrap: wrap-reverse !important; }\n  .flex-xl-fill {\n    flex: 1 1 auto !important; }\n  .flex-xl-grow-0 {\n    flex-grow: 0 !important; }\n  .flex-xl-grow-1 {\n    flex-grow: 1 !important; }\n  .flex-xl-shrink-0 {\n    flex-shrink: 0 !important; }\n  .flex-xl-shrink-1 {\n    flex-shrink: 1 !important; }\n  .justify-content-xl-start {\n    justify-content: flex-start !important; }\n  .justify-content-xl-end {\n    justify-content: flex-end !important; }\n  .justify-content-xl-center {\n    justify-content: center !important; }\n  .justify-content-xl-between {\n    justify-content: space-between !important; }\n  .justify-content-xl-around {\n    justify-content: space-around !important; }\n  .align-items-xl-start {\n    align-items: flex-start !important; }\n  .align-items-xl-end {\n    align-items: flex-end !important; }\n  .align-items-xl-center {\n    align-items: center !important; }\n  .align-items-xl-baseline {\n    align-items: baseline !important; }\n  .align-items-xl-stretch {\n    align-items: stretch !important; }\n  .align-content-xl-start {\n    align-content: flex-start !important; }\n  .align-content-xl-end {\n    align-content: flex-end !important; }\n  .align-content-xl-center {\n    align-content: center !important; }\n  .align-content-xl-between {\n    align-content: space-between !important; }\n  .align-content-xl-around {\n    align-content: space-around !important; }\n  .align-content-xl-stretch {\n    align-content: stretch !important; }\n  .align-self-xl-auto {\n    align-self: auto !important; }\n  .align-self-xl-start {\n    align-self: flex-start !important; }\n  .align-self-xl-end {\n    align-self: flex-end !important; }\n  .align-self-xl-center {\n    align-self: center !important; }\n  .align-self-xl-baseline {\n    align-self: baseline !important; }\n  .align-self-xl-stretch {\n    align-self: stretch !important; } }\n\n.float-left {\n  float: left !important; }\n\n.float-right {\n  float: right !important; }\n\n.float-none {\n  float: none !important; }\n\n@media (min-width: 576px) {\n  .float-sm-left {\n    float: left !important; }\n  .float-sm-right {\n    float: right !important; }\n  .float-sm-none {\n    float: none !important; } }\n\n@media (min-width: 768px) {\n  .float-md-left {\n    float: left !important; }\n  .float-md-right {\n    float: right !important; }\n  .float-md-none {\n    float: none !important; } }\n\n@media (min-width: 992px) {\n  .float-lg-left {\n    float: left !important; }\n  .float-lg-right {\n    float: right !important; }\n  .float-lg-none {\n    float: none !important; } }\n\n@media (min-width: 1200px) {\n  .float-xl-left {\n    float: left !important; }\n  .float-xl-right {\n    float: right !important; }\n  .float-xl-none {\n    float: none !important; } }\n\n.position-static {\n  position: static !important; }\n\n.position-relative {\n  position: relative !important; }\n\n.position-absolute {\n  position: absolute !important; }\n\n.position-fixed {\n  position: fixed !important; }\n\n.position-sticky {\n  position: -webkit-sticky !important;\n  position: sticky !important; }\n\n.fixed-top {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n\n.fixed-bottom {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1030; }\n\n@supports ((position: -webkit-sticky) or (position: sticky)) {\n  .sticky-top {\n    position: -webkit-sticky;\n    position: sticky;\n    top: 0;\n    z-index: 1020; } }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  overflow: visible;\n  clip: auto;\n  white-space: normal; }\n\n.shadow-sm {\n  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important; }\n\n.shadow {\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; }\n\n.shadow-lg {\n  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important; }\n\n.shadow-none {\n  box-shadow: none !important; }\n\n.w-25 {\n  width: 25% !important; }\n\n.w-50 {\n  width: 50% !important; }\n\n.w-75 {\n  width: 75% !important; }\n\n.w-100 {\n  width: 100% !important; }\n\n.w-auto {\n  width: auto !important; }\n\n.h-25 {\n  height: 25% !important; }\n\n.h-50 {\n  height: 50% !important; }\n\n.h-75 {\n  height: 75% !important; }\n\n.h-100 {\n  height: 100% !important; }\n\n.h-auto {\n  height: auto !important; }\n\n.mw-100 {\n  max-width: 100% !important; }\n\n.mh-100 {\n  max-height: 100% !important; }\n\n.m-0 {\n  margin: 0 !important; }\n\n.mt-0,\n.my-0 {\n  margin-top: 0 !important; }\n\n.mr-0,\n.mx-0 {\n  margin-right: 0 !important; }\n\n.mb-0,\n.my-0 {\n  margin-bottom: 0 !important; }\n\n.ml-0,\n.mx-0 {\n  margin-left: 0 !important; }\n\n.m-1 {\n  margin: 0.25rem !important; }\n\n.mt-1,\n.my-1 {\n  margin-top: 0.25rem !important; }\n\n.mr-1,\n.mx-1 {\n  margin-right: 0.25rem !important; }\n\n.mb-1,\n.my-1 {\n  margin-bottom: 0.25rem !important; }\n\n.ml-1,\n.mx-1 {\n  margin-left: 0.25rem !important; }\n\n.m-2 {\n  margin: 0.5rem !important; }\n\n.mt-2,\n.my-2 {\n  margin-top: 0.5rem !important; }\n\n.mr-2,\n.mx-2 {\n  margin-right: 0.5rem !important; }\n\n.mb-2,\n.my-2 {\n  margin-bottom: 0.5rem !important; }\n\n.ml-2,\n.mx-2 {\n  margin-left: 0.5rem !important; }\n\n.m-3 {\n  margin: 1rem !important; }\n\n.mt-3,\n.my-3 {\n  margin-top: 1rem !important; }\n\n.mr-3,\n.mx-3 {\n  margin-right: 1rem !important; }\n\n.mb-3,\n.my-3 {\n  margin-bottom: 1rem !important; }\n\n.ml-3,\n.mx-3 {\n  margin-left: 1rem !important; }\n\n.m-4 {\n  margin: 1.5rem !important; }\n\n.mt-4,\n.my-4 {\n  margin-top: 1.5rem !important; }\n\n.mr-4,\n.mx-4 {\n  margin-right: 1.5rem !important; }\n\n.mb-4,\n.my-4 {\n  margin-bottom: 1.5rem !important; }\n\n.ml-4,\n.mx-4 {\n  margin-left: 1.5rem !important; }\n\n.m-5 {\n  margin: 3rem !important; }\n\n.mt-5,\n.my-5 {\n  margin-top: 3rem !important; }\n\n.mr-5,\n.mx-5 {\n  margin-right: 3rem !important; }\n\n.mb-5,\n.my-5 {\n  margin-bottom: 3rem !important; }\n\n.ml-5,\n.mx-5 {\n  margin-left: 3rem !important; }\n\n.p-0 {\n  padding: 0 !important; }\n\n.pt-0,\n.py-0 {\n  padding-top: 0 !important; }\n\n.pr-0,\n.px-0 {\n  padding-right: 0 !important; }\n\n.pb-0,\n.py-0 {\n  padding-bottom: 0 !important; }\n\n.pl-0,\n.px-0 {\n  padding-left: 0 !important; }\n\n.p-1 {\n  padding: 0.25rem !important; }\n\n.pt-1,\n.py-1 {\n  padding-top: 0.25rem !important; }\n\n.pr-1,\n.px-1 {\n  padding-right: 0.25rem !important; }\n\n.pb-1,\n.py-1 {\n  padding-bottom: 0.25rem !important; }\n\n.pl-1,\n.px-1 {\n  padding-left: 0.25rem !important; }\n\n.p-2 {\n  padding: 0.5rem !important; }\n\n.pt-2,\n.py-2 {\n  padding-top: 0.5rem !important; }\n\n.pr-2,\n.px-2 {\n  padding-right: 0.5rem !important; }\n\n.pb-2,\n.py-2 {\n  padding-bottom: 0.5rem !important; }\n\n.pl-2,\n.px-2 {\n  padding-left: 0.5rem !important; }\n\n.p-3 {\n  padding: 1rem !important; }\n\n.pt-3,\n.py-3 {\n  padding-top: 1rem !important; }\n\n.pr-3,\n.px-3 {\n  padding-right: 1rem !important; }\n\n.pb-3,\n.py-3 {\n  padding-bottom: 1rem !important; }\n\n.pl-3,\n.px-3 {\n  padding-left: 1rem !important; }\n\n.p-4 {\n  padding: 1.5rem !important; }\n\n.pt-4,\n.py-4 {\n  padding-top: 1.5rem !important; }\n\n.pr-4,\n.px-4 {\n  padding-right: 1.5rem !important; }\n\n.pb-4,\n.py-4 {\n  padding-bottom: 1.5rem !important; }\n\n.pl-4,\n.px-4 {\n  padding-left: 1.5rem !important; }\n\n.p-5 {\n  padding: 3rem !important; }\n\n.pt-5,\n.py-5 {\n  padding-top: 3rem !important; }\n\n.pr-5,\n.px-5 {\n  padding-right: 3rem !important; }\n\n.pb-5,\n.py-5 {\n  padding-bottom: 3rem !important; }\n\n.pl-5,\n.px-5 {\n  padding-left: 3rem !important; }\n\n.m-auto {\n  margin: auto !important; }\n\n.mt-auto,\n.my-auto {\n  margin-top: auto !important; }\n\n.mr-auto,\n.mx-auto {\n  margin-right: auto !important; }\n\n.mb-auto,\n.my-auto {\n  margin-bottom: auto !important; }\n\n.ml-auto,\n.mx-auto {\n  margin-left: auto !important; }\n\n@media (min-width: 576px) {\n  .m-sm-0 {\n    margin: 0 !important; }\n  .mt-sm-0,\n  .my-sm-0 {\n    margin-top: 0 !important; }\n  .mr-sm-0,\n  .mx-sm-0 {\n    margin-right: 0 !important; }\n  .mb-sm-0,\n  .my-sm-0 {\n    margin-bottom: 0 !important; }\n  .ml-sm-0,\n  .mx-sm-0 {\n    margin-left: 0 !important; }\n  .m-sm-1 {\n    margin: 0.25rem !important; }\n  .mt-sm-1,\n  .my-sm-1 {\n    margin-top: 0.25rem !important; }\n  .mr-sm-1,\n  .mx-sm-1 {\n    margin-right: 0.25rem !important; }\n  .mb-sm-1,\n  .my-sm-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-sm-1,\n  .mx-sm-1 {\n    margin-left: 0.25rem !important; }\n  .m-sm-2 {\n    margin: 0.5rem !important; }\n  .mt-sm-2,\n  .my-sm-2 {\n    margin-top: 0.5rem !important; }\n  .mr-sm-2,\n  .mx-sm-2 {\n    margin-right: 0.5rem !important; }\n  .mb-sm-2,\n  .my-sm-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-sm-2,\n  .mx-sm-2 {\n    margin-left: 0.5rem !important; }\n  .m-sm-3 {\n    margin: 1rem !important; }\n  .mt-sm-3,\n  .my-sm-3 {\n    margin-top: 1rem !important; }\n  .mr-sm-3,\n  .mx-sm-3 {\n    margin-right: 1rem !important; }\n  .mb-sm-3,\n  .my-sm-3 {\n    margin-bottom: 1rem !important; }\n  .ml-sm-3,\n  .mx-sm-3 {\n    margin-left: 1rem !important; }\n  .m-sm-4 {\n    margin: 1.5rem !important; }\n  .mt-sm-4,\n  .my-sm-4 {\n    margin-top: 1.5rem !important; }\n  .mr-sm-4,\n  .mx-sm-4 {\n    margin-right: 1.5rem !important; }\n  .mb-sm-4,\n  .my-sm-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-sm-4,\n  .mx-sm-4 {\n    margin-left: 1.5rem !important; }\n  .m-sm-5 {\n    margin: 3rem !important; }\n  .mt-sm-5,\n  .my-sm-5 {\n    margin-top: 3rem !important; }\n  .mr-sm-5,\n  .mx-sm-5 {\n    margin-right: 3rem !important; }\n  .mb-sm-5,\n  .my-sm-5 {\n    margin-bottom: 3rem !important; }\n  .ml-sm-5,\n  .mx-sm-5 {\n    margin-left: 3rem !important; }\n  .p-sm-0 {\n    padding: 0 !important; }\n  .pt-sm-0,\n  .py-sm-0 {\n    padding-top: 0 !important; }\n  .pr-sm-0,\n  .px-sm-0 {\n    padding-right: 0 !important; }\n  .pb-sm-0,\n  .py-sm-0 {\n    padding-bottom: 0 !important; }\n  .pl-sm-0,\n  .px-sm-0 {\n    padding-left: 0 !important; }\n  .p-sm-1 {\n    padding: 0.25rem !important; }\n  .pt-sm-1,\n  .py-sm-1 {\n    padding-top: 0.25rem !important; }\n  .pr-sm-1,\n  .px-sm-1 {\n    padding-right: 0.25rem !important; }\n  .pb-sm-1,\n  .py-sm-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-sm-1,\n  .px-sm-1 {\n    padding-left: 0.25rem !important; }\n  .p-sm-2 {\n    padding: 0.5rem !important; }\n  .pt-sm-2,\n  .py-sm-2 {\n    padding-top: 0.5rem !important; }\n  .pr-sm-2,\n  .px-sm-2 {\n    padding-right: 0.5rem !important; }\n  .pb-sm-2,\n  .py-sm-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-sm-2,\n  .px-sm-2 {\n    padding-left: 0.5rem !important; }\n  .p-sm-3 {\n    padding: 1rem !important; }\n  .pt-sm-3,\n  .py-sm-3 {\n    padding-top: 1rem !important; }\n  .pr-sm-3,\n  .px-sm-3 {\n    padding-right: 1rem !important; }\n  .pb-sm-3,\n  .py-sm-3 {\n    padding-bottom: 1rem !important; }\n  .pl-sm-3,\n  .px-sm-3 {\n    padding-left: 1rem !important; }\n  .p-sm-4 {\n    padding: 1.5rem !important; }\n  .pt-sm-4,\n  .py-sm-4 {\n    padding-top: 1.5rem !important; }\n  .pr-sm-4,\n  .px-sm-4 {\n    padding-right: 1.5rem !important; }\n  .pb-sm-4,\n  .py-sm-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-sm-4,\n  .px-sm-4 {\n    padding-left: 1.5rem !important; }\n  .p-sm-5 {\n    padding: 3rem !important; }\n  .pt-sm-5,\n  .py-sm-5 {\n    padding-top: 3rem !important; }\n  .pr-sm-5,\n  .px-sm-5 {\n    padding-right: 3rem !important; }\n  .pb-sm-5,\n  .py-sm-5 {\n    padding-bottom: 3rem !important; }\n  .pl-sm-5,\n  .px-sm-5 {\n    padding-left: 3rem !important; }\n  .m-sm-auto {\n    margin: auto !important; }\n  .mt-sm-auto,\n  .my-sm-auto {\n    margin-top: auto !important; }\n  .mr-sm-auto,\n  .mx-sm-auto {\n    margin-right: auto !important; }\n  .mb-sm-auto,\n  .my-sm-auto {\n    margin-bottom: auto !important; }\n  .ml-sm-auto,\n  .mx-sm-auto {\n    margin-left: auto !important; } }\n\n@media (min-width: 768px) {\n  .m-md-0 {\n    margin: 0 !important; }\n  .mt-md-0,\n  .my-md-0 {\n    margin-top: 0 !important; }\n  .mr-md-0,\n  .mx-md-0 {\n    margin-right: 0 !important; }\n  .mb-md-0,\n  .my-md-0 {\n    margin-bottom: 0 !important; }\n  .ml-md-0,\n  .mx-md-0 {\n    margin-left: 0 !important; }\n  .m-md-1 {\n    margin: 0.25rem !important; }\n  .mt-md-1,\n  .my-md-1 {\n    margin-top: 0.25rem !important; }\n  .mr-md-1,\n  .mx-md-1 {\n    margin-right: 0.25rem !important; }\n  .mb-md-1,\n  .my-md-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-md-1,\n  .mx-md-1 {\n    margin-left: 0.25rem !important; }\n  .m-md-2 {\n    margin: 0.5rem !important; }\n  .mt-md-2,\n  .my-md-2 {\n    margin-top: 0.5rem !important; }\n  .mr-md-2,\n  .mx-md-2 {\n    margin-right: 0.5rem !important; }\n  .mb-md-2,\n  .my-md-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-md-2,\n  .mx-md-2 {\n    margin-left: 0.5rem !important; }\n  .m-md-3 {\n    margin: 1rem !important; }\n  .mt-md-3,\n  .my-md-3 {\n    margin-top: 1rem !important; }\n  .mr-md-3,\n  .mx-md-3 {\n    margin-right: 1rem !important; }\n  .mb-md-3,\n  .my-md-3 {\n    margin-bottom: 1rem !important; }\n  .ml-md-3,\n  .mx-md-3 {\n    margin-left: 1rem !important; }\n  .m-md-4 {\n    margin: 1.5rem !important; }\n  .mt-md-4,\n  .my-md-4 {\n    margin-top: 1.5rem !important; }\n  .mr-md-4,\n  .mx-md-4 {\n    margin-right: 1.5rem !important; }\n  .mb-md-4,\n  .my-md-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-md-4,\n  .mx-md-4 {\n    margin-left: 1.5rem !important; }\n  .m-md-5 {\n    margin: 3rem !important; }\n  .mt-md-5,\n  .my-md-5 {\n    margin-top: 3rem !important; }\n  .mr-md-5,\n  .mx-md-5 {\n    margin-right: 3rem !important; }\n  .mb-md-5,\n  .my-md-5 {\n    margin-bottom: 3rem !important; }\n  .ml-md-5,\n  .mx-md-5 {\n    margin-left: 3rem !important; }\n  .p-md-0 {\n    padding: 0 !important; }\n  .pt-md-0,\n  .py-md-0 {\n    padding-top: 0 !important; }\n  .pr-md-0,\n  .px-md-0 {\n    padding-right: 0 !important; }\n  .pb-md-0,\n  .py-md-0 {\n    padding-bottom: 0 !important; }\n  .pl-md-0,\n  .px-md-0 {\n    padding-left: 0 !important; }\n  .p-md-1 {\n    padding: 0.25rem !important; }\n  .pt-md-1,\n  .py-md-1 {\n    padding-top: 0.25rem !important; }\n  .pr-md-1,\n  .px-md-1 {\n    padding-right: 0.25rem !important; }\n  .pb-md-1,\n  .py-md-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-md-1,\n  .px-md-1 {\n    padding-left: 0.25rem !important; }\n  .p-md-2 {\n    padding: 0.5rem !important; }\n  .pt-md-2,\n  .py-md-2 {\n    padding-top: 0.5rem !important; }\n  .pr-md-2,\n  .px-md-2 {\n    padding-right: 0.5rem !important; }\n  .pb-md-2,\n  .py-md-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-md-2,\n  .px-md-2 {\n    padding-left: 0.5rem !important; }\n  .p-md-3 {\n    padding: 1rem !important; }\n  .pt-md-3,\n  .py-md-3 {\n    padding-top: 1rem !important; }\n  .pr-md-3,\n  .px-md-3 {\n    padding-right: 1rem !important; }\n  .pb-md-3,\n  .py-md-3 {\n    padding-bottom: 1rem !important; }\n  .pl-md-3,\n  .px-md-3 {\n    padding-left: 1rem !important; }\n  .p-md-4 {\n    padding: 1.5rem !important; }\n  .pt-md-4,\n  .py-md-4 {\n    padding-top: 1.5rem !important; }\n  .pr-md-4,\n  .px-md-4 {\n    padding-right: 1.5rem !important; }\n  .pb-md-4,\n  .py-md-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-md-4,\n  .px-md-4 {\n    padding-left: 1.5rem !important; }\n  .p-md-5 {\n    padding: 3rem !important; }\n  .pt-md-5,\n  .py-md-5 {\n    padding-top: 3rem !important; }\n  .pr-md-5,\n  .px-md-5 {\n    padding-right: 3rem !important; }\n  .pb-md-5,\n  .py-md-5 {\n    padding-bottom: 3rem !important; }\n  .pl-md-5,\n  .px-md-5 {\n    padding-left: 3rem !important; }\n  .m-md-auto {\n    margin: auto !important; }\n  .mt-md-auto,\n  .my-md-auto {\n    margin-top: auto !important; }\n  .mr-md-auto,\n  .mx-md-auto {\n    margin-right: auto !important; }\n  .mb-md-auto,\n  .my-md-auto {\n    margin-bottom: auto !important; }\n  .ml-md-auto,\n  .mx-md-auto {\n    margin-left: auto !important; } }\n\n@media (min-width: 992px) {\n  .m-lg-0 {\n    margin: 0 !important; }\n  .mt-lg-0,\n  .my-lg-0 {\n    margin-top: 0 !important; }\n  .mr-lg-0,\n  .mx-lg-0 {\n    margin-right: 0 !important; }\n  .mb-lg-0,\n  .my-lg-0 {\n    margin-bottom: 0 !important; }\n  .ml-lg-0,\n  .mx-lg-0 {\n    margin-left: 0 !important; }\n  .m-lg-1 {\n    margin: 0.25rem !important; }\n  .mt-lg-1,\n  .my-lg-1 {\n    margin-top: 0.25rem !important; }\n  .mr-lg-1,\n  .mx-lg-1 {\n    margin-right: 0.25rem !important; }\n  .mb-lg-1,\n  .my-lg-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-lg-1,\n  .mx-lg-1 {\n    margin-left: 0.25rem !important; }\n  .m-lg-2 {\n    margin: 0.5rem !important; }\n  .mt-lg-2,\n  .my-lg-2 {\n    margin-top: 0.5rem !important; }\n  .mr-lg-2,\n  .mx-lg-2 {\n    margin-right: 0.5rem !important; }\n  .mb-lg-2,\n  .my-lg-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-lg-2,\n  .mx-lg-2 {\n    margin-left: 0.5rem !important; }\n  .m-lg-3 {\n    margin: 1rem !important; }\n  .mt-lg-3,\n  .my-lg-3 {\n    margin-top: 1rem !important; }\n  .mr-lg-3,\n  .mx-lg-3 {\n    margin-right: 1rem !important; }\n  .mb-lg-3,\n  .my-lg-3 {\n    margin-bottom: 1rem !important; }\n  .ml-lg-3,\n  .mx-lg-3 {\n    margin-left: 1rem !important; }\n  .m-lg-4 {\n    margin: 1.5rem !important; }\n  .mt-lg-4,\n  .my-lg-4 {\n    margin-top: 1.5rem !important; }\n  .mr-lg-4,\n  .mx-lg-4 {\n    margin-right: 1.5rem !important; }\n  .mb-lg-4,\n  .my-lg-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-lg-4,\n  .mx-lg-4 {\n    margin-left: 1.5rem !important; }\n  .m-lg-5 {\n    margin: 3rem !important; }\n  .mt-lg-5,\n  .my-lg-5 {\n    margin-top: 3rem !important; }\n  .mr-lg-5,\n  .mx-lg-5 {\n    margin-right: 3rem !important; }\n  .mb-lg-5,\n  .my-lg-5 {\n    margin-bottom: 3rem !important; }\n  .ml-lg-5,\n  .mx-lg-5 {\n    margin-left: 3rem !important; }\n  .p-lg-0 {\n    padding: 0 !important; }\n  .pt-lg-0,\n  .py-lg-0 {\n    padding-top: 0 !important; }\n  .pr-lg-0,\n  .px-lg-0 {\n    padding-right: 0 !important; }\n  .pb-lg-0,\n  .py-lg-0 {\n    padding-bottom: 0 !important; }\n  .pl-lg-0,\n  .px-lg-0 {\n    padding-left: 0 !important; }\n  .p-lg-1 {\n    padding: 0.25rem !important; }\n  .pt-lg-1,\n  .py-lg-1 {\n    padding-top: 0.25rem !important; }\n  .pr-lg-1,\n  .px-lg-1 {\n    padding-right: 0.25rem !important; }\n  .pb-lg-1,\n  .py-lg-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-lg-1,\n  .px-lg-1 {\n    padding-left: 0.25rem !important; }\n  .p-lg-2 {\n    padding: 0.5rem !important; }\n  .pt-lg-2,\n  .py-lg-2 {\n    padding-top: 0.5rem !important; }\n  .pr-lg-2,\n  .px-lg-2 {\n    padding-right: 0.5rem !important; }\n  .pb-lg-2,\n  .py-lg-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-lg-2,\n  .px-lg-2 {\n    padding-left: 0.5rem !important; }\n  .p-lg-3 {\n    padding: 1rem !important; }\n  .pt-lg-3,\n  .py-lg-3 {\n    padding-top: 1rem !important; }\n  .pr-lg-3,\n  .px-lg-3 {\n    padding-right: 1rem !important; }\n  .pb-lg-3,\n  .py-lg-3 {\n    padding-bottom: 1rem !important; }\n  .pl-lg-3,\n  .px-lg-3 {\n    padding-left: 1rem !important; }\n  .p-lg-4 {\n    padding: 1.5rem !important; }\n  .pt-lg-4,\n  .py-lg-4 {\n    padding-top: 1.5rem !important; }\n  .pr-lg-4,\n  .px-lg-4 {\n    padding-right: 1.5rem !important; }\n  .pb-lg-4,\n  .py-lg-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-lg-4,\n  .px-lg-4 {\n    padding-left: 1.5rem !important; }\n  .p-lg-5 {\n    padding: 3rem !important; }\n  .pt-lg-5,\n  .py-lg-5 {\n    padding-top: 3rem !important; }\n  .pr-lg-5,\n  .px-lg-5 {\n    padding-right: 3rem !important; }\n  .pb-lg-5,\n  .py-lg-5 {\n    padding-bottom: 3rem !important; }\n  .pl-lg-5,\n  .px-lg-5 {\n    padding-left: 3rem !important; }\n  .m-lg-auto {\n    margin: auto !important; }\n  .mt-lg-auto,\n  .my-lg-auto {\n    margin-top: auto !important; }\n  .mr-lg-auto,\n  .mx-lg-auto {\n    margin-right: auto !important; }\n  .mb-lg-auto,\n  .my-lg-auto {\n    margin-bottom: auto !important; }\n  .ml-lg-auto,\n  .mx-lg-auto {\n    margin-left: auto !important; } }\n\n@media (min-width: 1200px) {\n  .m-xl-0 {\n    margin: 0 !important; }\n  .mt-xl-0,\n  .my-xl-0 {\n    margin-top: 0 !important; }\n  .mr-xl-0,\n  .mx-xl-0 {\n    margin-right: 0 !important; }\n  .mb-xl-0,\n  .my-xl-0 {\n    margin-bottom: 0 !important; }\n  .ml-xl-0,\n  .mx-xl-0 {\n    margin-left: 0 !important; }\n  .m-xl-1 {\n    margin: 0.25rem !important; }\n  .mt-xl-1,\n  .my-xl-1 {\n    margin-top: 0.25rem !important; }\n  .mr-xl-1,\n  .mx-xl-1 {\n    margin-right: 0.25rem !important; }\n  .mb-xl-1,\n  .my-xl-1 {\n    margin-bottom: 0.25rem !important; }\n  .ml-xl-1,\n  .mx-xl-1 {\n    margin-left: 0.25rem !important; }\n  .m-xl-2 {\n    margin: 0.5rem !important; }\n  .mt-xl-2,\n  .my-xl-2 {\n    margin-top: 0.5rem !important; }\n  .mr-xl-2,\n  .mx-xl-2 {\n    margin-right: 0.5rem !important; }\n  .mb-xl-2,\n  .my-xl-2 {\n    margin-bottom: 0.5rem !important; }\n  .ml-xl-2,\n  .mx-xl-2 {\n    margin-left: 0.5rem !important; }\n  .m-xl-3 {\n    margin: 1rem !important; }\n  .mt-xl-3,\n  .my-xl-3 {\n    margin-top: 1rem !important; }\n  .mr-xl-3,\n  .mx-xl-3 {\n    margin-right: 1rem !important; }\n  .mb-xl-3,\n  .my-xl-3 {\n    margin-bottom: 1rem !important; }\n  .ml-xl-3,\n  .mx-xl-3 {\n    margin-left: 1rem !important; }\n  .m-xl-4 {\n    margin: 1.5rem !important; }\n  .mt-xl-4,\n  .my-xl-4 {\n    margin-top: 1.5rem !important; }\n  .mr-xl-4,\n  .mx-xl-4 {\n    margin-right: 1.5rem !important; }\n  .mb-xl-4,\n  .my-xl-4 {\n    margin-bottom: 1.5rem !important; }\n  .ml-xl-4,\n  .mx-xl-4 {\n    margin-left: 1.5rem !important; }\n  .m-xl-5 {\n    margin: 3rem !important; }\n  .mt-xl-5,\n  .my-xl-5 {\n    margin-top: 3rem !important; }\n  .mr-xl-5,\n  .mx-xl-5 {\n    margin-right: 3rem !important; }\n  .mb-xl-5,\n  .my-xl-5 {\n    margin-bottom: 3rem !important; }\n  .ml-xl-5,\n  .mx-xl-5 {\n    margin-left: 3rem !important; }\n  .p-xl-0 {\n    padding: 0 !important; }\n  .pt-xl-0,\n  .py-xl-0 {\n    padding-top: 0 !important; }\n  .pr-xl-0,\n  .px-xl-0 {\n    padding-right: 0 !important; }\n  .pb-xl-0,\n  .py-xl-0 {\n    padding-bottom: 0 !important; }\n  .pl-xl-0,\n  .px-xl-0 {\n    padding-left: 0 !important; }\n  .p-xl-1 {\n    padding: 0.25rem !important; }\n  .pt-xl-1,\n  .py-xl-1 {\n    padding-top: 0.25rem !important; }\n  .pr-xl-1,\n  .px-xl-1 {\n    padding-right: 0.25rem !important; }\n  .pb-xl-1,\n  .py-xl-1 {\n    padding-bottom: 0.25rem !important; }\n  .pl-xl-1,\n  .px-xl-1 {\n    padding-left: 0.25rem !important; }\n  .p-xl-2 {\n    padding: 0.5rem !important; }\n  .pt-xl-2,\n  .py-xl-2 {\n    padding-top: 0.5rem !important; }\n  .pr-xl-2,\n  .px-xl-2 {\n    padding-right: 0.5rem !important; }\n  .pb-xl-2,\n  .py-xl-2 {\n    padding-bottom: 0.5rem !important; }\n  .pl-xl-2,\n  .px-xl-2 {\n    padding-left: 0.5rem !important; }\n  .p-xl-3 {\n    padding: 1rem !important; }\n  .pt-xl-3,\n  .py-xl-3 {\n    padding-top: 1rem !important; }\n  .pr-xl-3,\n  .px-xl-3 {\n    padding-right: 1rem !important; }\n  .pb-xl-3,\n  .py-xl-3 {\n    padding-bottom: 1rem !important; }\n  .pl-xl-3,\n  .px-xl-3 {\n    padding-left: 1rem !important; }\n  .p-xl-4 {\n    padding: 1.5rem !important; }\n  .pt-xl-4,\n  .py-xl-4 {\n    padding-top: 1.5rem !important; }\n  .pr-xl-4,\n  .px-xl-4 {\n    padding-right: 1.5rem !important; }\n  .pb-xl-4,\n  .py-xl-4 {\n    padding-bottom: 1.5rem !important; }\n  .pl-xl-4,\n  .px-xl-4 {\n    padding-left: 1.5rem !important; }\n  .p-xl-5 {\n    padding: 3rem !important; }\n  .pt-xl-5,\n  .py-xl-5 {\n    padding-top: 3rem !important; }\n  .pr-xl-5,\n  .px-xl-5 {\n    padding-right: 3rem !important; }\n  .pb-xl-5,\n  .py-xl-5 {\n    padding-bottom: 3rem !important; }\n  .pl-xl-5,\n  .px-xl-5 {\n    padding-left: 3rem !important; }\n  .m-xl-auto {\n    margin: auto !important; }\n  .mt-xl-auto,\n  .my-xl-auto {\n    margin-top: auto !important; }\n  .mr-xl-auto,\n  .mx-xl-auto {\n    margin-right: auto !important; }\n  .mb-xl-auto,\n  .my-xl-auto {\n    margin-bottom: auto !important; }\n  .ml-xl-auto,\n  .mx-xl-auto {\n    margin-left: auto !important; } }\n\n.text-monospace {\n  font-family: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; }\n\n.text-justify {\n  text-align: justify !important; }\n\n.text-nowrap {\n  white-space: nowrap !important; }\n\n.text-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n.text-left {\n  text-align: left !important; }\n\n.text-right {\n  text-align: right !important; }\n\n.text-center {\n  text-align: center !important; }\n\n@media (min-width: 576px) {\n  .text-sm-left {\n    text-align: left !important; }\n  .text-sm-right {\n    text-align: right !important; }\n  .text-sm-center {\n    text-align: center !important; } }\n\n@media (min-width: 768px) {\n  .text-md-left {\n    text-align: left !important; }\n  .text-md-right {\n    text-align: right !important; }\n  .text-md-center {\n    text-align: center !important; } }\n\n@media (min-width: 992px) {\n  .text-lg-left {\n    text-align: left !important; }\n  .text-lg-right {\n    text-align: right !important; }\n  .text-lg-center {\n    text-align: center !important; } }\n\n@media (min-width: 1200px) {\n  .text-xl-left {\n    text-align: left !important; }\n  .text-xl-right {\n    text-align: right !important; }\n  .text-xl-center {\n    text-align: center !important; } }\n\n.text-lowercase {\n  text-transform: lowercase !important; }\n\n.text-uppercase {\n  text-transform: uppercase !important; }\n\n.text-capitalize {\n  text-transform: capitalize !important; }\n\n.font-weight-light {\n  font-weight: 300 !important; }\n\n.font-weight-normal {\n  font-weight: 400 !important; }\n\n.font-weight-bold {\n  font-weight: 700 !important; }\n\n.font-italic {\n  font-style: italic !important; }\n\n.text-white {\n  color: #fff !important; }\n\n.text-primary {\n  color: #007bff !important; }\n\na.text-primary:hover, a.text-primary:focus {\n  color: #0062cc !important; }\n\n.text-secondary {\n  color: #6c757d !important; }\n\na.text-secondary:hover, a.text-secondary:focus {\n  color: #545b62 !important; }\n\n.text-success {\n  color: #28a745 !important; }\n\na.text-success:hover, a.text-success:focus {\n  color: #1e7e34 !important; }\n\n.text-info {\n  color: #17a2b8 !important; }\n\na.text-info:hover, a.text-info:focus {\n  color: #117a8b !important; }\n\n.text-warning {\n  color: #ffc107 !important; }\n\na.text-warning:hover, a.text-warning:focus {\n  color: #d39e00 !important; }\n\n.text-danger {\n  color: #dc3545 !important; }\n\na.text-danger:hover, a.text-danger:focus {\n  color: #bd2130 !important; }\n\n.text-light {\n  color: #f8f9fa !important; }\n\na.text-light:hover, a.text-light:focus {\n  color: #dae0e5 !important; }\n\n.text-dark {\n  color: #343a40 !important; }\n\na.text-dark:hover, a.text-dark:focus {\n  color: #1d2124 !important; }\n\n.text-body {\n  color: #212529 !important; }\n\n.text-muted {\n  color: #6c757d !important; }\n\n.text-black-50 {\n  color: rgba(0, 0, 0, 0.5) !important; }\n\n.text-white-50 {\n  color: rgba(255, 255, 255, 0.5) !important; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0; }\n\n.visible {\n  visibility: visible !important; }\n\n.invisible {\n  visibility: hidden !important; }\n\n@media print {\n  *,\n  *::before,\n  *::after {\n    text-shadow: none !important;\n    box-shadow: none !important; }\n  a:not(.btn) {\n    text-decoration: underline; }\n  abbr[title]::after {\n    content: \" (\" attr(title) \")\"; }\n  pre {\n    white-space: pre-wrap !important; }\n  pre,\n  blockquote {\n    border: 1px solid #adb5bd;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; }\n  @page {\n    size: a3; }\n  body {\n    min-width: 992px !important; }\n  .container {\n    min-width: 992px !important; }\n  .navbar {\n    display: none; }\n  .badge {\n    border: 1px solid #000; }\n  .table {\n    border-collapse: collapse !important; }\n    .table td,\n    .table th {\n      background-color: #fff !important; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #dee2e6 !important; }\n  .table-dark {\n    color: inherit; }\n    .table-dark th,\n    .table-dark td,\n    .table-dark thead th,\n    .table-dark tbody + tbody {\n      border-color: #dee2e6; }\n  .table .thead-dark th {\n    color: inherit;\n    border-color: #dee2e6; } }\n", ""]);

// exports


/***/ }),
/* 65 */,
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./fontawesome.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./fontawesome.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(31);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(" + escape(__webpack_require__(68)) + ");\n  src: url(" + escape(__webpack_require__(69)) + "?#iefix&v=4.7.0) format(\"embedded-opentype\"), url(" + escape(__webpack_require__(70)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(71)) + ") format(\"woff\"), url(" + escape(__webpack_require__(72)) + ") format(\"truetype\"), url(" + escape(__webpack_require__(73)) + "#fontawesomeregular) format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -15%; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-fw {\n  width: 1.28571em;\n  text-align: center; }\n\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14286em;\n  list-style-type: none; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  position: absolute;\n  left: -2.14286em;\n  width: 2.14286em;\n  top: 0.14286em;\n  text-align: center; }\n  .fa-li.fa-lg {\n    left: -1.85714em; }\n\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right {\n  margin-left: .3em; }\n\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right; }\n\n.pull-left {\n  float: left; }\n\n.fa.pull-left {\n  margin-right: .3em; }\n\n.fa.pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8); }\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  transform: scale(1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  -webkit-filter: none;\n          filter: none; }\n\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle; }\n\n.fa-stack-1x, .fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.fa-stack-1x {\n  line-height: inherit; }\n\n.fa-stack-2x {\n  font-size: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\"; }\n\n.fa-music:before {\n  content: \"\\F001\"; }\n\n.fa-search:before {\n  content: \"\\F002\"; }\n\n.fa-envelope-o:before {\n  content: \"\\F003\"; }\n\n.fa-heart:before {\n  content: \"\\F004\"; }\n\n.fa-star:before {\n  content: \"\\F005\"; }\n\n.fa-star-o:before {\n  content: \"\\F006\"; }\n\n.fa-user:before {\n  content: \"\\F007\"; }\n\n.fa-film:before {\n  content: \"\\F008\"; }\n\n.fa-th-large:before {\n  content: \"\\F009\"; }\n\n.fa-th:before {\n  content: \"\\F00A\"; }\n\n.fa-th-list:before {\n  content: \"\\F00B\"; }\n\n.fa-check:before {\n  content: \"\\F00C\"; }\n\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\"; }\n\n.fa-search-plus:before {\n  content: \"\\F00E\"; }\n\n.fa-search-minus:before {\n  content: \"\\F010\"; }\n\n.fa-power-off:before {\n  content: \"\\F011\"; }\n\n.fa-signal:before {\n  content: \"\\F012\"; }\n\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\"; }\n\n.fa-trash-o:before {\n  content: \"\\F014\"; }\n\n.fa-home:before {\n  content: \"\\F015\"; }\n\n.fa-file-o:before {\n  content: \"\\F016\"; }\n\n.fa-clock-o:before {\n  content: \"\\F017\"; }\n\n.fa-road:before {\n  content: \"\\F018\"; }\n\n.fa-download:before {\n  content: \"\\F019\"; }\n\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\"; }\n\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\"; }\n\n.fa-inbox:before {\n  content: \"\\F01C\"; }\n\n.fa-play-circle-o:before {\n  content: \"\\F01D\"; }\n\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\"; }\n\n.fa-refresh:before {\n  content: \"\\F021\"; }\n\n.fa-list-alt:before {\n  content: \"\\F022\"; }\n\n.fa-lock:before {\n  content: \"\\F023\"; }\n\n.fa-flag:before {\n  content: \"\\F024\"; }\n\n.fa-headphones:before {\n  content: \"\\F025\"; }\n\n.fa-volume-off:before {\n  content: \"\\F026\"; }\n\n.fa-volume-down:before {\n  content: \"\\F027\"; }\n\n.fa-volume-up:before {\n  content: \"\\F028\"; }\n\n.fa-qrcode:before {\n  content: \"\\F029\"; }\n\n.fa-barcode:before {\n  content: \"\\F02A\"; }\n\n.fa-tag:before {\n  content: \"\\F02B\"; }\n\n.fa-tags:before {\n  content: \"\\F02C\"; }\n\n.fa-book:before {\n  content: \"\\F02D\"; }\n\n.fa-bookmark:before {\n  content: \"\\F02E\"; }\n\n.fa-print:before {\n  content: \"\\F02F\"; }\n\n.fa-camera:before {\n  content: \"\\F030\"; }\n\n.fa-font:before {\n  content: \"\\F031\"; }\n\n.fa-bold:before {\n  content: \"\\F032\"; }\n\n.fa-italic:before {\n  content: \"\\F033\"; }\n\n.fa-text-height:before {\n  content: \"\\F034\"; }\n\n.fa-text-width:before {\n  content: \"\\F035\"; }\n\n.fa-align-left:before {\n  content: \"\\F036\"; }\n\n.fa-align-center:before {\n  content: \"\\F037\"; }\n\n.fa-align-right:before {\n  content: \"\\F038\"; }\n\n.fa-align-justify:before {\n  content: \"\\F039\"; }\n\n.fa-list:before {\n  content: \"\\F03A\"; }\n\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\"; }\n\n.fa-indent:before {\n  content: \"\\F03C\"; }\n\n.fa-video-camera:before {\n  content: \"\\F03D\"; }\n\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\"; }\n\n.fa-pencil:before {\n  content: \"\\F040\"; }\n\n.fa-map-marker:before {\n  content: \"\\F041\"; }\n\n.fa-adjust:before {\n  content: \"\\F042\"; }\n\n.fa-tint:before {\n  content: \"\\F043\"; }\n\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\"; }\n\n.fa-share-square-o:before {\n  content: \"\\F045\"; }\n\n.fa-check-square-o:before {\n  content: \"\\F046\"; }\n\n.fa-arrows:before {\n  content: \"\\F047\"; }\n\n.fa-step-backward:before {\n  content: \"\\F048\"; }\n\n.fa-fast-backward:before {\n  content: \"\\F049\"; }\n\n.fa-backward:before {\n  content: \"\\F04A\"; }\n\n.fa-play:before {\n  content: \"\\F04B\"; }\n\n.fa-pause:before {\n  content: \"\\F04C\"; }\n\n.fa-stop:before {\n  content: \"\\F04D\"; }\n\n.fa-forward:before {\n  content: \"\\F04E\"; }\n\n.fa-fast-forward:before {\n  content: \"\\F050\"; }\n\n.fa-step-forward:before {\n  content: \"\\F051\"; }\n\n.fa-eject:before {\n  content: \"\\F052\"; }\n\n.fa-chevron-left:before {\n  content: \"\\F053\"; }\n\n.fa-chevron-right:before {\n  content: \"\\F054\"; }\n\n.fa-plus-circle:before {\n  content: \"\\F055\"; }\n\n.fa-minus-circle:before {\n  content: \"\\F056\"; }\n\n.fa-times-circle:before {\n  content: \"\\F057\"; }\n\n.fa-check-circle:before {\n  content: \"\\F058\"; }\n\n.fa-question-circle:before {\n  content: \"\\F059\"; }\n\n.fa-info-circle:before {\n  content: \"\\F05A\"; }\n\n.fa-crosshairs:before {\n  content: \"\\F05B\"; }\n\n.fa-times-circle-o:before {\n  content: \"\\F05C\"; }\n\n.fa-check-circle-o:before {\n  content: \"\\F05D\"; }\n\n.fa-ban:before {\n  content: \"\\F05E\"; }\n\n.fa-arrow-left:before {\n  content: \"\\F060\"; }\n\n.fa-arrow-right:before {\n  content: \"\\F061\"; }\n\n.fa-arrow-up:before {\n  content: \"\\F062\"; }\n\n.fa-arrow-down:before {\n  content: \"\\F063\"; }\n\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\"; }\n\n.fa-expand:before {\n  content: \"\\F065\"; }\n\n.fa-compress:before {\n  content: \"\\F066\"; }\n\n.fa-plus:before {\n  content: \"\\F067\"; }\n\n.fa-minus:before {\n  content: \"\\F068\"; }\n\n.fa-asterisk:before {\n  content: \"\\F069\"; }\n\n.fa-exclamation-circle:before {\n  content: \"\\F06A\"; }\n\n.fa-gift:before {\n  content: \"\\F06B\"; }\n\n.fa-leaf:before {\n  content: \"\\F06C\"; }\n\n.fa-fire:before {\n  content: \"\\F06D\"; }\n\n.fa-eye:before {\n  content: \"\\F06E\"; }\n\n.fa-eye-slash:before {\n  content: \"\\F070\"; }\n\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\"; }\n\n.fa-plane:before {\n  content: \"\\F072\"; }\n\n.fa-calendar:before {\n  content: \"\\F073\"; }\n\n.fa-random:before {\n  content: \"\\F074\"; }\n\n.fa-comment:before {\n  content: \"\\F075\"; }\n\n.fa-magnet:before {\n  content: \"\\F076\"; }\n\n.fa-chevron-up:before {\n  content: \"\\F077\"; }\n\n.fa-chevron-down:before {\n  content: \"\\F078\"; }\n\n.fa-retweet:before {\n  content: \"\\F079\"; }\n\n.fa-shopping-cart:before {\n  content: \"\\F07A\"; }\n\n.fa-folder:before {\n  content: \"\\F07B\"; }\n\n.fa-folder-open:before {\n  content: \"\\F07C\"; }\n\n.fa-arrows-v:before {\n  content: \"\\F07D\"; }\n\n.fa-arrows-h:before {\n  content: \"\\F07E\"; }\n\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\"; }\n\n.fa-twitter-square:before {\n  content: \"\\F081\"; }\n\n.fa-facebook-square:before {\n  content: \"\\F082\"; }\n\n.fa-camera-retro:before {\n  content: \"\\F083\"; }\n\n.fa-key:before {\n  content: \"\\F084\"; }\n\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\"; }\n\n.fa-comments:before {\n  content: \"\\F086\"; }\n\n.fa-thumbs-o-up:before {\n  content: \"\\F087\"; }\n\n.fa-thumbs-o-down:before {\n  content: \"\\F088\"; }\n\n.fa-star-half:before {\n  content: \"\\F089\"; }\n\n.fa-heart-o:before {\n  content: \"\\F08A\"; }\n\n.fa-sign-out:before {\n  content: \"\\F08B\"; }\n\n.fa-linkedin-square:before {\n  content: \"\\F08C\"; }\n\n.fa-thumb-tack:before {\n  content: \"\\F08D\"; }\n\n.fa-external-link:before {\n  content: \"\\F08E\"; }\n\n.fa-sign-in:before {\n  content: \"\\F090\"; }\n\n.fa-trophy:before {\n  content: \"\\F091\"; }\n\n.fa-github-square:before {\n  content: \"\\F092\"; }\n\n.fa-upload:before {\n  content: \"\\F093\"; }\n\n.fa-lemon-o:before {\n  content: \"\\F094\"; }\n\n.fa-phone:before {\n  content: \"\\F095\"; }\n\n.fa-square-o:before {\n  content: \"\\F096\"; }\n\n.fa-bookmark-o:before {\n  content: \"\\F097\"; }\n\n.fa-phone-square:before {\n  content: \"\\F098\"; }\n\n.fa-twitter:before {\n  content: \"\\F099\"; }\n\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\"; }\n\n.fa-github:before {\n  content: \"\\F09B\"; }\n\n.fa-unlock:before {\n  content: \"\\F09C\"; }\n\n.fa-credit-card:before {\n  content: \"\\F09D\"; }\n\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\F09E\"; }\n\n.fa-hdd-o:before {\n  content: \"\\F0A0\"; }\n\n.fa-bullhorn:before {\n  content: \"\\F0A1\"; }\n\n.fa-bell:before {\n  content: \"\\F0F3\"; }\n\n.fa-certificate:before {\n  content: \"\\F0A3\"; }\n\n.fa-hand-o-right:before {\n  content: \"\\F0A4\"; }\n\n.fa-hand-o-left:before {\n  content: \"\\F0A5\"; }\n\n.fa-hand-o-up:before {\n  content: \"\\F0A6\"; }\n\n.fa-hand-o-down:before {\n  content: \"\\F0A7\"; }\n\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\"; }\n\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\"; }\n\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\"; }\n\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\"; }\n\n.fa-globe:before {\n  content: \"\\F0AC\"; }\n\n.fa-wrench:before {\n  content: \"\\F0AD\"; }\n\n.fa-tasks:before {\n  content: \"\\F0AE\"; }\n\n.fa-filter:before {\n  content: \"\\F0B0\"; }\n\n.fa-briefcase:before {\n  content: \"\\F0B1\"; }\n\n.fa-arrows-alt:before {\n  content: \"\\F0B2\"; }\n\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\"; }\n\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\"; }\n\n.fa-cloud:before {\n  content: \"\\F0C2\"; }\n\n.fa-flask:before {\n  content: \"\\F0C3\"; }\n\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\"; }\n\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\"; }\n\n.fa-paperclip:before {\n  content: \"\\F0C6\"; }\n\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\"; }\n\n.fa-square:before {\n  content: \"\\F0C8\"; }\n\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\"; }\n\n.fa-list-ul:before {\n  content: \"\\F0CA\"; }\n\n.fa-list-ol:before {\n  content: \"\\F0CB\"; }\n\n.fa-strikethrough:before {\n  content: \"\\F0CC\"; }\n\n.fa-underline:before {\n  content: \"\\F0CD\"; }\n\n.fa-table:before {\n  content: \"\\F0CE\"; }\n\n.fa-magic:before {\n  content: \"\\F0D0\"; }\n\n.fa-truck:before {\n  content: \"\\F0D1\"; }\n\n.fa-pinterest:before {\n  content: \"\\F0D2\"; }\n\n.fa-pinterest-square:before {\n  content: \"\\F0D3\"; }\n\n.fa-google-plus-square:before {\n  content: \"\\F0D4\"; }\n\n.fa-google-plus:before {\n  content: \"\\F0D5\"; }\n\n.fa-money:before {\n  content: \"\\F0D6\"; }\n\n.fa-caret-down:before {\n  content: \"\\F0D7\"; }\n\n.fa-caret-up:before {\n  content: \"\\F0D8\"; }\n\n.fa-caret-left:before {\n  content: \"\\F0D9\"; }\n\n.fa-caret-right:before {\n  content: \"\\F0DA\"; }\n\n.fa-columns:before {\n  content: \"\\F0DB\"; }\n\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\"; }\n\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\"; }\n\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\"; }\n\n.fa-envelope:before {\n  content: \"\\F0E0\"; }\n\n.fa-linkedin:before {\n  content: \"\\F0E1\"; }\n\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\"; }\n\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\"; }\n\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\"; }\n\n.fa-comment-o:before {\n  content: \"\\F0E5\"; }\n\n.fa-comments-o:before {\n  content: \"\\F0E6\"; }\n\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\"; }\n\n.fa-sitemap:before {\n  content: \"\\F0E8\"; }\n\n.fa-umbrella:before {\n  content: \"\\F0E9\"; }\n\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\"; }\n\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\"; }\n\n.fa-exchange:before {\n  content: \"\\F0EC\"; }\n\n.fa-cloud-download:before {\n  content: \"\\F0ED\"; }\n\n.fa-cloud-upload:before {\n  content: \"\\F0EE\"; }\n\n.fa-user-md:before {\n  content: \"\\F0F0\"; }\n\n.fa-stethoscope:before {\n  content: \"\\F0F1\"; }\n\n.fa-suitcase:before {\n  content: \"\\F0F2\"; }\n\n.fa-bell-o:before {\n  content: \"\\F0A2\"; }\n\n.fa-coffee:before {\n  content: \"\\F0F4\"; }\n\n.fa-cutlery:before {\n  content: \"\\F0F5\"; }\n\n.fa-file-text-o:before {\n  content: \"\\F0F6\"; }\n\n.fa-building-o:before {\n  content: \"\\F0F7\"; }\n\n.fa-hospital-o:before {\n  content: \"\\F0F8\"; }\n\n.fa-ambulance:before {\n  content: \"\\F0F9\"; }\n\n.fa-medkit:before {\n  content: \"\\F0FA\"; }\n\n.fa-fighter-jet:before {\n  content: \"\\F0FB\"; }\n\n.fa-beer:before {\n  content: \"\\F0FC\"; }\n\n.fa-h-square:before {\n  content: \"\\F0FD\"; }\n\n.fa-plus-square:before {\n  content: \"\\F0FE\"; }\n\n.fa-angle-double-left:before {\n  content: \"\\F100\"; }\n\n.fa-angle-double-right:before {\n  content: \"\\F101\"; }\n\n.fa-angle-double-up:before {\n  content: \"\\F102\"; }\n\n.fa-angle-double-down:before {\n  content: \"\\F103\"; }\n\n.fa-angle-left:before {\n  content: \"\\F104\"; }\n\n.fa-angle-right:before {\n  content: \"\\F105\"; }\n\n.fa-angle-up:before {\n  content: \"\\F106\"; }\n\n.fa-angle-down:before {\n  content: \"\\F107\"; }\n\n.fa-desktop:before {\n  content: \"\\F108\"; }\n\n.fa-laptop:before {\n  content: \"\\F109\"; }\n\n.fa-tablet:before {\n  content: \"\\F10A\"; }\n\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\"; }\n\n.fa-circle-o:before {\n  content: \"\\F10C\"; }\n\n.fa-quote-left:before {\n  content: \"\\F10D\"; }\n\n.fa-quote-right:before {\n  content: \"\\F10E\"; }\n\n.fa-spinner:before {\n  content: \"\\F110\"; }\n\n.fa-circle:before {\n  content: \"\\F111\"; }\n\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\"; }\n\n.fa-github-alt:before {\n  content: \"\\F113\"; }\n\n.fa-folder-o:before {\n  content: \"\\F114\"; }\n\n.fa-folder-open-o:before {\n  content: \"\\F115\"; }\n\n.fa-smile-o:before {\n  content: \"\\F118\"; }\n\n.fa-frown-o:before {\n  content: \"\\F119\"; }\n\n.fa-meh-o:before {\n  content: \"\\F11A\"; }\n\n.fa-gamepad:before {\n  content: \"\\F11B\"; }\n\n.fa-keyboard-o:before {\n  content: \"\\F11C\"; }\n\n.fa-flag-o:before {\n  content: \"\\F11D\"; }\n\n.fa-flag-checkered:before {\n  content: \"\\F11E\"; }\n\n.fa-terminal:before {\n  content: \"\\F120\"; }\n\n.fa-code:before {\n  content: \"\\F121\"; }\n\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\"; }\n\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\"; }\n\n.fa-location-arrow:before {\n  content: \"\\F124\"; }\n\n.fa-crop:before {\n  content: \"\\F125\"; }\n\n.fa-code-fork:before {\n  content: \"\\F126\"; }\n\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\"; }\n\n.fa-question:before {\n  content: \"\\F128\"; }\n\n.fa-info:before {\n  content: \"\\F129\"; }\n\n.fa-exclamation:before {\n  content: \"\\F12A\"; }\n\n.fa-superscript:before {\n  content: \"\\F12B\"; }\n\n.fa-subscript:before {\n  content: \"\\F12C\"; }\n\n.fa-eraser:before {\n  content: \"\\F12D\"; }\n\n.fa-puzzle-piece:before {\n  content: \"\\F12E\"; }\n\n.fa-microphone:before {\n  content: \"\\F130\"; }\n\n.fa-microphone-slash:before {\n  content: \"\\F131\"; }\n\n.fa-shield:before {\n  content: \"\\F132\"; }\n\n.fa-calendar-o:before {\n  content: \"\\F133\"; }\n\n.fa-fire-extinguisher:before {\n  content: \"\\F134\"; }\n\n.fa-rocket:before {\n  content: \"\\F135\"; }\n\n.fa-maxcdn:before {\n  content: \"\\F136\"; }\n\n.fa-chevron-circle-left:before {\n  content: \"\\F137\"; }\n\n.fa-chevron-circle-right:before {\n  content: \"\\F138\"; }\n\n.fa-chevron-circle-up:before {\n  content: \"\\F139\"; }\n\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\"; }\n\n.fa-html5:before {\n  content: \"\\F13B\"; }\n\n.fa-css3:before {\n  content: \"\\F13C\"; }\n\n.fa-anchor:before {\n  content: \"\\F13D\"; }\n\n.fa-unlock-alt:before {\n  content: \"\\F13E\"; }\n\n.fa-bullseye:before {\n  content: \"\\F140\"; }\n\n.fa-ellipsis-h:before {\n  content: \"\\F141\"; }\n\n.fa-ellipsis-v:before {\n  content: \"\\F142\"; }\n\n.fa-rss-square:before {\n  content: \"\\F143\"; }\n\n.fa-play-circle:before {\n  content: \"\\F144\"; }\n\n.fa-ticket:before {\n  content: \"\\F145\"; }\n\n.fa-minus-square:before {\n  content: \"\\F146\"; }\n\n.fa-minus-square-o:before {\n  content: \"\\F147\"; }\n\n.fa-level-up:before {\n  content: \"\\F148\"; }\n\n.fa-level-down:before {\n  content: \"\\F149\"; }\n\n.fa-check-square:before {\n  content: \"\\F14A\"; }\n\n.fa-pencil-square:before {\n  content: \"\\F14B\"; }\n\n.fa-external-link-square:before {\n  content: \"\\F14C\"; }\n\n.fa-share-square:before {\n  content: \"\\F14D\"; }\n\n.fa-compass:before {\n  content: \"\\F14E\"; }\n\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\"; }\n\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\"; }\n\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\"; }\n\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\"; }\n\n.fa-gbp:before {\n  content: \"\\F154\"; }\n\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\"; }\n\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\"; }\n\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\"; }\n\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\"; }\n\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\"; }\n\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\"; }\n\n.fa-file:before {\n  content: \"\\F15B\"; }\n\n.fa-file-text:before {\n  content: \"\\F15C\"; }\n\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\"; }\n\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\"; }\n\n.fa-sort-amount-asc:before {\n  content: \"\\F160\"; }\n\n.fa-sort-amount-desc:before {\n  content: \"\\F161\"; }\n\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\"; }\n\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\"; }\n\n.fa-thumbs-up:before {\n  content: \"\\F164\"; }\n\n.fa-thumbs-down:before {\n  content: \"\\F165\"; }\n\n.fa-youtube-square:before {\n  content: \"\\F166\"; }\n\n.fa-youtube:before {\n  content: \"\\F167\"; }\n\n.fa-xing:before {\n  content: \"\\F168\"; }\n\n.fa-xing-square:before {\n  content: \"\\F169\"; }\n\n.fa-youtube-play:before {\n  content: \"\\F16A\"; }\n\n.fa-dropbox:before {\n  content: \"\\F16B\"; }\n\n.fa-stack-overflow:before {\n  content: \"\\F16C\"; }\n\n.fa-instagram:before {\n  content: \"\\F16D\"; }\n\n.fa-flickr:before {\n  content: \"\\F16E\"; }\n\n.fa-adn:before {\n  content: \"\\F170\"; }\n\n.fa-bitbucket:before {\n  content: \"\\F171\"; }\n\n.fa-bitbucket-square:before {\n  content: \"\\F172\"; }\n\n.fa-tumblr:before {\n  content: \"\\F173\"; }\n\n.fa-tumblr-square:before {\n  content: \"\\F174\"; }\n\n.fa-long-arrow-down:before {\n  content: \"\\F175\"; }\n\n.fa-long-arrow-up:before {\n  content: \"\\F176\"; }\n\n.fa-long-arrow-left:before {\n  content: \"\\F177\"; }\n\n.fa-long-arrow-right:before {\n  content: \"\\F178\"; }\n\n.fa-apple:before {\n  content: \"\\F179\"; }\n\n.fa-windows:before {\n  content: \"\\F17A\"; }\n\n.fa-android:before {\n  content: \"\\F17B\"; }\n\n.fa-linux:before {\n  content: \"\\F17C\"; }\n\n.fa-dribbble:before {\n  content: \"\\F17D\"; }\n\n.fa-skype:before {\n  content: \"\\F17E\"; }\n\n.fa-foursquare:before {\n  content: \"\\F180\"; }\n\n.fa-trello:before {\n  content: \"\\F181\"; }\n\n.fa-female:before {\n  content: \"\\F182\"; }\n\n.fa-male:before {\n  content: \"\\F183\"; }\n\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\"; }\n\n.fa-sun-o:before {\n  content: \"\\F185\"; }\n\n.fa-moon-o:before {\n  content: \"\\F186\"; }\n\n.fa-archive:before {\n  content: \"\\F187\"; }\n\n.fa-bug:before {\n  content: \"\\F188\"; }\n\n.fa-vk:before {\n  content: \"\\F189\"; }\n\n.fa-weibo:before {\n  content: \"\\F18A\"; }\n\n.fa-renren:before {\n  content: \"\\F18B\"; }\n\n.fa-pagelines:before {\n  content: \"\\F18C\"; }\n\n.fa-stack-exchange:before {\n  content: \"\\F18D\"; }\n\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\"; }\n\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\"; }\n\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\"; }\n\n.fa-dot-circle-o:before {\n  content: \"\\F192\"; }\n\n.fa-wheelchair:before {\n  content: \"\\F193\"; }\n\n.fa-vimeo-square:before {\n  content: \"\\F194\"; }\n\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\"; }\n\n.fa-plus-square-o:before {\n  content: \"\\F196\"; }\n\n.fa-space-shuttle:before {\n  content: \"\\F197\"; }\n\n.fa-slack:before {\n  content: \"\\F198\"; }\n\n.fa-envelope-square:before {\n  content: \"\\F199\"; }\n\n.fa-wordpress:before {\n  content: \"\\F19A\"; }\n\n.fa-openid:before {\n  content: \"\\F19B\"; }\n\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\"; }\n\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\"; }\n\n.fa-yahoo:before {\n  content: \"\\F19E\"; }\n\n.fa-google:before {\n  content: \"\\F1A0\"; }\n\n.fa-reddit:before {\n  content: \"\\F1A1\"; }\n\n.fa-reddit-square:before {\n  content: \"\\F1A2\"; }\n\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\"; }\n\n.fa-stumbleupon:before {\n  content: \"\\F1A4\"; }\n\n.fa-delicious:before {\n  content: \"\\F1A5\"; }\n\n.fa-digg:before {\n  content: \"\\F1A6\"; }\n\n.fa-pied-piper-pp:before {\n  content: \"\\F1A7\"; }\n\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\"; }\n\n.fa-drupal:before {\n  content: \"\\F1A9\"; }\n\n.fa-joomla:before {\n  content: \"\\F1AA\"; }\n\n.fa-language:before {\n  content: \"\\F1AB\"; }\n\n.fa-fax:before {\n  content: \"\\F1AC\"; }\n\n.fa-building:before {\n  content: \"\\F1AD\"; }\n\n.fa-child:before {\n  content: \"\\F1AE\"; }\n\n.fa-paw:before {\n  content: \"\\F1B0\"; }\n\n.fa-spoon:before {\n  content: \"\\F1B1\"; }\n\n.fa-cube:before {\n  content: \"\\F1B2\"; }\n\n.fa-cubes:before {\n  content: \"\\F1B3\"; }\n\n.fa-behance:before {\n  content: \"\\F1B4\"; }\n\n.fa-behance-square:before {\n  content: \"\\F1B5\"; }\n\n.fa-steam:before {\n  content: \"\\F1B6\"; }\n\n.fa-steam-square:before {\n  content: \"\\F1B7\"; }\n\n.fa-recycle:before {\n  content: \"\\F1B8\"; }\n\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\"; }\n\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\"; }\n\n.fa-tree:before {\n  content: \"\\F1BB\"; }\n\n.fa-spotify:before {\n  content: \"\\F1BC\"; }\n\n.fa-deviantart:before {\n  content: \"\\F1BD\"; }\n\n.fa-soundcloud:before {\n  content: \"\\F1BE\"; }\n\n.fa-database:before {\n  content: \"\\F1C0\"; }\n\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\"; }\n\n.fa-file-word-o:before {\n  content: \"\\F1C2\"; }\n\n.fa-file-excel-o:before {\n  content: \"\\F1C3\"; }\n\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\"; }\n\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\"; }\n\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\"; }\n\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\"; }\n\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\"; }\n\n.fa-file-code-o:before {\n  content: \"\\F1C9\"; }\n\n.fa-vine:before {\n  content: \"\\F1CA\"; }\n\n.fa-codepen:before {\n  content: \"\\F1CB\"; }\n\n.fa-jsfiddle:before {\n  content: \"\\F1CC\"; }\n\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\"; }\n\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\"; }\n\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\\F1D0\"; }\n\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\"; }\n\n.fa-git-square:before {\n  content: \"\\F1D2\"; }\n\n.fa-git:before {\n  content: \"\\F1D3\"; }\n\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\F1D4\"; }\n\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\"; }\n\n.fa-qq:before {\n  content: \"\\F1D6\"; }\n\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\"; }\n\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\"; }\n\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\"; }\n\n.fa-history:before {\n  content: \"\\F1DA\"; }\n\n.fa-circle-thin:before {\n  content: \"\\F1DB\"; }\n\n.fa-header:before {\n  content: \"\\F1DC\"; }\n\n.fa-paragraph:before {\n  content: \"\\F1DD\"; }\n\n.fa-sliders:before {\n  content: \"\\F1DE\"; }\n\n.fa-share-alt:before {\n  content: \"\\F1E0\"; }\n\n.fa-share-alt-square:before {\n  content: \"\\F1E1\"; }\n\n.fa-bomb:before {\n  content: \"\\F1E2\"; }\n\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\"; }\n\n.fa-tty:before {\n  content: \"\\F1E4\"; }\n\n.fa-binoculars:before {\n  content: \"\\F1E5\"; }\n\n.fa-plug:before {\n  content: \"\\F1E6\"; }\n\n.fa-slideshare:before {\n  content: \"\\F1E7\"; }\n\n.fa-twitch:before {\n  content: \"\\F1E8\"; }\n\n.fa-yelp:before {\n  content: \"\\F1E9\"; }\n\n.fa-newspaper-o:before {\n  content: \"\\F1EA\"; }\n\n.fa-wifi:before {\n  content: \"\\F1EB\"; }\n\n.fa-calculator:before {\n  content: \"\\F1EC\"; }\n\n.fa-paypal:before {\n  content: \"\\F1ED\"; }\n\n.fa-google-wallet:before {\n  content: \"\\F1EE\"; }\n\n.fa-cc-visa:before {\n  content: \"\\F1F0\"; }\n\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\"; }\n\n.fa-cc-discover:before {\n  content: \"\\F1F2\"; }\n\n.fa-cc-amex:before {\n  content: \"\\F1F3\"; }\n\n.fa-cc-paypal:before {\n  content: \"\\F1F4\"; }\n\n.fa-cc-stripe:before {\n  content: \"\\F1F5\"; }\n\n.fa-bell-slash:before {\n  content: \"\\F1F6\"; }\n\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\"; }\n\n.fa-trash:before {\n  content: \"\\F1F8\"; }\n\n.fa-copyright:before {\n  content: \"\\F1F9\"; }\n\n.fa-at:before {\n  content: \"\\F1FA\"; }\n\n.fa-eyedropper:before {\n  content: \"\\F1FB\"; }\n\n.fa-paint-brush:before {\n  content: \"\\F1FC\"; }\n\n.fa-birthday-cake:before {\n  content: \"\\F1FD\"; }\n\n.fa-area-chart:before {\n  content: \"\\F1FE\"; }\n\n.fa-pie-chart:before {\n  content: \"\\F200\"; }\n\n.fa-line-chart:before {\n  content: \"\\F201\"; }\n\n.fa-lastfm:before {\n  content: \"\\F202\"; }\n\n.fa-lastfm-square:before {\n  content: \"\\F203\"; }\n\n.fa-toggle-off:before {\n  content: \"\\F204\"; }\n\n.fa-toggle-on:before {\n  content: \"\\F205\"; }\n\n.fa-bicycle:before {\n  content: \"\\F206\"; }\n\n.fa-bus:before {\n  content: \"\\F207\"; }\n\n.fa-ioxhost:before {\n  content: \"\\F208\"; }\n\n.fa-angellist:before {\n  content: \"\\F209\"; }\n\n.fa-cc:before {\n  content: \"\\F20A\"; }\n\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\"; }\n\n.fa-meanpath:before {\n  content: \"\\F20C\"; }\n\n.fa-buysellads:before {\n  content: \"\\F20D\"; }\n\n.fa-connectdevelop:before {\n  content: \"\\F20E\"; }\n\n.fa-dashcube:before {\n  content: \"\\F210\"; }\n\n.fa-forumbee:before {\n  content: \"\\F211\"; }\n\n.fa-leanpub:before {\n  content: \"\\F212\"; }\n\n.fa-sellsy:before {\n  content: \"\\F213\"; }\n\n.fa-shirtsinbulk:before {\n  content: \"\\F214\"; }\n\n.fa-simplybuilt:before {\n  content: \"\\F215\"; }\n\n.fa-skyatlas:before {\n  content: \"\\F216\"; }\n\n.fa-cart-plus:before {\n  content: \"\\F217\"; }\n\n.fa-cart-arrow-down:before {\n  content: \"\\F218\"; }\n\n.fa-diamond:before {\n  content: \"\\F219\"; }\n\n.fa-ship:before {\n  content: \"\\F21A\"; }\n\n.fa-user-secret:before {\n  content: \"\\F21B\"; }\n\n.fa-motorcycle:before {\n  content: \"\\F21C\"; }\n\n.fa-street-view:before {\n  content: \"\\F21D\"; }\n\n.fa-heartbeat:before {\n  content: \"\\F21E\"; }\n\n.fa-venus:before {\n  content: \"\\F221\"; }\n\n.fa-mars:before {\n  content: \"\\F222\"; }\n\n.fa-mercury:before {\n  content: \"\\F223\"; }\n\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\F224\"; }\n\n.fa-transgender-alt:before {\n  content: \"\\F225\"; }\n\n.fa-venus-double:before {\n  content: \"\\F226\"; }\n\n.fa-mars-double:before {\n  content: \"\\F227\"; }\n\n.fa-venus-mars:before {\n  content: \"\\F228\"; }\n\n.fa-mars-stroke:before {\n  content: \"\\F229\"; }\n\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\"; }\n\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\"; }\n\n.fa-neuter:before {\n  content: \"\\F22C\"; }\n\n.fa-genderless:before {\n  content: \"\\F22D\"; }\n\n.fa-facebook-official:before {\n  content: \"\\F230\"; }\n\n.fa-pinterest-p:before {\n  content: \"\\F231\"; }\n\n.fa-whatsapp:before {\n  content: \"\\F232\"; }\n\n.fa-server:before {\n  content: \"\\F233\"; }\n\n.fa-user-plus:before {\n  content: \"\\F234\"; }\n\n.fa-user-times:before {\n  content: \"\\F235\"; }\n\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\"; }\n\n.fa-viacoin:before {\n  content: \"\\F237\"; }\n\n.fa-train:before {\n  content: \"\\F238\"; }\n\n.fa-subway:before {\n  content: \"\\F239\"; }\n\n.fa-medium:before {\n  content: \"\\F23A\"; }\n\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\F23B\"; }\n\n.fa-optin-monster:before {\n  content: \"\\F23C\"; }\n\n.fa-opencart:before {\n  content: \"\\F23D\"; }\n\n.fa-expeditedssl:before {\n  content: \"\\F23E\"; }\n\n.fa-battery-4:before,\n.fa-battery:before,\n.fa-battery-full:before {\n  content: \"\\F240\"; }\n\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\F241\"; }\n\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\F242\"; }\n\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\F243\"; }\n\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\F244\"; }\n\n.fa-mouse-pointer:before {\n  content: \"\\F245\"; }\n\n.fa-i-cursor:before {\n  content: \"\\F246\"; }\n\n.fa-object-group:before {\n  content: \"\\F247\"; }\n\n.fa-object-ungroup:before {\n  content: \"\\F248\"; }\n\n.fa-sticky-note:before {\n  content: \"\\F249\"; }\n\n.fa-sticky-note-o:before {\n  content: \"\\F24A\"; }\n\n.fa-cc-jcb:before {\n  content: \"\\F24B\"; }\n\n.fa-cc-diners-club:before {\n  content: \"\\F24C\"; }\n\n.fa-clone:before {\n  content: \"\\F24D\"; }\n\n.fa-balance-scale:before {\n  content: \"\\F24E\"; }\n\n.fa-hourglass-o:before {\n  content: \"\\F250\"; }\n\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\F251\"; }\n\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\F252\"; }\n\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\F253\"; }\n\n.fa-hourglass:before {\n  content: \"\\F254\"; }\n\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\F255\"; }\n\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\F256\"; }\n\n.fa-hand-scissors-o:before {\n  content: \"\\F257\"; }\n\n.fa-hand-lizard-o:before {\n  content: \"\\F258\"; }\n\n.fa-hand-spock-o:before {\n  content: \"\\F259\"; }\n\n.fa-hand-pointer-o:before {\n  content: \"\\F25A\"; }\n\n.fa-hand-peace-o:before {\n  content: \"\\F25B\"; }\n\n.fa-trademark:before {\n  content: \"\\F25C\"; }\n\n.fa-registered:before {\n  content: \"\\F25D\"; }\n\n.fa-creative-commons:before {\n  content: \"\\F25E\"; }\n\n.fa-gg:before {\n  content: \"\\F260\"; }\n\n.fa-gg-circle:before {\n  content: \"\\F261\"; }\n\n.fa-tripadvisor:before {\n  content: \"\\F262\"; }\n\n.fa-odnoklassniki:before {\n  content: \"\\F263\"; }\n\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\"; }\n\n.fa-get-pocket:before {\n  content: \"\\F265\"; }\n\n.fa-wikipedia-w:before {\n  content: \"\\F266\"; }\n\n.fa-safari:before {\n  content: \"\\F267\"; }\n\n.fa-chrome:before {\n  content: \"\\F268\"; }\n\n.fa-firefox:before {\n  content: \"\\F269\"; }\n\n.fa-opera:before {\n  content: \"\\F26A\"; }\n\n.fa-internet-explorer:before {\n  content: \"\\F26B\"; }\n\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\F26C\"; }\n\n.fa-contao:before {\n  content: \"\\F26D\"; }\n\n.fa-500px:before {\n  content: \"\\F26E\"; }\n\n.fa-amazon:before {\n  content: \"\\F270\"; }\n\n.fa-calendar-plus-o:before {\n  content: \"\\F271\"; }\n\n.fa-calendar-minus-o:before {\n  content: \"\\F272\"; }\n\n.fa-calendar-times-o:before {\n  content: \"\\F273\"; }\n\n.fa-calendar-check-o:before {\n  content: \"\\F274\"; }\n\n.fa-industry:before {\n  content: \"\\F275\"; }\n\n.fa-map-pin:before {\n  content: \"\\F276\"; }\n\n.fa-map-signs:before {\n  content: \"\\F277\"; }\n\n.fa-map-o:before {\n  content: \"\\F278\"; }\n\n.fa-map:before {\n  content: \"\\F279\"; }\n\n.fa-commenting:before {\n  content: \"\\F27A\"; }\n\n.fa-commenting-o:before {\n  content: \"\\F27B\"; }\n\n.fa-houzz:before {\n  content: \"\\F27C\"; }\n\n.fa-vimeo:before {\n  content: \"\\F27D\"; }\n\n.fa-black-tie:before {\n  content: \"\\F27E\"; }\n\n.fa-fonticons:before {\n  content: \"\\F280\"; }\n\n.fa-reddit-alien:before {\n  content: \"\\F281\"; }\n\n.fa-edge:before {\n  content: \"\\F282\"; }\n\n.fa-credit-card-alt:before {\n  content: \"\\F283\"; }\n\n.fa-codiepie:before {\n  content: \"\\F284\"; }\n\n.fa-modx:before {\n  content: \"\\F285\"; }\n\n.fa-fort-awesome:before {\n  content: \"\\F286\"; }\n\n.fa-usb:before {\n  content: \"\\F287\"; }\n\n.fa-product-hunt:before {\n  content: \"\\F288\"; }\n\n.fa-mixcloud:before {\n  content: \"\\F289\"; }\n\n.fa-scribd:before {\n  content: \"\\F28A\"; }\n\n.fa-pause-circle:before {\n  content: \"\\F28B\"; }\n\n.fa-pause-circle-o:before {\n  content: \"\\F28C\"; }\n\n.fa-stop-circle:before {\n  content: \"\\F28D\"; }\n\n.fa-stop-circle-o:before {\n  content: \"\\F28E\"; }\n\n.fa-shopping-bag:before {\n  content: \"\\F290\"; }\n\n.fa-shopping-basket:before {\n  content: \"\\F291\"; }\n\n.fa-hashtag:before {\n  content: \"\\F292\"; }\n\n.fa-bluetooth:before {\n  content: \"\\F293\"; }\n\n.fa-bluetooth-b:before {\n  content: \"\\F294\"; }\n\n.fa-percent:before {\n  content: \"\\F295\"; }\n\n.fa-gitlab:before {\n  content: \"\\F296\"; }\n\n.fa-wpbeginner:before {\n  content: \"\\F297\"; }\n\n.fa-wpforms:before {\n  content: \"\\F298\"; }\n\n.fa-envira:before {\n  content: \"\\F299\"; }\n\n.fa-universal-access:before {\n  content: \"\\F29A\"; }\n\n.fa-wheelchair-alt:before {\n  content: \"\\F29B\"; }\n\n.fa-question-circle-o:before {\n  content: \"\\F29C\"; }\n\n.fa-blind:before {\n  content: \"\\F29D\"; }\n\n.fa-audio-description:before {\n  content: \"\\F29E\"; }\n\n.fa-volume-control-phone:before {\n  content: \"\\F2A0\"; }\n\n.fa-braille:before {\n  content: \"\\F2A1\"; }\n\n.fa-assistive-listening-systems:before {\n  content: \"\\F2A2\"; }\n\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\\F2A3\"; }\n\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\\F2A4\"; }\n\n.fa-glide:before {\n  content: \"\\F2A5\"; }\n\n.fa-glide-g:before {\n  content: \"\\F2A6\"; }\n\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\\F2A7\"; }\n\n.fa-low-vision:before {\n  content: \"\\F2A8\"; }\n\n.fa-viadeo:before {\n  content: \"\\F2A9\"; }\n\n.fa-viadeo-square:before {\n  content: \"\\F2AA\"; }\n\n.fa-snapchat:before {\n  content: \"\\F2AB\"; }\n\n.fa-snapchat-ghost:before {\n  content: \"\\F2AC\"; }\n\n.fa-snapchat-square:before {\n  content: \"\\F2AD\"; }\n\n.fa-pied-piper:before {\n  content: \"\\F2AE\"; }\n\n.fa-first-order:before {\n  content: \"\\F2B0\"; }\n\n.fa-yoast:before {\n  content: \"\\F2B1\"; }\n\n.fa-themeisle:before {\n  content: \"\\F2B2\"; }\n\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\\F2B3\"; }\n\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\\F2B4\"; }\n\n.fa-handshake-o:before {\n  content: \"\\F2B5\"; }\n\n.fa-envelope-open:before {\n  content: \"\\F2B6\"; }\n\n.fa-envelope-open-o:before {\n  content: \"\\F2B7\"; }\n\n.fa-linode:before {\n  content: \"\\F2B8\"; }\n\n.fa-address-book:before {\n  content: \"\\F2B9\"; }\n\n.fa-address-book-o:before {\n  content: \"\\F2BA\"; }\n\n.fa-vcard:before,\n.fa-address-card:before {\n  content: \"\\F2BB\"; }\n\n.fa-vcard-o:before,\n.fa-address-card-o:before {\n  content: \"\\F2BC\"; }\n\n.fa-user-circle:before {\n  content: \"\\F2BD\"; }\n\n.fa-user-circle-o:before {\n  content: \"\\F2BE\"; }\n\n.fa-user-o:before {\n  content: \"\\F2C0\"; }\n\n.fa-id-badge:before {\n  content: \"\\F2C1\"; }\n\n.fa-drivers-license:before,\n.fa-id-card:before {\n  content: \"\\F2C2\"; }\n\n.fa-drivers-license-o:before,\n.fa-id-card-o:before {\n  content: \"\\F2C3\"; }\n\n.fa-quora:before {\n  content: \"\\F2C4\"; }\n\n.fa-free-code-camp:before {\n  content: \"\\F2C5\"; }\n\n.fa-telegram:before {\n  content: \"\\F2C6\"; }\n\n.fa-thermometer-4:before,\n.fa-thermometer:before,\n.fa-thermometer-full:before {\n  content: \"\\F2C7\"; }\n\n.fa-thermometer-3:before,\n.fa-thermometer-three-quarters:before {\n  content: \"\\F2C8\"; }\n\n.fa-thermometer-2:before,\n.fa-thermometer-half:before {\n  content: \"\\F2C9\"; }\n\n.fa-thermometer-1:before,\n.fa-thermometer-quarter:before {\n  content: \"\\F2CA\"; }\n\n.fa-thermometer-0:before,\n.fa-thermometer-empty:before {\n  content: \"\\F2CB\"; }\n\n.fa-shower:before {\n  content: \"\\F2CC\"; }\n\n.fa-bathtub:before,\n.fa-s15:before,\n.fa-bath:before {\n  content: \"\\F2CD\"; }\n\n.fa-podcast:before {\n  content: \"\\F2CE\"; }\n\n.fa-window-maximize:before {\n  content: \"\\F2D0\"; }\n\n.fa-window-minimize:before {\n  content: \"\\F2D1\"; }\n\n.fa-window-restore:before {\n  content: \"\\F2D2\"; }\n\n.fa-times-rectangle:before,\n.fa-window-close:before {\n  content: \"\\F2D3\"; }\n\n.fa-times-rectangle-o:before,\n.fa-window-close-o:before {\n  content: \"\\F2D4\"; }\n\n.fa-bandcamp:before {\n  content: \"\\F2D5\"; }\n\n.fa-grav:before {\n  content: \"\\F2D6\"; }\n\n.fa-etsy:before {\n  content: \"\\F2D7\"; }\n\n.fa-imdb:before {\n  content: \"\\F2D8\"; }\n\n.fa-ravelry:before {\n  content: \"\\F2D9\"; }\n\n.fa-eercast:before {\n  content: \"\\F2DA\"; }\n\n.fa-microchip:before {\n  content: \"\\F2DB\"; }\n\n.fa-snowflake-o:before {\n  content: \"\\F2DC\"; }\n\n.fa-superpowers:before {\n  content: \"\\F2DD\"; }\n\n.fa-wpexplorer:before {\n  content: \"\\F2DE\"; }\n\n.fa-meetup:before {\n  content: \"\\F2E0\"; }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n", ""]);

// exports


/***/ }),
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(79);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./angular.autocomplete.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./angular.autocomplete.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\ndiv.auto-complete-container {\n  border: 1px solid lightsteelblue;\n  background-color: #cccccc;\n  white-space: nowrap; }\n\ndiv.auto-complete-container.unselectable {\n  user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none; }\n\ndiv.auto-complete-absolute-container {\n  position: absolute;\n  z-index: 10000; }\n\ndiv.auto-complete-container ul.auto-complete-results {\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin: 0px;\n  padding: 0px; }\n\ndiv.auto-complete-container ul.auto-complete-results li.auto-complete-item {\n  color: Black;\n  cursor: pointer;\n  font-weight: bold; }\n\ndiv.auto-complete-container ul.auto-complete-results li:not(:first-child) {\n  margin-top: 1px; }\n\ndiv.auto-complete-container ul.auto-complete-results li.auto-complete-item:hover {\n  background-color: #6699FF;\n  color: White; }\n\ndiv.auto-complete-container ul.auto-complete-results li.auto-complete-item-selected {\n  background-color: #6699FF;\n  color: White; }\n\ndiv.auto-complete-container ul.auto-complete-results li.auto-complete-item.auto-complete-no-match {\n  background-color: #efefef;\n  color: Black;\n  white-space: normal;\n  white-space: initial; }\n\ndiv.auto-complete-container table.auto-complete {\n  width: 100%;\n  border-collapse: collapse;\n  margin: 0px;\n  border-width: 0px;\n  border-style: none; }\n\ndiv.auto-complete-container table.auto-complete tr {\n  white-space: nowrap;\n  text-align: left; }\n\ndiv.auto-complete-container table.auto-complete tbody tr > td {\n  padding: 0px;\n  background-color: transparent;\n  border-width: 0px; }\n", ""]);

// exports


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(81);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./base.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./base.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\nhtml,\nbody {\n  height: 100%;\n  background-color: #242424;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 1em;\n  display: flex;\n  flex-direction: column; }\n\nbody p {\n  font-family: \"Roboto\", sans-serif; }\n\nh3,\nh4,\nh5 {\n  font-family: \"Lato-Regular\", sans-serif; }\n\n.clearfix:before,\n.clearfix:after {\n  display: table;\n  content: \" \"; }\n\n.clearfix:after {\n  clear: both; }\n\n* {\n  box-sizing: border-box; }\n\n*:before,\n*:after {\n  box-sizing: border-box; }\n\na {\n  background-color: transparent; }\n\na:active,\na:hover {\n  outline: 0; }\n\na {\n  color: #337ab7;\n  text-decoration: none; }\n\na:hover,\na:focus {\n  color: #23527c;\n  text-decoration: underline; }\n\na:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px; }\n\nbody a {\n  transition: 0.5s all;\n  -webkit-transition: 0.5s all;\n  -moz-transition: 0.5s all;\n  -o-transition: 0.5s all;\n  -ms-transition: 0.5s all; }\n\na:focus,\na:active,\na:hover {\n  outline: none;\n  transition: all 0.3s;\n  color: #111; }\n\na {\n  background-color: none;\n  color: inherit; }\n\nimg {\n  vertical-align: middle; }\n\n.img-responsive {\n  display: block;\n  min-width: 100%;\n  height: auto; }\n\nbutton {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\nbutton {\n  margin: 0;\n  font: inherit;\n  color: inherit; }\n\nbutton {\n  overflow: visible; }\n\nbutton {\n  text-transform: none; }\n\nbutton {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0; }\n\nbutton:focus {\n  outline: 0; }\n\nh3,\nh4,\nh5 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit; }\n\nh3 {\n  margin-top: 20px;\n  margin-bottom: 10px; }\n\nh4,\nh5 {\n  margin-top: 10px;\n  margin-bottom: 10px; }\n\nh3 {\n  font-size: 24px; }\n\nh4 {\n  font-size: 18px; }\n\nh5 {\n  font-size: 14px; }\n\nmain {\n  flex: 1;\n  margin-top: 40px;\n  display: flex;\n  flex-direction: column; }\n\nsvg:not(:root).svg-inline--fa {\n  overflow: visible; }\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -.125em; }\n\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em; }\n\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em; }\n\n.svg-inline--fa.fa-w-16 {\n  width: 1em; }\n\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em; }\n\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em; }\n\n.main-container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  margin: 0;\n  margin-top: 40px;\n  max-width: none;\n  background-attachment: fixed;\n  background-position: top;\n  background-repeat: no-repeat;\n  background-size: cover; }\n\n.main-content {\n  background-color: #242424;\n  background-attachment: fixed;\n  background-position: top;\n  background-repeat: no-repeat;\n  background-size: cover;\n  padding: 0px; }\n\n.row {\n  flex: 1;\n  display: flex;\n  flex-direction: row;\n  max-width: none; }\n\n.col {\n  overflow: auto; }\n\n.generalConfigWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.generalConfigBodyWrapper {\n  margin-top: 45px;\n  overflow: auto;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%; }\n\n.bio-text {\n  font-size: 0.7em;\n  float: left;\n  color: white;\n  font-family: \"MavenPro-Regular\", sans-serif;\n  font-size: 12px;\n  font-weight: bold;\n  border-right: thin dotted #666666;\n  line-height: 18px;\n  max-height: 75px;\n  overflow: auto; }\n\n.btn-dark {\n  background-color: rgba(36, 36, 36, 0.45);\n  color: white !important; }\n\n.btn-dark:hover,\n.btn-dark:focus,\n.btn-dark:active,\n.btn-dark.active,\n.open > .dropdown-toggle.btn-dark {\n  color: white;\n  background-color: rgba(2, 158, 197, 0.904);\n  border-color: rgba(20, 22, 24, 0.904);\n  /*set the color you want here*/ }\n\n.popover-body {\n  background-color: #242424; }\n\n.similar-artist-link {\n  background-color: rgba(36, 36, 36, 0.35) !important;\n  color: white !important; }\n\n.card-1 {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }\n\n.card-1:hover {\n  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }\n\n.card-2 {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n\n.card-3 {\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n\n.card-4 {\n  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }\n\n.card-5 {\n  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22); }\n\n.list-group {\n  background-color: #242424 !important; }\n\n.list-group-item {\n  background-color: #242424 !important;\n  border: 1px solid rgba(20, 22, 24, 0.904); }\n\n.notification {\n  position: fixed;\n  top: 10em;\n  right: 10em; }\n\n.bg-dark-transparent {\n  background-color: rgba(36, 36, 36, 0.35) !important;\n  color: white !important;\n  border-color: rgba(20, 22, 24, 0.904) !important; }\n\n.Link-link {\n  margin: 0;\n  padding: 0;\n  outline: none;\n  border: 0;\n  background: none;\n  color: white;\n  text-align: center;\n  text-decoration: none;\n  cursor: pointer; }\n\n.Link-link:hover {\n  color: white; }\n\n.HeartRating-heart {\n  margin-right: 5px;\n  color: #c4273c; }\n\n.IconButton-button {\n  display: inline-block;\n  margin: 0 2px;\n  width: 22px;\n  border-radius: 4px;\n  background-color: transparent;\n  text-align: center;\n  font-size: inherit; }\n\n.IconButton-button:hover {\n  border: none;\n  background-color: inherit;\n  color: #666; }\n\n.coverflowImage {\n  min-width: 100px;\n  min-height: 100px;\n  width: 100px;\n  height: 100px;\n  max-width: 100px;\n  max-height: 100px; }\n\n.animate-fade {\n  position: relative;\n  -webkit-animation-name: animatefading;\n  -webkit-animation-duration: 1s;\n  animation-name: animatefading;\n  animation-duration: 1s; }\n\n@-webkit-keyframes animatefading {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@keyframes animatefading {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@-webkit-keyframes spin {\n  0% {\n    -webkit-transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg); } }\n\n@keyframes spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n", ""]);

// exports


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(83);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./mixins.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./mixins.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n[type='range'] {\n  -webkit-appearance: none;\n  background: transparent;\n  margin: 12px 0;\n  width: 100%; }\n  [type='range']::-moz-focus-outer {\n    border: 0; }\n  [type='range']:focus {\n    outline: 0; }\n    [type='range']:focus::-webkit-slider-runnable-track {\n      background: rgba(2, 178, 222, 0.719); }\n    [type='range']:focus::-ms-fill-lower {\n      background: rgba(2, 158, 197, 0.719); }\n    [type='range']:focus::-ms-fill-upper {\n      background: rgba(2, 178, 222, 0.719); }\n  [type='range']::-webkit-slider-runnable-track {\n    cursor: default;\n    height: 8px;\n    transition: all .2s ease;\n    width: 100%;\n    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2), 0 0 1px rgba(13, 13, 13, 0.2);\n    background: rgba(2, 158, 197, 0.719);\n    border: 2px solid rgba(2, 158, 197, 0.719);\n    border-radius: 5px; }\n  [type='range']::-webkit-slider-thumb {\n    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2), 0 0 4px rgba(13, 13, 13, 0.2);\n    background: #242424;\n    border: 2px solid rgba(20, 22, 24, 0.904);\n    border-radius: 3px;\n    cursor: default;\n    height: 24px;\n    width: 10px;\n    -webkit-appearance: none;\n    margin-top: -10px; }\n  [type='range']::-moz-range-track {\n    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2), 0 0 1px rgba(13, 13, 13, 0.2);\n    cursor: default;\n    height: 8px;\n    transition: all .2s ease;\n    width: 100%;\n    background: rgba(2, 158, 197, 0.719);\n    border: 2px solid rgba(2, 158, 197, 0.719);\n    border-radius: 5px;\n    height: 4px; }\n  [type='range']::-moz-range-thumb {\n    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2), 0 0 4px rgba(13, 13, 13, 0.2);\n    background: #242424;\n    border: 2px solid rgba(20, 22, 24, 0.904);\n    border-radius: 3px;\n    cursor: default;\n    height: 20px;\n    width: 6px; }\n  [type='range']::-ms-track {\n    cursor: default;\n    height: 8px;\n    transition: all .2s ease;\n    width: 100%;\n    background: transparent;\n    border-color: transparent;\n    border-width: 12px 0;\n    color: transparent; }\n  [type='range']::-ms-fill-lower {\n    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2), 0 0 1px rgba(13, 13, 13, 0.2);\n    background: rgba(2, 138, 172, 0.719);\n    border: 2px solid rgba(2, 158, 197, 0.719);\n    border-radius: 10px; }\n  [type='range']::-ms-fill-upper {\n    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2), 0 0 1px rgba(13, 13, 13, 0.2);\n    background: rgba(2, 158, 197, 0.719);\n    border: 2px solid rgba(2, 158, 197, 0.719);\n    border-radius: 10px; }\n  [type='range']::-ms-thumb {\n    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2), 0 0 4px rgba(13, 13, 13, 0.2);\n    background: #242424;\n    border: 2px solid rgba(20, 22, 24, 0.904);\n    border-radius: 3px;\n    cursor: default;\n    height: 20px;\n    width: 6px;\n    margin-top: 2px; }\n  [type='range']:disabled::-webkit-slider-thumb {\n    cursor: not-allowed; }\n  [type='range']:disabled::-moz-range-thumb {\n    cursor: not-allowed; }\n  [type='range']:disabled::-ms-thumb {\n    cursor: not-allowed; }\n  [type='range']:disabled::-webkit-slider-runnable-track {\n    cursor: not-allowed; }\n  [type='range']:disabled::-ms-fill-lower {\n    cursor: not-allowed; }\n  [type='range']:disabled::-ms-fill-upper {\n    cursor: not-allowed; }\n\n@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\ntextarea,\ninput[type=\"text\"],\ninput[type=\"password\"],\ninput[type=\"datetime\"],\ninput[type=\"datetime-local\"],\ninput[type=\"date\"],\ninput[type=\"month\"],\ninput[type=\"time\"],\ninput[type=\"week\"],\ninput[type=\"number\"],\ninput[type=\"email\"],\ninput[type=\"url\"],\ninput[type=\"search\"],\ninput[type=\"tel\"],\ninput[type=\"color\"],\n.uneditable-input {\n  border-color: rgba(20, 22, 24, 0.904);\n  box-shadow: 0 1px 1px rgba(20, 22, 24, 0.904) inset, 0 0 8px rgba(20, 22, 24, 0.904);\n  outline: 0 none;\n  background-color: #242424;\n  color: white; }\n\ntextarea:focus,\ninput[type=\"text\"]:focus,\ninput[type=\"password\"]:focus,\ninput[type=\"datetime\"]:focus,\ninput[type=\"datetime-local\"]:focus,\ninput[type=\"date\"]:focus,\ninput[type=\"month\"]:focus,\ninput[type=\"time\"]:focus,\ninput[type=\"week\"]:focus,\ninput[type=\"number\"]:focus,\ninput[type=\"email\"]:focus,\ninput[type=\"url\"]:focus,\ninput[type=\"search\"]:focus,\ninput[type=\"tel\"]:focus,\ninput[type=\"color\"]:focus,\n.uneditable-input:focus {\n  border-color: rgba(20, 22, 24, 0.904);\n  box-shadow: 0 1px 1px rgba(20, 22, 24, 0.904) inset, 0 0 8px rgba(20, 22, 24, 0.904);\n  outline: 0 none;\n  background-color: #242424;\n  color: white; }\n\n::-webkit-scrollbar {\n  width: 0.5em;\n  height: 0.5em; }\n\n::-webkit-scrollbar-thumb {\n  background: #121212; }\n\n::-webkit-scrollbar-track {\n  background: #929292; }\n\nbody {\n  scrollbar-face-color: #121212;\n  scrollbar-track-color: #929292; }\n", ""]);

// exports


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(85);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./loader.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./loader.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.loader {\n  position: absolute;\n  z-index: 1000 !important;\n  margin-top: 40px;\n  margin-bottom: 70px;\n  left: calc(50vw + 160px - 75px);\n  top: 50%;\n  z-index: 1; }\n\n*, *:before, *:after {\n  box-sizing: border-box; }\n\n.loader-container {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  -webkit-perspective: 2000px;\n          perspective: 2000px;\n  -webkit-transform: rotateX(-30deg) rotateY(-45deg);\n          transform: rotateX(-30deg) rotateY(-45deg); }\n\n.holder {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  -webkit-transform: translate3d(0em, 3em, 1.5em);\n          transform: translate3d(0em, 3em, 1.5em); }\n  .holder:last-child {\n    -webkit-transform: rotateY(-90deg) rotateX(90deg) translate3d(0, 3em, 1.5em);\n            transform: rotateY(-90deg) rotateX(90deg) translate3d(0, 3em, 1.5em); }\n  .holder:first-child {\n    -webkit-transform: rotateZ(-90deg) rotateX(-90deg) translate3d(0, 3em, 1.5em);\n            transform: rotateZ(-90deg) rotateX(-90deg) translate3d(0, 3em, 1.5em); }\n  .holder:nth-child(1) .box {\n    background-color: #1FBCD3; }\n    .holder:nth-child(1) .box:before {\n      background-color: #126d7a; }\n    .holder:nth-child(1) .box:after {\n      background-color: #1894a7; }\n  .holder:nth-child(2) .box {\n    background-color: #52afda; }\n    .holder:nth-child(2) .box:before {\n      background-color: #237ba3; }\n    .holder:nth-child(2) .box:after {\n      background-color: #2c9acd; }\n  .holder:nth-child(3) .box {\n    background-color: #487488; }\n    .holder:nth-child(3) .box:before {\n      background-color: #253b45; }\n    .holder:nth-child(3) .box:after {\n      background-color: #365867; }\n\n.box {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  -webkit-animation: ani-box 6s infinite;\n          animation: ani-box 6s infinite;\n  width: 3em;\n  height: 3em; }\n  .box:before, .box:after {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    content: \"\"; }\n  .box:before {\n    left: 100%;\n    bottom: 0;\n    -webkit-transform: rotateY(90deg);\n            transform: rotateY(90deg);\n    -webkit-transform-origin: 0 50%;\n            transform-origin: 0 50%; }\n  .box:after {\n    left: 0;\n    bottom: 100%;\n    -webkit-transform: rotateX(90deg);\n            transform: rotateX(90deg);\n    -webkit-transform-origin: 0 100%;\n            transform-origin: 0 100%; }\n\n@-webkit-keyframes ani-box {\n  8.33% {\n    -webkit-transform: translate3d(-50%, -50%, 0) scaleZ(2);\n            transform: translate3d(-50%, -50%, 0) scaleZ(2); }\n  16.7% {\n    -webkit-transform: translate3d(-50%, -50%, -3em) scaleZ(1);\n            transform: translate3d(-50%, -50%, -3em) scaleZ(1); }\n  25% {\n    -webkit-transform: translate3d(-50%, -100%, -3em) scaleY(2);\n            transform: translate3d(-50%, -100%, -3em) scaleY(2); }\n  33.3% {\n    -webkit-transform: translate3d(-50%, -150%, -3em) scaleY(1);\n            transform: translate3d(-50%, -150%, -3em) scaleY(1); }\n  41.7% {\n    -webkit-transform: translate3d(-100%, -150%, -3em) scaleX(2);\n            transform: translate3d(-100%, -150%, -3em) scaleX(2); }\n  50% {\n    -webkit-transform: translate3d(-150%, -150%, -3em) scaleX(1);\n            transform: translate3d(-150%, -150%, -3em) scaleX(1); }\n  58.3% {\n    -webkit-transform: translate3d(-150%, -150%, 0) scaleZ(2);\n            transform: translate3d(-150%, -150%, 0) scaleZ(2); }\n  66.7% {\n    -webkit-transform: translate3d(-150%, -150%, 0) scaleZ(1);\n            transform: translate3d(-150%, -150%, 0) scaleZ(1); }\n  75% {\n    -webkit-transform: translate3d(-150%, -100%, 0) scaleY(2);\n            transform: translate3d(-150%, -100%, 0) scaleY(2); }\n  83.3% {\n    -webkit-transform: translate3d(-150%, -50%, 0) scaleY(1);\n            transform: translate3d(-150%, -50%, 0) scaleY(1); }\n  91.7% {\n    -webkit-transform: translate3d(-100%, -50%, 0) scaleX(2);\n            transform: translate3d(-100%, -50%, 0) scaleX(2); }\n  100% {\n    -webkit-transform: translate3d(-50%, -50%, 0) scaleX(1);\n            transform: translate3d(-50%, -50%, 0) scaleX(1); } }\n\n@keyframes ani-box {\n  8.33% {\n    -webkit-transform: translate3d(-50%, -50%, 0) scaleZ(2);\n            transform: translate3d(-50%, -50%, 0) scaleZ(2); }\n  16.7% {\n    -webkit-transform: translate3d(-50%, -50%, -3em) scaleZ(1);\n            transform: translate3d(-50%, -50%, -3em) scaleZ(1); }\n  25% {\n    -webkit-transform: translate3d(-50%, -100%, -3em) scaleY(2);\n            transform: translate3d(-50%, -100%, -3em) scaleY(2); }\n  33.3% {\n    -webkit-transform: translate3d(-50%, -150%, -3em) scaleY(1);\n            transform: translate3d(-50%, -150%, -3em) scaleY(1); }\n  41.7% {\n    -webkit-transform: translate3d(-100%, -150%, -3em) scaleX(2);\n            transform: translate3d(-100%, -150%, -3em) scaleX(2); }\n  50% {\n    -webkit-transform: translate3d(-150%, -150%, -3em) scaleX(1);\n            transform: translate3d(-150%, -150%, -3em) scaleX(1); }\n  58.3% {\n    -webkit-transform: translate3d(-150%, -150%, 0) scaleZ(2);\n            transform: translate3d(-150%, -150%, 0) scaleZ(2); }\n  66.7% {\n    -webkit-transform: translate3d(-150%, -150%, 0) scaleZ(1);\n            transform: translate3d(-150%, -150%, 0) scaleZ(1); }\n  75% {\n    -webkit-transform: translate3d(-150%, -100%, 0) scaleY(2);\n            transform: translate3d(-150%, -100%, 0) scaleY(2); }\n  83.3% {\n    -webkit-transform: translate3d(-150%, -50%, 0) scaleY(1);\n            transform: translate3d(-150%, -50%, 0) scaleY(1); }\n  91.7% {\n    -webkit-transform: translate3d(-100%, -50%, 0) scaleX(2);\n            transform: translate3d(-100%, -50%, 0) scaleX(2); }\n  100% {\n    -webkit-transform: translate3d(-50%, -50%, 0) scaleX(1);\n            transform: translate3d(-50%, -50%, 0) scaleX(1); } }\n", ""]);

// exports


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(87);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./debug.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/src/index.js??ref--4-2!../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./debug.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.card {\n  box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  border: 0px lime; }\n\n.row {\n  border: 0px orange; }\n\n.col {\n  border: 0px yellow; }\n\n.main-container {\n  border: 0px red; }\n\n.sidebar {\n  border: 0px lime; }\n\n* {\n  border: 0px red; }\n", ""]);

// exports


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(89);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pagecontainer.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pagecontainer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.root {\n  background-attachment: fixed;\n  background-position: top;\n  background-repeat: no-repeat;\n  background-size: 100% auto;\n  overflow: hidden;\n  height: 100%; }\n\n.Page-page {\n  display: flex;\n  flex-direction: column;\n  height: 100%; }\n\n.Page-main {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto; }\n\n.PageContent-content {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  overflow-x: hidden;\n  width: 100%; }\n\n.PageContentBody-contentBody {\n  flex: 1 0 1px; }\n\n.PageContentBody-innerContentBody {\n  padding: 0; }\n\n@media screen and (max-width: 768px) {\n  .root {\n    display: flex;\n    flex-direction: column;\n    min-height: 100%;\n    height: auto; }\n  .Page-page {\n    flex-grow: 1;\n    height: auto;\n    height: initial; }\n  .PageContentBody-contentBody {\n    flex-basis: auto;\n    overflow-y: hidden !important; } }\n", ""]);

// exports


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pageheader.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pageheader.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.PageContent-header {\n  position: relative;\n  width: 100%;\n  height: 375px; }\n\n.PageContent-backdrop {\n  position: absolute;\n  width: 100%;\n  height: 100%; }\n\n.PageContent-backdrop-bg {\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n  filter: blur(28px);\n  -webkit-filter: blur(28px); }\n\n.PageContent-backdropOverlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.445); }\n\n.PageContent-headerContent {\n  display: flex;\n  padding: 30px;\n  width: 100%;\n  height: 100%;\n  color: #fff; }\n\n.PageContent-HeaderDetails-poster {\n  flex-shrink: 0;\n  margin-right: 35px;\n  width: 250px;\n  height: 250px; }\n\n.PageContent-HeaderDetails-info {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  overflow: hidden; }\n\n.PageContent-HeaderDetails-titleContainer {\n  display: flex;\n  justify-content: space-between; }\n\n.PageContent-HeaderDetails-title {\n  margin-bottom: 5px;\n  font-weight: 300;\n  font-size: 50px;\n  line-height: 50px; }\n\n.PageContent-HeaderDetails-navigation-buttons {\n  white-space: nowrap; }\n\n.PageContent-HeaderDetails-navigation-button {\n  margin-left: 5px;\n  width: 30px;\n  color: #e1e2e3;\n  white-space: nowrap; }\n\n.PageContent-HeaderDetails-details {\n  font-weight: 300;\n  font-size: 20px; }\n\n.PageContent-HeaderDetails-detailsLabel {\n  margin: 5px 10px 5px 0; }\n\n.PageContent-HeaderDetails-overview {\n  flex: 1 0 auto;\n  min-height: 0; }\n\n@media only screen and (max-width: 768px) {\n  .PageContent-headerContent {\n    padding: 15px; } }\n\n@media only screen and (max-width: 1200px) {\n  .PageContent-HeaderDetails-poster {\n    display: none; } }\n", ""]);

// exports


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(93);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pagecontent.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pagecontent.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(95);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pagetoolbar.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./pagetoolbar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.PageToolbar-toolbar {\n  display: flex;\n  justify-content: space-between;\n  flex: 0 0 auto;\n  padding: 0;\n  height: 45px;\n  line-height: 45px;\n  background-color: #242424 !important;\n  border: 1px solid rgba(20, 22, 24, 0.904); }\n\n.PageToolbarSection-sectionContainer {\n  display: flex;\n  flex: 1 1 10%; }\n\n.PageToolbarSection-section {\n  display: flex;\n  align-items: center;\n  flex-grow: 1; }\n\n.PageToolbarSection-left {\n  justify-content: flex-start; }\n\n.PageToolbarButton-toolbarButton {\n  width: 45px;\n  text-align: center;\n  line-height: 0.25em;\n  font-size: 21px;\n  color: white;\n  margin: 5px; }\n\n.PageToolbarButton-toolbarButton:hover {\n  color: rgba(255, 255, 255, 0.904); }\n\n.PageToolbarButton-labelContainer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 16px; }\n\n.PageToolbarButton-label {\n  padding: 0 3px;\n  color: white;\n  font-size: 11px;\n  line-height: calc(11px + 1px); }\n\n.PageToolbarSeparator-separator {\n  margin: 10px 20px;\n  height: 40px;\n  border-right: 1px solid rgba(20, 22, 24, 0.904);\n  opacity: 0.35; }\n\n.PageToolbarSection-right {\n  justify-content: flex-end; }\n\n@media only screen and (max-width: 768px) and (max-width: 768px) {\n  .PageToolbar-toolbar {\n    padding: 0 10px; }\n  .PageToolbarSeparator-separator {\n    margin: 10px 5px; } }\n", ""]);

// exports


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./tables.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./tables.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.Table-tableContainer {\n  overflow-x: auto; }\n\n.Table-table {\n  max-width: 100%;\n  width: 100%;\n  border-collapse: collapse; }\n\n.TableHeaderCell-headerCell {\n  padding: 8px;\n  border: none !important;\n  text-align: left;\n  font-weight: bold; }\n\n.TableHeaderCell-sortIcon {\n  margin-left: 10px; }\n\n.TableRow-row {\n  transition: background-color 500ms; }\n\n.TableRow-row-now-playing {\n  transition: background-color 500ms;\n  background-color: rgba(2, 158, 197, 0.904) !important;\n  color: rgba(0, 0, 0, 0.904) !important; }\n\n.TableRow-row:hover {\n  background-color: #242424;\n  color: white; }\n\n.TableRowCell-cell {\n  padding-left: 8px;\n  padding-right: 4px;\n  padding-top: 2px;\n  padding-bottom: 2px;\n  border-top: 1px solid rgba(20, 22, 24, 0.904);\n  line-height: 1.52857143;\n  color: white; }\n\n.TableRowHeaderCell-Starred {\n  width: 15px;\n  border: none !important;\n  text-align: left;\n  font-weight: bold; }\n\n.TableRowHeaderCell-Play {\n  width: 15px;\n  border: none !important;\n  text-align: left;\n  font-weight: bold; }\n\n.TableRowHeaderCell-TrackCount {\n  padding: 8px;\n  width: 50px;\n  border: none !important;\n  vertical-align: middle;\n  align-content: center;\n  text-align: center; }\n\n.TableRowHeaderCell-TrackCount-Center {\n  padding: 8px;\n  width: 50px;\n  border: none !important;\n  text-align: center;\n  text-align: center;\n  font-weight: bold; }\n\n.RelativeDateCell-cell {\n  width: 180px; }\n\n.AlbumSearchCell-AlbumSearchCell {\n  width: 70px;\n  white-space: nowrap; }\n\n.TableRowCell-monitored {\n  width: 42px; }\n\n.TableRowCell-now-playing {\n  font-weight: bold; }\n\n.TableRowCell-status {\n  width: 75px;\n  text-align: center;\n  vertical-align: middle; }\n\n.TableRowCell-star {\n  width: 15px; }\n\n.TableRowCell-play {\n  width: 15px; }\n\n.TableRowCell-count {\n  width: 30px;\n  vertical-align: middle;\n  align-content: center;\n  text-align: right; }\n\n.TableRowCell-count-center {\n  width: 30px;\n  vertical-align: middle;\n  align-content: center;\n  text-align: center; }\n\n.TableRowCell-duration {\n  width: 30px;\n  vertical-align: middle;\n  align-content: center;\n  text-align: center; }\n\n.StarRating-starRating {\n  display: flex;\n  align-items: left;\n  justify-content: left; }\n\n.StarRating-backStar {\n  position: relative;\n  display: flex;\n  color: #515253; }\n\n.StarRating-frontStar {\n  position: absolute;\n  top: 0;\n  display: flex;\n  overflow: hidden;\n  color: #ffbc0b; }\n\n.MonitorToggleButton-toggleButton {\n  padding: 0;\n  font-size: inherit; }\n\n@media screen and (max-width: 768px) {\n  .Table-tableContainer {\n    overflow-y: hidden;\n    width: 100%; }\n  .TableHeaderCell-headerCell {\n    white-space: nowrap; }\n  .TableRowCell-cell {\n    white-space: nowrap; } }\n", ""]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(99);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./jumpbar.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./jumpbar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.PageJumpBarItem-jumpBarItem {\n  flex: 1 0 25px;\n  border-bottom: 1px solid #e5e5e5;\n  text-align: center;\n  font-weight: bold; }\n\n.PageJumpBarItem-jumpBarItem:last-child {\n  border: none; }\n\n.PageJumpBar-jumpBar {\n  display: flex;\n  align-content: stretch;\n  align-items: stretch;\n  align-self: stretch;\n  justify-content: center;\n  flex: 0 0 30px;\n  float: right;\n  position: absolute;\n  right: 20px;\n  top: 45px;\n  bottom: 0px;\n  z-index: 1000; }\n\n.PageJumpBar-jumpBarItems {\n  display: flex;\n  justify-content: space-around;\n  flex: 0 0 100%;\n  flex-direction: column;\n  overflow: hidden; }\n\n@media only screen and (max-width: 768px) {\n  .PageJumpBar-jumpBar {\n    display: none; } }\n", ""]);

// exports


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(101);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./detaillabel.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./detaillabel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.Details-Label {\n  margin: 5px 10px 5px 0; }\n\n.AlbumDetails-path,\n.AlbumDetails-sizeOnDisk,\n.AlbumDetails-qualityProfileName,\n.AlbumDetails-links {\n  margin-left: 8px;\n  font-weight: 300;\n  font-size: 17px; }\n\n.AlbumDetails-path {\n  vertical-align: text-top;\n  font-size: 14px;\n  font-family: \"Ubuntu Mono\", Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n\n.Label-label {\n  display: inline-block;\n  margin: 2px;\n  border: 1px solid;\n  border-radius: 2px;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  line-height: 1;\n  cursor: default; }\n\n.Label-default {\n  border-color: rgba(20, 22, 24, 0.904);\n  background-color: rgba(36, 36, 36, 0.35) !important;\n  color: white !important; }\n\n.Label-large {\n  padding: 3px 7px;\n  font-weight: bold;\n  font-size: 14px; }\n\n.Label-success {\n  border-color: #27c24c;\n  background-color: #27c24c; }\n\n.Label-medium {\n  padding: 2px 5px;\n  font-size: 12px; }\n", ""]);

// exports


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(103);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./expander.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./expander.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.ExpanderContainer {\n  margin-bottom: 20px;\n  border: 1px solid rgba(20, 22, 24, 0.904);\n  border-radius: 4px;\n  background-color: #242424; }\n\n.ExpanderContainer:last-of-type {\n  margin-bottom: 0; }\n\n.ExpanderContainer-header {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  font-size: 24px;\n  cursor: pointer; }\n\n.ExpanderContainer-body {\n  padding-top: 15px;\n  border-top: 1px solid rgba(20, 22, 24, 0.904); }\n\n.ExpanderContainer-left {\n  display: flex;\n  align-items: center;\n  flex: 0 1 300px;\n  padding: 15px 10px; }\n\n.ExpanderContainer-label {\n  color: rgba(255, 255, 255, 0.904);\n  margin-right: 5px;\n  margin-left: 5px; }\n\n.ExpanderContainer-sublabel {\n  color: #8895aa;\n  font-style: italic;\n  font-size: 18px; }\n\n.ExpanderContainer-expandButton {\n  flex-grow: 1;\n  width: 100%;\n  text-align: center; }\n\n.ExpanderContainer-actionButton {\n  width: 30px; }\n\n.ExpanderContainer-expandButtonIcon {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin-top: -12px;\n  margin-left: -15px; }\n\n.ExpanderContainer-collapseButtonContainer {\n  padding: 10px 15px;\n  width: 100%;\n  border-top: 1px solid rgba(20, 22, 24, 0.904);\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n  background-color: #242424;\n  text-align: center; }\n\n@media only screen and (max-width: 768px) {\n  .ExpanderContainer {\n    border-right: 0;\n    border-left: 0;\n    border-radius: 0; }\n  .ExpanderContainer-expandButtonIcon {\n    position: static;\n    margin: 0; } }\n", ""]);

// exports


/***/ }),
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */
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

window.AlloyApi = function () {

  var AlloyApi = function () {
    function AlloyApi(obj) {
      var _this = this;

      _classCallCheck(this, AlloyApi);

      if (typeof obj !== 'object') {
        throw new Error('Input must be an object & contain url & apikey');
        return;
      }
      if (obj.hasOwnProperty('alloydb_host') && obj.hasOwnProperty('alloydb_port') && obj.hasOwnProperty('alloydb_apikey')) {

      } else {
        throw new TypeError('Input must be an object & contain url and apikey fields');
        return;
      }

      this._settings = obj;
    }


    _createClass(AlloyApi, [{
      key: '_toQueryString',
      value: function _toQueryString(params) {
        var r = [];
        for (var n in params) {
          n = encodeURIComponent(n);
          r.push(params[n] === null ? n : n + '=' + encodeURIComponent(params[n]));
        }
        return r.join('&');
      }
    },
    {
      key: '_buildUrl',
      value: function _buildUrl(method, options) {
        if (options !== null && typeof options === 'object') {
          options = '&' + this._toQueryString(options);
        }
        if (!options) {
          options = '';
        }

        if (this._settings.alloydb_use_ssl)
          this._url = "https://";
        else
          this._url = "http://";

        this._url += this._settings.alloydb_host;
        if (this._settings.alloydb_include_port_in_url)
          this._url += ":" + this._settings.alloydb_port;
        return this._url + '/api/v1/' + method + '?' + this._toQueryString(this.params) + options;

      }
    },
    {
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
    },
    {
      key: '_xhrput',
      value: function _xhrput(url, dataType) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", url, true);
          xhr.responseType = dataType || 'json';
          xhr.onload = resolve;
          xhr.onerror = reject;
          xhr.send();
          _this2._lastXhr = xhr;
        });
      }
    },
    {
      key: '_xhrdel',
      value: function _xhrput(url, dataType) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("DELETE", url, true);
          xhr.responseType = dataType || 'json';
          xhr.onload = resolve;
          xhr.onerror = reject;
          xhr.send();
          _this2._lastXhr = xhr;
        });
      }
    },
    {
      key: '_get',
      value: function _get(method, options) {
        var _that = this;
        var opt = {};
        Object.assign(opt, { api_key: _that._settings.alloydb_apikey }, options);
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl(method, opt);
          _that._xhr(url).then(function (e) {
            var res = e.target.response;
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }
    },
    {
      key: '_put',
      value: function _put(method, options) {
        var _that = this;
        var opt = {};
        Object.assign(opt, { api_key: _that._settings.alloydb_apikey }, options);
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl(method, opt);
          _that._xhrput(url).then(function (e) {
            var res = e.target.response;
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }
    },
    {
      key: '_delete',
      value: function _delete(method, options) {
        var _that = this;
        var opt = {};
        Object.assign(opt, { api_key: _that._settings.alloydb_apikey }, options);
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl(method, opt);
          _that._xhrdel(url).then(function (e) {
            var res = e.target.response;
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }
    },
    {
      key: 'ping',
      value: function ping() {
        return this._get('system/ping');
      }
    },
    {
      key: 'getSchedulerStatus',
      value: function getSchedulerStatus() {
        return this._get('system/scheduler');
      }
    },
    {
      key: 'getLibraryInfo',
      value: function getLibraryInfo() {
        return this._get('system/stats');
      }
    },
    {
      key: 'getMediaPaths',
      value: function getLibraryInfo() {
        return this._get('config/mediapaths');
      }
    },
    {
      key: 'getMusicFolders',
      value: function getMusicFolders() {
        return this._get('browse/music_folders');
      }
    },
    {
      key: 'getMusicFoldersIndex',
      value: function getMusicFoldersIndex() {
        return this._get('browse/music_folders_index');
      }
    },
    {
      key: 'getRandomSongs',
      value: function getRandomSongs() {
        return this._get('list/random_songs');
      }
    },
    {
      key: 'getFresh',
      value: function getFresh(limit) {
        return this._get('browse/fresh', { limit: limit });
      }
    },
    {
      key: 'getStarred',
      value: function getStarred() {
        return this._get('list/starred');
      }
    },
    {
      key: 'getAlbums',
      value: function getAlbums() {
        return this._get('list/album_list');
      }
    },
    {
      key: 'getAlbum',
      value: function id(id) {
        return this._get('browse/album', { id: id });
      }
    },
    {
      key: 'getGenre',
      value: function getGenre(id) {
        return this._get('browse/genre', { id: id });
      }
    },
    {
      key: 'getGenres',
      value: function getGenres() {
        return this._get('browse/genres');
      }
    },
    {
      key: 'getSongsByGenre',
      value: function getSongsByGenre(id) {
        return this._get('list/songs_by_genre', { id: id });
      }
    },
    {
      key: 'getArtist',
      value: function getArtist(id) {
        return this._get('browse/artist', { id: id });
      }
    },
    {
      key: 'getArtistInfo',
      value: function getArtistInfo(artist) {
        return this._get('lastfm/artist_info', { artist: artist });
      }
    },
    {
      key: 'getAlbumInfo',
      value: function getAlbumInfo(artist, album) {
        return this._get('lastfm/album_info', { artist: artist, album: album });
      }
    },
    {
      key: 'getTrackInfo',
      value: function getTrackInfo(id) {
        return this._get('lastfm/track_info', { id: id });
      }
    },
    {
      key: 'getGenreInfo',
      value: function getGenreInfo(genre) {
        return this._get('lastfm/genre_info', { genre: genre });
      }
    },
    {
      key: 'scanFullStart',
      value: function scanFullStart() {
        return this._get('system/start_full_scan');
      }
    },
    {
      key: 'scanQuickStart',
      value: function scanQuickStart() {
        return this._get('system/start_quick_scan');
      }
    },
    {
      key: 'scanStatus',
      value: function scanStatus() {
        return this._get('system/scan_status');
      }
    },
    {
      key: 'scanCancel',
      value: function scanCancel() {
        return this._get('system/cancel_scan');
      }
    },
    {
      key: 'search',
      value: function search(query) {
        return this._get('search', { any: query });
      }
    },
    {
      key: 'addPlay',
      value: function addPlay(id) {
        return this._put('annotation/add_play', { id: id });
      }
    },
    {
      key: 'love',
      value: function love(params) {
        return this._put('lastfm/love', params);
      }
    },
    {
      key: 'unlove',
      value: function unlove(params) {
        return this._delete('lastfm/love', params);
      }
    },
    {
      key: 'star',
      value: function star(params) {
        return this._put('annotation/star', params);
      }
    },
    {
      key: 'unstar',
      value: function unstar(params) {
        return this._put('annotation/unstar', params);
      }
    },
    {
      key: 'stream',
      value: function stream(id, quality) {
        return this._buildUrl('media/stream', { api_key: this._settings.alloydb_apikey, id: id, quality: quality })
      }
    },
    {
      key: 'download',
      value: function download(id, quality) {
        return this._buildUrl('media/download', { api_key: this._settings.alloydb_apikey, id: id })
      }
    },
    {
      key: 'getCoverArt',
      value: function getCoverArt(id) {
        return this._buildUrl('media/cover_art', { api_key: this._settings.alloydb_apikey, id: id })
      }
    },
    {
      key: 'lastFmLogin',
      value: function lastFmLogin(username, password) {
        return this._put('lastfm/lastfm_login', { username: username, password: password });
      }
    },
    {
      key: 'scrobble',
      value: function scrobble(id) {
        return this._put('lastfm/scrobble', { id: id, submission: 'true' });
      }
    },
    {
      key: 'scrobbleNowPlaying',
      value: function scrobbleNowPlaying(id) {
        return this._put('lastfm/scrobble', { id: id, submission: 'false' });
      }
    },
    ]);

    return AlloyApi;
  }();

  return AlloyApi;
}();

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery, _, $) {(function (global, factory) {
  'use strict';

  if (true) {
    // commonJS
    module.exports = factory(__webpack_require__(7));
  }
  else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['module', 'angular'], function (module, angular) {
      module.exports = factory(angular);
    });
  }
  else {
    factory(global.angular);
  }
}(this, function (angular) {
  var helperService = new HelperService();

  angular
    .module('autoCompleteModule', ['ngSanitize'])
    .directive('autoComplete', autoCompleteDirective)
    .directive('autoCompleteItem', autoCompleteItemDirective)
    .directive('autoCompleteNoMatch', autoCompleteNoMatchDirective);

  autoCompleteDirective.$inject = ['$q', '$compile', '$document', '$window', '$timeout'];
  function autoCompleteDirective($q, $compile, $document, $window, $timeout) {

    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controllerAs: 'ctrl',
      bindToController: {
        initialOptions: '&autoComplete'
      },
      require: ['autoComplete', 'ngModel'],
      link: postLinkFn,
      controller: MainCtrl
    };

    function postLinkFn(scope, element, attrs, ctrls) {
      var ctrl = ctrls[0]; //directive controller
      ctrl.textModelCtrl = ctrls[1]; // textbox model controller

      // store the jquery element on the controller
      ctrl.target = element;

      $timeout(function () {
        // execute the options expression
        $q.when(ctrl.initialOptions()).then(_initialize);
      });

      function _initialize(options) {
        options = options || {};

        ctrl.init(angular.extend({}, defaultOptions, options));

        _initializeContainer();
        _wireupEvents();
      }

      function _initializeContainer() {
        ctrl.container = _getContainer();

        if (ctrl.options.containerCssClass) {
          ctrl.container.addClass(ctrl.options.containerCssClass);
        }

        // if a jquery parent is specified in options append the container to that
        // otherwise append to body
        if (ctrl.options.dropdownParent) {
          ctrl.options.dropdownParent.append(ctrl.container);
        }
        else {
          $document.find('body').append(ctrl.container);
          ctrl.container.addClass('auto-complete-absolute-container');
        }

        // keep a reference to the <ul> element
        ctrl.elementUL = angular.element(ctrl.container[0].querySelector('ul.auto-complete-results'));
      }

      function _getContainer() {
        if (angular.isElement(ctrl.options.dropdownParent)) {
          return _getCustomContainer();
        }
        if (ctrl.options.containerTemplate) {
          var linkFn = $compile(ctrl.options.containerTemplate);
          return linkFn(scope);
        }

        return _getDefaultContainer();
      }

      function _getCustomContainer() {
        var container = ctrl.options.dropdownParent;

        container.addClass('auto-complete-container unselectable');
        container.attr('data-instance-id', ctrl.instanceId);

        var linkFn = $compile(_getDropdownListTemplate());
        var elementUL = linkFn(scope);
        container.append(elementUL);

        return container;
      }

      function _getDefaultContainer() {
        var linkFn = $compile(_getContainerTemplate());
        return linkFn(scope);
      }

      function _getContainerTemplate() {
        var html = '';
        html += '<div class="auto-complete-container unselectable"';
        html += '     data-instance-id="{{ ctrl.instanceId }}"';
        html += '     ng-show="ctrl.containerVisible">';
        html += _getDropdownListTemplate();
        html += '</div>';

        return html;
      }

      function _getDropdownListTemplate() {
        var html = '';
        html += '     <ul class="auto-complete-results">';
        html += '         <li ng-if="ctrl.renderItems.length"';
        html += '             ng-repeat="renderItem in ctrl.renderItems track by renderItem.id"';
        html += '             ng-click="ctrl.selectItem($index, true)"';
        html += '             class="auto-complete-item" data-index="{{ $index }}"';
        html += '             ng-class="ctrl.getSelectedCssClass($index)">';
        html += '               <auto-complete-item index="$index"';
        html += '                      item-template-link-fn="ctrl.itemTemplateLinkFn"';
        html += '                      render-item="renderItem"';
        html += '                      search-text="ctrl.searchText" />';
        html += '         </li>';
        html += '         <li ng-if="!ctrl.renderItems.length && ctrl.options.noMatchTemplateEnabled"';
        html += '             class="auto-complete-item auto-complete-no-match">';
        html += '               <auto-complete-no-match';
        html += '                      template="ctrl.options.noMatchTemplate"';
        html += '                      search-text="ctrl.searchText" />';
        html += '         </li>';
        html += '     </ul>';

        return html;
      }

      function _wireupEvents() {

        // when the target(textbox) gets focus activate the corresponding container
        element.on(DOM_EVENT.FOCUS, function () {
          scope.$evalAsync(function () {
            ctrl.activate();
            if (ctrl.options.activateOnFocus) {
              _waitAndQuery(element.val(), 100);
            }
          });
        });

        element.on(DOM_EVENT.INPUT, function () {
          scope.$evalAsync(function () {
            _tryQuery(element.val());
          });
        });

        element.on(DOM_EVENT.KEYDOWN, function (event) {
          var $event = event;
          scope.$evalAsync(function () {
            _handleElementKeyDown($event);
          });
        });

        ctrl.container.find('ul').on(DOM_EVENT.SCROLL, function () {
          if (!ctrl.options.pagingEnabled) {
            return;
          }

          var list = this;
          scope.$evalAsync(function () {
            if (!ctrl.containerVisible) {
              return;
            }

            // scrolled to the bottom?
            if ((list.offsetHeight + list.scrollTop) >= list.scrollHeight) {
              ctrl.tryLoadNextPage();
            }
          });
        });

        $document.on(DOM_EVENT.KEYDOWN, function (event) {
          var $event = event;
          scope.$evalAsync(function () {
            _handleDocumentKeyDown($event);
          });
        });

        $document.on(DOM_EVENT.CLICK, function (event) {
          var $event = event;
          scope.$evalAsync(function () {
            _handleDocumentClick($event);
          });
        });

        // $window is a reference to the browser's window object
        angular.element($window).on(DOM_EVENT.RESIZE, function () {
          if (ctrl.options.hideDropdownOnWindowResize) {
            scope.$evalAsync(function () {
              ctrl.autoHide();
            });
          }
        });
      }

      function _ignoreKeyCode(keyCode) {
        return [
          KEYCODE.TAB,
          KEYCODE.ALT,
          KEYCODE.CTRL,
          KEYCODE.LEFTARROW,
          KEYCODE.RIGHTARROW,
          KEYCODE.MAC_COMMAND_LEFT,
          KEYCODE.MAC_COMMAND_RIGHT
        ].indexOf(keyCode) !== -1;
      }

      function _handleElementKeyDown(event) {
        var keyCode = event.charCode || event.keyCode || 0;

        if (_ignoreKeyCode(keyCode)) {
          return;
        }

        switch (keyCode) {
          case KEYCODE.UPARROW:
            ctrl.scrollToPreviousItem();

            event.stopPropagation();
            event.preventDefault();

            break;

          case KEYCODE.DOWNARROW:
            ctrl.scrollToNextItem();

            event.stopPropagation();
            event.preventDefault();

            break;

          case KEYCODE.ENTER:
            ctrl.selectItem(ctrl.selectedListIndex, ctrl.selectedIndex, true);

            //prevent postback upon hitting enter
            event.preventDefault();
            event.stopPropagation();

            break;

          case KEYCODE.ESCAPE:
            ctrl.restoreOriginalText();
            ctrl.autoHide();

            event.preventDefault();
            event.stopPropagation();

            break;

          default:
            break;
        }
      }

      function _handleDocumentKeyDown() {
        // hide inactive dropdowns when multiple auto complete exist on a page
        helperService.hideAllInactive();
      }

      function _handleDocumentClick(event) {
        // hide inactive dropdowns when multiple auto complete exist on a page
        helperService.hideAllInactive();

        // ignore inline
        if (ctrl.isInline()) {
          return;
        }

        // no container. probably destroyed in scope $destroy
        if (!ctrl.container) {
          return;
        }

        // ignore target click
        if (event.target === ctrl.target[0]) {
          event.stopPropagation();
          return;
        }

        if (_containerContainsTarget(event.target)) {
          event.stopPropagation();
          return;
        }

        ctrl.autoHide();
      }

      function _tryQuery(searchText) {
        // query only if minimum number of chars are typed; else hide dropdown
        if ((ctrl.options.minimumChars === 0)
          || (searchText && searchText.trim().length !== 0 && searchText.length >= ctrl.options.minimumChars)) {
          _waitAndQuery(searchText);
          return;
        }

        ctrl.autoHide();
      }

      function _waitAndQuery(searchText, delay) {
        // wait few millisecs before calling query(); this to check if the user has stopped typing
        var promise = $timeout(function () {
          // has searchText unchanged?
          if (searchText === element.val()) {
            ctrl.query(searchText);
          }

          //cancel the timeout
          $timeout.cancel(promise);

        }, (delay || 300));
      }

      function _containerContainsTarget(target) {
        // use native Node.contains
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
        var container = ctrl.container[0];
        if (angular.isFunction(container.contains) && container.contains(target)) {
          return true;
        }

        // otherwise use .has() if jQuery is available
        if (__webpack_provided_window_dot_jQuery && angular.isFunction(ctrl.container.has) &&
          ctrl.container.has(target).length > 0) {

          return true;
        }

        // assume target is not in container
        return false;
      }

      // cleanup on destroy
      var destroyFn = scope.$on('$destroy', function () {
        if (ctrl.container) {
          ctrl.container.remove();
          ctrl.container = null;
        }

        destroyFn();
      });
    }
  }

  MainCtrl.$inject = ['$q', '$window', '$document', '$timeout', '$templateRequest', '$compile', '$exceptionHandler'];
  function MainCtrl($q, $window, $document, $timeout, $templateRequest, $compile, $exceptionHandler) {
    var that = this;
    var originalSearchText = null;
    var queryCounter = 0;
    var dataLoadInProgress = false;
    var endOfPagedList = false;
    var currentPageIndex = 0;

    this.target = null;
    this.instanceId = -1;
    this.selectedListIndex = -1;
    this.selectedIndex = -1;
    this.renderItems = [];
    this.containerVisible = false;
    this.searchText = null;
    this.itemTemplateLinkFn = null;

    this.isInline = function () {
      // if a dropdown jquery parent is provided it is assumed inline
      return angular.isElement(that.options.dropdownParent);
    };

    this.init = function (options) {
      that.instanceId = helperService.registerInstance(that);
      that.options = options;
      that.containerVisible = that.isInline();

      _safeCallback(that.options.ready, publicApi);
    };

    this.activate = function () {
      helperService.setActiveInstanceId(that.instanceId);
      // do not reset if the container (dropdown list) is currently visible
      // Ex: Switching to a different tab or window and switching back
      // again when the dropdown list is visible.
      if (!that.containerVisible) {
        originalSearchText = that.searchText = null;
      }
    };

    this.query = function (searchText) {
      that.empty();
      _reset();

      return _query(searchText, 0);
    };

    this.show = function () {
      // the show() method is called after the items are ready for display
      // the textbox position can change (ex: window resize) when it has focus
      // so reposition the dropdown before it's shown
      _positionDropdown();

      // callback
      _safeCallback(that.options.dropdownShown);
    };

    this.autoHide = function () {
      if (that.options && that.options.autoHideDropdown) {
        _hideDropdown();
      }
    };

    this.empty = function () {
      that.selectedIndex = -1;
      that.renderItems = [];
    };

    this.restoreOriginalText = function () {
      if (!originalSearchText) {
        return;
      }

      _setTargetValue(originalSearchText);
    };

    this.scrollToPreviousItem = function () {
      var itemIndex = _getItemIndexFromOffset(-1);
      if (itemIndex === -1) {
        return;
      }

      _scrollToItem(itemIndex);
    };

    this.scrollToNextItem = function () {
      var itemIndex = _getItemIndexFromOffset(1);
      if (itemIndex === -1) {
        return;
      }

      _scrollToItem(itemIndex);

      if (_shouldLoadNextPageAtItemIndex(itemIndex)) {
        _loadNextPage();
      }
    };

    this.selectItem = function (item, type, closeDropdownAndRaiseCallback) {
    
      if (!item) {
        return;
      }

      that.selectedItem = item;

      _updateTarget();

      if (closeDropdownAndRaiseCallback) {
        that.autoHide();

        _safeCallback(that.options.itemSelected, { item: item, type: type });
      }
    };

    this.getSelectedCssClass = function (item) {
      return (item === that.selectedItem) ? that.options.selectedCssClass : '';
    };

    this.tryLoadNextPage = function () {
      if (_shouldLoadNextPage()) {
        _loadNextPage();
      }
    };


    function _loadNextPage() {
      return _query(originalSearchText, (currentPageIndex + 1));
    }

    function _query(searchText, pageIndex) {
      var params = {
        searchText: searchText,
        paging: {
          pageIndex: pageIndex,
          pageSize: that.options.pageSize
        },
        queryId: ++queryCounter
      };

      var renderListFn = (that.options.pagingEnabled ? _renderPagedList : _renderList);

      return _queryInternal(params, renderListFn.bind(that, params));
    }

    function _queryInternal(params, renderListFn) {
      // backup original search term in case we need to restore if user hits ESCAPE
      originalSearchText = params.searchText;

      dataLoadInProgress = true;

      _safeCallback(that.options.loading);

      return $q.when(that.options.data(params.searchText, params.paging),
        function successCallback(result) {
          // verify that the queryId did not change since the possibility exists that the
          // search text changed before the 'data' promise was resolved. Say, due to a lag
          // in getting data from a remote web service.
          if (_didQueryIdChange(params)) {
            that.autoHide();
            return;
          }

          if (_shouldHideDropdown(params, result)) {
            that.autoHide();
            return;
          }

          renderListFn(result).then(function () {
            that.searchText = params.searchText;
            that.show();
          });

          // callback
          _safeCallback(that.options.loadingComplete);
        },
        function errorCallback(error) {
          that.autoHide();

          _safeCallback(that.options.loadingComplete, { error: error });
        }).then(function () {
          dataLoadInProgress = false;
        });
    }

    function _getItemIndexFromOffset(itemOffset) {
      var itemIndex = that.selectedIndex + itemOffset;

      if (itemIndex >= that.renderItems.length) {
        return -1;
      }

      return itemIndex;
    }

    function _scrollToItem(itemIndex) {
      if (!that.containerVisible) {
        return;
      }

      that.selectItem(itemIndex);

      var attrSelector = 'li[data-index="' + itemIndex + '"]';

      // use jquery.scrollTo plugin if available
      // http://flesler.blogspot.com/2007/10/jqueryscrollto.html
      if (__webpack_provided_window_dot_jQuery && __webpack_provided_window_dot_jQuery.scrollTo) {  // requires jquery to be loaded
        that.elementUL.scrollTo(that.elementUL.find(attrSelector));
        return;
      }

      var li = that.elementUL[0].querySelector(attrSelector);
      if (li) {
        // this was causing the page to jump/scroll
        //    li.scrollIntoView(true);
        that.elementUL[0].scrollTop = li.offsetTop;
      }
    }

    function _safeCallback(fn, args) {
      if (!angular.isFunction(fn)) {
        return;
      }

      try {
        return fn.call(that.target, args);
      } catch (ex) {
        //ignore
      }
    }

    function _positionDropdownIfVisible() {
      if (that.containerVisible) {
        _positionDropdown();
      }
    }

    function _positionDropdown() {
      // no need to position if container has been appended to
      // parent specified in options
      if (that.isInline()) {
        return;
      }

      var dropdownWidth = null;
      if (that.options.dropdownWidth && that.options.dropdownWidth !== 'auto') {
        dropdownWidth = that.options.dropdownWidth;
      }
      else {
        // same as textbox width
        dropdownWidth = that.target[0].getBoundingClientRect().width + 'px';
      }
      that.container.css({ 'width': dropdownWidth });

      if (that.options.dropdownHeight && that.options.dropdownHeight !== 'auto') {
        that.elementUL.css({ 'max-height': that.options.dropdownHeight });
      }

      // use the .position() function from jquery.ui if available (requires both jquery and jquery-ui)
      var hasJQueryUI = !!(__webpack_provided_window_dot_jQuery && __webpack_provided_window_dot_jQuery.ui);
      if (that.options.positionUsingJQuery && hasJQueryUI) {
        _positionUsingJQuery();
      }
      else {
        _positionUsingDomAPI();
      }
    }

    function _positionUsingJQuery() {
      var defaultPosition = {
        my: 'left top',
        at: 'left bottom',
        of: that.target,
        collision: 'none flip'
      };

      var position = angular.extend({}, defaultPosition, that.options.positionUsing);

      // jquery.ui position() requires the container to be visible to calculate its position.
      if (!that.containerVisible) {
        that.container.css({ 'visibility': 'hidden' });
      }
      that.containerVisible = true; // used in the template to set ng-show.
      $timeout(function () {
        that.container.position(position);
        that.container.css({ 'visibility': 'visible' });
      });
    }

    function _positionUsingDomAPI() {
      var rect = that.target[0].getBoundingClientRect();
      var DOCUMENT = $document[0];

      var scrollTop = DOCUMENT.body.scrollTop || DOCUMENT.documentElement.scrollTop || $window.pageYOffset;
      var scrollLeft = DOCUMENT.body.scrollLeft || DOCUMENT.documentElement.scrollLeft || $window.pageXOffset;

      that.container.css({
        'left': rect.left + scrollLeft + 'px',
        'top': rect.top + rect.height + scrollTop + 'px'
      });

      that.containerVisible = true;
    }

    function _updateTarget() {
    

      if(that.selectedItem.name)
        _setTargetValue(that.selectedItem.name);
      if(that.selectedItem.title)
        _setTargetValue(that.selectedItem.title);
    }

    function _setTargetValue(value) {
      that.target.val(value);
      that.textModelCtrl.$setViewValue(value);
    }

    function _hideDropdown() {
      if (that.isInline() || !that.containerVisible) {
        return;
      }

      // reset scroll position
      //that.elementUL[0].scrollTop = 0;
      that.containerVisible = false;
      that.empty();

      _reset();

      // callback
      _safeCallback(that.options.dropdownHidden);
    }

    function _shouldHideDropdown(params, result) {
      // do not hide the dropdown if the no match template is enabled
      // because the no match template is rendered within the dropdown container
      if (that.options.noMatchTemplateEnabled) {
        return false;
      }

      // do we have results to render?
      if (!_.isEmpty(result)) {
        return false;
      }

      // if paging is enabled hide the dropdown only when rendering the first page
      if (that.options.pagingEnabled) {
        return (params.paging.pageIndex === 0);
      }

      return true;
    }

    function _didQueryIdChange(params) {
      return (params.queryId !== queryCounter);
    }

    function _renderList(params, result) {
      return _getRenderFn().then(function (renderFn) {
        if (_.isEmpty(result)) {
          return;
        }

        that.renderItems = _renderItems(renderFn, result);
      });
    }

    function _renderPagedList(params, result) {
      return _getRenderFn().then(function (renderFn) {
        if (_.isEmpty(result)) {
          return;
        }

        var items = _renderItems(renderFn, result);

        // in case of paged list we add to the array instead of replacing it
        angular.forEach(items, function (item) {
          that.renderItems.push(item);
        });

        currentPageIndex = params.paging.pageIndex;
        endOfPagedList = (items.length < that.options.pageSize);
      });
    }

    function _renderItems(renderFn, dataItems) {
      // limit number of items rendered in the dropdown
      var dataItemsToRender = _.slice(dataItems, 0, that.options.maxItemsToRender);

      var itemsToRender = _.map(dataItemsToRender, function (data, index) {
        // invoke render callback with the data as parameter
        // this should return an object with a 'label' and 'value' property where
        // 'label' is the template for display and 'value' is the text for the textbox
        // If the object has an 'id' property, it will be used in the 'track by' clause of ng-repeat in the template
        var item = renderFn(data);

        if (!item || !item.hasOwnProperty('label') || !item.hasOwnProperty('value')) {
          return null;
        }

        // store the data on the renderItem and add to array
        item.data = data;
        // unique 'id' for use in the 'track by' clause
        item.id = item.hasOwnProperty('id') ? item.id : (item.value + item.label + index);

        return item;
      });

      return _.filter(itemsToRender, function (item) {
        return (item !== null);
      });
    }

    function _getRenderFn() {
      // user provided function
      if (angular.isFunction(that.options.renderItem) && that.options.renderItem !== angular.noop) {
        that.itemTemplateLinkFn = null;
        return $q.when(that.options.renderItem.bind(null));
      }

      return _getItemTemplate().then(function (template) {
        that.itemTemplateLinkFn = $compile(template);
        return _getRenderItem.bind(null, template);
      }).catch($exceptionHandler);
    }

    function _getItemTemplate() {
      // itemTemplateUrl
      if (that.options.itemTemplateUrl) {
        return $templateRequest(that.options.itemTemplateUrl);
      }

      // itemTemplate or default
      var template = that.options.itemTemplate || '<span ng-bind-html="entry.item"></span>';
      return $q.when(template);
    }

    function _getRenderItem(template, data) {
      var value = (angular.isObject(data) && that.options.selectedTextAttr) ? data[that.options.selectedTextAttr] : data;
      return {
        value: value,
        label: template
      };
    }

    function _shouldLoadNextPage() {
      return that.options.pagingEnabled && !dataLoadInProgress && !endOfPagedList;
    }

    function _shouldLoadNextPageAtItemIndex(itemIndex) {
      if (!_shouldLoadNextPage()) {
        return false;
      }

      var triggerIndex = that.renderItems.length - that.options.invokePageLoadWhenItemsRemaining - 1;
      return itemIndex >= triggerIndex;
    }

    function _reset() {
      originalSearchText = that.searchText = null;
      currentPageIndex = 0;
      endOfPagedList = false;
    }

    function _setOptions(options) {
      if (_.isEmpty(options)) {
        return;
      }

      angular.forEach(options, function (value, key) {
        if (defaultOptions.hasOwnProperty(key)) {
          that.options[key] = value;
        }
      });
    }

    var publicApi = (function () {
      return {
        setOptions: _setOptions,
        positionDropdown: _positionDropdownIfVisible,
        hideDropdown: _hideDropdown
      };
    })();
  }

  autoCompleteItemDirective.$inject = ['$compile', '$rootScope', '$sce', '$controller'];
  function autoCompleteItemDirective($compile, $rootScope, $sce, $controller) {
    return {
      restrict: 'E',
      transclude: 'element',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: {
        index: '<',
        renderItem: '<',
        searchText: '<',
        itemTemplateLinkFn: '<'
      },
      controller: function () { },
      link: function (scope, element) {
        var linkFn = null;
        if (_.isFunction(scope.ctrl.itemTemplateLinkFn)) {
          linkFn = scope.ctrl.itemTemplateLinkFn;
        }
        else {
          // Needed to maintain backward compatibility since the parameter passed to $compile must be html.
          // When 'item' is returned from the 'options.renderItem' callback the 'label' might contain
          // a trusted value [returned by a call to $sce.trustAsHtml(html)]. We can get the original
          // html that was provided to $sce.trustAsHtml using the valueOf() function.
          // If 'label' is not a value that had been returned by $sce.trustAsHtml, it will be returned unchanged.
          var template = $sce.valueOf(scope.ctrl.renderItem.label);
          linkFn = $compile(template);
        }

        linkFn(createEntryScope(scope), function (clonedElement) {
          // append to the directive element's parent (<li>) since this directive element is replaced (transclude is set to 'element').
          $(element[0].parentNode).append(clonedElement);
        });
      }
    };

    function createEntryScope(directiveScope) {
      var entryScope = $rootScope.$new(true);

      // for now its an empty controller. Additional logic can be added to this controller if needed
      var entry = entryScope.entry = $controller(angular.noop);

      var deregisterWatchesFn = _.map(['index', 'renderItem', 'searchText'], function (key) {
        return directiveScope.$watch(('ctrl.' + key), function (newVal) {
          switch (key) {
            case 'renderItem':
              // add 'item' property on entryScope for backward compatibility
              entry.item = entryScope.item = newVal.data;
              break;
            default:
              entry[key] = newVal;
              break;
          }
        });
      });

      helperService.deregisterOnDestroy(directiveScope, deregisterWatchesFn);

      return entryScope;
    }
  }

  autoCompleteNoMatchDirective.$inject = ['$compile', '$rootScope', '$controller'];
  function autoCompleteNoMatchDirective($compile, $rootScope, $controller) {
    return {
      restrict: 'E',
      transclude: 'element',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: {
        template: '<',
        searchText: '<'
      },
      controller: function () { },
      link: function (scope, element) {
        var linkFn = $compile(scope.ctrl.template);
        linkFn(createEntryScope(scope), function (clonedElement) {
          // append to the directive element's parent (<li>) since this directive element is replaced (transclude is set to 'element').
          $(element[0].parentNode).append(clonedElement);
        });
      }
    };

    function createEntryScope(directiveScope) {
      var entryScope = $rootScope.$new(true);

      // for now its an empty controller. Additional logic can be added to this controller if needed
      var entry = entryScope.entry = $controller(angular.noop);

      var deregisterFn = directiveScope.$watch('ctrl.searchText', function (newVal) {
        entry.searchText = newVal;
      });

      helperService.deregisterOnDestroy(directiveScope, [deregisterFn]);

      return entryScope;
    }
  }

  function HelperService() {
    var that = this;
    var plugins = [];
    var instanceCount = 0;
    var activeInstanceId = 0;

    this.registerInstance = function (instance) {
      if (instance) {
        plugins.push(instance);
        return ++instanceCount;
      }

      return -1;
    };

    this.setActiveInstanceId = function (instanceId) {
      activeInstanceId = instanceId;
      that.hideAllInactive();
    };

    this.hideAllInactive = function () {
      angular.forEach(plugins, function (ctrl) {
        // hide if this is not the active instance
        if (ctrl.instanceId !== activeInstanceId) {
          ctrl.autoHide();
        }
      });
    };

    this.deregisterOnDestroy = function (scope, deregisterWatchesFn) {
      // cleanup on destroy
      var destroyFn = scope.$on('$destroy', function () {
        _.each(deregisterWatchesFn, function (deregisterFn) {
          deregisterFn();
        });

        destroyFn();
      });
    };
  }

  var DOM_EVENT = {
    RESIZE: 'resize',
    SCROLL: 'scroll',
    CLICK: 'click',
    KEYDOWN: 'keydown',
    FOCUS: 'focus',
    INPUT: 'input'
  };

  var KEYCODE = {
    TAB: 9,
    ENTER: 13,
    CTRL: 17,
    ALT: 18,
    ESCAPE: 27,
    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
    MAC_COMMAND_LEFT: 91,
    MAC_COMMAND_RIGHT: 93
  };

  var defaultOptions = {
    /**
     * CSS class applied to the dropdown container.
     * @default null
     */
    containerCssClass: null,
    /**
     * CSS class applied to the selected list element.
     * @default auto-complete-item-selected
     */
    selectedCssClass: 'auto-complete-item-selected',
    /**
     * Minimum number of characters required to display the dropdown.
     * @default 1
     */
    minimumChars: 1,
    /**
     * Maximum number of items to render in the list.
     * @default 20
     */
    maxItemsToRender: 20,
    /**
     * If true displays the dropdown list when the textbox gets focus.
     * @default false
     */
    activateOnFocus: false,
    /**
     * Width in "px" of the dropddown list. This can also be applied using CSS.
     * @default 'auto'
     */
    dropdownWidth: 'auto',
    /**
     * Maximum height in "px" of the dropddown list. This can also be applied using CSS.
     * @default 'auto'
     */
    dropdownHeight: 'auto',
    /**
     * a jQuery object to append the dropddown list.
     * @default null
     */
    dropdownParent: null,
    /**
     * If the data for the dropdown is a collection of objects, this should be the name 
     * of a property on the object. The property value will be used to update the input textbox.
     * @default null
     */
    selectedTextAttr: null,
    /**
     * A template for the dropddown list item. For example "<p ng-bind-html='entry.item.name'></p>";
     * Or using interpolation "<p>{{entry.item.lastName}}, {{entry.item.firstName}}></p>".
     * @default null
     */
    itemTemplate: null,
    /**
     * This is similar to template but the template is loaded from the specified URL, asynchronously.
     * @default null
     */
    itemTemplateUrl: null,
    /**
     * Set to true to enable server side paging. See "data" callback for more information.
     * @default false
     */
    pagingEnabled: false,
    /**
     * The number of items to display per page when paging is enabled.
     * @default 5
     */
    pageSize: 5,
    /**
     * When using the keyboard arrow key to scroll down the list, the "data" callback will 
     * be invoked when at least this many items remain below the current focused item. 
     * Note that dragging the vertical scrollbar to the bottom of the list might also invoke a "data" callback.
     * @default 1
     */
    invokePageLoadWhenItemsRemaining: 1,
    /**
     * Set to true to position the dropdown list using the position() method from the jQueryUI library.
     * See <a href="https://api.jqueryui.com/position/">jQueryUI.position() documentation</a>
     * @default true
     * @bindAsHtml true
     */
    positionUsingJQuery: true,
    /**
     * Options that will be passed to jQueryUI position() method.
     * @default null
     */
    positionUsing: null,
    /**
     * Set to true to let the plugin hide the dropdown list. If this option is set to false you can hide the dropdown list
     * with the hideDropdown() method available in the ready callback.
     * @default true
     */
    autoHideDropdown: true,
    /**
     * Set to true to hide the dropdown list when the window is resized. If this option is set to false you can hide
     * or re-position the dropdown list with the hideDropdown() or positionDropdown() methods available in the ready.
     * callback.
     * @default true
     */
    hideDropdownOnWindowResize: true,
    /**
     * Set to true to enable the template to display a message when no items match the search text.
     * @default true
     */
    noMatchTemplateEnabled: true,
    /**
     * The template used to display the message when no items match the search text.
     * @default "<span>No results match '{{entry.searchText}}'></span>"
     */
    noMatchTemplate: "<span>No results match '{{entry.searchText}}'</span>",
    /**
     * Callback after the plugin is initialized and ready. The callback receives an object with the following methods:
     * @default angular.noop
     */
    ready: angular.noop,
    /**
     * Callback before the "data" callback is invoked.
     * @default angular.noop
     */
    loading: angular.noop,
    /**
     * Callback to get the data for the dropdown. The callback receives the search text as the first parameter.
     * If paging is enabled the callback receives an object with "pageIndex" and "pageSize" properties as the second parameter.
     * This function must return a promise.
     * @default angular.noop
     */
    data: angular.noop,
    /**
     * Callback after the items are rendered in the dropdown
     * @default angular.noop
     */
    loadingComplete: angular.noop,
    /**
     * Callback for custom rendering a list item. This is called for each item in the dropdown.
     * This must return an object literal with "value" and "label" properties where
     * "label" is the template for display and "value" is the text for the textbox.
     * If the object has an "id" property, it will be used in the "track by" clause of the ng-repeat of the dropdown list.
     * @default angular.noop
     */
    renderItem: angular.noop,
    /**
     * Callback after an item is selected from the dropdown. The callback receives an object with an "item" property representing the selected item.
     * @default angular.noop
     */
    itemSelected: angular.noop,
    /**
     * Callback after the dropdown is shown.
     * @default angular.noop
     */
    dropdownShown: angular.noop,
    /**
     * Callback after the dropdown is hidden.
     * @default angular.noop
     */
    dropdownHidden: angular.noop
  };

}));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(14), __webpack_require__(3)))

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, $) {__webpack_require__(8)
__webpack_require__(22)
__webpack_require__(38)
__webpack_require__(39)
__webpack_require__(143)
__webpack_require__(40)
__webpack_require__(36)
__webpack_require__(144)
//require('./modernizr')
__webpack_require__(37)
__webpack_require__(23)

var Api = __webpack_require__(22);
var players = {};

var coverflow = window.coverflow = function(id) {
	if (!id) {
		for (var key in players) {
			id = players[key].id;
		}
	}
	if (id) {
		var foundPlayer = players[id];
		if (foundPlayer) {
			return foundPlayer;
		} else {
			return players[id] = new Api(id);
		}
	}
	return null;
};

if (typeof jQuery !== 'undefined') {
	jQuery.fn.coverflow = function(method) {
		var player = coverflow(this[0].id);
		if (player[method]) {
			return player[method].apply(player, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object') {
			return player.setup.apply(player, arguments);
		} else if (!method) {
			return player;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.coverflow');
		}
	};
}

module.exports = coverflow;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(3)))

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {


var Signal = __webpack_require__(23);
var Controller = __webpack_require__(38);
var Cover = __webpack_require__(39);
var Hit = __webpack_require__(40);
var Modernizr = __webpack_require__(41);
var _ = __webpack_require__(8);
var CoverFlow = function(div, playlist, config) {
	var _this = this;

	this.config = config;
	
	var coversLength = playlist.length;
	var completeLength = 0;
	var maxCoverHeight = 0;
	var current = 0;

	this.events = {
		focus: new Signal(),
		click: new Signal()
	};

	this.covers = [];
	this.transforms = [];
	this.hits = [];
	this.transforms2 = [];
	this.prevF = -1;
  this.transformProp = Modernizr.prefixed('transform');
  
	this.space = config.coveroffset + config.covergap;
	this._angle = 'rotateY(' + (-config.coverangle) + 'deg)';
	this.angle = 'rotateY(' + config.coverangle + 'deg)';

	this.offsetX = 0;
	this.offsetY = 0;
	
	this.el = document.createElement('div');
	this.el.className = 'coverflow-wrap';
	this.tray = document.createElement('div');
	this.tray.className = 'coverflow-tray';
	this.el.appendChild(this.tray);
	this.rect = document.createElement('div');
	this.rect.className = 'coverflow-rect';
	this.el.appendChild(this.rect);
	
	this.el.style[Modernizr.prefixed('perspective')] = config.focallength+'px';
	this.tray.style[Modernizr.prefixed('transitionDuration')] = this.config.tweentime + 's';
	
	var controller = new Controller(this, this.tray, this.config);

	var cover = null;
	var hit = null;
	for (var i = 0; i < coversLength; i++) {
		
		cover = new Cover(_this, i, playlist[i].image, config);
		this.tray.appendChild(cover.el);
		cover.el.style[Modernizr.prefixed('transitionDuration')] = this.config.tweentime + 's';
		this.covers[i] = cover;

		hit = new Hit(_this, i, config);
		this.rect.appendChild(hit.el);
		this.hits[i] = hit;
	}

	div.addEventListener('touchstart', controller, true);
	div.addEventListener('keydown', keyboard, false);
	this.rect.addEventListener('mousedown', clickHandler, false);


	this.itemComplete = function(h) {
		maxCoverHeight = maxCoverHeight < h ? h : maxCoverHeight;
		completeLength += 1;
		if (completeLength == coversLength) {
			for (var i = 0; i < coversLength; i++) {
				var cover = this.covers[i];
				cover.setY(maxCoverHeight);
				this.hits[i].resize(cover.width, cover.height);
				this.hits[i].setY(maxCoverHeight);
			}
		}
	};

	this.left = function() {
		if (current > 0) _this.to(current - 1);
	};
		
	this.right = function() {
		if (current < coversLength - 1) _this.to(current + 1);
	};
	
	this.prev = function() {
		if (current > 0) _this.to(current - 1);
		else _this.to(coversLength - 1);
	};
	
	this.next = function() {
		if (current < coversLength - 1) _this.to(current + 1);
		else _this.to(0);
	};
	
	this.to = function(index) {

		var match;
		if (typeof index === 'string' && (match = /^([+-])=(\d)/.exec(index))) {
			index = (match[1] + 1) * match[2] + current;
		}

		if (index > coversLength - 1) index = coversLength - 1;
		else if (index < 0) index = 0;
					
		current = index;
		controller.to(index);
	};

	this.on = function(e, fn) {
		this.events[e].on(fn);
	};
	
	this.destroy = function() {
		div.removeChild(_this.el);

		div.removeEventListener('touchstart', controller, true);
		div.removeEventListener('keydown', keyboard, false);
	};

	this.resize = function() {
		this.offsetX = config.width * 0.5 + config.x;
		this.offsetY = config.height * 0.5 + config.y;
		this.setTrayStyle((controller.currentX + this.offsetX), this.offsetY);
		this.setRectStyle((controller.currentX + this.offsetX), this.offsetY);
	};
	
	function clickHandler(e) {
		if (e.button === 0) {
			e.stopImmediatePropagation();
			e.preventDefault();

			var hit = _this.hits[_.getChildIndex(e.target)];
			if (hit.index == current) {
				_this.events.click.trigger(hit.index);
			} else {
				_this.to(hit.index);
			}
		}
	}

	function keyboard(e) {
		var element = e.target;
		if (element.tagName == 'INPUT' ||
			element.tagName == 'SELECT' ||
			element.tagName == 'TEXTAREA') return;

		if ([37, 39, 38, 40, 32].indexOf(e.keyCode) !== -1) {
			e.preventDefault();
			switch (e.keyCode) {
			case 37:
				_this.left();
				break;
			case 39:
				_this.right();
				break;
			case 38:
				_this.to(0);
				break;
			case 40:
				_this.to(coversLength - 1);
				break;
			case 32:
				_this.events.click.trigger(current);
				break;
			}
		}
	}
};

CoverFlow.prototype.updateTouchEnd = function(controller) {
	var i = this.getFocusedCover(controller.currentX);
	controller.currentX = -i * this.config.covergap;
	this.update(controller.currentX);
};

CoverFlow.prototype.getFocusedCover = function(currentX) {
	var i = -Math.round(currentX / this.config.covergap);
	return Math.min(Math.max(i, 0), this.covers.length - 1);
};

CoverFlow.prototype.getFocusedCoverOne = function(currentX) {
	var i = -Math.round(currentX / this.config.covergap);
	return Math.min(Math.max(i, -1), this.covers.length);
};

CoverFlow.prototype.tap = function(e, currentX) {
	if (e.target.className == 'coverflow-hit') {
		var current = this.getFocusedCover(currentX);
		var hit = this.hits[_.getChildIndex(e.target)];
		if (hit.index == current) {
			this.events.click.trigger(hit.index);
		} else {
			this.to(hit.index);
		}
	}
};

CoverFlow.prototype.setTrayStyle = function(x, y) {
	this.tray.style[this.transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, -' + this.config.coverdepth + 'px)';
};

CoverFlow.prototype.setRectStyle = function(x, y) {
	this.rect.style[this.transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, -' + this.config.coverdepth + 'px)';
};

CoverFlow.prototype.setHitStyle = function(hit, i, transform) {
	if (this.transforms2[i] != transform) {
		hit.el.style[this.transformProp] = transform;
		this.transforms2[i] = transform;
	}
};

CoverFlow.prototype.setCoverStyle = function(cover, i, transform) {
	if (this.transforms[i] != transform) {
		cover.el.style[this.transformProp] = transform;
		this.transforms[i] = transform;
	}
};

CoverFlow.prototype.getCoverTransform = function(f, i) {
	var x = i * this.config.covergap;
	if (f == i) {
		return 'translate3d(' + x + 'px, 0, ' + this.config.coverdepth + 'px)';
	} else if (i > f) {
		return 'translate3d(' + (x + this.space) + 'px, 0, 0) ' + this._angle;
	} else {
		return 'translate3d(' + (x - this.space) + 'px, 0, 0) ' + this.angle;
	}
};

CoverFlow.prototype.update = function(currentX) {

	var f = this.getFocusedCoverOne(currentX);
	if (f != this.prevF) {
		this.events.focus.trigger(f);
		this.prevF = f;
	}

	this.setRectStyle((currentX + this.offsetX), this.offsetY);
	this.setTrayStyle((currentX + this.offsetX), this.offsetY);
	for (var i = 0; i < this.covers.length; i++) {
		this.setHitStyle(this.hits[i], i, this.getCoverTransform(f, i));
		this.setCoverStyle(this.covers[i], i, this.getCoverTransform(f, i));
	}
};

module.exports = CoverFlow;

/***/ }),
/* 143 */
/***/ (function(module, exports) {


var Flash = function(api) {

	var swf;

	function setup() {

		var html = '<object id="' + api.id + '-coverflow-flash" data="' + api.config.flash + '" width="100%" height="100%" type="application/x-shockwave-flash">' +
			'<param name="movie" value="' + api.config.flash + '" />' +
			'<param name="wmode" value="' + api.config.wmode + '" />' +
			'<param name="allowscriptaccess" value="always" />' +
			'<param name="flashvars" value="' + jsonToFlashvars(api.config) + '" />' +
			'<a href="http://get.adobe.com/flashplayer/">Get Adobe Flash player</a>' +
		'</object>';
		api.el.innerHTML = html;
		
		swf = document.getElementById(api.id + '-coverflow-flash');
	}

	function jsonToFlashvars(json) {
		var flashvars = '';
		for (var key in json) {
			if (typeof(json[key]) === 'object') {
				flashvars += key + '=' + encodeURIComponent('[[JSON]]' + JSON.stringify(json[key])) + '&';
			} else {
				flashvars += key + '=' + encodeURIComponent(json[key]) + '&';
			}
		}
		return flashvars.slice(0, -1);
	}

	this.resize = function(wid, hei) {
		swf.apiResize(wid, hei);
	};

	this.left = function() {
		swf.apiLeft();
	};
	this.right = function() {
		swf.apiRight();
	};
	this.prev = function() {
		swf.apiPrev();
	};
	this.next = function() {
		swf.apiNext();
	};
	this.to = function(index) {
		swf.apiTo(index);
	};
	this.destroy = function() {
	};

	setup();
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, $) {/** @license
 * Cover Flow
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/06/20)
 * Version: 1.2 - (2013/11/09)
 */
var Api = __webpack_require__(22);
var players = {};

var coverflow = window.coverflow = function(id) {
	if (!id) {
		for (var key in players) {
			id = players[key].id;
		}
	}
	if (id) {
		var foundPlayer = players[id];
		if (foundPlayer) {
			return foundPlayer;
		} else {
			return players[id] = new Api(id);
		}
	}
	return null;
};

if (typeof jQuery !== 'undefined') {
	jQuery.fn.coverflow = function(method) {
		var player = coverflow(this[0].id);
		if (player[method]) {
			return player[method].apply(player, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object') {
			return player.setup.apply(player, arguments);
		} else if (!method) {
			return player;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.coverflow');
		}
	};
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(3)))

/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_toolbarbutton__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_toolbarbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__ui_toolbarbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_toolbarseperator__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_toolbarseperator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ui_toolbarseperator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_navbutton__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_navbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ui_navbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ui_albumslist__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ui_albumslist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__ui_albumslist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ui_artistlist__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ui_artistlist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__ui_artistlist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ui_genrelist__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ui_genrelist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__ui_genrelist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ui_tracklist__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ui_tracklist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__ui_tracklist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ui_sabnzbd_queuelist__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ui_sabnzbd_queuelist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__ui_sabnzbd_queuelist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ui_sabnzbd_blacklist__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ui_sabnzbd_blacklist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__ui_sabnzbd_blacklist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ui_sabnzbd_historylist__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ui_sabnzbd_historylist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__ui_sabnzbd_historylist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ui_jumpbar__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ui_jumpbar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__ui_jumpbar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ui_detaillabel__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ui_detaillabel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__ui_detaillabel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ui_expandbutton__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ui_expandbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__ui_expandbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ui_popoverbutton__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ui_popoverbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__ui_popoverbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ui_coverflow__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ui_coverflow___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__ui_coverflow__);


















/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.directives', [])
  .directive('toolbarbutton', __WEBPACK_IMPORTED_MODULE_1__ui_toolbarbutton___default.a)
  .directive('toolbarseperator', __WEBPACK_IMPORTED_MODULE_2__ui_toolbarseperator___default.a)
  .directive('navbutton', __WEBPACK_IMPORTED_MODULE_3__ui_navbutton___default.a)
  .directive('albumslist', __WEBPACK_IMPORTED_MODULE_4__ui_albumslist___default.a)
  .directive('artistlist', __WEBPACK_IMPORTED_MODULE_5__ui_artistlist___default.a)
  .directive('genrelist', __WEBPACK_IMPORTED_MODULE_6__ui_genrelist___default.a)
  .directive('tracklist', __WEBPACK_IMPORTED_MODULE_7__ui_tracklist___default.a)
  .directive('queuelist', __WEBPACK_IMPORTED_MODULE_8__ui_sabnzbd_queuelist___default.a)
  .directive('historylist', __WEBPACK_IMPORTED_MODULE_10__ui_sabnzbd_historylist___default.a)
  .directive('blacklist', __WEBPACK_IMPORTED_MODULE_9__ui_sabnzbd_blacklist___default.a)
  .directive('jumpbar', __WEBPACK_IMPORTED_MODULE_11__ui_jumpbar___default.a)
  .directive('detaillabel', __WEBPACK_IMPORTED_MODULE_12__ui_detaillabel___default.a)
  .directive('expandbutton', __WEBPACK_IMPORTED_MODULE_13__ui_expandbutton___default.a)
  .directive('popoverbutton', __WEBPACK_IMPORTED_MODULE_14__ui_popoverbutton___default.a)
  .directive('coverflow', __WEBPACK_IMPORTED_MODULE_15__ui_coverflow___default.a));


/***/ }),
/* 146 */
/***/ (function(module, exports) {

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      buttontext: '@',
      buttonid: '@',
      buttonrel: '@',
      buttonicon: '@',
      buttonclick: '&'
    },
    // object is passed while making the call
    template: '<button type="button" id="{{buttonid}}" ng-click="clickButton()" class="PageToolbarButton-toolbarButton Link-link" rel="{{buttonrel}}">' +
      '	<i aria-hidden="true" data-prefix="fas" class="fa {{buttonicon}} fa-w-16 Icon-default"></i>' +
      '	<div class="PageToolbarButton-labelContainer">' +
      '		<div class="PageToolbarButton-label">{{buttontext}}</div>' +
      '	</div>' +
      '</button>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
      scope.text = scope.buttontext;
    }
  }
};

/***/ }),
/* 147 */
/***/ (function(module, exports) {



module.exports = function () {
  return {
    restrict: 'E',
    // object is passed while making the call
    template: '<div class="PageToolbarSeparator-separator"></div>',
    replace: true
  }
};

/***/ }),
/* 148 */
/***/ (function(module, exports) {

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      buttontext: '@',
      href: '@',
      direction: '@',
      buttonclick: '&'
    },
    // object is passed while making the call
    template:
      '<a title="{{buttontext}}" href="{{href}}" class="PageContent-HeaderDetails-navigation-button IconButton-button Link-link Link-link">' +
      ' <svg aria-hidden="true" data-prefix="fas" data-icon="arrow-circle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="font-size: 30px;" class="svg-inline--fa fa-arrow-circle-left fa-w-16 Icon-default">' +
      `  <path ng-show="{{direction == 'left'}}"  fill="currentColor" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm28.9-143.6L209.4 288H392c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24H209.4l75.5-72.4c9.7-9.3 9.9-24.8.4-34.3l-11-10.9c-9.4-9.4-24.6-9.4-33.9 0L107.7 239c-9.4 9.4-9.4 24.6 0 33.9l132.7 132.7c9.4 9.4 24.6 9.4 33.9 0l11-10.9c9.5-9.5 9.3-25-.4-34.3z"></path>` +
      `   <path ng-show="{{direction == 'right'}}" fill="currentColor" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4z"></path>` +
      ' </svg>' +
      '</a>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
      scope.text = scope.buttontext;
    }
  }
};




/***/ }),
/* 149 */
/***/ (function(module, exports) {

module.exports = function ($rootScope, $location, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist: '@',
      hasjumpbar: '@'
    },
    templateUrl: '/template/albumslist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToAlbum = function (id) {
        $location.path('/album/' + id);
      }
      scope.navToArtist = function (id) {
        $location.path('/artist/' + id);
      }
      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.album_id;
        }
        return false;
      }
      scope.starAlbum = function (album) {
        Backend.info('starring album: ' + album.artist + " - " + album.name);
        if (album.starred === 'true') {
          AlloyDbService.unstar({ album: album.id }).then(function (result) {
            Backend.info('UnStarred');
            Backend.info(result);
            album.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          AlloyDbService.star({ album: album.id }).then(function (result) {
            Backend.info('starred');
            Backend.info(result);
            album.starred = 'true';
            AppUtilities.apply();
          });
        }
      }
      scope.playAlbum = function (album) {
        console.log(album);
        var album = AlloyDbService.getAlbum(album.id);
        if (album) {
          album.then(function (data) {
            Backend.debug('selection changed');
            $rootScope.tracks = data.tracks;
            MediaPlayer.loadTrack(0);
          });
        }
      }
    }
  }
};

/***/ }),
/* 150 */
/***/ (function(module, exports) {

module.exports = function ($rootScope, $location, Backend, AppUtilities, AlloyDbService, MediaPlayer) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      hasjumpbar: '@'
    },
    templateUrl: 'template/artistlist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToArtist = function (id) {
        $location.path('/artist/' + id);
      }
      var testForLetter = function (character) {
        try {
          //Variable declarations can't start with digits or operators
          //If no error is thrown check for dollar or underscore. Those are the only nonletter characters that are allowed as identifiers
          eval("let " + character + ";");
          let regExSpecial = /[^\$_]/;
          return regExSpecial.test(character);
        }
        catch (error) {
          return false;
        }
      }
      scope.getId = function (name) {

        if (!testForLetter(name.charAt(0).toUpperCase())) return 'symbol';
        return name.charAt(0).toUpperCase()
      }

      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.base_id;
        }
        return false;
      }

      scope.starArtist = function (artist) {
        Backend.info('starring artist: ' + artist.base_path);
        if (artist.starred === 'true') {
          AlloyDbService.unstar({ artist: artist.base_id }).then(function (result) {
            Backend.info('UnStarred');
            Backend.info(result);
            artist.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          AlloyDbService.star({ artist: artist.base_id }).then(function (result) {
            Backend.info('starred');
            Backend.info(result);
            artist.starred = 'true';
            AppUtilities.apply();
          });
        }
      }

      scope.playArtist = function (artist) {
        console.log(artist);
        var artist = AlloyDbService.getArtist(artist.base_id);
        if (artist) {
          artist.then(function (artist) {
            Backend.debug('selection changed');
            $rootScope.tracks = artist.tracks;
            MediaPlayer.loadTrack(0);
          });
        }
      }
    }
  }
};


/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = function ($rootScope, $location, Backend, MediaPlayer, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      hasjumpbar: '@'
    },
    templateUrl: 'template/genrelist.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToGenre = function (id) {
        $location.path('/genre/' + id);
      }
      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.genre_id;
        }
        return false;
      }
      scope.playGenre = function (genre) {
        console.log(genre);
        var genre = AlloyDbService.getGenre(genre.id);
        if (genre) {
          genre.then(function (data) {
            Backend.debug('selection changed');
            $rootScope.tracks = data.tracks;
            MediaPlayer.loadTrack(0);
          });
        }
      }
    }
  }
};

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(_) {module.exports = function ($rootScope, $timeout, $location, MediaPlayer, Backend, AlloyDbService, AppUtilities) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist:'@',
      showalbum:'@',
      hasjumpbar: '@'
    },
    templateUrl: '/template/tracklist.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToAlbum = function(id){
        $location.path('/album/' + id);
      }
      scope.navToArtist = function(id){
        $location.path('/artist/' + id);
      }
      scope.navToGenre = function(id){
        $location.path('/genre/' + id);
      }

      scope.requestPlay = function (id) {
        Backend.debug('selection changed');
        $rootScope.tracks = scope.data;
        var index = _.findIndex($rootScope.tracks, function (track) {
          return track.id === id;
        });
        MediaPlayer.loadTrack(index);
      }

      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.id;
        }
        return false;
      }

      scope.starTrack = function (track) {
        Backend.info('starring track: ' + track.artist + " - " + track.title);
        if (track.starred === 'true') {
          AlloyDbService.unstar({ id: track.id }).then(function (result) {
            if ($rootScope.settings.alloydb.alloydb_love_tracks === true) {
              AlloyDbService.unlove({ id: track.id })
            }
            Backend.info('UnStarred');
            Backend.info(result);
            track.starred = 'false';
            $timeout(function () {
              AppUtilities.apply();
            })
          });
        } else {
          AlloyDbService.star({ id: track.id }).then(function (result) {
            if ($rootScope.settings.alloydb.alloydb_love_tracks === true) {
              AlloyDbService.love({ id: track.id })
            }
            Backend.info('starred');
            Backend.info(result);
            track.starred = 'true';
            $timeout(function () {
              AppUtilities.apply();
            })

          });
        }




      }

      scope.$watch('data', function (newVal, oldVal) {
        AppUtilities.apply();
      });

    }
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 153 */
/***/ (function(module, exports) {

module.exports = function(Backend, AppUtilities, AlloyDbService) {
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    templateUrl: "/template/queuelist.jade",
    replace: true,
    link: function(scope, elm, attrs) {
      scope.makePercent = function(percent) {
        return percent.value + "%";
      };

      scope.humanFileSize = function(size) {
        var i = Math.floor(Math.log(size.value) / Math.log(1024));
        return (
          (size.value / Math.pow(1024, i)).toFixed(2) * 1 +
          " " +
          ["B", "kB", "MB", "GB", "TB"][i]
        );
      };
    }
  };
};


/***/ }),
/* 154 */
/***/ (function(module, exports) {

module.exports = function (Backend, AppUtilities, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: '/template/blacklist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      
    }
  }
};

/***/ }),
/* 155 */
/***/ (function(module, exports) {

module.exports = function (Backend, AppUtilities, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: '/template/historylist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      
    }
  }
};

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      buttonclick: '&'
    },
    template:
      '<div class="PageJumpBar-jumpBar">' +
      '   <div class="PageJumpBar-jumpBarItems">' +
      '     <a href="#" class="Link-link PageJumpBarItem-jumpBarItem" ng-repeat="artist in data" ng-click="clickButton(artist.name)">{{artist.name}}</a>' +
      '  </div>' +
      '</div>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function (x) {
        if (x === '#') {
          $("#symbol")[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "start" // or "end"
          });
        } else {
          $("#" + x)[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "start" // or "end"
          });
        }
      }
    }
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      buttontext: '@',
      buttonicon: '@',
      buttonclick: '&',
      href: "@"
    },
    // object is passed while making the call
    templateUrl:'/template/detaillabel.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
    }
  }
};



/***/ }),
/* 158 */
/***/ (function(module, exports) {

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      direction: '@'
    },
    // object is passed while making the call
    template: "",
    link: function (scope, element, attrs) {

      if (attrs.mini) {
        var t = '<svg aria-hidden="true" data-prefix="fas" data-icon="chevron-circle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="font-size: 20px;" class="svg-inline--fa fa-chevron-circle-up fa-w-16 Icon-default">' +
          '	<path fill="currentColor" d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z"></path>' +
          '</svg>';
        element.html(t);
      } else {
        var t = '<span title="Hide albums">' +
          '  <svg aria-hidden="true" data-prefix="fas" data-icon="chevron-circle-{{direction}}" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="font-size: 24px;" class="svg-inline--fa fa-chevron-circle-down fa-w-16 ExpanderContainer-expandButtonIcon ExpanderContainer-actionButton IconButton-button Link-link Icon-default">';

        switch (scope.direction) {
          case 'up':
            t += '	<path fill="currentColor" d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z"></path>';
            break;
          case 'down':
            t += '   <path fill="currentColor" d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM273 369.9l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L256 285.1 154.4 183.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L239 369.9c9.4 9.4 24.6 9.4 34 0z"></path>';
            break;
        }

        t += '  </svg>' +
          '</span>';

        element.html(t);
      }


    },
    replace: true
  }
};

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      buttontext: '@',
      buttonicon: '@',
      data: '='
    },
    // object is passed while making the call
    templateUrl:'/template/popoverbutton.jade',
    replace: true,

    link: function (scope, elm, attrs) {
      console.log('linking')
      scope.$watch('data', function (newVal, oldVal) {
        if (scope.data) {
          var t = '<div class="popover" role="tooltip">' +
            '<div class="arrow">' +
            '</div>' +
            '<h3 class="popover-header"></h3>' +
            '<div class="popover-body"></div>' +
            '</div>';
          var content = [];
          scope.data.forEach(tag => {
            content.push("<div class='Details-Label Label-label Label-default Label-large'>" + tag.name + "</div>")
          });


          $('body').popover({
            html: true,
            selector: '[rel=popover-button-selector]',
            trigger: 'click',
            template: t,
            content: content.join(''),
            container: '.PageContentBody-contentBody',
            placement: "bottom",
          });
        }
      });
    }
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports = function ($timeout) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      onfocus: '&',
      onclick: '&',
      coverwidth: '@',
      coverheight: '@',
      width: '@',
    },
    // object is passed while making the call
    template: '<div id="player" style="overflow: hidden;"/>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.$watch('data', function (newVal, oldVal) {
        if (scope.data.length > 0) {
          $timeout(function () {
            scope.clickButton = function (idx, link) {
              scope.onclick(idx, link);
            }

            scope.coverflow = coverflow('player').setup({
              playlist: scope.data,
              width: scope.width,
              coverwidth: scope.coverwidth,
              coverheight: scope.coverheight,
              fixedsize: true,
            }).on('ready', function () {
              this.on('focus', scope.onfocus);
              this.on('click', scope.clickButton);
            });
          });
        }
      });
    }
  }
};

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__artist_artist_component__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__artists_artists_component__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__album_album_component__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__albums_albums_component__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__fresh_fresh_component__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__footer_footer_component__ = __webpack_require__(178);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__genre_genre_component__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__genres_genres_component__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__home_home_component__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__index_index_component__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__navbar_navbar_component__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__playing_playing_component__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__playlist_playlist_component__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__playlists_playlists_component__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__podcasts_podcasts_component__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__sidenav_sidenav_component__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__config_config_component__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__config_general_configGeneral_component__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__config_alloydb_configAlloyDb_Component__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__config_sabnzbd_configSabnzbd_component__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__config_scheduler_configScheduler_component__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__activity_activity_component__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__activity_general_activityGeneral_component__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__activity_queue_activityQueue_component__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__activity_history_activityHistory_component__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__activity_blacklist_activityBlacklist_component__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__starred_starred_component__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__status_status_component__ = __webpack_require__(247);


//Page Components





























/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.components', [])
  .component('artist', __WEBPACK_IMPORTED_MODULE_1__artist_artist_component__["a" /* default */])
  .component('artists', __WEBPACK_IMPORTED_MODULE_2__artists_artists_component__["a" /* default */])
  .component('album', __WEBPACK_IMPORTED_MODULE_3__album_album_component__["a" /* default */])
  .component('albums', __WEBPACK_IMPORTED_MODULE_4__albums_albums_component__["a" /* default */])
  .component('fresh', __WEBPACK_IMPORTED_MODULE_5__fresh_fresh_component__["a" /* default */])
  .component('footer', __WEBPACK_IMPORTED_MODULE_6__footer_footer_component__["a" /* default */])
  .component('genre', __WEBPACK_IMPORTED_MODULE_7__genre_genre_component__["a" /* default */])
  .component('genres', __WEBPACK_IMPORTED_MODULE_8__genres_genres_component__["a" /* default */])
  .component('home', __WEBPACK_IMPORTED_MODULE_9__home_home_component__["a" /* default */])
  .component('index', __WEBPACK_IMPORTED_MODULE_10__index_index_component__["a" /* default */])
  .component('header', __WEBPACK_IMPORTED_MODULE_11__navbar_navbar_component__["a" /* default */])
  .component('playing', __WEBPACK_IMPORTED_MODULE_12__playing_playing_component__["a" /* default */])
  .component('playlist', __WEBPACK_IMPORTED_MODULE_13__playlist_playlist_component__["a" /* default */])
  .component('playlists', __WEBPACK_IMPORTED_MODULE_14__playlists_playlists_component__["a" /* default */])
  .component('podcasts', __WEBPACK_IMPORTED_MODULE_15__podcasts_podcasts_component__["a" /* default */])
  .component('sidenav', __WEBPACK_IMPORTED_MODULE_16__sidenav_sidenav_component__["a" /* default */])
  .component('config', __WEBPACK_IMPORTED_MODULE_17__config_config_component__["a" /* default */])
  .component('configgeneral', __WEBPACK_IMPORTED_MODULE_18__config_general_configGeneral_component__["a" /* default */])
  .component('configalloydb', __WEBPACK_IMPORTED_MODULE_19__config_alloydb_configAlloyDb_Component__["a" /* default */])
  .component('configsabnzbd', __WEBPACK_IMPORTED_MODULE_20__config_sabnzbd_configSabnzbd_component__["a" /* default */])
  .component('configscheduler', __WEBPACK_IMPORTED_MODULE_21__config_scheduler_configScheduler_component__["a" /* default */])
  .component('activity', __WEBPACK_IMPORTED_MODULE_22__activity_activity_component__["a" /* default */])
  .component('activitygeneral', __WEBPACK_IMPORTED_MODULE_23__activity_general_activityGeneral_component__["a" /* default */])
  .component('activityqueue', __WEBPACK_IMPORTED_MODULE_24__activity_queue_activityQueue_component__["a" /* default */])
  .component('activityhistory', __WEBPACK_IMPORTED_MODULE_25__activity_history_activityHistory_component__["a" /* default */])
  .component('activityblacklist', __WEBPACK_IMPORTED_MODULE_26__activity_blacklist_activityBlacklist_component__["a" /* default */])
  .component('starred', __WEBPACK_IMPORTED_MODULE_27__starred_starred_component__["a" /* default */])
  .component('status', __WEBPACK_IMPORTED_MODULE_28__status_status_component__["a" /* default */]));


/***/ }),
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__artist_scss__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__artist_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__artist_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__glidejs_glide__ = __webpack_require__(165);




class ArtistController {
  constructor($scope, $rootScope, $routeParams, $compile, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$compile = $compile;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artist-controller');
    this.AppUtilities.showLoader();
    $scope.artistName = '';
    $scope.artist = {};
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.all_expanded = false;
    $scope.albums_expanded = true;
    $scope.tracks_expanded = false;
    $('#trackListContainer').hide();


    var that = this;
   
    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.toggleAlbums = function () {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = function () {
      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.tracks_expanded = !$scope.tracks_expanded;
    }

    $scope.toggleAll = function () {
      $scope.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.getTags = function(obj){
      return obj;
    }

    $scope.getArtist = function () {

      var artist = that.AlloyDbService.getArtist($routeParams.id);
      if (artist) {
        artist.then(function (artist) {

          $scope.artist = artist;
          $scope.artistName = artist.name;
          $scope.artist.albums.forEach(function (album) {
            album.cover_art = $scope.getCoverArt(album.cover_art);
          })

          $scope.tracks = artist.tracks;



          var artistInfo = that.AlloyDbService.getArtistInfo($scope.artistName);
          if (artistInfo) {
            artistInfo.then(function (info) {
              if (info.artistInfo) {
                $scope.artistInfo = info.artistInfo;

                angular.element(document.getElementById('linkContainer')).append($compile("<div> <p>test</p></div>")($scope));

               // $('#linkContainer').append('<popoverbutton buttontext="Tags" buttonicon="fa-tags" data="artistInfo.tags.tag"><popoverbutton>')


                if ($scope.artistInfo.bio) {
                  $scope.artistBio = $scope.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                }
                if ($scope.artistInfo.similar) {
                  $scope.similarArtists = $scope.artistInfo.similar.artist.slice(0, 5);
                }
                if ($scope.artistInfo.image) {
                  $scope.artistInfo.image.forEach(function (image) {
                    if (image['@'].size === 'large') {
                      $scope.artistImage = image['#'];
                    }
                    if (image['@'].size === 'extralarge') {
                      $scope.artistImage = image['#'];
                    }
                  });
                }
                that.AppUtilities.apply();
                that.AppUtilities.hideLoader();
              } else {
                that.AppUtilities.hideLoader();
              }
            });
          }

          that.AppUtilities.apply();
        });
      }
    };

    $scope.refresh = function () {
      that.Backend.debug('refresh artist');
      $scope.getArtist();
    };

    $scope.startRadio = function () {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      that.$rootScope.tracks = AppUtilities.shuffle($scope.tracks);
      that.MediaPlayer.loadTrack(0);
    };

    $scope.starArtist = function () {
      that.Backend.info('starring artist: ' + $scope.artist);
      if ($scope.artist.starred === 'true') {
        that.AlloyDbService.unstar({ artist: that.$routeParams.id }).then(function (result) {
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'false'
          that.AppUtilities.apply();
        });
      } else {
        that.AlloyDbService.star({ artist: that.$routeParams.id }).then(function (result) {
          that.Backend.info('starred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'true'
          that.AppUtilities.apply();
        });
      }
    };

   

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Artist reload on loginsatuschange');
      $scope.getArtist();
    });

    $scope.getArtist();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(164);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./artist.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./artist.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 165 */,
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__artists_scss__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__artists_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__artists_scss__);

class ArtistsController {
  constructor($scope, $rootScope, $timeout, $location, $anchorScroll, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artists-controller');
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshArtists();
    }

    $scope.jumpBarClick = function () {
      console.log('jump bar clicked');

    }

    $rootScope.$watch('artists', function (newVal, oldVal) {
      if ($rootScope.artists) {
        AppUtilities.apply();
        AppUtilities.hideLoader();        
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ArtistsController,
  templateUrl: '/template/artists.jade'
});

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(168);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./artists.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./artists.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__album_scss__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__album_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__album_scss__);

class AlbumController {
  constructor($scope, $rootScope, $routeParams, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artist-controller');
    this.AppUtilities.showLoader();
    $scope.album = {};
    $scope.tracks = [];
    $scope.albumName = '';
    $scope.artistName = '';
    var that = this;
    
    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.getArtistInfo = function (data) {
      if (data) {
        data.forEach(function (info) {
          if (info.artistInfo) {
            $scope.artistInfo = info.artistInfo;
            if ($scope.artistInfo.bio) {
              $scope.artistBio = $scope.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            }
            if ($scope.artistInfo.similar) {
              $scope.similarArtists = $scope.artistInfo.similar.artist.slice(0, 5);
            }
            if ($scope.artistInfo.image) {
              $scope.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'extralarge') {
                  //that.AppUtilities.setContentBackground(image['#']);
                }
              });
            }
          }
        });
      }
    };
    $scope.getAlbumInfo = function (data) {
      if (data) {
        data.forEach(function (info) {
          if (info.albumInfo) {
            $scope.albumInfo = info.albumInfo;
            if ($scope.albumInfo.image) {
              $scope.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'extralarge') {
                  //that.AppUtilities.setContentBackground(image['#']);
                }
              });
            }
          }
        });
      }
    };

    $scope.getAlbum = function () {
      var alb = AlloyDbService.getAlbum($routeParams.id);
      if (alb) {
        alb.then(function (album) {
          if (album) {
            $scope.album = album;
            $scope.albumName = album.name;
            $scope.albumArt = $scope.getCoverArt(album.tracks[0].cover_art);
            $scope.artistName = album.base_path;
            $scope.tracks = album.tracks;

            that.AppUtilities.setContentBackground($scope.albumArt);

            var artistInfo = that.AlloyDbService.getArtistInfo($scope.artistName);
            var albumInfo = that.AlloyDbService.getAlbumInfo($scope.artistName, $scope.albumName);

            Promise.all([artistInfo, albumInfo]).then(function (info) {
              $scope.getArtistInfo(info);
              $scope.getAlbumInfo(info);

              if ($scope.tracks && $scope.tracks.length > 0) {
 
                if ($routeParams.trackid) {
                  $scope.gridOptions.api.forEachNode(function (node) {
                    if (node.data.id === $routeParams.trackid) {
                      $scope.gridOptions.api.selectNode(node, true);
                    }
                  });
                }
              }

              that.AppUtilities.hideLoader();
              that.AppUtilities.apply();
            });
          } else {
            that.AppUtilities.hideLoader();
          }
        });
      }
    };

    $scope.goToArtist = function (id) {
      window.location.href = '/artist/' + id;

    };

    $scope.refresh = function () {
      that.Backend.debug('refresh album');
      $scope.getAlbum();
    };

    $scope.startRadio = function () {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      that.$rootScope.tracks = AppUtilities.shuffle($scope.tracks);
      that.MediaPlayer.loadTrack(0);
    };

    $scope.shareAlbum = function () {
      that.Backend.debug('shareButton');
      that.AlloyDbService.createShare($scope.album.id, 'Shared from Alloy').then(function (result) {
        $('#shareAlbumButton').popover({
          animation: true,
          content: 'Success! Url Copied to Clipboard.',
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: 'top'
        }).popover('show');
        var url = result.url.toString();
        that.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $('#shareAlbumButton').popover('hide');
        }, 5000);
      });
    };

    $scope.starAlbum = function(){
        that.Backend.info('liking album: ' + that.$scope.album.name);
        if ($scope.album.starred === 'true') {
          that.AlloyDbService.unstar({ album: that.$scope.album.id }).then(function (result) {
            that.Backend.info('UnStarred');
            that.Backend.info(result);
            that.$scope.album.starred = 'false';
            that.AppUtilities.apply();
          });
        } else {
          that.AlloyDbService.star({ album: that.$scope.album.id }).then(function (result) {
            that.Backend.info('starred');
            that.Backend.info(result);
            that.$scope.album.starred = 'true';
            that.AppUtilities.apply();
          });
        }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Album reload on loginsatuschange');
      $scope.refresh();
    });

    $scope.refresh();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: AlbumController,
  templateUrl: '/template/album.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(171);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./album.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./album.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.AlbumDetails-innerContentBody {\n  padding: 0; }\n\n.AlbumDetails-header {\n  position: relative;\n  width: 100%;\n  height: 375px; }\n\n.AlbumDetails-backdrop {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center; }\n\n.AlbumDetails-backdropOverlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.445); }\n\n.AlbumDetails-backdrop-bg {\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n  filter: blur(28px);\n  -webkit-filter: blur(28px); }\n\n.AlbumDetails-headerContent {\n  display: flex;\n  padding: 30px;\n  width: 100%;\n  height: 100%;\n  color: #fff; }\n\n.AlbumDetails-poster {\n  flex-shrink: 0;\n  margin-right: 35px;\n  width: 250px;\n  height: 250px; }\n\n.AlbumDetails-info {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  overflow: hidden; }\n\n.AlbumDetails-metadataMessage {\n  color: #909293;\n  text-align: center;\n  font-weight: 300;\n  font-size: 20px; }\n\n.AlbumDetails-titleContainer {\n  display: flex;\n  justify-content: space-between; }\n\n.AlbumDetails-title {\n  margin-bottom: 5px;\n  font-weight: 300;\n  font-size: 50px;\n  line-height: 50px; }\n\n.AlbumDetails-AlbumNavigationButtons {\n  white-space: nowrap; }\n\n.AlbumDetails-AlbumNavigationButton {\n  margin-left: 5px;\n  width: 30px;\n  color: #e1e2e3;\n  white-space: nowrap; }\n\n.AlbumDetails-details {\n  font-weight: 300;\n  font-size: 20px; }\n\n.AlbumDetails-overview {\n  flex: 1 0 auto;\n  min-height: 0; }\n\n.AlbumDetails-contentContainer {\n  padding: 20px; }\n\n@media only screen and (max-width: 768px) {\n  .AlbumDetails-contentContainer {\n    padding: 20px 0; }\n  .AlbumDetails-headerContent {\n    padding: 15px; } }\n\n@media only screen and (max-width: 1200px) {\n  .AlbumDetails-poster {\n    display: none; } }\n", ""]);

// exports


/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__albums_scss__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__albums_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__albums_scss__);

class AlbumsController {
  constructor($scope, $rootScope, $location, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('albums-controller');
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshAlbums();
    };

    $rootScope.$watch('albums', function (newVal, oldVal) {
      if ($rootScope.albums) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: AlbumsController,
  templateUrl: '/template/albums.jade'
});

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(174);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./albums.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./albums.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fresh_scss__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fresh_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__fresh_scss__);


class FreshController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('fresh-controller');
    this.AppUtilities.showLoader();
    var that = this;

    $scope.refreshing = false;

    $scope.tracks = [];

    $scope.continousPlay = true;

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.findNowPlaying = function (id) {
      $rootScope.fresh_albums.forEach(function (album) {

      });
    }

    $scope.getAlbum = function (album) {
      that.$scope.tracks = album.tracks;

      if ($scope.play_prev_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack($scope.tracks.length - 1);
        $scope.play_prev_album = false;
      }

      if ($scope.play_next_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack(0);
        $scope.play_next_album = false;
      }

      that.AppUtilities.apply();
    }

    $scope.findNowPlaying = function () {
      var found = false;
      for (var i = 0; i < $rootScope.fresh_albums.length; i++) {
        if (found) return;
        var album = $rootScope.fresh_albums[i];
        album.tracks.forEach(function (track) {
          if (found) return;
          if (MediaPlayer.checkIfNowPlaying(track)) {
            $scope.coverflow.to(i);
            found = true;
          }
        })
      }
    };



    $scope.refresh = function () {
      AlloyDbService.refreshFresh();
    };

    $scope.startRadio = function () {
      var track = that.MediaPlayer.selectedTrack();
      if (!track || !track.artistId) {
        track = $scope.tracks[0];
      }

      AlloyDbService.getSimilarSongs2(track.artistId).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        if (similarSongs && similarSongs.song) {
          $rootScope.tracks = similarSongs.song;
          MediaPlayer.loadTrack(0);
        }
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      $rootScope.tracks = AppUtilities.shuffle($scope.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on('playlistBeginEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.play_prev_album = true;
        $scope.coverflow.prev();
      }
    });

    $rootScope.$on('playlistEndEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.play_next_album = true;
        $scope.coverflow.next();
      }
    });

    $rootScope.$watch('fresh_albums', function (newVal, oldVal) {
      if ($rootScope.fresh_albums) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({

            playlist: $rootScope.fresh_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {
              if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
                $scope.getAlbum($rootScope.fresh_albums[index]);
              }
            });

            this.on('click', function (index, link) {
              if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
                $scope.getAlbum($rootScope.fresh_albums[index]);
              }
            });
          });

          if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
            $scope.getAlbum($rootScope.fresh_albums[0]);
            $scope.findNowPlaying();
          }

          $scope.refreshing = false;
          console.log('refreshed')
        });
      }

    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: FreshController,
  templateUrl: '/template/fresh.jade'
});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(177);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./fresh.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./fresh.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n#player {\n  width: 100%;\n  background-color: #242424 !important; }\n\n.coverflow {\n  z-index: 10;\n  position: relative;\n  overflow: hidden;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-text-size-adjust: none;\n  -ms-text-size-adjust: none;\n  -webkit-touch-callout: none; }\n\n.coverflow-wrap {\n  background-color: #242424 !important; }\n\n.coverflow .coverflow-wrap {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n.coverflow .coverflow-tray,\n.coverflow .coverflow-rect {\n  position: absolute;\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d; }\n\n.coverflow .coverflow-tray,\n.coverflow .coverflow-cell {\n  pointer-events: none;\n  position: absolute;\n  transition: -webkit-transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);\n  transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);\n  transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), -webkit-transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  background-color: transparent !important; }\n\n.coverflow .coverflow-hit {\n  position: absolute;\n  opacity: 0;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden; }\n\n.coverflow .coverflow-cell canvas {\n  pointer-events: none;\n  outline: 1px solid transparent;\n  position: absolute; }\n\n.coverflow-text {\n  position: absolute;\n  width: 100%;\n  padding-top: 10px;\n  color: white;\n  font-weight: bolder;\n  font-family: \"Lato-Regular\", sans-serif;\n  font-size: 0.85em;\n  background-color: #fefefe; }\n\n.coverflow-text h1,\n.coverflow-text h2 {\n  margin: 0; }\n", ""]);

// exports


/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_scss__ = __webpack_require__(179);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__footer_scss__);

class FooterController {
  constructor($scope, $rootScope, $location, MediaElement, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;

    this.Backend.debug('footer-controller');
  }

  updateVolume(val) {
    this.MediaPlayer.currentVolume = val;
    if (this.MediaPlayer.remotePlayerConnected()) {
      this.MediaPlayer.remotePlayer.volumeLevel = val;
      this.MediaPlayer.remotePlayerController.setVolumeLevel();
    } else {
      this.MediaElement.volume = val;
    }
  }

  $onInit() {
    var that = this;
    that.Backend.debug('footer-init');

    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $('.btn').on('click', function (event) {
      this.blur();
    });

    $('#volumeSlider').on('mousewheel', function (event) {
      event.preventDefault();
      var value = parseInt($("#volumeSlider").val());
      if (event.originalEvent.deltaY < 0) {
        value = value + 5;
        $("#volumeSlider").val(value);
      }
      else if (event.originalEvent.deltaY > 0) {
        value = value - 5;
        $("#volumeSlider").val(value);
      }

      that.updateVolume($('#volumeSlider').val() / 100);
    });

    $("#volumeSlider").on('change', function () {

    });

    $("#volumeSlider").on('input change', function () {
      that.updateVolume($('#volumeSlider').val() / 100);
    });

    $("#clickProgress").click(function (e) {
      var seekto = NaN;

      if (that.MediaPlayer.remotePlayerConnected()) {
        var currentMediaDuration = that.MediaPlayer.remotePlayer.duration;
        seekto = currentMediaDuration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          that.MediaPlayer.remotePlayer.currentTime = seekto;
          that.MediaPlayer.remotePlayerController.seek();
        }
      } else {
        var duration = that.MediaElement.duration;
        if (!isFinite(duration))
          duration = that.MediaPlayer.selectedTrack().duration;
        seekto = duration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          that.MediaElement.currentTime = seekto;
        }
      }
    });

    $("#shareButton").click(function () {
      that.Backend.debug('shareButton');
      //that.AlloyDbService.createShare(that.MediaPlayer.selectedTrack().id, 'Shared from Alloy').then(function (result) {
      //  $('#shareButton').popover({
      //    animation: true,
      //    content: 'Success! Url Copied to Clipboard.',
      //    delay: {
      //      "show": 0,
      //      "hide": 5000
      //    },
      //    placement: 'top'
      //  }).popover('show');
      //  var url = result.url.toString();
      //  that.AppUtilities.copyTextToClipboard(url);
      //  setTimeout(() => {
      //    $('#shareButton').popover('hide');
      //  }, 5000);
      //});

    });

    $("#muteButton").click(function () {
      var vol = 0;
      if (that.MediaPlayer.remotePlayerConnected()) {
        that.MediaPlayer.remotePlayerController.muteOrUnmute();
        that.MediaPlayer.isMuted = that.MediaPlayer.remotePlayer.isMuted;
        if (that.MediaPlayer.isMuted) {
          vol = 0;
          $('#volumeSlider').val(vol);
        } else {
          vol = that.MediaPlayer.remotePlayer.volumeLevel;
          $('#volumeSlider').val(vol * 100);
        }
      } else {
        that.MediaPlayer.isMuted = !that.MediaPlayer.isMuted;
        if (that.MediaPlayer.isMuted) {
          that.MediaElement.volume = 0;
          $('#volumeSlider').val(0);
        } else {
          that.MediaElement.volume = that.MediaPlayer.currentVolume;
          $('#volumeSlider').val(that.MediaPlayer.currentVolume * 100);
        }
      }
      this.blur();
    });

    $("#skipBackButton").click(function () {
      that.MediaPlayer.previous();
      this.blur();
    });

    $("#playPauseButton").click(function () {

      if (that.MediaPlayer.remotePlayerConnected()) {
        if (!that.MediaPlayer.remotePlayer.isPaused) that.MediaPlayer.pause();
        else that.MediaPlayer.play();
      } else {
        if (that.MediaPlayer.playing) that.MediaPlayer.pause();
        else that.MediaPlayer.play();
      }
      this.blur();
    });

    $("#skipNextButton").click(function () {
      that.MediaPlayer.next();
      this.blur();
    });

    $("#repeatButton").click(function () {
      that.MediaPlayer.repeatEnabled = !that.MediaPlayer.repeatEnabled;
      $("#repeatButton").toggleClass('button-selected');
      this.blur();
    });

    $("#downloadButton").click(function () {
      var dlUrl = that.AlloyDbService.download(that.MediaPlayer.selectedTrack().id);
      window.open(dlUrl, '_blank');
    });

    $("#nowPlayingImageHolder").click(function () {
      that.$location.path('/playing');
    });

    $("#likeButton").click(function () {
      var track = that.MediaPlayer.selectedTrack();
      that.Backend.info('liking track: ' + track.artist + " - " + track.title);
      if (track.starred === 'true') {
        that.AlloyDbService.unstar({ id: that.MediaPlayer.selectedTrack().id }).then(function (result) {
          if (that.$rootScope.settings.alloydb.alloydb_love_tracks === true) {
            that.AlloyDbService.unlove({ id: that.MediaPlayer.selectedTrack().id })
          }
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.MediaPlayer.selectedTrack().starred = 'false';
          $("#likeButtonIcon").addClass('fa-star-o');
          $("#likeButtonIcon").removeClass('fa-star');
          that.AppUtilities.apply();
        });
      } else {
        that.AlloyDbService.star({ id: that.MediaPlayer.selectedTrack().id }).then(function (result) {
          if (that.$rootScope.settings.alloydb.alloydb_love_tracks === true) {
            that.AlloyDbService.love({ id: that.MediaPlayer.selectedTrack().id })
          }
          that.Backend.info('starred');
          that.Backend.info(result);
          that.MediaPlayer.selectedTrack().starred = 'true';
          $("#likeButtonIcon").removeClass('fa-star-o');
          $("#likeButtonIcon").addClass('fa-star');
          that.AppUtilities.apply();
        });
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: FooterController,
  templateUrl: '/template/footer.jade',
  selector: 'footer-mediaplayer'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(180);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./footer.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./footer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\nfooter {\n  height: 70px;\n  background-color: #242424 !important; }\n\n.sliderContainer {\n  padding-left: 15px; }\n\n.progress-bar {\n  transition: none 0s ease 0s !important;\n  transition: initial !important; }\n\n.progress-bar.active,\n.progress.active .progress-bar {\n  -webkit-animation: initial !important;\n  animation: none 0s ease 0s 1 normal none running !important;\n  animation: initial !important; }\n\n.progress .bar .progress-bar .progress-bar.active,\n.progress.active {\n  transition: none; }\n\n.buffer-color {\n  background-color: rgba(36, 36, 36, 0.25) !important; }\n\n.progress-color {\n  background-color: rgba(2, 158, 197, 0.728) !important; }\n\n.progress-background {\n  background-color: rgba(36, 36, 36, 0.25) !important;\n  border: 1px solid rgba(20, 22, 24, 0.904) !important; }\n\n​ .track-progress {\n  height: 10px;\n  width: 100vw; }\n\n#mainProgress {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  min-height: 10px; }\n\n#subProgress {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  opacity: 0.33; }\n\n#mainTimeDisplay {\n  font-size: 0.9em;\n  text-align: center; }\n\n#artistInfo {\n  color: white !important;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 0.85em;\n  font-weight: 400; }\n\n#trackTitle {\n  color: white !important;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 0.85em;\n  font-weight: 500; }\n\n.nowPlayingBarInfoContainer {\n  display: flex;\n  align-items: center;\n  height: 100%;\n  -webkit-box-flex: 1;\n  flex-shrink: 1;\n  overflow: hidden; }\n\n.nowPlayingBar {\n  text-align: center;\n  will-change: transform;\n  contain: layout style;\n  transition: -webkit-transform .2s ease-out;\n  transition: transform .2s ease-out;\n  transition: transform .2s ease-out, -webkit-transform .2s ease-out; }\n\n.nowPlayingBar-hidden {\n  -webkit-transform: translate3d(0, 100%, 0);\n  transform: translate3d(0, 100%, 0); }\n\n.nowPlayingBarTop {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 70px;\n  position: relative;\n  justify-content: center;\n  padding-top: 10px; }\n\n.mediaButton,\n.nowPlayingBarUserDataButtons .btnUserItemRating {\n  vertical-align: middle;\n  margin: 0;\n  text-align: center; }\n\n.mediaButton {\n  font-size: 120%; }\n\n.appfooter {\n  position: fixed;\n  left: 0;\n  right: 0;\n  z-index: 2147483647;\n  bottom: 0;\n  transition: -webkit-transform 180ms linear;\n  transition: transform 180ms linear;\n  transition: transform 180ms linear, -webkit-transform 180ms linear;\n  contain: layout style;\n  background-color: #242424 !important;\n  border: 1px solid rgba(20, 22, 24, 0.904); }\n\n.appfooter.headroom--unpinned {\n  -webkit-transform: translateY(100%) !important;\n  transform: translateY(100%) !important; }\n\n.nowPlayingBar .nowPlayingImage {\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: contain;\n  height: 100%;\n  width: 70px;\n  flex-shrink: 0; }\n\n.nowPlayingBarText {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n  text-align: left;\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n  margin-left: 0.25em;\n  margin-top: 5px; }\n\n.nowPlayingBarSecondaryText {\n  background-color: #242424 !important;\n  color: white !important;\n  font-family: \"Roboto\", sans-serif;\n  font-size: 0.85em; }\n\n.nowPlayingBarTimeContainer {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n  text-align: left;\n  flex-grow: 1;\n  padding-bottom: 0px; }\n\n.mediaControlButtonGroup {\n  text-align: center;\n  vertical-align: middle; }\n\n.mediaControlButtonGroup.btn-group {\n  margin: 0 auto;\n  text-align: center;\n  width: inherit;\n  display: inline-block;\n  font-size: 0.5em;\n  vertical-align: middle; }\n\n.mediaControlButton {\n  height: 10px;\n  margin: 0px;\n  padding-top: 0px;\n  padding-bottom: 10px;\n  font-size: 0.7em;\n  vertical-align: middle;\n  text-align: center; }\n\n.nowPlayingBarCenter {\n  vertical-align: middle;\n  text-align: center;\n  z-index: 2;\n  height: 100%;\n  flex-grow: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute; }\n\n.nowPlayingBarPositionContainer {\n  position: absolute !important;\n  left: 0;\n  top: -.56em;\n  right: 0;\n  z-index: 1; }\n\n.headroom--unpinned .nowPlayingBarPositionContainer,\n.noMediaProgress .nowPlayingBarPositionContainer {\n  display: none; }\n\n.nowPlayingBarRight {\n  position: relative;\n  margin: 15px 0 0 auto;\n  height: 100%;\n  z-index: 2;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  display: flex;\n  align-items: center;\n  flex-shrink: 0; }\n\n.nowPlayingBarCurrentTime {\n  vertical-align: middle;\n  text-align: center;\n  display: inline-block;\n  padding-left: 1.5em; }\n\n.nowPlayingBarVolumeSliderContainer {\n  margin-right: 2em; }\n\n.nowPlayingBarUserDataButtons {\n  display: inline-block;\n  margin-left: 1em;\n  margin-right: 1em; }\n\n.nowPlayingBarPositionSlider::-webkit-slider-thumb {\n  width: 1.2em !important;\n  height: 1.2em !important; }\n\n@media all and (max-width: 640px) {\n  .nowPlayingBarVolumeSliderContainer {\n    display: none !important; } }\n\n@media all and (max-width: 87.5em) {\n  .nowPlayingBarUserDataButtons {\n    display: none; } }\n\n@media all and (max-width: 68.75em) {\n  .nowPlayingBarVolumeSliderContainer {\n    display: none !important; } }\n\n@media all and (max-width: 50em) {\n  #downloadButton {\n    display: none !important; }\n  #repeatButton {\n    display: none !important; }\n  #shareButton {\n    display: none !important; }\n  #muteButton {\n    display: none !important; }\n  #artistInfo {\n    max-width: 50px;\n    overflow: hidden; }\n  #trackTitle {\n    max-width: 50px;\n    overflow: hidden; } }\n\n@media all and (min-width: 50em) {\n  .nowPlayingBarRight .playPauseButton {\n    display: none; }\n  .nowPlayingBarInfoContainer {\n    max-width: 40%; } }\n", ""]);

// exports


/***/ }),
/* 181 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__genre_scss__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__genre_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__genre_scss__);

class GenreController {
  constructor($scope, $rootScope, $routeParams, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('genre-controller');
    this.AppUtilities.showLoader();
    $scope.artist = {};
    $scope.albums = [];
    $scope.genre = { tracks: [] }
    $scope.artistName = '';
    $scope.all_expanded = false;
    $scope.albums_expanded = true;
    $scope.genre.tracks_expanded = false;
    $scope.genre = this.$routeParams.id;
    var that = this;

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.getGenre = function () {
      if (AlloyDbService.isLoggedIn) {
        that.AlloyDbService.getGenre(that.$routeParams.id).then(function (result) {
          $scope.genre = result;

          var randomTrack = $scope.genre.tracks[Math.floor(Math.random()*$scope.genre.tracks.length)];
          $scope.genreImage = that.AlloyDbService.getCoverArt(randomTrack.cover_art)
          var genreInfo = that.AlloyDbService.getGenreInfo($scope.genre.name);
          if (genreInfo) {
            genreInfo.then(function (result) {
              $scope.genreInfo = result.genreInfo;
              $scope.genreInfo.wiki.summary = $scope.genreInfo.wiki.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
              that.AppUtilities.apply();
            });
          }


          that.AppUtilities.apply();
          that.AppUtilities.hideLoader();
        });
      }
    };

    $scope.toggleAlbums = function () {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = function () {
      if ($scope.genre.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.genre.tracks_expanded = !$scope.genre.tracks_expanded;
    }

    $scope.toggleAll = function () {
      $scope.genre.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.genre.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.refresh = function () {
      that.Backend.debug('refresh genre');
      $scope.getGenre();
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      $rootScope.tracks = AppUtilities.shuffle($scope.genre.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Genre reload on loginsatuschange');
      $scope.getGenre();
    });

    $scope.getGenre();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: GenreController,
  templateUrl: '/template/genre.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(183);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./genre.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./genre.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.GenreDetailsSeason-albumType {\n  margin-bottom: 20px;\n  border: 1px solid #e5e5e5;\n  border-radius: 4px;\n  background-color: #fff; }\n\n.GenreDetailsSeason-albumType:last-of-type {\n  margin-bottom: 0; }\n\n.GenreDetailsSeason-header {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  font-size: 24px;\n  cursor: pointer; }\n\n.GenreDetailsSeason-albumTypeLabel {\n  margin-right: 5px;\n  margin-left: 5px; }\n\n.GenreDetailsSeason-albumCount {\n  color: #8895aa;\n  font-style: italic;\n  font-size: 18px; }\n\n.GenreDetailsSeason-expandButton {\n  flex-grow: 1;\n  width: 100%;\n  text-align: center; }\n\n.GenreDetailsSeason-left {\n  display: flex;\n  align-items: center;\n  flex: 0 1 300px;\n  padding: 15px 10px; }\n\n.GenreDetailsSeason-actionButton {\n  width: 30px; }\n\n.GenreDetailsSeason-albums {\n  padding-top: 15px;\n  border-top: 1px solid #e5e5e5; }\n\n.GenreDetailsSeason-collapseButtonContainer {\n  padding: 10px 15px;\n  width: 100%;\n  border-top: 1px solid #e5e5e5;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n  background-color: #fafafa;\n  text-align: center; }\n\n.GenreDetailsSeason-expandButtonIcon {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin-top: -12px;\n  margin-left: -15px; }\n\n@media only screen and (max-width: 768px) {\n  .GenreDetailsSeason-albumType {\n    border-right: 0;\n    border-left: 0;\n    border-radius: 0; }\n  .GenreDetailsSeason-expandButtonIcon {\n    position: static;\n    margin: 0; } }\n\n.GenreDetails-innerContentBody {\n  padding: 0; }\n\n.GenreDetails-header {\n  position: relative;\n  width: 100%;\n  height: 375px; }\n\n.GenreDetails-backdrop {\n  position: absolute;\n  width: 100%;\n  height: 100%; }\n\n.GenreDetails-backdrop-bg {\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n  filter: blur(28px);\n  -webkit-filter: blur(28px); }\n\n.GenreDetails-backdropOverlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.445); }\n\n.GenreDetails-headerContent {\n  display: flex;\n  padding: 30px;\n  width: 100%;\n  height: 100%;\n  color: #fff; }\n\n.GenreDetails-poster {\n  flex-shrink: 0;\n  margin-right: 35px;\n  width: 250px;\n  height: 250px; }\n\n.GenreDetails-info {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  overflow: hidden; }\n\n.GenreDetails-metadataMessage {\n  color: #909293;\n  text-align: center;\n  font-weight: 300;\n  font-size: 20px; }\n\n.GenreDetails-titleContainer {\n  display: flex;\n  justify-content: space-between; }\n\n.GenreDetails-title {\n  margin-bottom: 5px;\n  font-weight: 300;\n  font-size: 50px;\n  line-height: 50px; }\n\n.GenreDetails-artistNavigationButtons {\n  white-space: nowrap; }\n\n.GenreDetails-artistNavigationButton {\n  margin-left: 5px;\n  width: 30px;\n  color: #e1e2e3;\n  white-space: nowrap; }\n\n.GenreDetails-details {\n  font-weight: 300;\n  font-size: 20px; }\n\n.GenreDetails-detailsLabel {\n  margin: 5px 10px 5px 0; }\n\n.GenreDetails-path,\n.GenreDetails-sizeOnDisk,\n.GenreDetails-qualityProfileName,\n.GenreDetails-links {\n  margin-left: 8px;\n  font-weight: 300;\n  font-size: 17px; }\n\n.GenreDetails-path {\n  vertical-align: text-top;\n  font-size: 14px;\n  font-family: \"Ubuntu Mono\", Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n\n.GenreDetails-overview {\n  flex: 1 0 auto;\n  min-height: 0; }\n\n.GenreDetails-contentContainer {\n  padding: 20px; }\n\n@media only screen and (max-width: 768px) {\n  .GenreDetails-contentContainer {\n    padding: 20px 0; }\n  .GenreDetails-headerContent {\n    padding: 15px; } }\n\n@media only screen and (max-width: 1200px) {\n  .GenreDetails-poster {\n    display: none; } }\n", ""]);

// exports


/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__genres_scss__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__genres_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__genres_scss__);

class GenresController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('genres-controller');
    this.AppUtilities.showLoader();
    
    $scope.refresh = function () {
      AlloyDbService.refreshGenres();
    };

    $rootScope.$watch('genres', function (newVal, oldVal) {
      if ($rootScope.genres) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: GenresController,
  templateUrl: '/template/genres.jade'
});

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./genres.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./genres.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 187 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_scss__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__home_scss__);

class HomeController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('home-controller');
    var that = this;
    $scope.refreshing = false;
    AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshFresh();
      AlloyDbService.refreshRandom();
    };

    $rootScope.$watch('fresh_albums', function (newVal, oldVal) {
      if ($rootScope.fresh_albums) {
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();

        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({

            playlist: $rootScope.fresh_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {

            });

            this.on('click', function (index, link) {

            });
          });
        });
      }
    });

    $rootScope.$watch('random', function (newVal, oldVal) {
      if ($rootScope.random) {

      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
});

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(189);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./home.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./home.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.home-body {\n  float: left;\n  width: 100%; }\n\n.col-md-3 {\n  position: relative;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px; }\n\n.content-grid img {\n  width: 100%; }\n\n.content-grid {\n  float: left;\n  text-align: center;\n  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.35);\n  margin-right: 0%;\n  margin-bottom: 2%;\n  position: relative;\n  padding-left: 0; }\n\n.content-grid:hover .inner-info {\n  display: block;\n  transition: all 0.3s ease;\n  position: absolute;\n  bottom: 0px;\n  background: #EA57A3;\n  padding: 10px 10px;\n  width: 227px;\n  border-radius: 0px 0px 4px 4px;\n  -webkit-border-radius: 0px 0px 4px 4px;\n  -moz-border-radius: 0px 0px 4px 4px;\n  -o-border-radius: 0px 0px 4px 4px; }\n\n.inner-info {\n  display: none; }\n\n.inner-info h5 {\n  color: #fff;\n  font-size: 1em;\n  font-weight: 600;\n  text-transform: uppercase; }\n\n.inner-info a {\n  color: #fff; }\n\n.inner-info a:hover {\n  text-decoration: none; }\n\n.content-grid.last-grid img {\n  width: 100%; }\n\nspan.new {\n  display: inline-block;\n  padding: 8px 13px;\n  background: #EA57A3;\n  font-size: 0.5em;\n  color: #fff;\n  -webkit-appearance: none;\n  border: none;\n  outline: none;\n  vertical-align: top;\n  border-radius: 0.3em;\n  -o-border-radius: 0.3em;\n  -moz-border-radius: 0.3em;\n  -webkit-border-radius: 0.3em; }\n\nh3.title-text {\n  float: left;\n  font-size: 1.8em;\n  font-weight: 700;\n  color: #444; }\n\nh4.title-text {\n  float: left;\n  font-size: 1.2em;\n  font-weight: 400;\n  color: #EA57A3;\n  margin-left: 70%; }\n\nh4.title-text.two {\n  margin-left: 70%; }\n\n.nbs-flexisel-container {\n  position: relative;\n  min-width: 100%; }\n\n.nbs-flexisel-item a img {\n  width: 100%; }\n\n.nbs-flexisel-item a {\n  display: block; }\n\n.nbs-flexisel-ul {\n  position: relative;\n  width: 9999px;\n  margin: 0px;\n  padding: 0px;\n  list-style-type: none;\n  text-align: center; }\n\n.nbs-flexisel-inner {\n  overflow: hidden;\n  padding: 2em 0; }\n\n.nbs-flexisel-item {\n  float: left;\n  margin: 0px;\n  padding: 0px;\n  cursor: pointer;\n  position: relative;\n  width: 235px !important;\n  margin: 0 10px;\n  box-shadow: 0px 0px 12px -1px rgba(215, 215, 215, 0.44);\n  -webkit-box-shadow: 0px 0px 12px -1px rgba(215, 215, 215, 0.44);\n  -moz-box-shadow: 0px 0px 12px -1px rgba(215, 215, 215, 0.44);\n  -o-box-shadow: 0px 0px 12px -1px rgba(215, 215, 215, 0.44);\n  -ms-box-shadow: 0px 0px 12px -1px rgba(215, 215, 215, 0.44);\n  border: 1px solid #ddd; }\n\n@media screen and (min-width: 320px) {\n  h3.title-text {\n    float: left;\n    font-size: 1.3em; }\n  h4.title-text {\n    margin-left: 6%;\n    font-size: 1em; }\n  .button {\n    margin: 10px 0 8px 0;\n    font-size: 0.8em; }\n  h4.title-text.two {\n    margin-left: 22%; }\n  .content-grid:hover .inner-info {\n    padding: 0px 10px;\n    width: 116px;\n    font-size: 0.8em; }\n  h3.hd-title-text {\n    font-size: 1.15em;\n    margin-bottom: 0.5em; } }\n\n@media screen and (min-width: 375px) {\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 143px; }\n  h4.title-text {\n    margin-left: 11%;\n    font-size: 1em; } }\n\n@media screen and (min-width: 384px) {\n  span.new {\n    display: inline-block;\n    padding: 6px 10px;\n    font-size: 0.5em; }\n  h4.title-text {\n    margin-left: 20%;\n    font-size: 1em; }\n  .button {\n    margin: 10px 0 0 0;\n    font-size: 0.85em; }\n  h4.title-text {\n    margin-left: 14%;\n    font-size: 1em;\n    margin-top: 2%; }\n  h4.title-text.two {\n    margin-left: 25%; }\n  h3.hd-title-text {\n    font-size: 1.3em;\n    margin-bottom: 0.5em; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 140px; }\n  .nbs-flexisel-item {\n    width: 156px !important;\n    margin: 0px 6px !important; }\n  .slide-title h4 {\n    font-size: 1em; } }\n\n@media screen and (min-width: 414px) {\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 143px; }\n  h4.title-text {\n    margin-left: 11%;\n    font-size: 1em; } }\n\n@media screen and (min-width: 480px) {\n  h3.title-text {\n    float: left;\n    font-size: 1.3em; }\n  h4.title-text {\n    margin-left: 6%;\n    font-size: 1em; }\n  .button {\n    margin: 10px 0 8px 0;\n    font-size: 0.8em; }\n  h4.title-text.two {\n    margin-left: 22%; }\n  .content-grid:hover .inner-info {\n    padding: 0px 10px;\n    width: 116px;\n    font-size: 0.8em; }\n  h3.hd-title-text {\n    font-size: 1.15em;\n    margin-bottom: 0.5em; } }\n\n@media screen and (min-width: 568px) {\n  .content-grid {\n    width: 17%;\n    margin-right: 0%; }\n  h4.title-text {\n    margin-left: 41%; } }\n\n@media screen and (min-width: 600px) {\n  h4.title-text {\n    margin-left: 45%; }\n  h4.title-text.two {\n    margin-left: 54%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 154px; } }\n\n@media screen and (min-width: 640px) {\n  .content-grid {\n    width: 18%;\n    margin-right: 0%; }\n  h3.title-text {\n    float: left;\n    font-size: 1.6em; }\n  h4.title-text.two {\n    margin-left: 53%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 163px; } }\n\n@media screen and (min-width: 667px) {\n  .home-body {\n    float: left;\n    width: 100%; }\n  .content-grid {\n    width: 19%;\n    margin-right: 0%; }\n  .col-md-3 {\n    float: left; }\n  .col-md-3 {\n    width: 25%; }\n  .content-grid.last-grid {\n    margin-right: 0%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 148px; }\n  h4.title-text.two {\n    margin-left: 56%; }\n  .button {\n    margin: 10px 0 0 0;\n    font-size: 0.9em; } }\n\n@media screen and (min-width: 768px) {\n  .content-grid {\n    width: 20%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 144px; } }\n\n@media screen and (min-width: 800px) {\n  .content-grid {\n    width: 21%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 144px; } }\n\n@media screen and (min-width: 991px) {\n  .home-body {\n    float: left;\n    width: 100%; }\n  .content-grid {\n    width: 22%; }\n  h4.title-text {\n    margin-left: 48%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 140px; }\n  h4.title-text.two {\n    margin-left: 56%; } }\n\n@media screen and (min-width: 1024px) {\n  .content-grid {\n    width: 23%; }\n  h4.title-text {\n    margin-left: 48%; }\n  h4.title-text.two {\n    margin-left: 57%; }\n  .button {\n    margin: 10px 0 0 0;\n    font-size: 0.85em; }\n  h3.hd-title-text {\n    font-size: 1.5em;\n    margin-bottom: 0.5em; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 133px; } }\n\n@media screen and (min-width: 1280px) {\n  .content-grid {\n    width: 24%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 162px; }\n  .button {\n    margin: 10px 0 0 0;\n    font-size: 0.9em; }\n  h3.hd-title-text {\n    font-size: 1.4em;\n    margin-bottom: 0.5em; } }\n\n@media screen and (min-width: 1366px) {\n  .content-grid {\n    width: 23.5%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 176px; }\n  a.text {\n    float: right;\n    width: 77%;\n    font-size: 0.9em;\n    line-height: 1.8em; }\n  h4.title-text {\n    margin-left: 63%; }\n  h4.title-text.two {\n    margin-left: 69%; } }\n\n@media screen and (min-width: 1440px) {\n  .content-grid {\n    width: 24%; }\n  .content-grid:hover .inner-info {\n    padding: 3px 10px;\n    width: 190px; }\n  .inner-info h5 {\n    font-size: 0.9em;\n    margin: 0; }\n  h3.hd-title-text {\n    font-size: 1.6em;\n    margin-bottom: 0.5em; }\n  h4.title-text {\n    margin-left: 64%; }\n  h4.title-text.two {\n    margin-left: 70%; } }\n\n@media screen and (min-width: 1600px) {\n  .content-grid {\n    width: 25%; }\n  .content-grid:hover .inner-info {\n    padding: 10px 10px;\n    width: 227px; }\n  h4.title-text {\n    margin-left: 68%; }\n  h4.title-text.two {\n    margin-left: 74%; } }\n\n#player {\n  background-color: #242424; }\n", ""]);

// exports


/***/ }),
/* 190 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class IndexController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('index-controller');
    this.AppUtilities.showLoader();
    $scope.artists = [];
    var that = this;

    $scope.refresh = function () {
      AlloyDbService.refreshIndex();
    };

    $scope.reloadArtists = function () {
      $scope.artists = [];
      var getMusicFoldersIndex = that.AlloyDbService.getMusicFoldersIndex();
      if (getMusicFoldersIndex) {
        getMusicFoldersIndex.then(function (result) {
          $scope.artists = result;
          that.AppUtilities.apply();
          that.AppUtilities.hideLoader();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Index reload on loginsatuschange');

    });

    $rootScope.$watch('music_index', function (newVal, oldVal) {
      if ($rootScope.music_index) {
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: IndexController,
  templateUrl: '/template/index-view.jade'
});

/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__navbar_scss__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__navbar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__navbar_scss__);

class NavbarController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService, $http) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('nav-controller');
    var that = this;

    $scope.selectedObject = null;

    $("#search-box").mouseenter(function () {
      $('#search-box').focus();
    });

    var html = '';
    html += '<div class="unselectable card-5" data-instance-id="{{ ctrl.instanceId }} ng-show="ctrl.containerVisible">';
    html += ' <ul class="list-group">';
    html += '   <li ng-repeat="item in ctrl.renderItems" class="list-group-item" ng-if="item.value.data.length">';
    html += '     <p>{{item.value.title}} - {{item.value.data.length}}</p>';
    html += '     <ul class="list-group">';
    html += '       <li ng-if="item.value.data.length" ng-repeat="renderItem in item.value.data" ng-click="ctrl.selectItem(renderItem, item.value, true)" class="list-group-item" ng-class="ctrl.getSelectedCssClass(renderItem)">';
    html += '         <p ng-if="renderItem.artist">{{renderItem.artist}}</p>';
    html += '         <p ng-if="renderItem.title">{{renderItem.title}}</p>';
    html += '         <p ng-if="renderItem.album">{{renderItem.album}}</p>';
    html += '         <p ng-if="renderItem.genre">{{renderItem.genre}}</p>';
    html += '       </li>';
    html += '     </ul>';
    html += '   </li>';
    html += ' </ul>';
    html += '</div>';

    var noMatch = "";
    noMatch += '<li class="list-group-item"/>  ';

    $scope.autoCompleteOptions = {
      minimumChars: 1,
      //pagingEnabled: true,
      dropdownWidth: '500px',
      containerCssClass: "autocomplete-container",
      //pageSize: 5,
      containerTemplate: html,
      //noMatchTemplate: noMatch,
      activateOnFocus: true,
      itemSelected: function (e) {
       // that.selectedObject = e.item;


        switch (e.type.title) {
          case "Artists":
            that.$location.path("/artist/" + e.item.base_id);
            break;
          case "Songs":
            that.$location.path("/album/" + e.item.album_id + "/" + e.item.id);
            break;
          case "Albums":
            that.$location.path("/album/" + e.item.album_id);
            break;
          case "Genres":
            that.$location.path("/genre/" + e.item.genre_id);
            break;
        }

      },
      data: function (searchText, pagingParams) {
        that.loading = true;

        return that.AlloyDbService.search(searchText).then(function (result) {
          searchText = searchText.toUpperCase();
          // console.log(result)

          var results = [
            {
              title: "Artists",
              data: result.artists
            },
            {
              title: "Songs",
              data: result.tracks
            },
            {
              title: "Albums",
              data: result.albums
            },
            {
              title: "Genres",
              data: result.genres
            }
          ];

          that.loading = false;
          return results;
        });
      }
    }
  }

  $onInit() {
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: NavbarController,
  templateUrl: '/template/navbar.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(193);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./navbar.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./navbar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.navbar {\n  height: 40px;\n  background-color: #242424 !important;\n  border: 1px solid rgba(20, 22, 24, 0.904); }\n\n.navbar-brand {\n  color: white !important; }\n\n.nav-link {\n  color: white !important; }\n\n.autocomplete-container {\n  position: absolute;\n  right: 10px;\n  width: 500px;\n  left: auto !important;\n  top: 45px !important;\n  max-height: 50vh;\n  overflow: auto; }\n", ""]);

// exports


/***/ }),
/* 194 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playing_scss__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playing_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__playing_scss__);

class PlayingController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('playing-controller');
    var that = this;
    $scope.getSong = function () {
      var track = that.MediaPlayer.selectedTrack();
      if (track) {
        $scope.trackTitle = track.title;
        $scope.artistName = track.artist;
        $scope.year = track.year;
        $scope.contentType = track.content_type;
        $scope.bitrate = track.bitrate;

        that.AlloyDbService.getTrackInfo(track.id).then(function (song) {
          if (song.trackInfo) {
            $scope.song = song.trackInfo;
            $scope.artistName = $scope.song.artist.name;
            $scope.trackTitle = $scope.song.name;
          
            $scope.playCount = $scope.song.playcount;
          }
          that.AppUtilities.hideLoader();
        });

        that.AlloyDbService.getArtistInfo(track.artist).then(function (info) {
          if (info) {

            $scope.artistInfo = info.artistInfo;
            if ($scope.artistInfo.bio) {
              $scope.artistBio = $scope.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            }
            if ($scope.artistInfo.similar) {
              $scope.similarArtists = $scope.artistInfo.similar.artist.slice(0, 5);
            }
            if ($scope.artistInfo.image) {
              $scope.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'extralarge') {
                  that.AppUtilities.setContentBackground(image['#']);
                }
              });
            }
            that.AppUtilities.apply();          
          }
        });

      } else {
        that.AppUtilities.hideLoader();
      }
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      that.Backend.debug('Track Changed reloading now playing');
      $scope.getSong();
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('login changed reloading now playing');
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

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(196);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./playing.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./playing.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.playingWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.playingBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 45px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n.playing-artist-name {\n  text-align: center;\n  font-size: 1.4em;\n  font-weight: bolder; }\n\n.playing-sub-info {\n  text-align: center;\n  font-size: 0.75em;\n  font-weight: 200; }\n\n.playing-bio {\n  text-align: center;\n  margin: 10px;\n  font-size: 1em;\n  max-height: 300px;\n  font-weight: 500;\n  overflow-y: auto; }\n\n.similar-artists-header {\n  text-align: left; }\n\n.similar-artists-container {\n  position: absolute;\n  left: 0px;\n  right: 0px;\n  bottom: 0px;\n  text-align: center;\n  margin: 10px;\n  font-size: 1em;\n  max-height: 300px;\n  font-weight: 500;\n  overflow-y: auto; }\n", ""]);

// exports


/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playlist_scss__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playlist_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__playlist_scss__);

class PlaylistController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('playlist-controller');
    var that = this;

    $rootScope.$watch('tracks', function (newVal, oldVal) {
      AppUtilities.apply();
      AppUtilities.hideLoader();
    });


  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
});

/***/ }),
/* 198 */
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
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./playlist.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./playlist.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.playlistWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.playlistBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 45px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#playlistTrackGrid {\n  flex: 1 0; }\n", ""]);

// exports


/***/ }),
/* 200 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playlists_scss__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playlists_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__playlists_scss__);

class PlaylistsController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('playlists-controller');
    AppUtilities.hideLoader();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PlaylistsController,
  templateUrl: '/template/playlists.jade'
});

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(202);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./playlists.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./playlists.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 203 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__podcasts_scss__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__podcasts_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__podcasts_scss__);

class PodcastsController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('podcasts-controller');
    AppUtilities.hideLoader();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: PodcastsController,
  templateUrl: '/template/podcasts.jade'
});

/***/ }),
/* 204 */
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
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./podcasts.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./podcasts.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n", ""]);

// exports


/***/ }),
/* 206 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sidenav_scss__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sidenav_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sidenav_scss__);

class SidenavController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('sidenav-controller');
  }

  $onInit() {
    var that = this;

    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });

    $('#body-row .collapse').collapse('hide');

    // Collapse/Expand icon
    $('#collapse-icon').addClass('fa-angle-double-left');

    // Collapse click
    $('[data-toggle=sidebar-colapse]').click(function () {
      that.sidebarCollapse();
    });

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
  }

  sidebarCollapse() {
    this.$rootScope.isMenuCollapsed = !this.$rootScope.isMenuCollapsed;
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('#list-tab').toggleClass('card-5');
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
    this.AppUtilities.broadcast('menuSizeChange');
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: SidenavController,
  templateUrl: '/template/sidenav.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3), __webpack_require__(3)))

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(208);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./sidenav.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./sidenav.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.sidebar {\n  background-color: #242424;\n  max-width: 160px;\n  border: 1px solid rgba(20, 22, 24, 0.904) !important;\n  overflow: auto;\n  padding: 0; }\n\n.list-group-item-dark {\n  color: white;\n  background-color: #242424;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: bold;\n  font-size: 0.8em; }\n\n.list-group-item-dark .active {\n  color: white;\n  background-color: #242424;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: bold;\n  font-size: 0.8em; }\n\n.list-group-item-dark-no-select {\n  color: white !important;\n  background-color: #242424 !important;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: bold;\n  font-size: 0.8em; }\n\n.sub-list-group-item-dark {\n  color: white !important;\n  background-color: rgba(2, 158, 197, 0.719) !important;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: bold;\n  font-size: 0.8em; }\n\n.sidebar-expanded {\n  width: 160px; }\n\n.sidebar-collapsed {\n  width: 50px; }\n\n.list-group-item {\n  color: white !important;\n  cursor: pointer; }\n", ""]);

// exports


/***/ }),
/* 209 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_scss__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__config_scss__);

class ConfigController {
  constructor($scope, $rootScope, $compile, $routeParams, $location, AppUtilities, Backend, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.Backend.debug('config-controller');
    this.AppUtilities.showLoader();
    var that = this;


    this.$scope.jumpTo = function (to) {
      that.$location.path('/config/' + to);
    };

    this.$scope.navigate = function (to) {
      $('.PageContentBody-contentBody').append(that.$compile("<config" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
    };

    this.$rootScope.triggerConfigAlert = function (message, type) {
      //$('.PageContentBody-contentBody').append('<div class="alert alert-' + type + ' config-alert notification" role="alert">' + message + '</div>');
      setTimeout(() => {
        // $('.config-alert').hide(500);
        $('#saveSettingsButton').popover('hide');
      }, 3000);

      // $('#saveSettingsButton').popover('show');
    };


    var t = '<div class="popover" role="tooltip">' +
      '<div class="arrow">' +
      '</div>' +
      '<h3 class="popover-header"></h3>' +
      '<div class="popover-body"></div>' +
      '</div>';


    $('body').popover({
      html: true,
      selector: '[rel=save-settings-popover]',
      trigger: 'click',
      template: t,
      content: "Success!",
      //container: '.PageContentBody-contentBody',
      placement: "bottom",
    });


    


    AppUtilities.apply();
    AppUtilities.hideLoader();
  }

  $onInit() {
    if (this.$routeParams.id) {
      this.Backend.debug('navigating to ' + this.$routeParams.id);
      this.$scope.navigate(this.$routeParams.id);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ConfigController,
  templateUrl: '/template/config.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 210 */
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
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./config.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./config.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.Settings-link {\n  border-bottom: 1px solid #e5e5e5;\n  color: white;\n  font-size: 21px; }\n\n.Settings-link:hover {\n  color: white;\n  text-decoration: none; }\n\n.Settings-summary {\n  margin-top: 10px;\n  margin-bottom: 30px;\n  color: #555; }\n\n.FormGroup-group {\n  display: flex;\n  margin-bottom: 20px;\n  margin-left: 20px;\n  margin-right: 20px; }\n\n.FormGroup-small {\n  max-width: 650px; }\n\n.FormGroup-medium {\n  max-width: 800px; }\n\n.FormGroup-large {\n  max-width: 1200px; }\n\n.FormLabel-label {\n  display: flex;\n  justify-content: flex-end;\n  margin-right: 20px;\n  font-weight: bold;\n  line-height: 35px;\n  color: white; }\n\n.FormLabel-large {\n  flex: 0 0 250px; }\n\n.FormLabel-isAdvanced {\n  color: #ff902b; }\n\n.Button-button {\n  overflow: hidden;\n  border: 1px solid;\n  border-radius: 4px;\n  vertical-align: middle;\n  text-align: center;\n  white-space: nowrap;\n  line-height: normal; }\n\n.Button-button:hover {\n  text-decoration: none; }\n\n.Button-primary {\n  border-color: rgba(20, 22, 24, 0.904);\n  background-color: #242424;\n  color: #fff; }\n\n.Button-primary:hover {\n  border-color: rgba(2, 158, 197, 0.719);\n  background-color: #242424;\n  color: #fff; }\n\n.Button-warning {\n  border-color: #a12f02;\n  background-color: #870b0b;\n  color: #fff; }\n\n.Button-warning:hover {\n  border-color: #b10000;\n  background-color: #e60000;\n  color: #fff; }\n\n.Button-medium {\n  padding: 6px 16px;\n  font-size: 14px; }\n\n.Input-input {\n  padding: 6px 16px;\n  width: 100%;\n  height: 35px;\n  border: 1px solid #dde6e9;\n  border-radius: 4px;\n  background-color: #fff;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n\n.Input-input:focus {\n  outline: 0;\n  border-color: #66afe9;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n\n.Input-hasButton {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.FormInputHelpText-helpText {\n  margin-top: 5px;\n  color: #909293;\n  line-height: 20px; }\n\n.CheckInput-container {\n  position: relative;\n  display: flex;\n  flex: 1 1 65%;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.CheckInput-input {\n  flex: 1 0 auto;\n  margin-top: 7px;\n  margin-right: 5px;\n  width: 20px;\n  height: 20px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background-color: #fff;\n  color: #fff;\n  text-align: center;\n  line-height: 20px; }\n\n.CheckInput-label {\n  display: flex;\n  margin-bottom: 0;\n  min-height: 21px;\n  font-weight: normal;\n  cursor: pointer; }\n\n.CheckInput-checkbox {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  pointer-events: none; }\n\n.CheckInput-input {\n  flex: 1 0 auto;\n  margin-top: 7px;\n  margin-right: 5px;\n  width: 20px;\n  height: 20px;\n  border: 1px solid rgba(20, 22, 24, 0.904);\n  border-radius: 2px;\n  background-color: #242424;\n  color: white;\n  text-align: center;\n  line-height: 20px; }\n\n.CheckInput-checkbox:focus + .CheckInput-input {\n  outline: 0;\n  border-color: rgba(20, 22, 24, 0.904);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n\n.CheckInput-primaryIsChecked {\n  border-color: rgba(20, 22, 24, 0.904);\n  background-color: rgba(2, 158, 197, 0.719); }\n\n.CheckInput-helpText {\n  margin-top: 8px;\n  margin-left: 5px; }\n\n.FormInputButton-button {\n  border-left: none;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.FormInputGroup-inputGroupContainer {\n  flex: 1 1 auto; }\n\n.FormInputGroup-inputGroup {\n  display: flex;\n  flex: 1 1 auto;\n  flex-wrap: wrap; }\n\n.FormInputGroup-inputContainer {\n  position: relative;\n  flex: 1 1 auto; }\n\n.FieldSet-fieldSet {\n  margin: 0;\n  margin-bottom: 20px;\n  padding: 0;\n  min-width: 0;\n  border: 0; }\n\n.FieldSet-legend {\n  display: block;\n  margin-bottom: 21px;\n  padding-left: 21px;\n  color: white;\n  width: 100%;\n  border: 0;\n  border-bottom: 1px solid rgba(20, 22, 24, 0.904);\n  font-size: 21px;\n  line-height: inherit; }\n\n.Naming-namingInput {\n  font-family: \"Ubuntu Mono\", Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n\n@media only screen and (max-width: 1200px) {\n  .FormGroup-group {\n    display: block; }\n  .FormLabel-label {\n    justify-content: flex-start; } }\n", ""]);

// exports


/***/ }),
/* 212 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class ConfigGeneralController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('general-config-controller');
    var that = this;
   
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ConfigGeneralController,
  templateUrl: '/template/configGeneral.jade',

});

/***/ }),
/* 213 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ConfigAlloyDbController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('config-alloydb-controller');
    var that = this;
    $scope.settings = {};
  
    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($rootScope.settings.alloydb) {
        if ($rootScope.settings.alloydb.alloydb_use_ssl)
          url = 'https://';
        url += $rootScope.settings.alloydb.alloydb_host;
        if ($rootScope.settings.alloydb.alloydb_include_port_in_url)
          url += ':' + $rootScope.settings.alloydb.alloydb_port;
      }


      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    Backend.emit('load_settings', 'alloydb_settings');

    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });


    AppUtilities.hideLoader();

    $rootScope.$watch('settings.alloydb ', function (newVal, oldVal) {
      $scope.previewConnectionString();
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ConfigAlloyDbController,
  templateUrl: '/template/configAlloyDb.jade'
});

/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto_js__);

class ConfigSabnzbdController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('sabnzbd-controller');
    var that = this;
    $scope.settings = {};

    $scope.testSettings = function () {
      Backend.emit('test_sabnzbd_settings', $rootScope.settings.sabnzbd);
    };



    var t = '<div class="popover" role="tooltip">' +
      '<div class="arrow">' +
      '</div>' +
      '<h3 class="popover-header"></h3>' +
      '<div class="popover-body"></div>' +
      '</div>';



    Backend.socket.on('test_sabnzbd_connection_result', function (data) {
      if (data) {
        that.Backend.debug('sabnzbd connection result');
        that.Backend.debug(data);

        if (data) {
          var pop = $('#testSabnzbdConnectionButton').popover({
            html: true,
            // selector: '[rel=save-settings-popover]',
            trigger: 'manual',
            //template: t,
            content: data.result,
            //container: '.PageContentBody-contentBody',
            placement: "top",
          });

          pop.popover('show');
          setTimeout(() => {
            pop.popover('hide');
          }, 3000);

        }
      }
    });

    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($rootScope.settings.sabnzbd) {
        if ($rootScope.settings.sabnzbd.sabnzbd_use_ssl)
          url = 'https://';
        url += $rootScope.settings.sabnzbd.sabnzbd_host;
        if ($rootScope.settings.sabnzbd.sabnzbd_include_port_in_url)
          url += ':' + $rootScope.settings.sabnzbd.sabnzbd_port;
        if ($rootScope.settings.sabnzbd.sabnzbd_url_base)
          url += '/' + $rootScope.settings.sabnzbd.sabnzbd_url_base;
        url += '/api';
      }
      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });

    $rootScope.$watch('settings.sabnzbd ', function (newVal, oldVal) {
      $scope.previewConnectionString();
    });

  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ConfigSabnzbdController,
  templateUrl: '/template/configSabnzbd.jade',

});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto_js__);

class ConfigSchedulerController {
  constructor($scope, $rootScope, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('scheduler-controller');
    var that = this;
    $scope.settings = {};

    var that = this;

    $scope.ping = function () {
      var ping = that.AlloyDbService.getSchedulerStatus();
      if (ping) {
        ping.then(function (data) {
          that.Backend.debug('getSchedulerStatus');
          that.$scope.schedulerStatus = data;
          that.AppUtilities.apply();
        });
      }
    };


    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });


    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(function () {
      AppUtilities.apply();
    }, 1000);


    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
    });


  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ConfigSchedulerController,
  templateUrl: '/template/configScheduler.jade'

});

/***/ }),
/* 239 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {class ActivityController {
  constructor($scope, $rootScope, $compile, $routeParams, $location, AppUtilities, Backend, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.Backend.debug('activity-controller');
    var that = this;


    this.$scope.jumpTo = function (to) {
      that.$location.path('/activity/' + to);
    };

    this.$scope.navigate = function (to) {
      $('.PageContentBody-contentBody').append(that.$compile("<activity" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
    };

    this.$scope.configQueue = function () {
      that.Backend.debug('activityQueue');
      that.$scope.navigate('queue');
    };

    this.$scope.configHistory = function () {
      that.Backend.debug('activityHistory');
      that.$scope.navigate('history');
    };

    this.$scope.configBlacklist = function () {
      that.Backend.debug('activityBlacklist');
      that.$scope.navigate('blacklist');
    };

    AppUtilities.apply();
    AppUtilities.hideLoader();

  }

  $onInit() {
    if (this.$routeParams.id) {
      this.Backend.debug('navigating to ' + this.$routeParams.id);
      this.$scope.navigate(this.$routeParams.id);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ActivityController,
  templateUrl: '/template/activity.jade'
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 240 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class ActivityGeneralController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('general-activity-controller');
    var that = this;
   
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ActivityGeneralController,
  templateUrl: '/template/activityGeneral.jade',

});

/***/ }),
/* 241 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActivityQueueController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('activity-queue-controller');
    this.AppUtilities.showLoader();
    var that = this;
    this.$scope.queue = [];
    
    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on('sabnzbdQueueResult', function (event, data) {
      that.Backend.debug('sabnzbd queue result');
      $scope.queue = JSON.parse(data);
      AppUtilities.updateGridRows($scope.gridOptions);
      that.AppUtilities.apply();
      that.AppUtilities.hideLoader();
    });

    $scope.refreshIntereval = setInterval(function () {
      Backend.emit('get_sabnzbd_queue');
    }, 1000);


  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ActivityQueueController,
  templateUrl: '/template/activityQueue.jade'
});

/***/ }),
/* 242 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActivityHistoryController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('activity-history-controller');
    this.AppUtilities.showLoader();
    var that = this;
    this.$scope.history = [];
   
    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on('sabnzbdHistoryResult', function (event, data) {
      that.Backend.debug('sabnzbd history result');
      $scope.history = JSON.parse(data);
      that.AppUtilities.apply();
      that.AppUtilities.hideLoader();
    });

    $scope.refreshIntereval = setInterval(function () {
      Backend.emit('get_sabnzbd_history');
    }, 10000);
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ActivityHistoryController,
  templateUrl: '/template/activityHistory.jade'
});

/***/ }),
/* 243 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActivityBlacklistController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('activity-blacklist-controller');
    var that = this;
   
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: ActivityBlacklistController,
  templateUrl: '/template/activityBlacklist.jade'
});

/***/ }),
/* 244 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__starred_scss__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__starred_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__starred_scss__);

class StarredController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('starred-controller');
    this.AppUtilities.showLoader();
    var that = this;

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.findNowPlaying = function (id) {
      $rootScope.fresh_albums.forEach(function (album) {

      });
    }

    $scope.getAlbum = function (album) {
      that.$scope.tracks = album.tracks;

      if ($scope.play_prev_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack($scope.tracks.length - 1);
        $scope.play_prev_album = false;
      }

      if ($scope.play_next_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack(0);
        $scope.play_next_album = false;
      }

      
    }

    $scope.refresh = function () {
      AlloyDbService.refreshStarred();
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      $rootScope.tracks = AppUtilities.shuffle($rootScope.starred_tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$watch('starred_tracks', function (newVal, oldVal) {
      if ($rootScope.starred_tracks) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      }
    });

    $rootScope.$watch('starred_albums', function (newVal, oldVal) {
      if ($rootScope.starred_albums) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({
            playlist: $rootScope.starred_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });

            this.on('click', function (index, link) {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });
          });
        });
      }

    });

  }

}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(246);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./starred.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./starred.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.starredWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  margin: 0; }\n\n.starredBodyWrapper {\n  position: absolute;\n  padding: 0;\n  top: 45px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n#starredAlbums {\n  height: 100px;\n  background-color: black; }\n\n#starredTracksGrid {\n  flex: 1 0; }\n", ""]);

// exports


/***/ }),
/* 247 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__status_scss__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__status_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__status_scss__);

class StatusController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('status-controller');
    var that = this;

    $scope.ping = function () {
      var ping = that.AlloyDbService.ping();
      if (ping) {
        ping.then(function (data) {
          $scope.alloydb = data;
          that.AppUtilities.apply();
        });
      }

    };

    $scope.getLibraryInfo = function () {
      var libraryInfo = that.AlloyDbService.getLibraryInfo();
      if (libraryInfo) {
        libraryInfo.then(function (info) {
          $scope.libraryInfo = info;
          that.AppUtilities.apply();
        });
      }
    };

    $scope.getMediaPaths = function () {
      var mediaPaths = that.AlloyDbService.getMediaPaths();
      if (mediaPaths) {
        mediaPaths.then(function (paths) {
          $scope.mediaPaths = paths;
          that.AppUtilities.apply();
        });
      }
    };

    $scope.scanFullStart = function () {
      var scanner = that.AlloyDbService.scanFullStart();
      that.Backend.debug('scanFullStart');
      $scope.scanStatus = result;
      that.AppUtilities.apply();
      $scope.rescanInterval = setInterval(function () {
        $scope.getScanStatus();
      }, 500);
    };

    $scope.scanQuickStart = function () {
      var scanner = that.AlloyDbService.scanQuickStart();
      that.Backend.debug('scanQuickStart');
      $scope.scanStatus = result;
      that.AppUtilities.apply();
      $scope.rescanInterval = setInterval(function () {
        $scope.getScanStatus();
      }, 500);
    };

    $scope.getScanStatus = function () {
      var scanner = that.AlloyDbService.scanStatus();
      if (scanner) {
        scanner.then(function (result) {
          $scope.scanStatus = result;
          that.AppUtilities.apply();
          if (!$scope.rescanInterval) {
            $scope.rescanInterval = setInterval(function () {
              $scope.getScanStatus();
            }, 500);
          }
        });
      }
      $scope.getLibraryInfo();
    };

    $scope.scanCancel = function () {
      var scanner = that.AlloyDbService.scanCancel();
      if (scanner) {
        scanner.then(function (result) {
          that.Backend.debug('cancelScan');
          $scope.scanStatus = result;
          that.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(function () {
      AppUtilities.apply();
    }, 1000);


    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
      clearInterval($scope.rescanInterval);
    });



    $timeout(() => {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
      $scope.getScanStatus();
    }, 500);
    AppUtilities.hideLoader();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  bindings: {},
  controller: StatusController,
  templateUrl: '/template/status.jade'
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(249);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./status.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/src/index.js??ref--4-2!../../../node_modules/sass-loader/lib/loader.js??ref--4-3!../../../node_modules/sass-resources-loader/lib/loader.js??ref--4-4!./status.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Lato-Regular\", sans-serif;\n  src: url(/content/Lato-Regular.ttf) format(\"truetype\"); }\n\n@font-face {\n  font-family: \"MavenPro-Regular\", sans-serif;\n  src: url(/content/MavenPro-Regular.ttf) format(\"truetype\"); }\n\n.statusWrapper {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  padding: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  width: 100%;\n  margin: 0; }\n\n.statusBodyWrapper {\n  overflow: auto; }\n", ""]);

// exports


/***/ }),
/* 250 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__appUtilities_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__backend_service__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__alloyDbService_service__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mediaElement_service__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mediaPlayer_service__ = __webpack_require__(281);








/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.services', [])
  .service('AppUtilities', __WEBPACK_IMPORTED_MODULE_1__appUtilities_service__["a" /* default */])
  .service('Backend', __WEBPACK_IMPORTED_MODULE_2__backend_service__["a" /* default */])
  .service('AlloyDbService', __WEBPACK_IMPORTED_MODULE_3__alloyDbService_service__["a" /* default */])
  .service('MediaElement', __WEBPACK_IMPORTED_MODULE_4__mediaElement_service__["a" /* default */])
  .service('MediaPlayer', __WEBPACK_IMPORTED_MODULE_5__mediaPlayer_service__["a" /* default */]));

/***/ }),
/* 251 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io_client__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io_client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_crypto_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_crypto_js__);



class Backend {
  constructor($rootScope, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    this.socket = __WEBPACK_IMPORTED_MODULE_0_socket_io_client___default()('//' + document.location.hostname + ':' + document.location.port);
    var that = this;
    this.socket.on('ping', function (data) {
      if (data)
        $rootScope.backend_ping = data;
    });
    this.socket.on('sabnzbd_ping', function (data) {
      if (data)
        $rootScope.sabnzbd_ping = data;
    });
    $rootScope.settings = {};
    $rootScope.settings.alloydb = {};
    $rootScope.settings.sabnzbd = {};

    $rootScope.saveSettings = function () {
      var d = JSON.stringify($rootScope.settings);

      $rootScope.settings.alloydb.alloydb_lastfm_password = AppUtilities.encryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);
      that.emit('save_settings', { key: 'alloydb_settings', data: $rootScope.settings.alloydb });
      $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);

      that.emit('save_settings', { key: 'sabnzbd_settings', data: $rootScope.settings.sabnzbd });
      $rootScope.triggerConfigAlert("Saved!", 'success');



    }

    $rootScope.loadSettings = function () {

    }

    var setup = function () {

      if (that.$rootScope.settings.alloydb.alloydb_host && that.$rootScope.settings.alloydb.alloydb_apikey) {
        AlloyDbService.login();
      }
      if ($rootScope.settings.alloydb && $rootScope.settings.alloydb.alloydb_lastfm_username && $rootScope.settings.alloydb.alloydb_lastfm_password) {
        AlloyDbService.lastFmLogin($rootScope.settings.alloydb.alloydb_lastfm_username, $rootScope.settings.alloydb.alloydb_lastfm_password);
      }
    }

    this.socket.on('settings_saved_event', function (settings) {
      setup();
    });

    this.socket.on('settings_loaded_event', function (settings) {
      if (settings) {
        if (settings.key === 'sabnzbd_settings') {
          $rootScope.settings.sabnzbd = settings.data;
        }


        if (settings.key === 'alloydb_settings') {
          $rootScope.settings.alloydb = settings.data;
          $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword(settings.data.alloydb_lastfm_password);
          setup();
        }
        that.AppUtilities.apply();
      }
    });


  

    this.socket.on('sabnzbd_history_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdHistoryResult', data);
      }
    });

    this.socket.on('sabnzbd_queue_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdQueueResult', data);
      }
    });

  }

  emit(message, data) {
    this.socket.emit(message, data);
  }

  formMessage(type, data) {

    var message = {
      message: data,
      method: type
    };
    console.log(data);
    this.emit('log', message);
  }

  info(data) {
    this.formMessage('info', data);
  }

  debug(data) {
    this.formMessage('debug', data);
  }

  error(data) {
    this.formMessage('error', data);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Backend;


/***/ }),
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 277 */,
/* 278 */,
/* 279 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto_js__);


class AlloyDbService {
  constructor($rootScope, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }

  doLogin() {
    var that = this;

    if (this.$rootScope.settings && this.$rootScope.settings.alloydb && this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
      if (!this.isLoggedIn) {
        console.log('logging into alloydb')

        this.alloydb = new AlloyApi(this.$rootScope.settings.alloydb);

        this.alloydb.ping().then(function (result) {
          if (result) {
            if (result.status == 'success') {
              that.isLoggedIn = true;
              that.isLoggingIn = false;
              that.preload();
            } else {
              that.isLoggingIn = false;
              that.isLoggedIn = false;
            }
            console.log('logging into alloydb is ' + result.status);
          }

          that.AppUtilities.broadcast('loginStatusChange', { service: 'alloydb', isLoggedIn: that.isLoggedIn });
        });


      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.ping();
    else return false;
  }

  getSchedulerStatus() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getSchedulerStatus();
    else return false;
  }

  getLibraryInfo() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getLibraryInfo();
    else return false;
  }

  getMediaPaths() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMediaPaths();
    else return false;
  }

  getMusicFolders() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMusicFolders();
    else return false;
  }

  getMusicFoldersIndex() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMusicFoldersIndex();
    else return false;
  }

  getRandomSongs() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getRandomSongs();
    else return false;
  }

  getFresh(limit) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getFresh(limit);
    else return false;
  }

  getAlbums() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbums();
    else return false;
  }

  getAlbum(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbum(id);
    else return false;
  }

  getGenre(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenre(id);
    else return false;
  }

  getGenres() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenres();
    else return false;
  }

  getSongsByGenre(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getSongsByGenre(id);
    else return false;
  }

  getArtist(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtist(id);
    else return false;
  }

  getArtistInfo(artist) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtistInfo(artist);
    else return false;
  }

  getAlbumInfo(artist, album) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbumInfo(artist, album);
    else return false;
  }

  getTrackInfo(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getTrackInfo(id);
    else return false;
  }

  getGenreInfo(genre) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenreInfo(genre);
    else return false;
  }

  getStarred() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getStarred();
    else return false;
  }

  scanFullStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanFullStart();
    else return false;
  }

  scanQuickStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanQuickStart();
    else return false;
  }

  scanStatus() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanStatus();
    else return false;
  }

  scanCancel() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanCancel();
    else return false;
  }

  search(query) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.search(query);
    else return false;
  }

  addPlay(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.addPlay(id);
    else return false;
  }

  love(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.love(params);
    else return false;
  }

  unlove(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unlove(params);
    else return false;
  }

  star(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.star(params);
    else return false;
  }

  unstar(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unstar(params);
    else return false;
  }

  stream(id, quality) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.stream(id, quality);
    else return false;
  }

  download(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.download(id);
    else return false;
  }

  getCoverArt(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getCoverArt(id);
    else return false;
  }

  lastFmLogin(username, password) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.lastFmLogin(username, password);
    else return false;
  }

  scrobble(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scrobble(id);
    else return false;
  }

  scrobbleNowPlaying(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scrobbleNowPlaying(id);
    else return false;
  }

  loadArtists(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.artists) {
          that.$rootScope.artists = info.artists;
        }
      });
    }
  }

  loadFresh(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.fresh && info.fresh.albums) {
          that.$rootScope.fresh_albums = info.fresh.albums;
          that.$rootScope.fresh_albums.forEach(function (album) {
            album.image = that.getCoverArt(album.cover_art);
            album.title = album.album;
          });
        }
      });
    }
  }

  loadAlbums(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.albums) {
          that.$rootScope.albums = info.albums;
          that.$rootScope.albums.forEach(function (album) {
            album.image = that.getCoverArt(album.cover_art);
            album.title = album.album;
          });
        }
      });
    }
  }

  loadGenres(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.genres) {
          that.$rootScope.genres = info.genres;

        }
      });
    }
  }

  loadStarred(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.starred) {
          that.$rootScope.starred_tracks = info.starred.tracks;
          that.$rootScope.starred_albums = info.starred.albums;
          that.$rootScope.starred_albums.forEach(function (album) {
            album.image = that.getCoverArt(album.cover_art);
            album.title = album.album;
          });
        }
      });
    }
  }

  loadIndex(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.index) {
          that.$rootScope.music_index = info.index;

        }
      });
    }
  }

  loadRandom(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.random) {
          that.$rootScope.random = info.random;
          that.$rootScope.random.forEach(function (track) {
            track.image = that.getCoverArt(track.cover_art);
          });
        }
      });
    }
  }

  refreshArtists(){
    var that = this;
    var artists = this.getMusicFolders();
    if(artists){
      artists.then(function(info){
        that.loadArtists([info]);
      })
    }
  };
  
  refreshFresh(){
    var that = this;
    var fresh = this.getFresh(50);
    if(fresh){
      fresh.then(function(info){
        that.loadFresh([info]);
      })
    }
  }

  refreshAlbums(){
    var that = this;
    var albums = this.getAlbums();
    if(albums){
      albums.then(function(info){
        that.loadAlbums([info]);
      })
    }
  }

  refreshGenres(){
    var that = this;
    var genres = this.getGenres();
    if(genres){
      genres.then(function(info){
        that.loadGenres([info]);
      })
    }
  }

  refreshStarred(){
    var that = this;
    var starred = this.getStarred();
    if(starred){
      starred.then(function(info){
        that.loadStarred([info]);
      })
    }
  }

  refreshIndex(){
    var that = this;
    var index = this.getMusicFoldersIndex();
    if(index){
      index.then(function(info){
        that.loadIndex([info]);
      })
    }
  }

  refreshRandom(){
    var that = this;
    var random = this.getRandomSongs();
    if(random){
      random.then(function(info){
        that.loadRandom([info]);
      })
    }
  }

  preload() {
    console.log('preloaing')
    var that = this;
    var artists = this.getMusicFolders();
    var fresh = this.getFresh(50);
    var albums = this.getAlbums();
    var genres = this.getGenres();
    var starred = this.getStarred();
    var index = this.getMusicFoldersIndex();
    var random = this.getRandomSongs();

    Promise.all([artists, fresh, albums, genres, starred, index, random]).then(function (info) {
      that.loadArtists(info);
      that.loadFresh(info);
      that.loadAlbums(info);
      that.loadGenres(info);
      that.loadStarred(info);
      that.loadIndex(info);
      that.loadRandom(info);
      that.AppUtilities.apply();
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AlloyDbService;


/***/ }),
/* 280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {class MediaElement {
  constructor($document) {
    "ngInject";
    var media = $document[0].getElementById('media-player');

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

    return media;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MediaElement;


Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__appUtilities_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__API_cast_framework__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__API_cast_framework___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__API_cast_framework__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__API_cast_v1__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__API_cast_v1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__API_cast_v1__);



var isCastAvailable = false;
window.__onGCastApiAvailable = function (isAvailable) {
  isCastAvailable = isAvailable;
};

class MediaPlayer {
  constructor($rootScope, MediaElement, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('init media player');
    this.activeSong = "";
    this.playing = false;
    this.currentVolume = this.MediaElement.volume;
    this.selectedIndex = 0;
    this.repeatEnabled = false;
    this.$rootScope.checkIfNowPlaying = this.checkIfNowPlaying;
    this.$rootScope.tracks = [];
    var that = this;
    this.MediaElement.addEventListener('play', function () {
      that.playing = true;
      that.togglePlayPause();
    });

    this.MediaElement.addEventListener('pause', function () {
      that.playing = false;
      that.togglePlayPause();
    });

    this.MediaElement.addEventListener('ended', function () {
      if ((that.selectedIndex + 1) === that.$rootScope.tracks.length) {
        that.playing = false;
        that.selectedIndex = 0;
        that.togglePlayPause();
        $('#media-player').src = that.selectedTrack();
        $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainTimeDisplay').html("");
        that.Backend.debug('Playlist ended');
        that.AppUtilities.broadcast('playlistEndEvent');

      } else {
        that.playing = true;
        that.next();
      }
    });

    this.MediaElement.addEventListener('canplaythrough', function () {
      $('#mainTimeDisplay').html("0:00 / " + that.AppUtilities.formatTime(MediaElement.duration));
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      that.togglePlayPause();
    });

    this.MediaElement.addEventListener('timeupdate', function () {
      var duration = MediaElement.duration;
      if (!isFinite(duration))
        duration = that.selectedTrack().duration;

      var playPercent = 100 * (MediaElement.currentTime / duration);
      if (!isNaN(playPercent)) {
        var buffered = MediaElement.buffered;
        var loaded;


        if (buffered.length) {
          loaded = 100 * buffered.end(0) / duration;
        }


        $('#subProgress').attr('aria-valuenow', loaded).css('width', loaded + "%");
        $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
        $('#mainTimeDisplay').html(that.AppUtilities.formatTime(MediaElement.currentTime) + " / " + that.AppUtilities.formatTime(duration));
      }
    });
  }

  castStatus() {
    return isCastAvailable;
  }

  initializeCast() {
    if (isCastAvailable) {
      var options = {};
      options.receiverApplicationId = 'DAB06F7C';
      options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
      cast.framework.CastContext.getInstance().setOptions(options);
      this.remotePlayer = new cast.framework.RemotePlayer();
      this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
      var that = this;
      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        function () {
          that.Backend.debug('switchPlayer');
          if (cast && cast.framework) {
            if (that.remotePlayerConnected()) {

              that.setupRemotePlayer();
              return;
            }
          }
          that.setupLocalPlayer();
        }
      );

      this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    }
  }

  castSession() {
    return this.getCurrentSession();
    //return cast.framework.CastContext.getInstance().getCurrentSession();
  }

  trackCount() {
    return this.$rootScope.tracks.length;
  }

  showTrackCount() {
    return this.$rootScope.tracks.length > 0;
  }

  selectedTrack() {
    return this.$rootScope.tracks[this.selectedIndex];
  }

  remotePlayerConnected() {
    if (!this.remotePlayer) return false;
    return this.remotePlayer.isConnected;
  }

  checkNowPlayingImage(source) {
    if (source.cover_art) {

      $('#nowPlayingImageHolder').attr('src', this.AlloyDbService.getCoverArt(source.cover_art));
    }
  }

  checkPlaylistBeginning(newIndex) {
    if (newIndex <= 0) {
      this.playing = false;
      this.selectedIndex = 0;
      this.togglePlayPause();
      $('#media-player').src = this.selectedTrack();
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainTimeDisplay').html("");
      this.Backend.debug('Playlist ended');
      this.AppUtilities.broadcast('playlistBeginEvent');
      return true;
    } return false;
  }

  checkPlaylistEnding(newIndex) {
    if (newIndex >= this.$rootScope.tracks.length) {
      this.playing = false;
      this.selectedIndex = 0;
      this.togglePlayPause();
      $('#media-player').src = this.selectedTrack();
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainTimeDisplay').html("");
      this.Backend.debug('Playlist ended');
      this.AppUtilities.broadcast('playlistEndEvent');
      return true;
    } return false;
  }

  generateRemoteMetadata(source) {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (!source) {
        throw new Error('source required');
      }
      if (!source.artistId) {
        throw new Error('no artist id');
      }
      //that.AlloyDbService.getArtistInfo(source.artistId).then(function (result) {
      //  var mediaInfo = new chrome.cast.media.MediaInfo(source.url, 'audio/mp3' /*source.transcodedContentType*/);
      //  mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MOVIE;
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.TV_SHOW;
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
      //  mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
      //  mediaInfo.metadata.customData = JSON.stringify(source);
      //  mediaInfo.metadata.albumArtist = source.albumArtist;
      //  mediaInfo.metadata.albumName = source.album;
      //  mediaInfo.metadata.artist = source.artist;
      //  mediaInfo.metadata.artistName = source.artist;
      //  mediaInfo.metadata.composer = source.artist;
      //  mediaInfo.metadata.discNumber = source.track;
      //  mediaInfo.metadata.songName = source.title;
      //  mediaInfo.metadata.title = source.title;
      //  mediaInfo.metadata.images = [{
      //    'url': result.largeImageUrl.replace('300x300', '1280x400')
      //  }];
      //  resolve(mediaInfo);
      //});
    });
  }

  togglePlayPause() {
    var playing = false;
    if (this.remotePlayerConnected()) {
      playing = this.remotePlayer.playerState === 'PLAYING';
    } else {
      playing = this.playing;
    }

    if (playing) {
      $("#playPauseIcon").addClass("fa-pause");
      $("#playPauseIcon").removeClass("fa-play");
    } else {
      $("#playPauseIcon").addClass("fa-play");
      $("#playPauseIcon").removeClass("fa-pause");
    }
  }

  toggleCurrentStatus() {
    var playing = false;
    if (this.remotePlayerConnected()) {
      playing = this.remotePlayer.playerState === 'PLAYING';
    } else {
      playing = this.playing;
    }
    if (playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  scrobble(instance, source) {
    instance.AlloyDbService.scrobble(source.id).then(function (scrobbleResult) {
      if (scrobbleResult) instance.Backend.info('scrobble success: ' + scrobbleResult.result + " : " + source.artist + " - " + source.title);
    });
    instance.AlloyDbService.scrobbleNowPlaying(source.id).then(function (scrobbleResult) {
      if (scrobbleResult) instance.Backend.info('scrobbleNowPlaying success: ' + scrobbleResult.result + " : " + source.artist + " - " + source.title);
    });
  }

  addPlay(instance, source) {
    instance.AlloyDbService.addPlay(source.id).then(function (result) {
      if (result) {
        instance.Backend.info('addPlay success: ' + result.result + " : " + source.artist + " - " + source.title);
        source.play_count++;
        instance.AppUtilities.broadcast('trackChangedEvent', source);
        instance.AppUtilities.apply();
      }
    });
  }

  loadTrack(index, that) {
    var t = this;
    if (that) {
      t = that;
    }
    t.selectedIndex = index;
    t.Backend.debug('load track');
    $('#mainTimeDisplay').html("Loading...");

    var source = t.selectedTrack();
    t.Backend.debug(source.artist + " - " + source.title);
    source.artistUrl = "/artist/" + source.base_id;
    source.albumUrl = "/album/" + source.album_id;
    if (source && source.id) {
      source.url = t.AlloyDbService.stream(source.id, 320);

      t.checkVolume();

      //if (source.artistId) {
      t.checkStarred(source);
      t.checkArtistInfo(source);
      t.checkNowPlayingImage(source);

      if (t.remotePlayerConnected()) {
        t.setupRemotePlayer();
        t.generateRemoteMetadata(source).then(function (mediaInfo) {
          var request = new chrome.cast.media.LoadRequest(mediaInfo);
          cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request);
          t.scrobble(t, source);
          t.togglePlayPause();
          t.startProgressTimer();
        });
      } else {

        t.MediaElement.src = source.url;
        t.MediaElement.load();
        if (t.shouldSeek) {
          t.shouldSeek = false;
          t.MediaElement.currentTime = t.prePlannedSeek;
        }
        var playPromise = t.MediaElement.play();
        var that2 = t;
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            that2.scrobble(that2, source);
            that2.addPlay(that2, source);
            that2.togglePlayPause();
            that2.AppUtilities.broadcast('trackChangedEvent', source);
          }).catch(error => {
            that2.Backend.error('playing failed ' + error);
            //that2.next();
          });
        } else {
          //t.next();
        }
      }
      //} else {
      //  t.next();
      //}
    } else {
      //t.next();
    }
  }

  play() {
    if (this.remotePlayerConnected()) {
      if (this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
      }

    } else {
      var playPromise = this.MediaElement.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          this.Backend.debug('success playing');
        }).catch(error => {
          this.Backend.error('playing failed ' + error);
        });
      }
    }
  }

  pause() {
    if (this.remotePlayerConnected()) {
      if (!this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
      }
    } else {
      this.MediaElement.pause();
    }
  }

  stop() {
    this.MediaElement.stop();
  }

  previous() {
    if (!this.repeatEnabled) this.selectedIndex--;
    if (!this.checkPlaylistBeginning(this.selectedIndex)) {
      this.loadTrack(this.selectedIndex);
    }
  }
  next() {
    if (!this.repeatEnabled) this.selectedIndex++;
    if (!this.checkPlaylistEnding(this.selectedIndex)) {
      this.loadTrack(this.selectedIndex);
    }
  }

  checkVolume() {
    $('#volumeSlider').val(this.currentVolume * 100);
  }

  checkStarred(source) {
    if (source.starred === 'true') {
      $("#likeButtonIcon").removeClass('fa-star-o');
      $("#likeButtonIcon").addClass('fa-star');
    } else {
      $("#likeButtonIcon").removeClass('fa-star');
      $("#likeButtonIcon").addClass('fa-star-o');
    }
  }

  checkArtistInfo(source) {
    $('#artistInfo').html(source.artist);
    $('#artistInfo').attr("href", source.artistUrl);
    $('#trackTitle').html(source.title);
    $('#trackTitle').attr("href", source.albumUrl);
  }

  startProgressTimer() {
    this.stopProgressTimer();
    var that = this;
    this.timer = setInterval(function () {
      if (that.remotePlayerConnected()) {
        var currentMediaTime = that.remotePlayer.currentTime;
        var currentMediaDuration = that.remotePlayer.duration;
        var playPercent = 100 * (currentMediaTime / currentMediaDuration);
        if (!isNaN(playPercent)) {
          $('#subProgress').attr('aria-valuenow', "100").css('width', "100%");
          $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
          $('#mainTimeDisplay').html(that.AppUtilities.formatTime(currentMediaTime) + " / " + that.AppUtilities.formatTime(currentMediaDuration));
        }
      }
    }, 250);
  }

  stopProgressTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }



  setupRemotePlayer() {

    if (!this.remoteConfigured) {
      var that = this;
      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
        function () {
          that.togglePlayPause(that.remotePlayer.isPaused);
        }
      );

      that.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
        function () {
          that.isMuted = that.remotePlayer.isMuted;
          if (that.isMuted) {
            vol = 0;
            $('#volumeSlider').val(vol);
          } else {
            vol = that.remotePlayer.volumeLevel;
            $('#volumeSlider').val(vol * 100);
          }
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
        function () {
          $('#volumeSlider').val(that.remotePlayer.volumeLevel * 100);
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        function () {
          that.Backend.debug('media info change');
          that.Backend.debug(that.remotePlayer.mediaInfo);
          if (that.remotePlayer && that.remotePlayer.mediaInfo && that.remotePlayer.mediaInfo.metadata) {
            var customData = that.remotePlayer.mediaInfo.metadata.customData;
            if (customData) {
              if (that.$rootScope.tracks.length > 0) {

              } else {
                that.$rootScope.tracks[0] = JSON.parse(customData);
                that.selectedIndex = 0;
              }
            }
          }
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        function () {
          that.Backend.debug('state change ');
          that.Backend.debug(that.remotePlayer.playerState);

          if (that.remotePlayer.playerState === null) {
            if (that.remotePlayer.savedPlayerState) {
              that.shouldSeek = true;
              that.prePlannedSeek = that.remotePlayer.savedPlayerState.currentTime;
              that.loadTrack(that.selectedIndex, that);
              that.Backend.debug('saved state');
            } else {
              that.next();
            }
          }
          if (that.remotePlayer.playerState === 'BUFFERING') {
            $('#mainTimeDisplay').html("Buffering...");
          }
          if (that.remotePlayer.playerState === 'PLAYING' && that.shouldSeek) {
            that.shouldSeek = false;
            that.remotePlayer.currentTime = that.prePlannedSeek;
            that.remotePlayerController.seek();
            that.AppUtilities.broadcast('trackChangedEvent', that.selectedTrack());
          }


          if (that.MediaElement.playing) {
            that.shouldSeek = true;
            that.prePlannedSeek = that.MediaElement.currentTime;
            that.MediaElement.pause();
            that.loadTrack(that.selectedIndex);
          }
          that.isMuted = that.remotePlayer.isMuted;
          if (that.isMuted) {
            $('#volumeSlider').val(0);
          } else {
            $('#volumeSlider').val(that.remotePlayer.volumeLevel * 100);
          }

          that.togglePlayPause();
          // TODO fix resume support
          if (that.remotePlayer.mediaInfo && that.remotePlayer.mediaInfo.metadata) {
            //id = this.remotePlayer.mediaInfo.contentId;

            //id = id.split("&")[6];
            //id = id.substring(3,id.length - 1);

            //this.AlloyDbService.getTrack(id).then(function (result) {
            //    this.Backend.debug("getArtistDetails result")
            //    this.Backend.debug(result)

            //    if (result) {

            //       

            //        $('#artistInfo').html(source.artist);
            //        $('#artistInfo').attr("href", source.artistUrl);
            //        $('#trackInfo').html(source.title);
            //        $('#trackInfo').attr("href", source.albumUrl);

            //        if (source.starred) {
            //            $("#likeButtonIcon").removeClass('star-o');
            //            $("#likeButtonIcon").addClass('star');
            //        } else {
            //            $("#likeButtonIcon").removeClass('star');
            //            $("#likeButtonIcon").addClass('star-o');
            //        }

            //        this.togglePlayPause();




            //        $('#nowPlayingImageHolder').attr('src', result.smallImageUrl);
            //    }
            //});
          }
        }
      );
      this.startProgressTimer();
      this.remoteConfigured = true;
    }
    if (this.remotePlayerConnected()) {
      if (this.MediaElement.playing) {
        this.shouldSeek = true;
        this.prePlannedSeek = this.MediaElement.currentTime;
        this.MediaElement.pause();
        this.loadTrack(this.selectedIndex);
      }
    }

  }

  setupLocalPlayer() {
    this.stopProgressTimer();
    this.remoteConfigured = false;
  }

  checkIfNowPlaying(track) {
    var selected = this.selectedTrack();
    if (selected && track) {
      return track.id === selected.id;
    }
    return false;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MediaPlayer;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 282 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);



/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('app.factories', []));

/***/ }),
/* 283 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ApplicationConfig;
function ApplicationConfig($routeProvider, $locationProvider) {
  "ngInject";
  // adding a new route requires that route to also be added to backend/routes/index.js
  // this allows the variables to be passed when navigating directly to that page instead of linking to that page. 
  $routeProvider.when('/', {
    template: '<home/>',
  }).when('/fresh', {
    template: '<fresh/>',
  }).when('/status', {
    template: '<status/>',
  }).when('/index', {
    template: '<index/>',
  }).when('/starred', {
    template: '<starred/>',
  }).when('/playlist', {
    template: '<playlist/>',
  }).when('/playlists', {
    template: '<playlists/>',
  }).when('/genres', {
    template: '<genres/>',
  }).when('/genre/:id', {
    template: '<genre/>',
  }).when('/podcasts', {
    template: '<podcasts/>',
  }).when('/playing', {
    template: '<playing/>',
  }).when('/config', {
    template: '<config/>',
  }).when('/config/:id', {
    template: '<config/>'
  }).when('/activity', {
    template: '<activity/>',
  }).when('/activity/:id', {
    template: '<activity/>'
  }).when('/artists', {
    template: '<artists/>',
  }).when('/artist/:id', {
    template: '<artist/>',
  }).when('/albums', {
    template: '<albums/>',
  }).when('/album/:id', {
    template: '<album/>',
  }).when('/album/:id/:trackid', {
    template: '<album/>',
  })
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  }).hashPrefix('');
}

/***/ }),
/* 284 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (immutable) */ __webpack_exports__["a"] = ApplicationRun;


function ApplicationRun($window, $rootScope, $location, $timeout, Backend, MediaPlayer, AppUtilities) {
  "ngInject";
  Backend.debug('starting application');
  $rootScope.settings = [];
  $rootScope.scrollPos = {};

  $rootScope.$on('$routeChangeStart', function () {
    $rootScope.okSaveScroll = false;
  });

  $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
    $timeout(function () { // wait for DOM, then restore scroll position
      $('#mainContentBody').scrollTop($rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0);
      $rootScope.okSaveScroll = true;
    }, 0);
    AppUtilities.broadcast('windowResized');
  });

  document.addEventListener('scroll', function (event) {
    if ($rootScope.okSaveScroll) {
      $rootScope.scrollPos[$location.path()] = $('#mainContentBody').scrollTop();
    }
  }, true);

  $rootScope.scrollClear = function (path) {
    $rootScope.scrollPos[path] = 0;
  }

  var windowResized = AppUtilities.debounce(function () {
    AppUtilities.broadcast('windowResized');
  }, 25);

  $(window).on('resize', windowResized);

  $window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key === 32) {
      e.preventDefault();
    }
  }

  $window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key === 32) {
      e.preventDefault();
      MediaPlayer.toggleCurrentStatus();
    }
  }

  //$window.onbeforeunload = function () {
  //  return "Are you sure to leave this page?";
  //}

  $timeout(function () {
    Backend.debug('loading settings');
    Backend.emit('load_settings', 'alloydb_settings');
    Backend.emit('load_settings', 'sabnzbd_settings');

    setTimeout(() => {
      if (MediaPlayer.castStatus()) {
        Backend.debug('cast status true, initialize cast');
        MediaPlayer.initializeCast();
      }
    }, 1000);
  });
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ })
],[57]);
//# sourceMappingURL=app.js.map