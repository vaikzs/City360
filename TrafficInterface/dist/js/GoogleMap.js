
//Initializing Google Maps onto the page

	//we define here the style of the map
	var styles= [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];


var mapGoogle;
var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
var infowindow = new google.maps.InfoWindow();

var initialize = function() {
    geocoder = new google.maps.Geocoder();

  var mapOptions = {
    zoom: 10,
    center: sanFrancisco,
    mapType: 'roadmap',
      styles : styles
      
  }
  
  mapGoogle = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
   
   setInterval(function(){$('.overlay').remove()},2000);
 google.maps.event.addListener(mapGoogle, 'click', function(event) {
   
     var latlngStr = (event.latLng).toString().split(',',2);
     var lat = parseFloat(latlngStr[0]);
  var lng = parseFloat(latlngStr[1]);
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': event.latLng}, function(results, status) {
      console.log(latlng);
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        marker = new google.maps.Marker({
            position: latlng,
            map: mapGoogle
        });
          console.log(lat + lng);
            //Nokia maps link data 
             $.getJSON('../Mti_Final_Proj/NewNokia.php?lat='+event.latLng.A.toString()+'&long='+event.latLng.F.toString(),function(data){
             
                console.log(data.Response.Link[0].Address.Street);
                 
                 $.getJSON('../Mti_Final_Proj/here_flow_to_json.php?start_date='+$('#input-from').val()+" 00:00:00"+'&end_date='+$('#input-to').val()+" 00:00:00"+"&street="+data.Response.Link[0].Address.Street,function(data){
                 
                        
                 console.log(data);
                 
                 
                 });
                    //chartFunction();
             
             });     
          
        //infowindow.setContent(results[1].formatted_address);
        //infowindow.open(mapGoogle, marker);
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
     
     
     
     
     
  });

    
    
}


function toggleBounce(marker) {

  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}



google.maps.event.addDomListener(window, 'load', initialize);





