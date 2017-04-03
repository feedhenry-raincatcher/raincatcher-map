var CONSTANTS = require('../constants');

function MapService(config) {
  this.config = config || {};
}

MapService.prototype.initMap =  function initMap(element, center) {
  var myOptions = {
    zoom: this.config.zoom || 14,
    center: new google.maps.LatLng(center[0], center[1]),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  return new google.maps.Map(element[0].querySelector('#gmap_canvas'), myOptions);
};

MapService.prototype.resizeMap = function resizeMap(element, parent) {
  var mapElement = element[0].querySelector('#gmap_canvas');
  var height = parent.clientHeight;
  var width = parent.clientWidth;
  mapElement.style.height = height + 'px';
  mapElement.style.width = width + 'px';

  console.log('Map dimensions:', width, height);
  google.maps.event.trigger(mapElement, 'resize');
};

MapService.prototype.addMarkers = function addMarkers(map, element, workorders) {
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
};

MapService.prototype.findParent = function findParent(document, element, selector) {
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
};

module.exports = function() {
  var MAP_SERVICE_NAME = "MapService";
  angular.module(CONSTANTS.MAP_DIRECTIVE,[CONSTANTS.MAP_CONFIG]).service(MAP_SERVICE_NAME,function(MAP_CONFIG) {
    return new MapService(MAP_CONFIG);
  });
  return [CONSTANTS.MAP_SERVICE,MAP_SERVICE_NAME].join(".");
};
