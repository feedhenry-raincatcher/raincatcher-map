module.exports = function(config) {
  require('./controller');
  require('./map-service');
  require('./config')(config);
  require('./directive');
  require('./route');
};
