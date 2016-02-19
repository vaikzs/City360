/**
 * Created by vaikunth on 2/15/16.
 */
L.mapbox.accessToken = 'pk.eyJ1IjoidmFpa3VudGhzcmlkaGFyYW4iLCJhIjoiY2locHR0amczMDQyeXRzbTRrYmcwc3JjciJ9.74473_3r6w8k9P0-dg_cwA';
var map = L.map('map', {
    maxZoom: 16,
    minZoom: 10,
    attributionControl: false,
    zoomControl : false,
    doubleClickZoom : false,
    dragging : true
});


var baseOutdoors = L.mapbox.tileLayer('mapbox.outdoors');
var baseDark = L.mapbox.tileLayer('mapbox.dark');
var baseStreet = L.mapbox.tileLayer('mapbox.streets');
var baseSatellite = L.mapbox.tileLayer('mapbox.satellite');
var geocoder = L.mapbox.geocoderControl('mapbox.places', {
    keepOpen: true,
    autocomplete: true

});
var layers = {
    Dark: baseDark,
    Streets: baseStreet,
    Outdoors: baseOutdoors,
    Satellite: baseSatellite
};

var sideNav = false;
$('.data-analytics').click(function () {
    if (sideNav === false) {
        $('#map').animate({
            width: '65%'
        });
        $('.fixed-action-btn').animate({right : '35%'});
        $('.data-icon').html("arrow_forward");

        sideNav = true;
    }
    else {

        $('#map').animate({
            width: '100%'
        });
        $('.fixed-action-btn').animate({right : '5%'});
        $('.data-icon').html("assessment");


        sideNav = false
    }

});

var initialize = function () {

    map.setView([37.773972
        , -122.431297], 13);
    layers.Streets.addTo(map);
    L.control.layers(layers).addTo(map);


}


$(document).ready(initialize);
