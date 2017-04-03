const CONSTANTS = require('../lib/constants');
var angular = require('angular');

module.exports = function() {
  try {
    angular.module(CONSTANTS.MAP_SERVICE);
  }  catch (e) {
    angular.module(CONSTANTS.MAP_SERVICE,[]);
  }
};