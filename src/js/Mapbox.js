/**
 * Created by vaikunth on 2/15/16.
 */
L.mapbox.accessToken = 'pk.eyJ1IjoidmFpa3VudGhzcmlkaGFyYW4iLCJhIjoiY2locHR0amczMDQyeXRzbTRrYmcwc3JjciJ9.74473_3r6w8k9P0-dg_cwA';
mapboxgl.accessToken = 'pk.eyJ1IjoidmFpa3VudGhzcmlkaGFyYW4iLCJhIjoiY2locHR0amczMDQyeXRzbTRrYmcwc3JjciJ9.74473_3r6w8k9P0-dg_cwA';
var map = L.mapbox.map('map', 'mapbox.streets', {
    doubleClickZoom: false,
    zoomControl: false,
    attributionControl: false
});
var baseOutdoors = L.mapbox.tileLayer('mapbox.outdoors', {
    interaction: true,
    format: 'png'
});
var baseDark = L.mapbox.tileLayer('mapbox.dark', {
    opacity: 0.85,
    format: 'png'
});
var baseStreet = L.mapbox.tileLayer('mapbox.streets', {

    format: 'png'
});
var baseSatellite = L.mapbox.tileLayer('mapbox.satellite', {

    format: 'png'
});
var baseStyle = L.mapbox.styleLayer('mapbox://styles/vaikunthsridharan/cil8z8h43002ea7kn460yhc42', {

    format: 'png'
});
var baseEmerald = L.mapbox.tileLayer('mapbox.emerald', {

    format: 'png'
});
var baseLight = L.mapbox.tileLayer('mapbox.light', {

    format: 'png'
});
var geocoder = L.mapbox.geocoder('mapbox.places', {});
var clouds = L.OWM.clouds({showLegend: false, opacity: 1});
var cloudscls = L.OWM.cloudsClassic();
var precipitation = L.OWM.precipitation();
var precipitationcls = L.OWM.precipitationClassic();
var rain = L.OWM.rain();
var raincls = L.OWM.rainClassic();
var snow = L.OWM.snow();
var pressure = L.OWM.pressure();
var pressurecntr = L.OWM.pressureContour();
var temp = L.OWM.temperature();
var OWM_API_KEY = '06aac0fd4ba239a20d824ef89602f311';
var city = L.OWM.current({
    intervall: 20,
    minZoom: 10,
    lang: 'en',
    imageLoadingUrl: 'https://cdn.elegantthemes.com/blog/wp-content/uploads/2014/12/LazyLoadingHeader.png',
    appId: OWM_API_KEY,
    caching: true,
    showTimestamp: true
});

var overlayMaps = {"Weather": city};

var layers = {
    Custom: baseStyle,
    Light: baseLight,
    Dark: baseDark,
    Streets: baseStreet,
    Outdoors: baseOutdoors,
    Satellite: baseSatellite,
    Emerald: baseEmerald
};

var myLayer = L.mapbox.featureLayer().addTo(map);

//var timeSettings = setTimeout(function () {
//    $('#modal-events').openModal();
//}, 5000);
var initialize = function () {

    $('#init-message').openModal();
    $('#locate').click(function () {
        map.locate({
            enableHighAccuracy: true
        });
    });
    //$('#initialModal').openModal();

    map.setView([37.773972
        , -122.431297], 13);
    var zoom = new L.control.zoom({
        position: 'bottomright',
        zoomInTitle: 'zoom in',
        zoomOutText: 'zoom out'
    });
    var attr = new L.control.attribution();
    L.control.scale({metric: true}).addTo(map);
    baseStyle.addTo(map);


    map.legendControl.addLegend(document.getElementById('legend').innerHTML);


}

$('#modal-events').click(function () {

});
$(document).ready(initialize);
$('.preloader-wrapper').hide();
var showMap = function(err, data) {
    // The geocoder can return an area, like a city, or a
    // point, like an address. Here we handle both cases,
    // by fitting the map bounds to an area or zooming to a point.


    if(data){
        for (var j = 0; j < data.results.features.length; j++) {

            $('.search-result').append('<a href="#" class="col s12 white truncate container-fluid"> ' + data.results.features[j].place_name + '</a>')

        }

        $('.search-result a').click(function () {
            var qu = $(this).html();
            queryGeo(qu);
            $('.search-result').html(" ");
        });
    }
}

var showresult = function (err,data) {

    if (data.lbounds) {
        map.fitBounds(data.lbounds);
    }
    if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 15);
        var geocode = L.marker(new L.LatLng(data.latlng[0], data.latlng[1]), {
            icon: L.mapbox.marker.icon({'marker-color': "1b5e20", 'marker-size': 'medium', 'marker-symbol':'star'}),
            title: 'Leaflet'
        });
        geocode.bindPopup(data.results.features[0].place_name);
        map.addLayer(geocode);
        geocode.openPopup();

    }
}
var queryGeo = function(v){

    geocoder.query(v,showresult);
}
var eval=function(va) {
    if(va.length>1)
    geocoder.query(va, showMap);
    $('.search-result').html(" ");

}
var runScript = function(e) {
    if (e.keyCode == 13) {
        var tb = $('#icon_prefix')
        eval(tb.val());
        return false;
    }
}
