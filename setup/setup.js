var opn = require("opn");
var npm = require("npm");
var path = require("path");
var exec = require("child_process").exec;
var ArgumentParser = require("argparse").ArgumentParser;

//required for deps script to pick up
require("cross-env");


// packages 
var webuiPackage = path.join(__dirname, "..", "webui");
var apiPackage = path.join(__dirname, "..", "api");
var allPacks = [webuiPackage, apiPackage];

function load(json) {
  return new Promise((resolve, reject) => {
    npm.load(json, function (er) {
      if (er) { reject(er); }
      else {
        console.log("loaded " + json);
        resolve();
      }
    });
  });
}

function runCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, {
      cwd: cwd
    }, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve(stdout);
    });
  });

}

function npmInstall(dir) {
  return new Promise((resolve, reject) => {
    runCommand("npm install", dir);
  });
}

function npmRun(command, dir) {
  return new Promise((resolve, reject) => {
    runCommand("npm run " + command, dir).then(() => { resolve(); });
  });
}

function npmPrune(dir) {
  return new Promise((resolve, reject) => {
    runCommand("npm prune", dir);
  });
}

function buildWebUi() {
  return new Promise((resolve, reject) => {
    npmRun("build", webuiPackage).then(() => {
      resolve();
    });
  });
}

function launchBrowser() {
  setTimeout(() => {
    opn("http://localhost:" + process.env.PORT);
  }, 5000);
}

function buildIcons() {
  return new Promise((resolve, reject) => {
    console.log("building icons for " + webuiPackage);
    npmRun("icons", webuiPackage).then(() => {
      resolve();
    });
  });
}

function buildAlloyDb() {
  return new Promise((resolve, reject) => {
    console.log("building alloyDB installer, this will take some time");
    npmRun("dist", apiPackage).then(() => {
      resolve();
    });
  });
}

function runUiOnly() {
  return new Promise((resolve, reject) => {
    runCommand("npm start", webuiPackage);
    launchBrowser();
  });
}

function runFullApp() {
  return new Promise((resolve, reject) => {
    runCommand("npm start", webuiPackage);
    runCommand("npm start", apiPackage);
    launchBrowser();
  });
}

var parser = new ArgumentParser({
  version: "0.0.1",
  addHelp: true,
  description: "Alloy setup.js helper"
});

parser.addArgument(
  ["-u", "--ui"],
  {
    action: "storeTrue",
    help: "runs the full UI frontend application for connecting to a remote database"
  }
);
parser.addArgument(
  ["-r", "--run"],
  {
    action: "storeTrue",
    help: "runs the full UI frontend application and database server"
  }
);
parser.addArgument(
  ["-f", "--fonts"],
  {
    action: "storeTrue",
    help: "rebuilds just the fonts"
  }
);
parser.addArgument(
  ["-b", "--build"],
  {
    action: "storeTrue",
    help: "builds the resources"
  }
);
parser.addArgument(
  ["-i", "--install"],
  {
    action: "storeTrue",
    help: "includes build, installs and builds"
  }
);
parser.addArgument(
  ["-p", "--port"],
  {
    defaultValue: 3000,
    type: "int",
    action: "store",
    help: "Port used for the UI server backend"
  }
);
parser.addArgument(
  ["-a", "--api-port"],
  {
    defaultValue: 4000,
    type: "int",
    action: "store",
    help: "Port used for the AlloyDB backend database"
  }
);

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

var args = parser.parseArgs();

process.env.MODE = "prod";
process.env.PORT = args.port;
process.env.API_PORT = args.api_port;


if (args.ui === true) {
  runUiOnly();
} else if (args.run === true) {
  runFullApp();
}
else if (args.fonts === true) {
  buildIcons();
}
else if (args.build === true) {
  buildIcons().then(() => {
    console.log("Finished Icons");
    buildWebUi().then(() => {
      console.log("Finished Webpack");
      buildAlloyDb().then(() => {
        console.log("Finished AlloyDB");
        console.log("Run api\\dist\\alloydb Setup.exe to install");
      });
    });
  });
}


else if (args.i === true || args.install === true) {
  allPacks.forEach((pack) => {
    console.log("Running NPM Install for " + pack);
    npmInstall(pack).then(() => {
      console.log("NPM Install Complete");
    });
  });
}