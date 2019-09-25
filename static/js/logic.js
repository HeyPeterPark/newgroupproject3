var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});


const map = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 11.5,
  // layers: [
  //   layers.ONE, 
  //   layers.TWO, 
  //   layers.THREE, 
  //   layers.FOUR, 
  //   layers.FIVE, 
  //   layers.SIX, 
  //   layers.SEVEN, 
  //   layers.EIGHT, 
  //   layers.NINE
  // ]
});

var layers = {
  ONE: new L.LayerGroup(), 
  TWO: new L.LayerGroup(), 
  THREE: new L.LayerGroup(), 
  FOUR: new L.LayerGroup(), 
  FIVE: new L.LayerGroup(), 
  SIX: new L.LayerGroup(), 
  SEVEN: new L.LayerGroup(), 
  EIGHT: new L.LayerGroup(), 
  NINE: new L.LayerGroup()
}

var overlays = {
    '<$50': layers.ONE, 
    '$51-$100': layers.TWO, 
    '$101-$150': layers.THREE, 
    '$151-$200': layers.FOUR, 
    '$200-$300': layers.FIVE, 
    '$300-$400': layers.SIX, 
    '$400-$500': layers.SEVEN, 
    '$500-$1,000': layers.EIGHT, 
    '$1,000+': layers.NINE
};

lightmap.addTo(map);

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

const link = "static/data/chicago.geojson";
const list = "static/data/listings.json";
const list_aug = "static/data/listings_aug.json";

// function chooseColor(neighbourhood) {
//   switch (neighbourhood) {
//   case "Near West Side":
//     return "yellow";
//   case "Lincoln Square":
//     return "red";
//   case "New City":
//     return "orange";
//   case "South Deering":
//     return "dark green";
//   case "Ashburn":
//     return "purple";
//   case "Ohare":
//     return "pink";
//   default:
//     return "blue";
//   }
// }

d3.json(list_aug).then(function(data) {
  var coord = data.features
  for (var i = 0; i < 20; i++) {
  // for (var i = 0; i < coord.length; i++) {
    var newMarker = L.marker([coord[i].latitude, coord[i].longitude])
    newMarker.addTo(map);
  }
})

function scaleGreenRed(avgPrice) {
  r = avgPrice < 50 ? 255 : Math.floor(255-(avgPrice * 2-100)*255/100);
  g = avgPrice > 50 ? 255 : Math.floor((avgPrice * 2) * 255/100);
  return 'rgb(' + r +',' + g + ',0)';
}

d3.json(link).then(function(data) {
  L.geoJson(data, {
    style: function() {
      return {
        color: "gray",
        // fillColor: 'blue',
        fillOpacity: .1,
        opacity: .5,
        dashArray: '3',
        weight: 1.5,
      };
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.3
          });
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.2
          });
        // },
        // click: function(event) {
        //   map.fitBounds(event.target.getBounds(), {padding: [100, 100]})
        //   .panTo(event.target.getCenter());
        }
      });
      layer.bindPopup("<h1>" + feature.properties.neighbourhood + "</h1> <hr> <h2>" + 'average cost' + "</h2>");
    }
  }).addTo(map);
}).catch(function(error) {
  console.log(error);
});

L.control.layers(null, overlays).addTo(map);



// // Create an overlays object to add to the layer control
// var overlays = {
//   "Coming Soon": layers.COMING_SOON,
//   "Empty Stations": layers.EMPTY,
//   "Low Stations": layers.LOW,
//   "Healthy Stations": layers.NORMAL,
//   "Out of Order": layers.OUT_OF_ORDER
// };

// // Create a control for our layers, add our overlay layers to it
// L.control.layers(null, overlays).addTo(map);

// // Create a legend to display information about our map
// var info = L.control({
//   position: "bottomright"
// });

// // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//   var div = L.DomUtil.create("div", "legend");
//   return div;
// };
// // Add the info legend to the map
// info.addTo(map);

// // Initialize an object containing icons for each layer group
// var icons = {
//   COMING_SOON: L.ExtraMarkers.icon({
//     icon: "ion-settings",
//     iconColor: "white",
//     markerColor: "yellow",
//     shape: "star"
//   }),
//   EMPTY: L.ExtraMarkers.icon({
//     icon: "ion-android-bicycle",
//     iconColor: "white",
//     markerColor: "red",
//     shape: "circle"
//   }),
//   OUT_OF_ORDER: L.ExtraMarkers.icon({
//     icon: "ion-minus-circled",
//     iconColor: "white",
//     markerColor: "blue-dark",
//     shape: "penta"
//   }),
//   LOW: L.ExtraMarkers.icon({
//     icon: "ion-android-bicycle",
//     iconColor: "white",
//     markerColor: "orange",
//     shape: "circle"
//   }),
//   NORMAL: L.ExtraMarkers.icon({
//     icon: "ion-android-bicycle",
//     iconColor: "white",
//     markerColor: "green",
//     shape: "circle"
//   })
// };

// // Perform an API call to the Citi Bike Station Information endpoint
// d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", function(infoRes) {

//   // When the first API call is complete, perform another call to the Citi Bike Station Status endpoint
//   d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json", function(statusRes) {
//     var updatedAt = infoRes.last_updated;
//     var stationStatus = statusRes.data.stations;
//     var stationInfo = infoRes.data.stations;

//     // Create an object to keep of the number of markers in each layer
//     var stationCount = {
//       COMING_SOON: 0,
//       EMPTY: 0,
//       LOW: 0,
//       NORMAL: 0,
//       OUT_OF_ORDER: 0
//     };

//     // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
//     var stationStatusCode;

//     // Loop through the stations (they're the same size and have partially matching data)
//     for (var i = 0; i < stationInfo.length; i++) {

//       // Create a new station object with properties of both station objects
//       var station = Object.assign({}, stationInfo[i], stationStatus[i]);
//       // If a station is listed but not installed, it's coming soon
//       if (!station.is_installed) {
//         stationStatusCode = "COMING_SOON";
//       }
//       // If a station has no bikes available, it's empty
//       else if (!station.num_bikes_available) {
//         stationStatusCode = "EMPTY";
//       }
//       // If a station is installed but isn't renting, it's out of order
//       else if (station.is_installed && !station.is_renting) {
//         stationStatusCode = "OUT_OF_ORDER";
//       }
//       // If a station has less than 5 bikes, it's status is low
//       else if (station.num_bikes_available < 5) {
//         stationStatusCode = "LOW";
//       }
//       // Otherwise the station is normal
//       else {
//         stationStatusCode = "NORMAL";
//       }

//       // Update the station count
//       stationCount[stationStatusCode]++;
//       // Create a new marker with the appropriate icon and coordinates
//       var newMarker = L.marker([station.lat, station.lon], {
//         icon: icons[stationStatusCode]
//       });

//       // Add the new marker to the appropriate layer
//       newMarker.addTo(layers[stationStatusCode]);

//       // Bind a popup to the marker that will  display on click. This will be rendered as HTML
//       newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
//     }

//     // Call the updateLegend function, which will... update the legend!
//     updateLegend(updatedAt, stationCount);
//   });
// });

// // Update the legend's innerHTML with the last updated time and station count
// function updateLegend(time, stationCount) {
//   document.querySelector(".legend").innerHTML = [
//     "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//     "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
//     "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
//     "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//     "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//     "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
//   ].join("");
// }
