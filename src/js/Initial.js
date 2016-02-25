var securityToken = '';
var serverPath = '';
var overlay = '';
var markersEventful, markers;
var clickTrafficLayer = true;
var geocodeControlLayer = false;
var populatedMarkers = [];
var RADIUS = 700;

var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
    opacity: 1,
    weight: 1,
    fillOpacity: 0.1,
    color: '#DD2C00'
});
/*
 Geocoding search for locations, example pan to New york
 */
$('.geocode').click(function () {
    if (geocodeControlLayer === false) {
        map.addControl(geocoder);

        geocodeControlLayer = true;
    }
    else {
        map.removeControl(geocoder);
        geocodeControlLayer = false;


    }
});

/*
 On click traffic layer
 */

$("#traffic-flow").click(function () {
    if ($(this).prop('checked')) {
        trafficLayer();
        map.on('dragstart dragend viewreset', function () {
            trafficLayer();
        });


    }
    else {

        if (overlay !== '') {
            map.removeLayer(overlay);

        }
        map.removeEventListener('dragstart dragend viewreset');

    }


});


/*
 Handling map events, example layer add event
 */
map.on('layeradd', function (e) {
    console.log("layer added");
});

/*
 On right click bring up search for all events nearby within the radius
 */
map.on('dblclick', function (e) {

    eventMarkersLayer(e);
    trafficCamera(e);
});

var eventMarkersLayer = function (e) {

    filterCircle.addTo(map);
    if (map.getZoom() === 12) {
        map.removeLayer(filterCircle);
        filterCircle.setRadius(1200);
    }

    filterCircle.setLatLng(e.latlng);
    map.addLayer(filterCircle);
    markersEventful = new L.MarkerClusterGroup();
    $.ajax({
        url: "http://api.eventful.com/json/events/search?location=San+Francisco&app_key=NfVrh5tMK93fRG9x&callback=?",
        dataType: "json",
    }).done(function (data) {

        for (var i = 0; i < data.events.event.length; i++) {

            var markerEF = L.marker(new L.LatLng(data.events.event[i].latitude, data.events.event[i].longitude), {
                icon: L.mapbox.marker.icon({'marker-symbol': "e", 'marker-color': "1b5e20", 'marker-size': 'large'}),
                title: 'Eventful'
            });

            if (e.latlng.distanceTo(L.latLng(data.events.event[i].latitude.toString(), data.events.event[i].longitude.toString())) < RADIUS) {

                markerEF.bindPopup('Title : ' + data.events.event[i].title + '<br> Venue : ' + data.events.event[i].venue_address + '<br> Cityname: ' + data.events.event[i].city_name + ' <br> Starttime:  ' + data.events.event[i].start_time + ' <br> Endtime:  ' + data.events.event[i].stop_time);
                markersEventful.addLayer(markerEF);

                markerEF.on('mouseover', function (e) {
                    this.openPopup();
                    map.panTo(e.layer.getLatLng());

                });
                markerEF.on('mouseout', function (e) {
                    this.closePopup();
                });

            }
            else {
                markersEventful.removeLayer(markerEF);
            }


        }
        map.addLayer(markersEventful);

    });

    markers = new L.MarkerClusterGroup();
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

                var title = arr[j].getElementsByTagName("ShortDesc");
                var lat = arr[j].getAttribute("latitude");
                var long = arr[j].getAttribute("longitude");
                var marker = L.marker(new L.LatLng(lat, long), {
                    icon: L.mapbox.marker.icon({'marker-symbol': "i", 'marker-size': 'large'}),
                    title: 'Inrix'
                });


                if (e.latlng.distanceTo(L.latLng(arr[j].getAttribute("latitude"), arr[j].getAttribute("longitude"))) < RADIUS) {
                    count = count + 1;

                    marker.bindPopup('Title : ' + title[0].textContent);
                    markers.addLayer(marker);
                    marker.on('mouseover', function (e) {
                        this.openPopup();
                        map.panTo(e.layer.getLatLng());
                    });
                    marker.on('mouseout', function (e) {
                        this.closePopup();
                    });
                }
                else {
                    markers.removeLayer(marker);

                }


            }
            map.addLayer(markers);


        });

    });


}

markersCameras = new L.MarkerClusterGroup({
    // The iconCreateFunction takes the cluster as an argument and returns
    // an icon that represents it. We use L.mapbox.marker.icon in this
    // example, but you could also use L.icon or L.divIcon.
    iconCreateFunction: function (cluster) {
        return L.mapbox.marker.icon({
            // show the number of markers in the cluster on the icon.
            'marker-symbol': cluster.getChildCount(),
            'marker-color': '#422'
        });
    }
});

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


            for (var j = 0; j < cam.length; j++) {
                var title = cam[j].getElementsByTagName("Name");
                var cameraId = cam[j].getAttribute("id");
                var lat = cam[j].getElementsByTagName("Point")[0].attributes[0].value;
                var long = cam[j].getElementsByTagName("Point")[0].attributes[1].value;
                var marker = L.marker(L.latLng(lat, long), {
                    icon: L.mapbox.marker.icon({'marker-symbol': "camera", 'marker-size': 'large'}),
                    title: 'Inrix traffic cameras'
                });

                var strll = lat + "-" + long;
                if (e.latlng.distanceTo(L.latLng(lat, long)) < RADIUS && $.inArray(strll, populatedMarkers) === -1) {
                    populatedMarkers.push(strll);
                    //Open dash to give image details

                    var urlstr = 'http://na.api.inrix.com/traffic/inrix.ashx?Action=GetTrafficCameraImage&Token=' + securityToken + '&CameraID=' + cameraId + '&DesiredWidth=640&DesiredHeight=480';
                    marker.bindPopup('Title : ' + title[0].textContent + '<br> Camera ID : ' + cameraId);
                    marker.on('mouseover', function (e) {
                        map.panTo(e.layer.getLatLng());
                        this.openPopup();


                    });

                    var newCamID = cameraId;
                    marker.on('click', function (e) {
                        console.log(urlstr);
                        $('#camera-image').html('');
                        $('#camera-image').html('<img src=' + urlstr + '>' + '<span class="card-title">' + newCamID + '</span>');
                        $('#listings').addClass('fixed');
                        $('#listings').sideNav('show');
                    });
                    markersCameras.eachLayer(function (locale) {
                        console.log(locale)

                    });

                    marker.on('mouseout', function (e) {
                        this.closePopup();
                    });
                    markersCameras.addLayer(marker);

                } else {
                    markersCameras.removeLayer(marker);
                }
            }
            map.addLayer(markersCameras);


        });

    });


}
var initPan = '';
$('.traffic-camera').click(function () {
    //Pan after 5 seconds
    initPan = setTimeout(function () {
        map.panTo([40.748817, -73.985428], {});
        $('#modalCameras').closeModal();
    }, 5000);


});

$('#cancel').click(function () {
    clearTimeout(initPan);

});
