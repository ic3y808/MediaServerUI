var socket = null;

module.exports.connect = function (host) {
  socket = require("socket.io-client")(host);
  socket.on("connect", function () {
    console.log("connected to host");
  });
  socket.on("event", function (data) { });
  socket.on("disconnect", function () { });
};


module.exports.callback = {};

module.exports.log = function (obj) {
  if(socket){
    socket.emit("log", obj);
  }
};

module.exports.debug = function (label, message) {
  var obj = {};
  obj.level = "debug";
  obj.label = label;
  obj.message = message;
  module.exports.log(obj);
};

module.exports.info = function (label, message) {
  var obj = {};
  obj.level = "info";
  obj.label = label;
  obj.message = message;
  module.exports.log(obj);
};

module.exports.error = function (label, err) {
  if (typeof (err) === "string") {
    var obj = {};
    obj.level = "error";
    obj.label = label;
    obj.message = err;
    module.exports.log(obj);
  } else {
    var obj1 = {};
    obj1.level = "error";
    obj1.label = label;
    obj1.message = err.message;
    var obj2 = {};
    obj2.level = "error";
    obj2.label = label;
    obj2.message = err.stack;
    module.exports.log(obj1);
    module.exports.log(obj2);
  }
};