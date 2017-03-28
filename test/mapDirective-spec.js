/*globals inject*/
var CONSTANTS = require('../lib/constants');
var initMapDirectiveModule = require('./initMapDirectiveModule');

var angular = require('angular');
require('angular-mocks');

var sinon = require('sinon');
var chai = require('chai');

var expect = chai.expect;

describe("Map Directive", function() {

  var self = {};
  var locations = {
    Trencin: [48.891132, 18.042297],
    Bali: [-8.650000, 115.216667],
    Brno: [49.195060, 16.606837]
  };

  var MapServiceMock;

  before(function() {
    initMapDirectiveModule();
    require('../lib/map/directive');
  });

  function mapControllerMock($scope) {
    var self = this;
    $scope.workorders = [];
    self.updateWorkorders = function(value) {
      $scope.workorders = value;
    };
  }

  function initDirective() {

    MapServiceMock = {
      initMap: sinon.spy(),
      resizeMap: sinon.spy(),
      findParent: sinon.spy(),
      addMarkers: sinon.spy()
    };
    angular.module(CONSTANTS.MAP_CONFIG,[]);
    angular.mock.module(CONSTANTS.MAP_DIRECTIVE, function($provide, $controllerProvider) {
      $provide.value('MapService', MapServiceMock);
      $provide.value('MAP_CONFIG',{});
      $controllerProvider.register('MapController', mapControllerMock);
    });
    var element = '<workorder-map container-selector="directiveData"></workorder-map>';
    inject(function($rootScope, $compile) {
      self.scope = $rootScope.$new(false);
      self.element = $compile(element)(self.scope);
      self.scope.$digest();
      self.mapController = self.element.scope().mapCtrl;
    });
  }

  beforeEach(initDirective);

  it('Should contain only one div element', function() {
    expect(self.element.find('div').length).to.equal(1);
    expect(self.element.find('div').attr('id')).to.equal("gmap_canvas");
  });

  it('Should be initialized from MapService',function() {
    sinon.assert.calledOnce(MapServiceMock.initMap);
  });

  it('Should add markers from MapService after updating workorders',function() {
    MapServiceMock.addMarkers.reset();
    var newWorkorders = [{
      description: 'Hello I am a workorder',
      location: locations.Trencin
    },{
      description: 'And I am too',
      location: locations.Bali
    },{
      description: 'If you like us, work too',
      location: locations.Brno
    }];
    self.mapController.updateWorkorders(newWorkorders);
    self.scope.$apply();
    sinon.assert.calledOnce(MapServiceMock.addMarkers);
  });



});