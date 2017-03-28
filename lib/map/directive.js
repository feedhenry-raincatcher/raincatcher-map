var CONSTANTS = require('../constants');

angular.module(CONSTANTS.MAP_DIRECTIVE,[CONSTANTS.MAP_CONFIG]).directive('workorderMap',MapDirective);

MapDirective.$inject = ['MapService','MAP_CONFIG','$window','$document','$timeout'];

function MapDirective(MapService,MAP_CONFIG,$window, $document, $timeout) {
  function linker(scope, element) {
    var map = MapService.initMap(element, MAP_CONFIG.center || [49.27, -123.08]);
    scope.$watch(function(scope) {
      return scope.workorders;
    }, function(workorders) {
      MapService.addMarkers(map, element, workorders);
    }, true);

    var parent = MapService.findParent($document[0],element[0], scope.containerSelector);
    var resizeListener = function() {
      MapService.resizeMap(element, parent);
    };
    $timeout(resizeListener);
    angular.element($window).on('resize', resizeListener); // TODO: throttle this
    scope.$on('$destroy', function() {
      angular.element($window).off('resize', resizeListener);
    });
  }

  return {
    restrict: 'E',
    template: '<div id="gmap_canvas"></div>',
    controller: 'MapController',
    controllerAs: 'mapCtrl',
    link: linker
  };
}

module.exports = CONSTANTS.MAP_DIRECTIVE;