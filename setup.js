
var exec = require('child_process').exec;
var ArgumentParser = require('argparse').ArgumentParser;
var path = require('path');
var npm = require('npm');


function load() {
  return new Promise((resolve, reject) => {
    npm.load(path.join(__dirname, "package.json"), function (er) {
      if (er) reject(er);
      else resolve();
    });
  });
};

function launchBrowser() {
  setTimeout(() => {
    require('opn')('http://localhost:' + process.env.PORT);
  }, 5000);
}

function processFonts() {
  return new Promise((resolve, reject) => {
    var icfPath = path.join(__dirname, 'node_modules', 'icon-font-generator', 'bin', 'icon-font-generator');
    var iconsSrcPath = path.join(__dirname, 'common', 'icons', '*.svg');
    var iconsDstPath = path.join(__dirname, 'frontend', 'styles', 'fonts');
    exec("node " + icfPath + " " + iconsSrcPath + " -n alloyicons --normalize --html false -j false -o " + iconsDstPath, function callback(error, stdout, stderr) {
      if (error) reject(error);
      if (stdout) {
        console.log(stdout);
        resolve();
      }
      if (stderr) reject(error);
    });
  });
};

function buildApp() {
  npm.commands.run(['build'], (err, data) => {
    if (err) console.log(err);
    console.log(data);
  });
}

function runFullApp() {
  npm.commands.run(['prod'], (err, data) => {
    if (err) console.log(err);
    console.log(data);
  });
  launchBrowser();
}

function runUiOnly() {
  npm.commands.run(['prod_ui_only'], (err, data) => {
    if (err) console.log(err);
    console.log(data);
  });
  launchBrowser();
}

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Alloy setup.js helper'
});

parser.addArgument(
  ['-u', '--ui'],
  {
    action: 'storeTrue',
    help: 'runs the full UI frontend application for connecting to a remote database'
  }
);
parser.addArgument(
  ['-r', '--run'],
  {
    action: 'storeTrue',
    help: 'runs the full UI frontend application and database server'
  }
);
parser.addArgument(
  ['-f', '--fonts'],
  {
    action: 'storeTrue',
    help: 'rebuilds just the fonts'
  }
);
parser.addArgument(
  ['-b', '--build'],
  {
    action: 'storeTrue',
    help: 'builds the resources'
  }
);
parser.addArgument(
  ['-i', '--install'],
  {
    action: 'storeTrue',
    help: 'includes build, installs and builds'
  }
);
parser.addArgument(
  ['-p', '--port'],
  {
    defaultValue: 3000,
    type: 'int',
    action: 'store',
    help: 'Port used for the UI server backend'
  }
);
parser.addArgument(
  ['-a', '--api-port'],
  {
    defaultValue: 4000,
    type: 'int',
    action: 'store',
    help: 'Port used for the AlloyDB backend database'
  }
);

var args = parser.parseArgs();

process.env.MODE = "prod";
process.env.PORT = args.port;
process.env.API_PORT = args.api_port;


load().then(() => {
  if (args.ui === true) {
    runUiOnly();
  } else if (args.run === true) {
    runFullApp();
  }
  else if (args.fonts === true) {
    processFonts();
  }
  else if (args.build === true) {
    processFonts().then(() => {
      buildApp();
    });
  }
  else if (args.install === true) {
    npm.commands.install([], function (er, data) {
      if (er) console.log(er);
      processFonts().then(() => {
        buildApp();
      });
    });
  }
});

console.dir(args);

