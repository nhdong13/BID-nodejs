const KEY = "AIzaSyAdyl3LLS1O2wBG5ALz8ETkJ8YphC7ogsk";
const API = "https://maps.googleapis.com/maps/api/distancematrix/";
const OUPUTFORMAT = "json";
var distance = require("google-distance-matrix");

export function callAPI(address1, address2) {
    let origins = [address1];
    let destinations = [address2];

    var result;

    distance.key(KEY);
    distance.matrix(origins, destinations, function (err, distances) {
      if (err) {
          return console.log(err);
      }
      if(!distances) {
          return console.log('no distances');
      }
      if (distances.status == 'OK') {
          for (var i=0; i < origins.length; i++) {
              for (var j = 0; j < destinations.length; j++) {
                  var origin = distances.origin_addresses[i];
                  var destination = distances.destination_addresses[j];
                  if (distances.rows[0].elements[j].status == 'OK') {
                      var distance = distances.rows[i].elements[j].distance.text;
                      console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                  } else {
                      console.log(destination + ' is not reachable by land from ' + origin);
                  }
              }
          }
      }
  });
    // distance.matrix(origins, destinations, function(err, distances) {
    //     if (!err) {
    //         result = distances.rows[0].elements[0].distance.text;
    //         console.log("distance API " + result);
    //         return result;
    //     } else {
    //       return 0;
    //     }
    // });
}
