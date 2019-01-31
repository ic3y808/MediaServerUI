module.exports.toHumanReadable = function toHumanReadable(val) {
  var thresh = 1000;
  if (Math.abs(val) < thresh) {
    val = val + ' B';
  } else {
    var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var u = -1;
    do {
      val /= thresh;
      ++u;
    } while (Math.abs(val) >= thresh && u < units.length - 1);
    val = val.toFixed(1) + ' ' + units[u];
  }
  return val;
}