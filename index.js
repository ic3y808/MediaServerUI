var nodemon = require('nodemon');
var path = require('path');

var isDev = process.env.DEV === true;
console.log('Is In Development: ' + isDev);
// We only want to run the workflow when not in production
if(isDev){
// We require the bundler inside the if block because
// it is only needed in a development environment.
var bundle = require('./bundler.js');
bundle();
} 
require('./backend/www.js');
//nodemon({
//  execMap: {
//    js: 'node'
//  },
//  script: path.join(__dirname, './backend/www.js'),
//  ignore: [],
//  watch: !isProduction ? ['./backend/*'] : false,
//  ext: 'js'
//}).on('restart', function() {
//  console.log('Backend restarted!');
//});