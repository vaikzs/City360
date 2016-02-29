/**
 * Created by vaikunth on 2/15/16.
 */
L.mapbox.accessToken = 'pk.eyJ1IjoidmFpa3VudGhzcmlkaGFyYW4iLCJhIjoiY2locHR0amczMDQyeXRzbTRrYmcwc3JjciJ9.74473_3r6w8k9P0-dg_cwA';
var map = L.mapbox.map('map','mapbox.streets',{

    doubleClickZoom : false

});
var baseOutdoors = L.mapbox.tileLayer('mapbox.outdoors', {
    interaction: true,
    format: 'png'
});
var baseDark = L.mapbox.tileLayer('mapbox.dark', {
    opacity : 0.85,
    format: 'png'
});
var baseStreet = L.mapbox.tileLayer('mapbox.streets', {

    format: 'png'
});
var baseSatellite = L.mapbox.tileLayer('mapbox.satellite', {

    format: 'png'
});
var baseStyle = L.mapbox.styleLayer('mapbox://styles/vaikunthsridharan/cikzsz3h800329klzi0bbrxpj', {

    format: 'png'
});
var baseEmerald = L.mapbox.tileLayer('mapbox.emerald', {

    format: 'png'
});
var baseLight = L.mapbox.tileLayer('mapbox.light', {

    format: 'png'
});
var geocoder = L.mapbox.geocoder('mapbox.places', {

});
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
var city = L.OWM.current({intervall: 20, minZoom: 10,lang :'en',imageLoadingUrl :'https://cdn.elegantthemes.com/blog/wp-content/uploads/2014/12/LazyLoadingHeader.png',
    appId: OWM_API_KEY,caching:true,showTimestamp:true});

var overlayMaps = {"Weather":city};

var layers = {
    Custom: baseStyle,
    Light: baseLight,
    Dark: baseDark,
    Streets: baseStreet,
    Outdoors: baseOutdoors,
    Satellite: baseSatellite,
    Emerald: baseEmerald
};


var initialize = function () {


    //$('#initialModal').openModal();

    map.setView([37.773972
        , -122.431297], 13);
    layers.Streets.addTo(map);
    var zoom = new L.control.zoom({
        position: 'topright',
        zoomInTitle: 'zoom in',
        zoomOutText: 'zoom out'
    }).addTo(map);
    var attr = new L.control.attribution();
    L.control.scale({metric : true}).addTo(map);

    attr.addAttribution('Inrix traffic data &copy; Mapbox ').addTo(map);
    L.control.layers(layers, overlayMaps, {position: 'bottomright'}).addTo(map);






}


$(document).ready(initialize);

function showMap(err, data) {
    // The geocoder can return an area, like a city, or a
    // point, like an address. Here we handle both cases,
    // by fitting the map bounds to an area or zooming to a point.
    if (data.lbounds) {
        map.fitBounds(data.lbounds);
    } else if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 13);
    }


}


