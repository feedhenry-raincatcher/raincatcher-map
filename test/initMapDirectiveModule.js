/**
 * Created by spriadka on 3/13/17.
 */
const CONSTANTS = require('../lib/angular/constants');
var angular = require('angular');

module.exports = function initMapDirectiveModule() {
  try {
    angular.module(CONSTANTS.MAP_DIRECTIVE);
  }    catch (exception) {
    angular.module(CONSTANTS.MAP_DIRECTIVE, []);
  }
};

