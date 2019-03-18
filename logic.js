// Store API endpoint inside queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryURL, function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3>`
      + `<hr><p>${new Date(feature.properties.time)}</p>` + 
      `<hr><p>${feature.properties.mag}</p>`)
  }

  // var geojsonMarkerOptions = {
  //   radius: feature.properties.mag,
  //   fillColor: "#ff7800",
  //   color: "#000",
  //   weight: 1,
  //   opacity: 1,
  //   fillOpacity: 0.8
  // };

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      
        var color = "";
        var colors = ["#008000","#9ACD32","#FFF000","#FFA500","#FF4500","#FF0000"]
        var magnitude = feature.properties.mag
        if (magnitude > 5) {
          color = colors[5];
        }
        else if (magnitude > 4 && magnitude < 5) {
          color = colors[4];
        }
        else if (magnitude > 3 && magnitude < 4) {
          color = colors[3];
        }
        else if (magnitude > 2 && magnitude < 3) {
          color = colors[2];
        }
        else if (magnitude > 1 && magnitude < 2) {
          color = colors[1];
        }
        else {
          color = colors[0];
        }

      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
  }
  });

  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function() {
  //   var div = L.DomUtil.create("div", "info legend");
  //   var limits = 
  // }

  createMap(earthquakes);
}

// function getColor(d) {
//   return d > 5 ? '#008000' :
//          d > 4 ? '#9ACD32' :
//          d > 3 ? '#FFF000' :
//          d > 2 ? '#FFA500' :
//          d > 1 ? '#FF4500' :
//                     '#FF0000';
// }

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  console.log(myMap)
  function getColor(d) {
    return d > 5 ? '#FF0000' :
          d > 4 ? '#FF4500':
          d > 3 ? '#FFA500':
          d > 2 ? '#FFF000':
          d > 1 ? '#9ACD32':
                    '#008000';
  }

  var legend = L.control({ });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var labels = [];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        labels.push(
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
        )
      
    }
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    console.log(div)
    return div;
  };
  
  console.log(legend)
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  console.log(myMap)
  legend.addTo(myMap);
}