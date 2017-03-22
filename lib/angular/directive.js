'use strict';
var CONSTANTS = require('./constants');

module.exports = function(config) {
  config = config || {};
  config.adminMode = config.mode === CONSTANTS.MODES.ADMIN;
  angular.module(CONSTANTS.MAP_DIRECTIVE, ['wfm.core.mediator'])
    .directive('workorderMap', function(mediator, $window, $document, $timeout) {
      function initMap(element, center) {
        var myOptions = {
          zoom: config.zoom || 14,
          center: new google.maps.LatLng(center[0], center[1]),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(element[0].querySelector('#gmap_canvas'), myOptions);
        return map;
      }

      function resizeMap(element, parent) {
        var mapElement = element[0].querySelector('#gmap_canvas');
        var height = parent.clientHeight;
        var width = parent.clientWidth;
        mapElement.style.height = height + 'px';
        mapElement.style.width = width + 'px';

        console.log('Map dimensions:', width, height);
        google.maps.event.trigger(mapElement, 'resize');
      }

      function addMarkers(map, element, workorders) {
        if (Object.prototype.toString.call(workorders) !== '[object Array]') {
          return;
        }
        workorders.forEach(function(workorder) {
          if (workorder.location) {
            var lat = workorder.location[0];
            var long = workorder.location[1];
            var marker = new google.maps.Marker({
              map: map,
              position: new google.maps.LatLng(lat, long)
            });
            var infowindow = new google.maps.InfoWindow({content: '<strong>Workorder #' + workorder.id + '</strong><br>' + workorder.address + '<br>'});
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });
          }
        });
      }

      function findParent(document, element, selector) {
        if (!selector) {
          return element.parentElement;
        }
        var matches = document.querySelectorAll(selector);
        var parent = element.parentElement;
        while (parent) {
          var isParentMatch = Array.prototype.some.call(matches, function(_match) {
            return parent === _match;
          });
          if (isParentMatch) {
            break;
          }
          parent = parent.parentElement;
          console.log('parent', parent);
        }
        return parent || element.parentElement;
      }

      return {
        restrict: 'E',
        template: '<div id=\'gmap_canvas\'></div>',
                /*scope: {
                 containerSelector: '@'
                 },*/
        controller: 'MapController',
        controllerAs: 'mapCtrl',
        link: function(scope, element) {
          var map = initMap(element, config.center || [49.27, -123.08]);
          scope.$watch(function(scope) {
            return scope.workorders;
          }, function(workorders) {
            addMarkers(map, element, workorders);
          }, true);

          var parent = findParent($document[0], element[0], scope.containerSelector);
          var resizeListener = function() {
            resizeMap(element, parent);
          };
          $timeout(resizeListener);
          angular.element($window).on('resize', resizeListener); // TODO: throttle this
          scope.$on('$destroy', function() {
            angular.element($window).off('resize', resizeListener);
          });
        }
      };
    });

  angular.module(CONSTANTS.MAP_DIRECTIVE).constant('MAP_CONFIG', config);

    //require('../../dist');
  require('./controller');
    //require('./route');
  return CONSTANTS.MAP_DIRECTIVE;
};