var CONSTANTS = require('../lib/angular/constants');
var initMapDirectiveModule = require('./initMapDirectiveModule');

var angular = require('angular');
require('angular-mocks');

var sinon = require('sinon');
var chai = require('chai');

var expect = chai.expect;

describe("Map Directive", function() {

  var self = {};
  var LatLngSpy = sinon.spy();
  var MapSpy = sinon.spy();
  var MarkerSpy= sinon.spy();
  var InfoWindowSpy = sinon.spy();
  var addListenerSpy = sinon.spy();

  var locations = {
    Trencin: [48.891132, 18.042297],
    Bali: [-8.650000, 115.216667],
    Brno: [49.195060, 16.606837]
  };

  before(function() {
    initMapDirectiveModule();
    require('../lib/angular/directive')();
  });

  function mapControllerMock($scope) {
    var self = this;
    $scope.workorders = [];
    self.updateWorkorders = function(value) {
      $scope.workorders = value;
    };
  }

  function initDirective() {
    angular.module('wfm.core.mediator', []);
    angular.mock.module(CONSTANTS.MAP_DIRECTIVE, function($provide, $controllerProvider) {
      $provide.value('mediator', {});
      $controllerProvider.register('MapController', mapControllerMock);
    });
    window.google = {
      maps: {
        LatLng: LatLngSpy,
        MapTypeId:{
          ROADMAP: {}
        },
        Map: MapSpy,
        Marker: MarkerSpy,
        InfoWindow: InfoWindowSpy,
        event: {
          addListener: addListenerSpy
        }
      }
    };
    var element = '<workorder-map container-selector="directiveData"></workorder-map>';
    inject(function($rootScope, $compile) {
      self.scope = $rootScope.$new(false);
      self.scope.directiveData = {};
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

  it('Should be initialized correctly',function() {
    sinon.assert.called(LatLngSpy);
    sinon.assert.called(MapSpy);
  });

  it('Should not set markers and info window on init',function() {
    sinon.assert.notCalled(MarkerSpy);
    sinon.assert.notCalled(InfoWindowSpy);
  });

  it('Should trigger markers,info window and addListener after updating workorders',function() {

        //Resetting call count because each is called during initialization
    MarkerSpy.reset();
    InfoWindowSpy.reset();

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
        //This has to be triggered manually to fire watchers
    self.scope.$apply();

    sinon.assert.callCount(MarkerSpy,newWorkorders.length);
    sinon.assert.callCount(InfoWindowSpy,newWorkorders.length);
    sinon.assert.callCount(addListenerSpy,newWorkorders.length);
  });
});