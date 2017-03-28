'use strict';
var CONSTANTS = require('./constants');


module.exports = function(config) {
  config = config || {};

  angular.module(CONSTANTS.MAP_MODULE_ID, [
    require('./mediator-service'),
    require('./map')(config)
  ]).constant("MAP_CONFIG",config);

  return CONSTANTS.MAP_MODULE_ID;
};
