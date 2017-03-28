var CONSTANTS = require('./../constants');

angular.module(CONSTANTS.MAP_DIRECTIVE).config(['$stateProvider', 'MAP_CONFIG', function($stateProvider, MAP_CONFIG) {
  var mapStateConfig = {
    url: '/map'
  };

  if (MAP_CONFIG.viewId) {
    mapStateConfig.views = {};
    mapStateConfig.views[MAP_CONFIG.viewId] = {
      controller: 'MapController as ctrl',
      templateProvider: function($timeout, $templateCache) {
        return $templateCache.get('wfm-template/workorder-map.tpl.html');
      }
    };
  } else {
    mapStateConfig.controller = 'MapController as ctrl';
    mapStateConfig.templateProvider = function($timeout, $templateCache) {
      return $templateCache.get('wfm-template/workorder-map.tpl.html');
    };
  }

  mapStateConfig.data = MAP_CONFIG.data;

  $stateProvider.state('app.map', mapStateConfig);
}]);

