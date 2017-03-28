var CONSTANTS = require('./constants');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');
var q = require('q');

/**
 *
 * Getting Promises for done and error topics.
 * This will resolve or reject the returned promise depending on the topic published.
 *
 * @param doneTopicPromise  - A promise for the done topic.
 * @param errorTopicPromise - A promise for the error topic.
 * @returns {Promise}
 */
function getTopicPromises(doneTopicPromise, errorTopicPromise) {
  var deferred = q.defer();

  doneTopicPromise.then(function(createdWorkorder) {
    deferred.resolve(createdWorkorder);
  });

  errorTopicPromise.then(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
}

/**
 *
 * A mediator service that will publish and subscribe to topics to be able to render data.
 *
 * @param {Mediator} mediator
 * @constructor
 */
function MapMediatorService(mediator) {
  this.mediator = mediator;

  this.workordersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKORDER_ENTITY_NAME);
}

/**
 *
 * Getting Promises for the done and error topics.
 *
 * @param {MediatorTopicUtility} topicGenerator
 * @param {string} topicName   - The name of the topic to generate
 * @param {string} [topicUid]  - A topic UID if required.
 * @returns {Promise} - A promise for the topic.
 */
MapMediatorService.prototype.getErrorAndDoneTopicPromises = function getErrorAndDoneTopicPromises(topicGenerator, topicName, topicUid) {
  var doneTopic = topicGenerator.getTopic(topicName, CONSTANTS.DONE_PREFIX, topicUid);
  var errorTopic = topicGenerator.getTopic(topicName, CONSTANTS.ERROR_PREFIX, topicUid);

  var doneTopicPromise = topicGenerator.mediator.promise(doneTopic);
  var errorTopicPromise = topicGenerator.mediator.promise(errorTopic);

  var timeoutDefer = q.defer();

  setTimeout(function() {
    timeoutDefer.reject(new Error("Timeout For Topic: " + doneTopic));
  }, CONSTANTS.TOPIC_TIMEOUT);

  //Either one of these promises resolves/rejects or it will time out.
  return q.race([getTopicPromises(doneTopicPromise, errorTopicPromise), timeoutDefer.promise]);
};

/**
 *
 * Listing all workorders
 *
 * @returns {Promise}
 */
MapMediatorService.prototype.listWorkorders = function listWorkorders() {
  var promise = this.getErrorAndDoneTopicPromises(this.workordersTopics, CONSTANTS.TOPICS.LIST);

  this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.LIST));

  return promise;
};

angular.module(CONSTANTS.MAP_SERVICE, ['wfm.core.mediator']).service("MapMediatorService", ['mediator', function(mediator) {
  return new MapMediatorService(mediator);
}]);

module.exports = CONSTANTS.MAP_SERVICE;