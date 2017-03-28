/*globals inject */
var initMapServiceModule = require('./initMapServiceModule');
var CONSTANTS = require('../lib/constants');

var angular = require('angular');
require('angular-mocks');
var Promise = require('bluebird');

var sinon = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');

sinonStubPromise(sinon);

var chai = require('chai');
chai.should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('Map Mediator Service',function() {
  var mapMediatorService;
  var mediator = {};
  var topicGeneratorMock = {
    mediator: mediator
  };

  function initModuleDependencies() {
    angular.module('wfm.core.mediator',[]);
    angular.mock.module(CONSTANTS.MAP_SERVICE,function($provide) {
      $provide.value('mediator',mediator);
    });
  }

  var retrieveMapMediatorService = inject(function(_MapMediatorService_) {
    mapMediatorService = _MapMediatorService_;
  });

  before(function() {
    initMapServiceModule();
    require('../lib/mediator-service');
  });

  beforeEach(initModuleDependencies);

  beforeEach(retrieveMapMediatorService);

  describe("#getErrorAndDoneTopicPromises",function() {

    var topicName = "topic";
    var errorTopicPrefix = "error";
    var doneTopicPrefix = "done";

    var doneTopic = [doneTopicPrefix,topicName].join(".");
    var errorTopic = [errorTopicPrefix,topicName].join(".");

    var doneMessage = "I was resolved successfully :)";
    var errorMessage = "I was rejected :(";


    function setUpGetTopicMock() {
      topicGeneratorMock.getTopic = sinon.stub();
      topicGeneratorMock.getTopic.withArgs(topicName,errorTopicPrefix).returns(errorTopic);
      topicGeneratorMock.getTopic.withArgs(topicName,doneTopicPrefix).returns(doneTopic);
      mediator.promise = sinon.stub();
    }

    beforeEach(setUpGetTopicMock);

    it('Should resolve done topic promise',function() {
      var doneTopicPromise = Promise.resolve(doneMessage).delay(500);
      var errorTopicPromise = Promise.resolve(errorMessage).delay(2000);
      mediator.promise.withArgs(doneTopic).returns(doneTopicPromise);
      mediator.promise.withArgs(errorTopic).returns(errorTopicPromise);
      return expect(mapMediatorService.getErrorAndDoneTopicPromises(topicGeneratorMock,topicName)).to.eventually.equal(doneMessage);
    });

    it('Should reject error topic promise',function() {
      var errorTopicPromise = Promise.resolve(errorMessage);
      mediator.promise.withArgs(doneTopic).returns(Promise.delay(500));
      mediator.promise.withArgs(errorTopic).returns(errorTopicPromise);
      return expect(mapMediatorService.getErrorAndDoneTopicPromises(topicGeneratorMock,topicName)).to.eventually.be.rejectedWith(errorMessage);
    });

    it('Should reject due to timeout',function() {
      CONSTANTS.TOPIC_TIMEOUT = 1000;
      var timeout = CONSTANTS.TOPIC_TIMEOUT + 500;
      mediator.promise.withArgs(doneTopic).returns(Promise.delay(timeout));
      mediator.promise.withArgs(errorTopic).returns(Promise.delay(timeout));
      return expect(mapMediatorService.getErrorAndDoneTopicPromises(topicGeneratorMock,topicName)).to.eventually.be.rejected;
    });
  });

  describe("#listWorkorders",function() {

    const workorders = [{
      id: 1,
      name: 'Step 1',
      description: 'Get the ring'
    },{
      id: 2,
      name: 'Step 2',
      description: 'Create a group of friends, called "Fellowship of the Ring"'
    },{
      id: 3,
      name: 'Step 3',
      description: 'Piss of Boromir and leave the group behind.'
    },{
      id: 4,
      name: 'Step 4',
      description: 'Let them fight in two greatest wars the world has ever seen'
    },{
      id: 5,
      name: 'Final Chapter',
      description: 'Get gold and be famous'
    }];


    function setUp() {
      mediator.publish = sinon.spy();
      mapMediatorService.getErrorAndDoneTopicPromises = sinon.stub().returnsPromise();
    }

    beforeEach(setUp);

    it('Should resolve workorders',function() {
      mapMediatorService.getErrorAndDoneTopicPromises.resolves(workorders);
      expect(mapMediatorService.listWorkorders()).to.eventually.equal(workorders);
      return sinon.assert.calledOnce(mediator.publish);
    });
  });

});