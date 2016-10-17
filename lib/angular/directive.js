'use strict';

var ngModule = angular.module('wfm.map.directives', ['wfm.core.mediator']);
module.exports = 'wfm.map.directives';

require('../../dist');

ngModule.directive('workorderMap', function($templateCache, mediator, $window, $document, $timeout) {
  function initMap(element, center) {
    var myOptions = {
      zoom:14,
      center:new google.maps.LatLng(center[0], center[1]),
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

  function addWorkorderMarkers(map, workorders) {
    workorders.forEach(function(workorder) {
      if (workorder.location) {
        var lat = workorder.location[0];
        var long = workorder.location[1];
        var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(lat, long)});
        var infowindow = new google.maps.InfoWindow({content:'<strong>Workorder #'+workorder.id+'</strong><br>'+workorder.address+'<br>'});
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });
      }
    });
  }

  /**
   * Function for adding worker markers to the map in addition to work order markers.
   * @param {object} map     - The map to add worker markers to.
   * @param {Array}  workers - An array of user object describing the workers.
   */
  function addUserMarkers(map, workers) {
    //If there are no workers, then there is no need to add any worker markers on the map.
    if (!workers) {
      return;
    }

    workers.forEach(function(worker) {

      //There is no guarantee that a worker will have a location. (e.g. a new worker has been added but has never logged into an app before.)
      if (worker.location) {
        var lat = worker.location.latitude;
        var long = worker.location.longitude;
        var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(lat, long)});
        //Using a different color marker to easily separate workers from work orders
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

        //Displaying the username and ID when the marker is clicked
        var infowindow = new google.maps.InfoWindow({content:'<strong>Worker #'+worker.id+'</strong><br>'+worker.name+'<br>'});

        //Whenever the marker is clicked, display the user data added above.
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
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
    template: $templateCache.get('wfm-template/workorder-map.tpl.html'),
    scope: {
      list: '=',
      center: '=',
      workorders: '=',
      //Added to display worker locations in addition to work orders.
      workers: '=',
      containerSelector: '@'
    },
    link: function(scope, element) {
      var map = initMap(element, scope.center || [49.27, -123.08]);

      //Adding markers for work orders
      addWorkorderMarkers(map, scope.workorders);

      //Adding map markers for users.
      addUserMarkers(map, scope.workers);

      var parent = findParent($document[0], element[0], scope.containerSelector);
      var resizeListener = function() {
        resizeMap(element, parent);
      };
      $timeout(resizeListener);
      angular.element($window).on('resize', resizeListener); // TODO: throttle this
      scope.$on('$destroy', function() {
        angular.element($window).off('resize', resizeListener);
      });
    },
    controller: function() {
    },
    controllerAs: 'ctrl'
  };
});
