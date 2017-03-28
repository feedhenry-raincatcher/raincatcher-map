/*globals inject window*/

var initMapServiceModule = require('./initMapServiceModule');
var CONSTANTS = require('../lib/constants');

var angular = require('angular');
require('angular-mocks');

var sinon = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');

sinonStubPromise(sinon);

var chai = require('chai');
chai.should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('Map Service',function() {
  var mapService;
  var LatLngSpy = sinon.spy();
  var MapSpy = sinon.spy();
  var MarkerSpy= sinon.spy();
  var InfoWindowSpy = sinon.spy();
  var addListenerSpy = sinon.spy();

  var element = angular.element('<div></div>');

  before(function() {
    initMapServiceModule();
    require('../lib/map/map-service')();
  });

  function initMapService() {
    angular.module(CONSTANTS.MAP_CONFIG,[]);
    angular.mock.module(CONSTANTS.MAP_DIRECTIVE,function($provide) {
      $provide.value('MAP_CONFIG',{});
    });
    inject(function(_MapService_) {
      mapService = _MapService_;
    });
    window.google = {
      maps: {
        LatLng: LatLngSpy,
        MapTypeId: {
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
  }

  beforeEach(initMapService);

  describe("#initMap",function() {
    var center = [49.27, -123.08];
    it('Should be initialized correctly',function() {
      mapService.initMap(element,center);
      sinon.assert.called(LatLngSpy);
      sinon.assert.called(MapSpy);
    });
    it('Should not set markers and info window on init',function() {
      mapService.initMap(element,center);
      sinon.assert.notCalled(MarkerSpy);
      sinon.assert.notCalled(InfoWindowSpy);
    });
  });

  describe("#addMarkers",function() {
    var locations = {
      Trencin: [48.891132, 18.042297],
      Bali: [-8.650000, 115.216667],
      Brno: [49.195060, 16.606837]
    };

    it('Should trigger markers,info window and addListener',function() {

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
      mapService.addMarkers({},element,newWorkorders);
      sinon.assert.callCount(MarkerSpy,newWorkorders.length);
      sinon.assert.callCount(InfoWindowSpy,newWorkorders.length);
      sinon.assert.callCount(addListenerSpy,newWorkorders.length);
    });

  });

});