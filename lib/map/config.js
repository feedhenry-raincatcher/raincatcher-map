var CONSTANTS = require('../constants');

module.exports = function(config) {
  var CONFIG_NAME = 'MAP_CONFIG';
  angular.module(CONSTANTS.MAP_CONFIG).constant(CONFIG_NAME,config);
  return [CONFIG_NAME,CONSTANTS.MAP_CONFIG].join(".");
};