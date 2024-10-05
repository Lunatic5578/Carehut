function initMap() {}
document.addEventListener("DOMContentLoaded", () => {
  // var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
  // var mapOptions = {
  //   zoom: 4,
  //   center: myLatlng
  // }
  // var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // var marker = new google.maps.Marker({
  //     position: myLatlng,
  //     title:"Hello World!"
  // });

  // // To add the marker to the map, call setMap();
  // marker.setMap(map);

  // initMap();
  // now it IS a function and it is in global

  let tabledata="";
  
    
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // const image = {
  //   url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
  //   // This marker is 20 pixels wide by 32 pixels high.
  //   size: new google.maps.Size(25, 37),
  //   // The origin for this image is (0, 0).
  //   origin: new google.maps.Point(0, 0),
  //   // The anchor for this image is the base of the flagpole at (0, 32).
  //   anchor: new google.maps.Point(0, 32),
  // };

  function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    
    var map;
    var service;
    var infowindow;
    console.log(lat, long);

    //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    function createMarker(place) {
      if (!place.geometry || !place.geometry.location) {console.log("error"); return; }
    
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        //icon:image
      });
    
      google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
      });
    }

    function initialize() {
      var locat = new google.maps.LatLng(lat, long);

      map = new google.maps.Map(document.getElementById("map"), {
        center: locat,
        zoom: 13,
      });
      
      var request = {
        location: locat,
        radius: 1000,
        query: ['pet keeping'],
        // type:'adoption'
      };

      

      service = new google.maps.places.PlacesService(map);
      service.textSearch(request, callback);

      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          
          for (var i = 0; i < results.length-10; i++) {
            var place = results[i];
            createMarker(results[i]);
            console.log(place);
            console.log(place.name);
            console.log(place.formatted_address);
            if(place.rating<=3)
            {
              console.log("Unrated");
            }
            else
            {
              console.log(place.rating);
            }
            tabledata+=`<tr>
                <td>${place.name}</td>
                <td>${place.formatted_address}</td>
                <td>${place.rating}</td>
                <td><a href="https://maps.google.com/?q=${place.name}" target="_blank" rel="noopener noreferrer">Tap to view on map</a></td>`  
                //
                document.querySelector("#table_body").innerHTML=tabledata;
                
            // function geocode(){
            //   var loc=place.formatted_address
            //   axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            //     params:{
            //       address:loc,
            //       key:'AIzaSyANO6HdP-yB52q2s4pk6SvD1UYFJuleVCo'
            //     }
            //   }).then(function(response){
            //     //console.log(response);
            //     latit=(response.data.results[0].geometry.location.lat)
            //     longit=(response.data.results[0].geometry.location.lng)
                
            //     console.log(latit,longit)
                
                
                
            //   })
              
            //    .catch(function(error){
            //      console.log('error in geocoding');
            //    })
            // }
            
          
            // geocode()
          }
          var marker = new google.maps.Marker({
            position: locat,
            scale:2,
            // icon: iconBase + 'info_maps.png'
          });
          // To add the marker to the map, call setMap();
          marker.setMap(map);
          
        }
      }
    }
    initialize();
  }


  getLocation();
  
});
