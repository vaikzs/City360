$('#submit-btn').click(function () {
    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(document.getElementById('navbar-search-input')));
    console.log('reached');
});
var temp;
var tempRangeHours = "00";
var tempRangeStart, tempRangeEnd;
var clickedHere = false;
var clickedEF = false;
var clickedEB = false;
var clickedOW = false;

var setTraffic = 0;
var setMarkerPins = 0;

//Refreshing map markers to put new markers, also set the same center and zoom level for maintaining accuracies
var refreshingMapFunction = function () {
    console.log('working refreshing');
    $('#box-body').append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');

    zoom = mapGoogle.getZoom();
    initialLocation = new google.maps.LatLng(mapGoogle.getCenter().A, mapGoogle.getCenter().F);
    initialize();
    mapGoogle.setCenter(initialLocation);
    mapGoogle.setZoom(zoom);
    var trafficLayer1 = new google.maps.TrafficLayer();
    if (setTraffic === 1) {

        trafficLayer1.setMap(mapGoogle);


    }
    else {
        trafficLayer1.setMap(null);
        initialize();

    }


}


var markerStartPins = function () {
    applyFunction(7);
    $('.description').html('');
    var image = {
        url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(20, 20)
    };
    if (setMarkerPins === 0) {

        $.getJSON('../Mti_Final_Proj/New511.php', function (data) {


            for (var i in data) {

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i].startlat.toString(), data[i].startlong.toString()),
                    map: mapGoogle,
                    icon: 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0'


                });
                var highTempDate = [];
                var highSpeed = [20, 30, 40, 50, 60, 76, 10];
                var highTime = [];
                var dat = [];
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {


                        google.maps.event.addListener(infowindow, 'domready', function () {

                            $.getJSON('../Mti_Final_Proj/511LinkStatus.php?starttime=' + tempRangeStart + ' ' + tempRangeHours + ':00:00&endtime=' + tempRangeEnd + ' ' + tempRangeHours + ":00:00" + '&linkid=' + data[i].linkid, function (data) {

                                //console.log(data[i].linkvolume);

                                if (data.length !== 0) {
                                    $('.description').html('');

                                    highTempDate = tempRangeStart.split(" ")[0].split("-");


                                    for (var j in data) {
                                        //console.log(data[j].linkvolume);
                                        //console.log(data[j].linkspeed);

                                        year = data[j].timestamp.split(" ")[0].split("-")[0];
                                        month = data[j].timestamp.split(" ")[0].split("-")[1] - 1;
                                        day = data[j].timestamp.split(" ")[0].split("-")[2];
                                        hh = data[j].timestamp.split(" ")[1].split(":")[0];
                                        mm = data[j].timestamp.split(" ")[1].split(":")[1];
                                        ss = data[j].timestamp.split(" ")[1].split(":")[2];

                                        //console.log(Number(data[j].linkspeed));
                                        highTime.push([Date.UTC(year, month, day, hh, mm, ss, 0), Number(data[j].linkspeed)]);


                                    }
                                }
                                else {

                                    $('.description').html('<span class="text-danger">PLEASE WAIT FOR LINKDATA IF WAITING LONGER THEN THERE IS NO DATA</span>');

                                }

                            });
                            dataChart = {
                                chart: {
                                    borderWidth: 2,
                                    renderTo: document.getElementById('containerr'),
                                    zoomType: 'x',
                                    type: "spline",
                                    height: 350,
                                    width: 350,
                                    marginRight: 40
                                },
                                title: {
                                    text: 'Speed(mph) vs Time',
                                    x: -20 //center
                                },
                                subtitle: {
                                    text: 'Source: 511.org',
                                    x: -20
                                },
                                xAxis: {
                                    title: {
                                        text: 'TIME'
                                    },
                                    type: 'datetime',
                                },
                                yAxis: {
                                    title: {
                                        text: 'SPEED'
                                    },
                                    plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#808080'
                                    }]
                                },
                                tooltip: {
                                    valueSuffix: 'mph'
                                },
                                series: [{
                                    data: []


                                }]
                            }
                            chart = new Highcharts.Chart(dataChart);
                            chart.series[0].setData(highTime);
                        });
                        var contentDiv = '<div id="containerr" style="height:350px; width:350px"></div><br><div>LinkID:' + data[i].linkid + '</div>';

                        infowindow.open(mapGoogle, marker);
                        infowindow.setContent(contentDiv);


                    }

                })(marker, i));


            }


        });
        setMarkerPins = 1;
    }
    else {
        refreshingMapFunction();
        setMarkerPins = 0;

    }


}


var dates = function () {
    var fromDate = Date();
    var ff = new Date(fromDate);
    ff.setMonth(ff.getMonth());
    fromDate = $.datepicker.formatDate("yy-mm-dd", ff);

    $("#input-from").val(fromDate);

    tempRangeStart = $('#input-from').val();

    temp = tempRangeStart + tempRangeHours + "-" + tempRangeEnd + tempRangeHours;


}

$('.refresh').click(function () {


    refreshingMapFunction();
    clickedHere = false;
    clickedEF = false;
    clickedEB = false;
    clickedOW = false;

});

//Slider, this is triggered whenever slide event(we slide) is changed. 
var time = ["12 am", "1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm"];
$("#scale-slider,#scale-slider2").slider({
    max: 23,
    start: function () {
        if (clickedEB) {

            eventbriteFunction();


        }

        if (clickedHere) {

            hereFunction();


        }
        if (clickedOW) {

            openweatherFunction();
        }
        if (clickedEF) {

            eventfulFunction();

        }


    },

    slide: function (event, ui) {
        $('#box-body').append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');

        var data = ui.value;
        if (data < 10) {
            tempRangeHours = '0' + data;

        }
        else {
            tempRangeHours = data;

        }


        refreshingMapFunction();

        if (clickedEB) {

            eventbriteFunction();


        }

        if (clickedHere) {

            hereFunction();


        }
        if (clickedOW) {

            openweatherFunction();
        }
        if (clickedEF) {

            eventfulFunction();

        }


    },


})
    .slider("pips", {
        rest: "label",
        step: 1,
        labels: time

    });


var applyFunction = function (numberOfDays) {


    //refreshingMapFunction();
    clickedHere = false;
    clickedEF = false;
    clickedEB = false;
    clickedOW = false;

    tempRangeStart = $('#input-from').val();
    var tempp = tempRangeStart.split("-");
    var trs = tempp[1] + '/' + tempp[2] + '/' + tempp[0];

    var myEndDate = new Date(trs);

    myEndDate.setDate(myEndDate.getDate() + numberOfDays);


    var fe = new Date(myEndDate);
    fe.setMonth(fe.getMonth());
    myEndDate = $.datepicker.formatDate("yy-mm-dd", fe);


    tempRangeEnd = myEndDate;

    //console.log(tempRangeEnd);

    temp = tempRangeStart + tempRangeHours + "-" + tempRangeEnd + tempRangeHours;
    //tempRangeHours = $('#range_4').data('ionRangeSlider');

//    $('#mapContainer').remove();
//    $('#box-body').append('<div id="mapContainer" style="height: 500px; width: 100%;"></div>');
//    mapLoad();
    //  console.log(tempRangeStart);


}

var trafficLayer;
$('#showTraffic').click(function () {

    if (setTraffic === 0) {
        trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(mapGoogle);
        setTraffic = 1;

    }
    else {

        trafficLayer.setMap(null);
        setTraffic = 0;

    }

});
var setWeather = 0;
var weatherLayer;
var cloudLayer;
$('#showWeather').click(function () {

    if (setWeather === 0) {
        weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
        });
        weatherLayer.setMap(mapGoogle);

        cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(mapGoogle);
        setWeather = 1;
    } else {

        weatherLayer.setMap(null);
        cloudLayer.setMap(null);
        setWeather = 0;


    }

});
var EFSpecialClick = 0;
var eventfulFunction = function () {
    var image = {
        url: 'http://hsto.org/storage3/928/3c7/61d/9283c761d0f80c8bde7f31d61ba21d8b.png',
        size: new google.maps.Size(25, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(20, 40)
    };
    applyFunction(30);

    if (EFSpecialClick === 0) {
        EFSpecialClick = 1;
        $('#arrow1').addClass("fa-spin");
        if (temp !== undefined) {


            clickedEF = true;


            var layer;


            $.getJSON("http://api.eventful.com/json/events/search?location=San+Francisco&date=" + temp + "&app_key=NfVrh5tMK93fRG9x&callback=?",
                function (data) {


                    var infowindow = new google.maps.InfoWindow();
                    for (var i in data.events.event) {

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(data.events.event[i].latitude.toString(), data.events.event[i].longitude.toString()),
                            map: mapGoogle,
                            icon: image

                        });
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent('<pre class="bg-black"><h6><b>Title             </b>                               ' + data.events.event[i].title + '</h6><h6><b>Venue          </b>                               ' + data.events.event[i].venue_address + data.events.event[i].city_name + '</h6>' + '<h6><b><h8>Start Time                               ' + data.events.event[i].start_time + '</h8></b><br/><b><h7>End Time                                  ' + data.events.event[i].stop_time + '</h7></b></h6></pre>');
                                infowindow.open(mapGoogle, marker);

                                toggleBounce(marker);
                            }

                        })(marker, i));

                    }

                }
            );


        }
    } else {
        $('#arrow1').removeClass('fa-spin');
        EFSpecialClick = 0;

        refreshingMapFunction();
        clickedEF = true;


    }
}

var openweatherFunction = function () {
    $('#arrow4').addClass("fa-spin");
    var image = {
        url: 'https://p3cdn2static.sharpschool.com/common/resources/images/Cliparts/Seasons%20&%20Holidays/Illustration%20Of%20The%20Sun%20With%20Clouds.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
    };
    if (tempRangeStart !== undefined || tempRangeEnd !== undefined) {

        if (!clickedOW) {


            clickedOW = true;


            $.getJSON("../Mti_Final_Proj/open_weather_to_json.php?start_date=" + tempRangeStart + " " + tempRangeHours + ":00:00&end_date=" + tempRangeEnd + " " + tempRangeHours + ":00:00",
                function (data) {

                    var infowindow = new google.maps.InfoWindow();

                    for (var i in data) {

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(data[i].weather_latitude.toString(), data[i].weather_longitude.toString()),
                            map: mapGoogle,
                            icon: image


                        });
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent('<pre class="bg-black"><h6><b>Title             </b>                               ' + data[i].weather_title + '</h6><h6><b>Description</b>                               ' + data[i].weather_description + '</h6>' + '<h6><b><h8>Sun Rise                               ' + data[i].weather_sunrise + '</h8></b><br/><b><h7>Sun set                                  ' + data[i].weather_sunset + '</h7></b></h6></pre>');
                                infowindow.open(mapGoogle, marker);
                                var heatMapData = [{}];


                                if (data[i].weather_description === 'Sky is Clear') {
                                    heatMapData.push({
                                        location: new google.maps.LatLng(data.events.event[i].latitude.toString(), data.events.event[i].longitude.toString()),
                                        weight: 0.5
                                    });
                                    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.1);
                                    var heatmap = new google.maps.visualization.HeatmapLayer({
                                        data: heatMapData
                                    });
                                    heatmap.setMap(mapGoogle);
                                }
                                else {

                                    heatMapData.push({
                                        location: new google.maps.LatLng(data.events.event[i].latitude.toString(), data.events.event[i].longitude.toString()),
                                        weight: 2
                                    })
                                    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.3);
                                    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.1);
                                    var heatmap = new google.maps.visualization.HeatmapLayer({
                                        data: heatMapData
                                    });
                                    heatmap.setMap(mapGoogle);
                                }


                                toggleBounce(marker);
                            }

                        })(marker, i));

                    }

                }
            );


        }
        else {
            $('#arrow4').removeClass("fa-spin");
            refreshingMapFunction();

        }
    }


}
var HereSplClick = 0;
var hereFunction = function () {
    if (HereSplClick === 0) {
        HereSplClick = 1;
        applyFunction(30);
        $('#arrow3').addClass("fa-spin");
        if (tempRangeStart !== undefined || tempRangeEnd !== undefined) {

            var image = {
                url: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Marker-Outside-Azure-icon.png',
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            };
            clickedHere = true;

            $.getJSON("../Mti_Final_Proj/here_incident_to_json.php?start_date=" + tempRangeStart + " " + tempRangeHours + ":00:00&end_date=" + tempRangeEnd + " " + tempRangeHours + ":00:00",
                function (data) {
                    // console.log("../Mti_Final_Proj/here_incident_to_json.php?start_date="+tempRangeStart+" "+tempRangeHours+":00:00"+"&end_date="+tempRangeEnd+" "+tempRangeHours+":00:00");


                    var infowindow = new google.maps.InfoWindow();

                    for (var i in data) {

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(data[i].traffic_from_latitude.toString(), data[i].traffic_from_longitude.toString()),

                            icon: image

                        });


                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent('<pre class="bg-black"><h6><b>Title             </b>                               ' + data[i].traffic_type_desc + '</h6><h6><b>Description</b>                               ' + data[i].traffic_full_description + '</h6>' + '<h6><b><h8>Start Time                               ' + data[i].traffic_start_time + '</h8></b><br/><b><h7>End Time                                  ' + data[i].traffic_end_time + '</h7></b></h6></pre>');
                                infowindow.open(mapGoogle, marker);
                                toggleBounce(marker);
                            }

                        })(marker, i));


                        marker.setMap(mapGoogle);


                    }


                }
            );


        }

    } else {
        $('#arrow3').removeClass("fa-spin");
        HereSplClick = 0;
        clickedHere = true;
        refreshingMapFunction();

    }

}

var BriteSplClick = 0;
var eventbriteFunction = function () {
    var image = {
        url: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/128/Map-Marker-Marker-Outside-Chartreuse-icon.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    };


    if (tempRangeStart !== undefined || tempRangeEnd !== undefined) {
        if (BriteSplClick === 0) {
            BriteSplClick = 1;
            applyFunction(30);
            $('#arrow2').addClass("fa-spin");


            clickedEB = true;


            $.getJSON("../Mti_Final_Proj/event_brite_to_json.php?start_date=" + tempRangeStart + " " + tempRangeHours + ":00:00&end_date=" + tempRangeEnd + " " + tempRangeHours + ":00:00",
                function (data) {
                    here_count = data.length;
                    //console.log('EB'+"../Mti_Final_Proj/event_brite_to_json.php?start_date="+tempRangeStart+" "+tempRangeHours+":00:00"+"&end_date="+tempRangeEnd+" "+tempRangeHours+":00:00");
                    var infowindow = new google.maps.InfoWindow();


                    for (var i in data) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(data[i].event_latitude.toString(), data[i].event_longitude.toString()),
                            map: mapGoogle,
                            icon: image

                        });

                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent('<pre class="bg-black"><h6><b>Title             </b>                               ' + data[i].event_title + '</h6><h6><b>Description</b>                               ' + data[i].event_description + '</h6>' + '<h6><b><h8>Start Time                               ' + data[i].event_start_time + '</h8></b><br/><b><h7>End Time                                  ' + data[i].event_end_time + '</h7></b></h6></pre>');
                                infowindow.open(mapGoogle, marker);
                                toggleBounce(marker);
                            }

                        })(marker, i));


                    }

                }
            );


        }

        else {

            BriteSplClick = 0;
            $('#arrow2').removeClass("fa-spin");
            refreshingMapFunction();
            clickedEB = true;

        }
    }

}
//On document ready we have default starting and ending date set
$(document).ready(dates);
//Click Event Listeners for individual source

$('#eventful').click(eventfulFunction);
$('#eventbrite').click(function () {
    setTimeout(eventbriteFunction, 1400);
});
$('#here').click(function () {
    setTimeout(hereFunction, 1400);
});
$('#openweather').click(function () {
    setTimeout(openweatherFunction, 1400);
});
//Link start pins - to view road link information

$('#RLI').click(markerStartPins);


//Date picker from input text area
$(function () {
    $("#input-from").datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
        onClose: function (selectedDate) {
            $("#input-to").datepicker("option", "minDate", selectedDate);
            applyFunction(1);
            refreshingMapFunction();

        }
    });

});






