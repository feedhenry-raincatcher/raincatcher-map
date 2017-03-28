/*globals inject*/
const CONSTANTS = require('../lib/constants');

var angular = require('angular');
require('angular-mocks');

var Promise = require('promise');
var sinon = require('sinon');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var initMapDirectiveModule = require('./initMapDirectiveModule');

describe('Map Controller',function() {
  var self = {};
  var sampleData = [{
    id: 'Lot of Work',
    description: 'Should be done'
  },{
    id: 'Some',
    description: 'Should not'
  }];

  before(function() {
    initMapDirectiveModule();
    require('../lib/map/controller');
  });
  beforeEach(angular.mock.module(CONSTANTS.MAP_DIRECTIVE));

  beforeEach(inject(function(_$controller_) {
    self.$controller = _$controller_;
  }));

  it('Should set controller values',inject(function($rootScope) {
    var mediatorSpy = sinon.spy();
    var $scope = $rootScope.$new();
    var promise = Promise.resolve(sampleData);
    var listWorkordersStub = sinon.stub().returns(promise);
    var mapMediatorServiceMock = {
      listWorkorders: listWorkordersStub
    };
    self.$controller('MapController',{$scope : $scope, mediator: mediatorSpy, mapMediatorService: mapMediatorServiceMock});
    expect($scope.workorders).to.eventually.equal(sampleData);
    sinon.assert.calledOnce(listWorkordersStub);
  }));


});
