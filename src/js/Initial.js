var securityToken = '';
var serverPath = '';
var imageOverlay = '';
var div = '';
var markersEventful, markersInrix, markersCameras;
var clickTrafficLayer = true;
var geocodeControlLayer = false;
var populatedMarkers = [];
var RADIUS = 950;
map.on('zoomchange',function(e){


if(map.getZoom()===17||map.getZoom()===16||map.getZoom()===15){

    RADIUS = 500;
}
else if(map.getZoom()===14||map.getZoom()===13||map.getZoom()===12){
    RADIUS = 700;
}
else if(map.getZoom()===11||map.getZoom()===10||map.getZoom()===9){
    RADIUS = 900;
}
});

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

map.on('dragstart dragend zoom viewreset', function () {
    removetrafficflow();
    trafficLayer();
});

$("#traffic-flow").click(function () {
    if ($(this).prop('checked')) {

        removetrafficflow();
        trafficLayer();
    }
    else {
        removetrafficflow();
        map.removeEventListener('dragstart dragend zoom viewreset');
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
        $(this).animate({left: '330px'});
        $(this).html("<i class='material-icons'>keyboard_arrow_left</i>");
        $('#listings').animate({
            opacity: 1
        });
        arrow = true;
    }
    else {
        $('#listings').animate({
            opacity: 0
        });
        $(this).animate({
            left: '-12px'
        });
        $(this).html("<i class='material-icons'>keyboard_arrow_right</i>");
        arrow = false;
    }

};
$('#geocode').click(function () {

    console.log("works")

    //geocoder.query('Chester, NJ', showMap);


});
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

map.on('dblclick', function (e) {
    $('.welcome-message').hide();
    sidebar_out();
    $('.events-title,#events,#incidents,#cameras').show();

    eventMarkersLayer(e);
    trafficCamera(e);


});
map.on('contextmenu', function (e) {
    //twitter(e);
    //roadLinks511(e);
});
// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function(e) {
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

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
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
        url: "http://api.eventful.com/json/events/search?location=San+Francisco&app_key=NfVrh5tMK93fRG9x&starttime=today&callback=?",
        dataType: "json",
    }).done(function (data) {
        console.log("Event data" + data)
        var count = 0;
        for (var i = 0; i < data.events.event.length; i++) {

            var markerEF = L.marker(new L.LatLng(data.events.event[i].latitude, data.events.event[i].longitude), {
                icon: L.mapbox.marker.icon({'marker-symbol': "e", 'marker-color': "1b5e20", 'marker-size': 'large'}),
                title: 'Eventful'
            });

            if (e.latlng.distanceTo(L.latLng(data.events.event[i].latitude.toString(), data.events.event[i].longitude.toString())) < RADIUS) {
                count = count + 1;
                markerEF.bindPopup('Title : ' + data.events.event[i].title + '<br> Venue : ' + data.events.event[i].venue_address + '<br> Cityname: ' + data.events.event[i].city_name + ' <br> Starttime:  ' + data.events.event[i].start_time + ' <br> Endtime:  ' + data.events.event[i].stop_time);
                markersEventful.addLayer(markerEF);


                $('#events').after('<li><div class="collapsible-header"  onclick="map.setView([' + data.events.event[i].latitude.toString() + ', ' + data.events.event[i].longitude.toString() + '], 16); reloadTrafficLayer();"><i class="material-icons teal-text right">explore</i><h6 style="padding:10%" class="">' + data.events.event[i].title.trim() + '</h6></div></li>');


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

    markersInrix = new L.MarkerClusterGroup();
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
                    markersInrix.addLayer(marker);
                    $('#incidents').after('<li><div class="collapsible-header row"  onclick="map.setView([' + arr[j].getAttribute("latitude") + ', ' + arr[j].getAttribute("longitude") + '], 16);reloadTrafficLayer();"><i class="material-icons teal-text right">explore</i><h6 style="padding: 10%" class="">' + title[0].textContent + '</h6></div></li>');
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

markersCameras = new L.MarkerClusterGroup();

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
                    icon: L.mapbox.marker.icon({'marker-symbol': "camera", 'marker-size': 'large'}),
                    title: 'Inrix traffic cameras'
                });

                var strll = lat + "-" + long;
                if (e.latlng.distanceTo(L.latLng(lat, long)) < RADIUS && $.inArray(strll, populatedMarkers) === -1) {
                    count = count + 1;
                    populatedMarkers.push(strll);
                    //Open dash to give image details
                    var urlstr = 'http://na.api.inrix.com/traffic/inrix.ashx?Action=GetTrafficCameraImage&Token=' + securityToken + '&CameraID=' + cameraId + '&DesiredWidth=640&DesiredHeight=480';
                    marker.bindPopup('Title : ' + title[0].textContent + '<br> Camera ID : ' + cameraId);
                    $('#cameras').after('<li><div  id="' + cameraId + '" class="collapsible-header "  onclick="map.setView([' + lat + ', ' + long + '], 16);reloadTrafficLayer();"><i class="teal-text right material-icons">explore</i>' + title[0].textContent + '</div><div class="collapsible-body"><img class="" src=' + urlstr + ' width="100%" height="200px"></div></li>');

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
    //$.ajax({ url : 'http://sonicbanana.cs.wright.edu/phpmyadmin/Mti_Final_Proj/New511.php?callback=json',
    //         dataType : "json" }).done(function (data) {

    data = [{
        "linkid": "101000",
        "startlat": "37.765830993652344",
        "startlong": "-122.4049072265625",
        "endlat": "37.76961898803711",
        "endlong": "-122.40518188476562"
    }, {
        "linkid": "101001",
        "startlat": "37.76961898803711",
        "startlong": "-122.40518188476562",
        "endlat": "37.774898529052734",
        "endlong": "-122.40560913085938"
    }, {
        "linkid": "101010",
        "startlat": "37.774898529052734",
        "startlong": "-122.40560913085938",
        "endlat": "37.77996826171875",
        "endlong": "-122.3984146118164"
    }, {
        "linkid": "101020",
        "startlat": "37.77996826171875",
        "startlong": "-122.3984146118164",
        "endlat": "37.78877639770508",
        "endlong": "-122.38780975341797"
    }, {
        "linkid": "101030",
        "startlat": "37.78877639770508",
        "startlong": "-122.38780975341797",
        "endlat": "37.81065368652344",
        "endlong": "-122.36433410644531"
    }, {
        "linkid": "101040",
        "startlat": "37.81065368652344",
        "startlong": "-122.36433410644531",
        "endlat": "37.81917190551758",
        "endlong": "-122.34320068359375"
    }, {
        "linkid": "101050",
        "startlat": "37.81917190551758",
        "startlong": "-122.34320068359375",
        "endlat": "37.82368087768555",
        "endlong": "-122.31463623046875"
    }, {
        "linkid": "101055",
        "startlat": "37.82368087768555",
        "startlong": "-122.31463623046875",
        "endlat": "37.82537078857422",
        "endlong": "-122.30522155761719"
    }, {
        "linkid": "101060",
        "startlat": "37.82537078857422",
        "startlong": "-122.30522155761719",
        "endlat": "37.82986068725586",
        "endlong": "-122.29347229003906"
    }, {
        "linkid": "101065",
        "startlat": "37.82986068725586",
        "startlong": "-122.29347229003906",
        "endlat": "37.83647918701172",
        "endlong": "-122.29580688476562"
    }, {
        "linkid": "101070",
        "startlat": "37.83647918701172",
        "startlong": "-122.29580688476562",
        "endlat": "37.83816146850586",
        "endlong": "-122.29622650146484"
    }, {
        "linkid": "101080",
        "startlat": "37.83816146850586",
        "startlong": "-122.29622650146484",
        "endlat": "37.844730377197266",
        "endlong": "-122.2977294921875"
    }, {
        "linkid": "101090",
        "startlat": "37.844730377197266",
        "startlong": "-122.2977294921875",
        "endlat": "37.850948333740234",
        "endlong": "-122.29917907714844"
    }, {
        "linkid": "101095",
        "startlat": "37.850948333740234",
        "startlong": "-122.29917907714844",
        "endlat": "37.866756439208984",
        "endlong": "-122.30386352539062"
    }, {
        "linkid": "101100",
        "startlat": "37.866756439208984",
        "startlong": "-122.30386352539062",
        "endlat": "37.878135681152344",
        "endlong": "-122.30731964111328"
    }];
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


    //});


}
var twitter = function (e) {

    markersTwitter = new L.MarkerClusterGroup();
    //$.ajax({ url : 'http://sonicbanana.cs.wright.edu/phpmyadmin/Mti_Final_Proj/New511.php?callback=json',
    //         dataType : "json" }).done(function (data) {
    console.log("right click")
    data = [{
        "event_type": "weather;",
        "start_time": "2014-05-22 13:13:59",
        "end_time": "2014-05-23 12:28:16",
        "impact": "75",
        "lat": "37.513994",
        "longitue": "-122.07076",
        "Id": "1"
    }, {
        "event_type": "fog;",
        "start_time": "2014-05-22 18:07:03",
        "end_time": "2014-05-23 12:13:58",
        "impact": "12",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "2"
    }, {
        "event_type": "concert;",
        "start_time": "2014-05-22 13:12:46",
        "end_time": "2014-05-23 13:07:29",
        "impact": "82",
        "lat": "36.967212",
        "longitue": "-121.933333",
        "Id": "3"
    }, {
        "event_type": "marathon;",
        "start_time": "2014-05-22 14:00:45",
        "end_time": "2014-05-23 11:01:10",
        "impact": "12",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "4"
    }, {
        "event_type": "blocked;",
        "start_time": "2014-05-22 15:10:49",
        "end_time": "2014-05-23 09:28:42",
        "impact": "34",
        "lat": "37.6648863",
        "longitue": "-122.470774",
        "Id": "5"
    }, {
        "event_type": "Concert;",
        "start_time": "2014-05-22 16:42:31",
        "end_time": "2014-05-23 11:53:25",
        "impact": "11",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "6"
    }, {
        "event_type": "Blocked;",
        "start_time": "2014-05-22 13:45:57",
        "end_time": "2014-05-23 12:27:30",
        "impact": "10",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "7"
    }, {
        "event_type": "tournament;",
        "start_time": "2014-05-22 13:55:16",
        "end_time": "2014-05-23 01:46:54",
        "impact": "12",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "8"
    }, {
        "event_type": "shooting;",
        "start_time": "2014-05-22 13:21:51",
        "end_time": "2014-05-23 03:59:51",
        "impact": "18",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "9"
    }, {
        "event_type": "festival;",
        "start_time": "2014-05-22 13:34:32",
        "end_time": "2014-05-23 12:54:14",
        "impact": "13",
        "lat": "37.649122",
        "longitue": "-122.500313",
        "Id": "10"
    }, {
        "event_type": "traffic;",
        "start_time": "2014-05-22 13:18:10",
        "end_time": "2014-05-23 13:00:31",
        "impact": "41",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "11"
    }, {
        "event_type": "Festival;",
        "start_time": "2014-05-22 13:57:55",
        "end_time": "2014-05-23 12:30:34",
        "impact": "12",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "12"
    }, {
        "event_type": "accident;",
        "start_time": "2014-05-22 15:03:51",
        "end_time": "2014-05-23 13:10:01",
        "impact": "16",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "13"
    }, {
        "event_type": "rain;",
        "start_time": "2014-05-22 13:18:35",
        "end_time": "2014-05-23 13:03:03",
        "impact": "66",
        "lat": "37.248194",
        "longitue": "-121.810118",
        "Id": "14"
    }, {
        "event_type": "rain;",
        "start_time": "2014-05-23 14:47:42",
        "end_time": "2014-05-24 12:50:06",
        "impact": "28",
        "lat": "37.6041549",
        "longitue": "-122.473595",
        "Id": "15"
    }, {
        "event_type": "weather;",
        "start_time": "2014-05-23 13:38:02",
        "end_time": "2014-05-24 13:07:31",
        "impact": "63",
        "lat": "37.661213",
        "longitue": "-122.161568",
        "Id": "16"
    }, {
        "event_type": "fog;",
        "start_time": "2014-05-23 13:32:56",
        "end_time": "2014-05-24 12:16:51",
        "impact": "14",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "17"
    }, {
        "event_type": "concert;",
        "start_time": "2014-05-23 13:31:16",
        "end_time": "2014-05-24 13:01:34",
        "impact": "101",
        "lat": "37.513994",
        "longitue": "-122.07076",
        "Id": "18"
    }, {
        "event_type": "Carnival;",
        "start_time": "2014-05-23 16:57:45",
        "end_time": "2014-05-23 21:15:56",
        "impact": "10",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "19"
    }, {
        "event_type": "marathon;",
        "start_time": "2014-05-23 13:39:14",
        "end_time": "2014-05-24 12:48:28",
        "impact": "10",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "20"
    }, {
        "event_type": "blocked;",
        "start_time": "2014-05-23 14:19:55",
        "end_time": "2014-05-24 12:41:16",
        "impact": "34",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "21"
    }, {
        "event_type": "weather.;",
        "start_time": "2014-05-23 15:44:33",
        "end_time": "2014-05-24 11:38:15",
        "impact": "10",
        "lat": "37.3567709",
        "longitue": "-122.117916",
        "Id": "22"
    }, {
        "event_type": "cleared;",
        "start_time": "2014-05-23 16:44:18",
        "end_time": "2014-05-24 02:42:32",
        "impact": "10",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "23"
    }, {
        "event_type": "tournament;",
        "start_time": "2014-05-23 14:31:18",
        "end_time": "2014-05-24 12:34:55",
        "impact": "18",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "24"
    }, {
        "event_type": "shooting;",
        "start_time": "2014-05-23 14:44:42",
        "end_time": "2014-05-24 13:03:39",
        "impact": "47",
        "lat": "37.513994",
        "longitue": "-122.07076",
        "Id": "25"
    }, {
        "event_type": "festival;",
        "start_time": "2014-05-23 13:34:39",
        "end_time": "2014-05-24 10:41:13",
        "impact": "10",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "26"
    }, {
        "event_type": "Traffic;",
        "start_time": "2014-05-23 15:21:27",
        "end_time": "2014-05-24 01:46:58",
        "impact": "15",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "27"
    }, {
        "event_type": "construction;",
        "start_time": "2014-05-23 13:25:22",
        "end_time": "2014-05-24 08:10:44",
        "impact": "10",
        "lat": "37.699279",
        "longitue": "-122.34266",
        "Id": "28"
    }, {
        "event_type": "traffic;",
        "start_time": "2014-05-23 14:51:07",
        "end_time": "2014-05-24 07:08:48",
        "impact": "65",
        "lat": "37.513994",
        "longitue": "-122.07076",
        "Id": "29"
    }, {
        "event_type": "Festival;",
        "start_time": "2014-05-23 16:34:04",
        "end_time": "2014-05-24 10:39:32",
        "impact": "10",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "30"
    }, {
        "event_type": "accident;",
        "start_time": "2014-05-23 13:51:59",
        "end_time": "2014-05-24 12:49:40",
        "impact": "13",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "31"
    }, {
        "event_type": "rain;",
        "start_time": "2014-05-24 13:21:47",
        "end_time": "2014-05-25 07:08:20",
        "impact": "14",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "32"
    }, {
        "event_type": "weather;",
        "start_time": "2014-05-24 13:16:10",
        "end_time": "2014-05-25 12:58:45",
        "impact": "57",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "33"
    }, {
        "event_type": "concert;",
        "start_time": "2014-05-24 13:23:28",
        "end_time": "2014-05-25 13:09:46",
        "impact": "63",
        "lat": "37.6041549",
        "longitue": "-122.473595",
        "Id": "34"
    }, {
        "event_type": "marathon;",
        "start_time": "2014-05-24 14:06:01",
        "end_time": "2014-05-25 08:28:18",
        "impact": "14",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "35"
    }, {
        "event_type": "carnival;",
        "start_time": "2014-05-24 15:06:51",
        "end_time": "2014-05-25 12:52:16",
        "impact": "10",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "36"
    }, {
        "event_type": "blocked;",
        "start_time": "2014-05-24 14:25:41",
        "end_time": "2014-05-25 10:59:50",
        "impact": "32",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "37"
    }, {
        "event_type": "Shooting;",
        "start_time": "2014-05-24 13:28:42",
        "end_time": "2014-05-25 12:55:59",
        "impact": "11",
        "lat": "37.779803",
        "longitue": "-122.027412",
        "Id": "38"
    }, {
        "event_type": "crime;",
        "start_time": "2014-05-24 13:25:13",
        "end_time": "2014-05-25 12:42:35",
        "impact": "11",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "39"
    }, {
        "event_type": "tournament;",
        "start_time": "2014-05-24 13:53:01",
        "end_time": "2014-05-25 12:55:15",
        "impact": "12",
        "lat": "37.708075",
        "longitue": "-122.514926",
        "Id": "40"
    }, {
        "event_type": "snow;",
        "start_time": "2014-05-24 14:37:40",
        "end_time": "2014-05-25 02:40:00",
        "impact": "11",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "41"
    }, {
        "event_type": "shooting;",
        "start_time": "2014-05-24 13:14:09",
        "end_time": "2014-05-25 12:24:55",
        "impact": "82",
        "lat": "37.779803",
        "longitue": "-122.027412",
        "Id": "42"
    }, {
        "event_type": "festival;",
        "start_time": "2014-05-24 13:32:25",
        "end_time": "2014-05-25 12:40:05",
        "impact": "35",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "43"
    }, {
        "event_type": "traffic;",
        "start_time": "2014-05-24 13:17:27",
        "end_time": "2014-05-25 13:09:47",
        "impact": "41",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "44"
    }, {
        "event_type": "Festival;",
        "start_time": "2014-05-24 14:52:13",
        "end_time": "2014-05-25 12:35:23",
        "impact": "68",
        "lat": "32.528832",
        "longitue": "-124.482003",
        "Id": "45"
    }];
    console.log(data);
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


    //});


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

