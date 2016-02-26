/**
 * Created by vaikunth on 2/15/16.
 */
L.mapbox.accessToken = 'pk.eyJ1IjoidmFpa3VudGhzcmlkaGFyYW4iLCJhIjoiY2locHR0amczMDQyeXRzbTRrYmcwc3JjciJ9.74473_3r6w8k9P0-dg_cwA';

var map = L.map('map', {
    minZoom: 10,
    attributionControl: false,
    zoomControl: false,
    doubleClickZoom: false,
    dragging: true
});

var baseOutdoors = L.mapbox.tileLayer('mapbox.outdoors');

var baseDark = L.mapbox.tileLayer('mapbox.dark');
var baseStreet = L.mapbox.tileLayer('mapbox.streets');
var baseSatellite = L.mapbox.tileLayer('mapbox.satellite');
var baseStyle = L.mapbox.styleLayer('mapbox://styles/vaikunthsridharan/cikzsz3h800329klzi0bbrxpj');
var baseEmerald = L.mapbox.tileLayer('mapbox.emerald');
var geocoder = L.mapbox.geocoderControl('mapbox.places', {
    keepOpen: true,
    autocomplete: true

});
var layers = {
    Custom : baseStyle,
    Dark: baseDark,
    Streets: baseStreet,
    Outdoors: baseOutdoors,
    Satellite: baseSatellite,
    Emerald : baseEmerald
};


var initialize = function () {

    $('#initialModal').openModal();
    map.setView([37.773972
        , -122.431297], 13);
    layers.Emerald.addTo(map);
    L.control.layers(layers,"",{position:'bottomright'}).addTo(map);
    var attr = new L.control.attribution();
    attr.addAttribution('Inrix traffic data &copy; Mapbox ').addTo(map);




}


$(document).ready(initialize);
