//var map;
function getAddress() {

  <!-- First lets get the Post Code and House -->
  var postcode  = document.getElementById("postcode").value;
  var house     = document.getElementById("house").value;

  <!-- Clear out the output address fields
  clearAddressFields();
  // for (var i = 0; i < 7; ++i) {
  //   var k = "addr" + i;
  //   var l = '""' + k + '""';
  //     document.getElementById(k).value = '';
  // }

  <!-- Next we want to build the get address string or we may be able to include the values within it! -->
  var addressURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + postcode + "+" + house + "&key=AIzaSyD4l-4g4Xj_qj1BolwxMRovvh8QzdeOpQp";

  //if (house) {
      //var addressURL = "https://api.getAddress.io/find/" + postcode + "/" + house + "?api-key=whmMTD4eQke25M9EQvAbEA9708"
  //} else {
      //var addressURL = "https://api.getAddress.io/find/" + postcode + "?api-key=whmMTD4eQke25M9EQvAbEA9708"
  //};

  <!-- Now lets call the getAddress API -->
  var xhttp = new XMLHttpRequest();

  <!-- Ok tried to find free address finder but all limited time or daily allowance              -->
  <!-- so used the google map API to proivde an approximate address based on address & post code -->
  //xhttp.open("GET", "https://api.getAddress.io/find/sw1a2aa?api-key=whmMTD4eQke25M9EQvAbEA9708", false);
  //xhttp.open("GET", "http://api.postcodes.io/postcodes/%20BR1%204BN", false);
  //xhttp.open("POST", "https://maps.googleapis.com/maps/api/geocode/json?address=BR14BN+59+Farnaby&key=AIzaSyD4l-4g4Xj_qj1BolwxMRovvh8QzdeOpQp", false);
  //xhttp.setRequestHeader("Content-type", "application/json"); //json defined in URL so this line gave me an error
  xhttp.open("GET", addressURL, false);
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);

  <!-- Did we get a valid address and location back? -->
  if (response.status === "OK") {
    // Unpack the address details and assign to address fields

    <!-- Set Location Longitude & Latidue -->
    document.getElementById("Longitude").value = response.results[0].geometry.location.lng;
    document.getElementById("latitude").value = response.results[0].geometry.location.lat;

    <!-- Show locaiton on Map -->
    var pos = {
      lat: response.results[0].geometry.location.lat,
      lng: response.results[0].geometry.location.lng
    };
    showMap(pos);

    <!-- Output Address fields
    for (var i = 0; i < response.results[0].address_components.length; i++) {

      var k = "addr" + i;
      var elementExists = document.getElementById(k);

      if (elementExists) {
      // if (i < 7) {
      //  var k = "addr" + i;

        //console.log(i);
        //console.log(k);

        document.getElementById(k).value = response.results[0].address_components[i].long_name;
      } else {
        // @TODO Didn't consider address_components could be longer than 6 fields! HTML fields only hold 6 lines!
        //       Could add dynamic fields into DOM would be a good exercise, consider impact of UX on screen fields

        // var elementExists = document.getElementById(k);
        // if (elementExists) {

        // } else {
          var k2 = "addr" + (i - 1);
          var newElement2 = document.getElementById(k2).cloneNode(true);
          newElement2.setAttribute('id', k);

          document.getElementById('addrLine').appendChild(newElement2);
          document.getElementById('addrLine').appendChild(document.createElement("br"));
          document.getElementById(k).value = response.results[0].address_components[i].long_name;
        // }
      }

      console.log(i);
      console.log(k);

    }

  } else {
    // @TODO Add good error message!
    alert("Unable to establish location Address... Try another");
    return; // exit getAddress function
  }



}

function showMap(pos) {
// Has map and infoWindow been initialised?

  if (pos){

    if (map){
    } else {
      map = new google.maps.Map(document.getElementById('map'), {
      //   // center: {
      //   //   lat: response.results[0].geometry.location.lat,
      //   //   lng: response.results[0].geometry.location.lng
      //   // },
      //   zoom: 15,
      //   Position: pos,
      //   //Content: 'You are here'
      });
    }

    if (infoWindow) {

    } else {
        infoWindow = new google.maps.InfoWindow;
    }

    // map.setPosition(pos);
    map.setZoom(15);
    map.setCenter(pos);
    infoWindow.setPosition(pos);
    infoWindow.setContent('Address Location Found');
    infoWindow.open(map);


  } else {


    // @TODO think about default currently Auz perhaps just zoom out
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 2
    });

    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);
        map.setZoom(10);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Current Location');
        infoWindow.open(map);
      });
    };

  }

}

function clearAddressFields() {
  // Clear out all the address line fields
  // Can we simply loop around the addrLine children?
  var child = document.getElementById('addrLine');

  for (i=0; i<child.childElementCount; i++){
    var childValue = document.getElementById(child.children[i].id); //.value = "";
        if (childValue) {
          console.log(childValue.value);
          childValue.value = "";
        }
  }
}
