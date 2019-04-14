const got = require("got");
var log = require("../../../../../common/logger");


class Musicbrainz {
  // Get server version.
  version() {
<<<<<<< HEAD
    return this.cmd("version").then((r) => r.version);
=======
    return this.cmd("version").then((r ) => r.version);
>>>>>>> master
  }

  // Perform command request.
  cmd(command, args) {
    // Build url for request.
    let url = this.url + "?" + qs.stringify({
      mode: command,
      apikey: this.apiKey,
      output: "json"
    });

    // Tack on any passed arguments
    if (args) {
      url += "&" + qs.stringify(args);
    }

    log.debug("alloyui", "Retrieving url `" + url + "`");

    // Perform request.
    return got(url, {
      json: true
    }).then((res) => res.body);
  }

}

// Allow for class to be called with or without `new` keyword,
// to maintain backward compatibility.
module.exports = new Proxy(Musicbrainz, {
  apply(target, thisArg, argumentsList) {
    return new target(...argumentsList);
  }
});