var CONSTANTS = require('./../constants');
const CONTROLLER_NAME = "MapController";

  /**
   *
   * Controller for displaying Workorders on a Map
   *
   * @param {Mediator} mediator
   * @param {MapMediatorService} mapMediatorService
   * @constructor
   */
function MapController($scope, mediator, mapMediatorService) {
  $scope.workorders = mapMediatorService.listWorkorders();
}

angular.module(CONSTANTS.MAP_DIRECTIVE).controller(CONTROLLER_NAME, ['$scope', 'mediator', 'mapMediatorService', MapController]);

module.exports = [CONSTANTS.MAP_DIRECTIVE,CONTROLLER_NAME].join(".");