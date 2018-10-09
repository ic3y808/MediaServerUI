'use strict';

const path = require('path');
const camelCase = require('lodash.camelcase');
const capitalize = require('./capitalize');

module.exports = function (input) {
  this.cacheable();

  var isComponent = path.basename(this.resourcePath).indexOf('component');
  if (isComponent > -1) {
    const fileName = path.basename(this.resourcePath, '.component.js');
    // The name of the controller that we want to hot reload
    const controllerName = `${capitalize(camelCase(fileName))}Controller`;
    // The name of the corresponding component
    const directiveName = camelCase(fileName);

    return input + `
    
    // check for hot module support
    if (module.hot) {
      // accept changes
      module.hot.accept();
      // get controller instance
      const name = ${controllerName}.name;
      // don't do anything if the directive is not printed
      const doc = angular.element(document.body);
      const injector = doc.injector();
      if (injector) {
        const directive = injector.get('${directiveName}Directive')[0];
        if (directive) {
          const origin = directive.controller;
          const target = ${controllerName}.prototype;
          for(var k in target){
            origin[k]=target[k];
            origin.prototype[k]=target[k];
          }
          angular.element(document).find('html').scope().$apply();
          console.info('Hot Swapped ' + name);
        }
      }
    }
  `;
  }
  return input;
};