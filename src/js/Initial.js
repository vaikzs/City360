var securityToken = '';
var serverPath = '';
var imageOverlay = '';
var div = '';
var markersEventful, markersInrix, markersCameras;
var clickTrafficLayer = true;
var geocodeControlLayer = false;
var populatedMarkers = [];
var RADIUS = 950;

var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
    opacity: 1,
    weight: 1,
    fillOpacity: 0.1,
    color: '#DD2C00'
});
/*
 Geocoding search for locations, example pan to New york
 */




/*
 On click traffic layer
 */


map.on('dragstart dragend viewreset', function () {
    removetrafficflow();
    trafficLayer();
});
$("#traffic-flow").click(function () {
    if ($(this).prop('checked')) {
        removetrafficflow();
        trafficLayer();
        map.legendControl.addLegend(document.getElementById('legend').innerHTML);

    }
    else {

        removetrafficflow();
        map.removeEventListener('dragstart dragend viewreset');
        map.removeLayer(baseOutdoors);
        baseOutdoors.addTo(map);
        map.legendControl.removeLegend(document.getElementById('legend').innerHTML);


    }
});
var reloadTrafficLayer = function () {
    removetrafficflow();
    trafficLayer();
}
/*
 On right click bring up search for all events nearby within the radius
 */
var arrow = false;
var arrowFunc = function () {
    if (arrow === false) {
        $('#arrow').animate({left: '330px'});
        $('#arrow').html("<i class='material-icons'>keyboard_arrow_left</i>");
        $('#listings').animate({
            opacity: 1
        });
        arrow = true;
    }
    else {
        $('#listings').animate({
            opacity: 0
        });
        $('#arrow').animate({
            left: '-12px'
        });
        $('#arrow').html("<i class='material-icons'>keyboard_arrow_right</i>");
        arrow = false;
    }

};
var sidebar_out = function () {
    $('#arrow').animate({left: '330px'});
    $('#arrow').html("<i class='material-icons'>keyboard_arrow_left</i>");
    $('#listings').animate({
        opacity: 1
    });
    arrow = true;

    $('#listings').html($('#listings').html());

}
$('#arrow').click(arrowFunc);
$('.preloader-wrapper').hide();

var refreshsummarylist = function(){

    $('.inrix-count,.eventful-count,.camera-count').html("0");
    $('.event-item').remove();
};
map.on('dblclick', function (e) {
    refreshsummarylist();
    $('.welcome-message').hide();
    sidebar_out();

    $('.events-title,#events,#incidents,#cameras').show();
    eventMarkersLayer(e);
    trafficCamera(e);


});
map.on('contextmenu', function (e) {
    //twitter(e);
    //roadLinks511(e);
    events311(e);

});
// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function (e) {
    map.fitBounds(e.bounds);
    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Your locality!',
            'marker-color': '#26c6da',
            'marker-symbol': 'star'
        }
    });
    myLayer.openPopup();

});

map.on('click',function(e){
    arrow = true;
    arrowFunc();

});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function () {
    geolocate.innerHTML = 'Position could not be found';
});
markersEventful = new L.MarkerClusterGroup({animateAddingMarkers:true});
markersInrix = new L.MarkerClusterGroup({animateAddingMarkers:true});

var eventMarkersLayer = function (e) {

    filterCircle.addTo(map);
    if (map.getZoom() === 12) {
        map.removeLayer(filterCircle);
        filterCircle.setRadius(1200);
    }
    filterCircle.setLatLng(e.latlng);
    map.addLayer(filterCircle);
    $.ajax({
        url: "http://api.eventful.com/json/events/search?location=San+Francisco&app_key=NfVrh5tMK93fRG9x&date=This Week&q=all&callback=?",
        dataType: "json",
    }).done(function (data) {
        console.log("Event data" + data)
        var count = 0;
        for (var i = 0; i < data.events.event.length; i++) {

            var markerEF = L.marker(new L.LatLng(data.events.event[i].latitude, data.events.event[i].longitude), {
                icon: L.mapbox.marker.icon({'marker-symbol': "theatre", 'marker-color': "#6200ea", 'marker-size': 'large'}),
                title: 'Eventful'
            });

            if (e.latlng.distanceTo(L.latLng(data.events.event[i].latitude.toString(), data.events.event[i].longitude.toString())) < RADIUS) {
                count = count + 1;
                markerEF.bindPopup('<b>Title</b> : ' + data.events.event[i].title + '<br> <b>Venue</b> : ' + data.events.event[i].venue_address + '<br> <b>Cityname</b>: ' + data.events.event[i].city_name + ' <br> <b>Starttime</b>:  ' + data.events.event[i].start_time + ' <br> <b>Endtime</b>:  ' + data.events.event[i].stop_time);
                markersEventful.addLayer(markerEF);


                $('#events').after('<li style="margin:2%;" class="card-panel event-item white"><div class="collapsible-header"  onclick="map.setView([' + data.events.event[i].latitude.toString() + ', ' + data.events.event[i].longitude.toString() + '], 16); reloadTrafficLayer();"><i class="material-icons center-align teal-text right">explore</i><h6 style="padding:10%" class="">' + data.events.event[i].title.trim() + '</h6></div></li>');


                markerEF.on('mouseover', function (e) {
                    this.openPopup();

                });
                markerEF.on('mouseout', function (e) {
                    this.closePopup();
                });
                $('.eventful-count').html(count);
            }
            else {
                markersEventful.removeLayer(markerEF);
            }


        }
        map.addLayer(markersEventful);
        markersEventful.on('clusterclick', function (a) {
            reloadTrafficLayer();

        });

    });

    $.ajax({
        url: "http://na.api.inrix.com/traffic/inrix.ashx?action=getsecuritytoken&VendorID=1808895794&ConsumerID=ce1f424d-fb48-43d3-a4b8-999c0c9d913e",
        dataType: "xml"
    }).done(function (data) {
        securityToken = data.getElementsByTagName("AuthToken")[0].textContent;
        serverPath = data.getElementsByTagName("ServerPath")[0].textContent;
        $.ajax({
            url: 'http://na.api.inrix.com/traffic/inrix.ashx?Action=GetIncidentsInRadius&Token=' + securityToken + '&Radius=5&Center=' + e.latlng.lat.toString() + '|' + e.latlng.lng.toString() + '&LocRefmethod=XD,TMC&IncidentOutputFields=All',
            dataType: "xml"
        }).done(function (xml) {

            var arr = xml.getElementsByTagName("Incident");
            var count = 0;
            for (var j = 0; j < arr.length; j++) {

                var title = arr[j].getElementsByTagName("ParameterizedDescription")[0];
                var lat = arr[j].getAttribute("latitude");
                var long = arr[j].getAttribute("longitude");
                var marker = L.marker(new L.LatLng(lat, long), {
                    icon: L.mapbox.marker.icon({'marker-symbol': "roadblock", 'marker-size': 'large',"marker-color":"#ff1744"}),
                    title: 'Inrix'
                });

		console.log(title.getElementsByTagName("EventText")[0].innerHTML)
                if (e.latlng.distanceTo(L.latLng(arr[j].getAttribute("latitude"), arr[j].getAttribute("longitude"))) < RADIUS) {
                    count = count + 1;
                    marker.bindPopup('<b>Title</b> : ' + title.getElementsByTagName("EventText")[0].innerHTML +'<br><b>Location</b> : ' +title.getElementsByTagName("RoadName")[0].innerHTML);
                    markersInrix.addLayer(marker);
                    $('#incidents').after('<li style="margin:2%;" class="card-panel event-item white"><div class="collapsible-header row"  onclick="map.setView([' + arr[j].getAttribute("latitude") + ', ' + arr[j].getAttribute("longitude") + '], 16);reloadTrafficLayer();"><i class="material-icons teal-text center-align right">explore</i><h6 style="padding: 10%" class="">' + title.getElementsByTagName("EventText")[0].innerHTML + '</h6></div></li>');
                    marker.on('mouseover', function (e) {
                        this.openPopup();
                    });
                    marker.on('mouseout', function (e) {
                        this.closePopup();
                    });


                }
                else {
                    markersInrix.removeLayer(marker);

                }


            }
            $('.inrix-count').html(count);
            map.addLayer(markersInrix);
            markersInrix.on('clusterclick', function (a) {
                reloadTrafficLayer();
            });


        });

    });


}
markersCameras = new L.MarkerClusterGroup({animateAddingMarkers:true});
var trafficCamera = function (e) {

    $.ajax({
        url: "http://na.api.inrix.com/traffic/inrix.ashx?action=getsecuritytoken&VendorID=1808895794&ConsumerID=ce1f424d-fb48-43d3-a4b8-999c0c9d913e",
        dataType: "xml"
    }).done(function (data) {
        securityToken = data.getElementsByTagName("AuthToken")[0].textContent;
        serverPath = data.getElementsByTagName("ServerPath")[0].textContent;
        $.ajax({
            url: 'http://na.api.inrix.com/traffic/inrix.ashx?Action=GetTrafficCamerasInRadius&Token=' + securityToken + '&Radius=5&Center=' + e.latlng.lat.toString() + '|' + e.latlng.lng.toString(),
            dataType: "xml"
        }).done(function (xml) {
            var point = xml.getElementsByTagName("Point");
            var cam = xml.getElementsByTagName("Camera");
            var count = 0;
            for (var j = 0; j < cam.length; j++) {
                var title = cam[j].getElementsByTagName("Name");
                var cameraId = cam[j].getAttribute("id");
                var lat = cam[j].getElementsByTagName("Point")[0].attributes[0].value;
                var long = cam[j].getElementsByTagName("Point")[0].attributes[1].value;
                var marker = L.marker(L.latLng(lat, long), {
                    icon: L.mapbox.marker.icon({'marker-symbol': "camera", 'marker-size': 'large','marker-color':'#1de9b6'}),
                    title: 'Inrix traffic cameras'
                });

                var strll = lat + "-" + long;
                if (e.latlng.distanceTo(L.latLng(lat, long)) < RADIUS && $.inArray(strll, populatedMarkers) === -1) {
                    count = count + 1;
                    populatedMarkers.push(strll);
                    //Open dash to give image details
                    var urlstr = 'http://na.api.inrix.com/traffic/inrix.ashx?Action=GetTrafficCameraImage&Token=' + securityToken + '&CameraID=' + cameraId + '&DesiredWidth=640&DesiredHeight=480';
                    marker.bindPopup('<b>Title</b> : ' + title[0].textContent + '<br> <b>Camera ID</b> : ' + cameraId);
                    $('#cameras').after('<li style="margin:2%;" class="card-panel event-item white"><div  id="' + cameraId + '" class="collapsible-header "  onclick="map.setView([' + lat + ', ' + long + '], 16);reloadTrafficLayer();"><i class="teal-text center-align right material-icons">explore</i>' + title[0].textContent + '</div><div class="collapsible-body"><img class="" src=' + urlstr + ' width="100%" height="200px"></div></li>');

                    $('#' + cameraId).click(function () {
                        //map.panTo([40.748817, -73.985428], {});

                    });
                    marker.on('click', function (e) {

                        this.openPopup();


                    });

                    var newCamID = cameraId;
                    marker.on('click', function (e) {

                    });
                    marker.on('dblclick', function (e) {
                        this.closePopup();
                    });
                    markersCameras.addLayer(marker);

                } else {
                    markersCameras.removeLayer(marker);
                }
            }
            $('.camera-count').html(count);
            map.addLayer(markersCameras);

            markersCameras.on('clusterclick', function (a) {
                reloadTrafficLayer();
            });


        });

    });


}
var roadLinks511 = function (e) {

    markersRoads = new L.MarkerClusterGroup();
    $.ajax({
        url: 'http://sonicbanana.cs.wright.edu/phpmyadmin/Mti_Final_Proj/New511.php?callback=json',
        dataType: "json"
    }).done(function (data) {


        for (var i = 0; i < data.length; i++) {
            var lat = data[i].startlat.toString();
            var long = data[i].startlong.toString();
            var latend = data[i].endlat.toString();
            var longend = data[i].endlong.toString();
            var linkid = data[i].linkid.toString();

            if (e.latlng.distanceTo(L.latLng(lat, long)) < RADIUS && e.latlng.distanceTo(L.latLng(latend, longend)) < RADIUS) {
                $.ajax({
                    url: 'https://api.mapbox.com/v4/directions/mapbox.driving/' + long + ',' + lat + ';' + long + ',' + latend + '.json?access_token=pk.eyJ1IjoidmFpa3VudGhzcmlkaGFyYW4iLCJhIjoiY2locHR0amczMDQyeXRzbTRrYmcwc3JjciJ9.74473_3r6w8k9P0-dg_cwA&geometry=geojson',
                    dataType: "json"
                }).done(function (data) {


                    var origin = L.mapbox.featureLayer(data.origin, {
                        pointToLayer: function (feature, latlon) {
                            // L.circleMarker() draws a circle with fixed radius in pixels.
                            // To draw a circle overlay with a radius in meters, use L.circle()
                            return L.marker(latlon, {
                                icon: L.mapbox.marker.icon({
                                    'marker-symbol': "o",
                                    'marker-size': 'small',
                                    'marker-color': '#5E35B1'
                                }),
                                title: '511 road links'
                            });
                        }
                    });
                    origin.addTo(map);
                    origin.bindPopup("Origin");
                    origin.on('mouseover', function (e) {
                        this.openPopup();
                    });
                    var desti = L.mapbox.featureLayer(data.destination, {
                        pointToLayer: function (feature, latlon) {
                            // L.circleMarker() draws a circle with fixed radius in pixels.
                            // To draw a circle overlay with a radius in meters, use L.circle()
                            return L.marker(latlon, {
                                icon: L.mapbox.marker.icon({
                                    'marker-symbol': "d",
                                    'marker-size': 'small',
                                    'marker-color': '#D50000'
                                }),
                                title: '511 road links'
                            });
                        }
                    });
                    desti.addTo(map);
                    desti.bindPopup("Destination");
                    desti.on('mouseover', function (e) {
                        this.openPopup();
                    });

                    var featureLayer = L.mapbox.featureLayer(data.routes[0].geometry, {

                        pointToLayer: function (feature, latlon) {
                            // L.circleMarker() draws a circle with fixed radius in pixels.
                            // To draw a circle overlay with a radius in meters, use L.circle()
                            console.log(feature);
                            return L.marker(latlon, {
                                icon: L.mapbox.marker.icon({
                                    'marker-symbol': "d",
                                    'marker-size': 'small',
                                    'marker-color': '#D50000'
                                }),
                                title: '511 road links'
                            });
                        }
                    });

                    featureLayer.addTo(map);
                    featureLayer.eachLayer(function (layer) {
                        // See the `.bindPopup` documentation for full details. This
                        // dataset has a property called `name`: your dataset might not,
                        // so inspect it and customize to taste.
                        layer.bindPopup("haha");
                    });
                    featureLayer.bindPopup(linkid);
                    featureLayer.on('mouseover', function (e) {

                        map.eachLayer(function (layer) {
                            if (layer !== baseLight && layer !== baseEmerald && layer !== baseStyle && layer !== baseStreet && layer !== baseDark && layer !== baseOutdoors && layer !== baseSatellite && layer !== markersEventful && layer !== markersInrix && layer !== filterCircle && layer !== markersCameras) {
                                map.removeLayer(layer);
                            }
                        });
                        origin.addTo(map);
                        desti.addTo(map);
                        featureLayer.addTo(map);


                    });
                    featureLayer.bringToFront();
                    origin.bringToFront();
                    desti.bringToFront();
                });
            }


            //
        }

        //map.addLayer(markersRoads);


    });


}
var twitter = function (e) {

    markersTwitter = new L.MarkerClusterGroup();
    $.ajax({
        url: 'http://sonicbanana.cs.wright.edu/phpmyadmin/Mti_Final_Proj/NewTwitter.php',
        dataType: "json"
    }).done(function (data) {


        for (var i = 0; i < data.length; i++) {

            var lat = data[i].lat;

            var long = data[i].longitue;
            var marker = L.marker(L.latLng(lat, long), {
                icon: L.mapbox.marker.icon({'marker-symbol': 't'}),
                title: 'twitter'
            });

            marker.bindPopup("Event type : " + data[i].event_type + "<br>Impact " + data[i].impact + "<br>Start time : " + data[i].start_time + "<br>End time" + data[i].end_time);
            markersTwitter.addLayer(marker);


        }
        map.addLayer(markersTwitter);


    });


}
var events311 = function (e) {
    var unixTimestamp = new Date();
    console.log(unixTimestamp.getUTCDate() + "-" + unixTimestamp.getUTCMonth() + "-" + unixTimestamp.getFullYear())
    markers311 = new L.MarkerClusterGroup();
    $.ajax({
        url: 'http://sonicbanana.cs.wright.edu/phpmyadmin/Mti_Final_Proj/New311.php?opentime=',
        dataType: "json"
    }).done(function (data) {
        console.log(data);
        var myIcon = L.icon({
            iconUrl: 'http://www.bigeasy.com/templates/client/images/311/311-logo.png.pagespeed.ce.Pxa_2RCvN7.png',
            iconSize: [20, 20]
        });
        for (var i = 0; i < data.length; i++) {

            var lat = data[i].lat;

            var long = data[i].long;
            var marker = L.marker(L.latLng(lat, long), {
                icon: L.mapbox.marker.icon({'marker-symbol': "1", 'marker-size': 'large',"marker-color":"#673AB7"}),
                title: '311'
            });

            marker.bindPopup("<b>Category</b> : " + data[i].category + "<br><b>Neighborhood</b> :  " + data[i].neighborhood + "<br><b>Opened</b> : " +data[i].opened+  "<br><b>Updated</b> : " +data[i].updated+"<br><b>Request type</b> : " + data[i].request_type + "<br><b>Request details</b> : " + data[i].request_details+"<br><b>Responsible Agency</b> : "+data[i].responsible_agency+"<br><b>Status_Notes</b> : " + data[i].status_notes+"<br><b>Supervisor district</b> : " + data[i].supervisor_district);
            markers311.addLayer(marker);


        }
        map.addLayer(markers311);


    });


}

var initPan = '';
$('.traffic-camera').click(function () {
    //Pan after 5 seconds
    initPan = setTimeout(function () {
        map.panTo([40.748817, -73.985428], {

            easeLinearity: -10
        });
        $('#modalCameras').closeModal();
    }, 5000);


});


$('#cancel').click(function () {
    clearTimeout(initPan);

});

$(document).ready(function () {

    sidebar_out();
    $('.events-title,#events,#incidents,#cameras').hide();
});

