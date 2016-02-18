//Converting XML TO JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

var newSource = function () {
//Authentication - Retrieving Security Token
    $.ajax({
        url: "http://na.api.inrix.com/traffic/inrix.ashx?action=getsecuritytoken&VendorID=1808895794&ConsumerID=ce1f424d-fb48-43d3-a4b8-999c0c9d913e&dataType=json",
        context: document.body,
        dataType: "xml"
    }).done(function (xml) {


        console.log(xml.getElementsByTagName("AuthToken")[0].textContent);
        //console.log(JSON.stringify(x2js.xml_str2json(xml.toString())));

        var securityToken = xml.getElementsByTagName("AuthToken")[0].textContent;
        var serverPath = xml.getElementsByTagName("ServerPath")[0].textContent;

        $.ajax({
            url: "http://na.api.inrix.com/traffic/inrix.ashx?Action=GetIncidentsInBox&Token=" + securityToken + "&Corner1=38.20|-121.87&Corner2=37.30|-123.00&LocRefmethod=XD,TMC&IncidentOutputFields=All",
            context: document.body,
            dataType: "xml"
        }).done(function (xml) {


            var jsonText = JSON.stringify(xmlToJson(xml));
            var jsonText2 = JSON.parse(jsonText);

            //console.log(json.inrix.incidents.incident[0].@attributes.latitude +" "+json.inrix.incidents.incident[0].@attributes.longitude);
            //console.log(jsonText2.Inrix.Incidents.Incident[0].attributes.latitude);

//            marker = new google.maps.Marker({
//                        position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[0].attributes.latitude,      jsonText2.Inrix.Incidents.Incident[0].attributes.longitude),
//                        map: mapGoogle,
//                        icon:'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Left-Pink-icon.png'
//
//                        });

//                        marker22 = new google.maps.Marker({
//                        position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[0].Head.attributes.latitude,      jsonText2.Inrix.Incidents.Incident[0].Head.attributes.longitude),
//                        map: mapGoogle
//
//
//                        });
//                 marker23 = new google.maps.Marker({
//                        position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[0].Tails.Tail.attributes.latitude,      jsonText2.Inrix.Incidents.Incident[0].Tails.Tail.attributes.longitude),
//                        map: mapGoogle
//
//
//                        });
            var imageLessSevere = {
                url: 'https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w170',
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50)
            };

            var imageMoreSevere = {
                url: 'http://maplacejs.com/images/red-dot.png',
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50)
            };


            var imageHead = {
                url: 'http://simpleicon.com/wp-content/uploads/map-marker-7.png',
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            };

            var imageTail = {
                url: 'http://simpleicon.com/wp-content/uploads/map-marker-7.png',
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            };


            console.log(jsonText2.Inrix.Incidents.Incident[0]);
            // console.log(jsonText2.Inrix.Incidents.Incident[1].attributes.latitude);
            //console.log(jsonText2.Inrix.Incidents.Incident[2].attributes.latitude);
            for (var i = 0; i < jsonText2.Inrix.Incidents.Incident.length; i++) {
                console.log(jsonText2.Inrix.Incidents.Incident[i].attributes.latitude);
                if (jsonText2.Inrix.Incidents.Incident[i].attributes.impacting === 'Y') {
                    if (jsonText2.Inrix.Incidents.Incident[i].attributes.severity >= 3) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[i].attributes.latitude.toString(), jsonText2.Inrix.Incidents.Incident[i].attributes.longitude.toString()),
                            map: mapGoogle,
                            icon: imageMoreSevere


                        });

                    }
                    else {

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[i].attributes.latitude.toString(), jsonText2.Inrix.Incidents.Incident[i].attributes.longitude.toString()),
                            map: mapGoogle,
                            icon: imageLessSevere


                        });

                    }

                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {


                            infowindow.setContent('<pre class="bg-black"><h6><b>Description</b>                               ' + jsonText2.Inrix.Incidents.Incident[i].FullDesc['#text'] + '</h6><h6><b>Impacting Traffic ?                </b>' + jsonText2.Inrix.Incidents.Incident[i].attributes.impacting + '</h6><h6><b>Severity         </b>                               ' + jsonText2.Inrix.Incidents.Incident[i].attributes.severity + '</h6>' + '<h6><b><h8>Start Time                               ' + jsonText2.Inrix.Incidents.Incident[i].attributes.startTime + '</h8></b><br/><b><h7>End Time                                  ' + jsonText2.Inrix.Incidents.Incident[i].attributes.endTime + '</h7></b></h6></pre>');

                            //HeatMap to show link that is
                            var headTail = [new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[i].Head.attributes.latitude, jsonText2.Inrix.Incidents.Incident[i].Head.attributes.longitude), new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[i].Tails.Tail.attributes.latitude, jsonText2.Inrix.Incidents.Incident[i].Tails.Tail.attributes.longitude)];


                            markerHEAD = new google.maps.Marker({
                                position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[i].Head.attributes.latitude, jsonText2.Inrix.Incidents.Incident[i].Head.attributes.longitude),
                                map: mapGoogle,
                                icon: imageHead


                            });
                            markerTAIL = new google.maps.Marker({
                                position: new google.maps.LatLng(jsonText2.Inrix.Incidents.Incident[i].Tails.Tail.attributes.latitude, jsonText2.Inrix.Incidents.Incident[i].Tails.Tail.attributes.longitude),
                                map: mapGoogle,
                                icon: imageTail


                            });
                            var flightPath = new google.maps.Polyline({
                                path: headTail,
                                geodesic: true,
                                strokeColor: '#424242',
                                strokeOpacity: 1.0,
                                strokeWeight: 3
                            });

                            flightPath.setMap(mapGoogle);

                            infowindow.open(mapGoogle, marker);

                            toggleBounce(marker);


                        }

                    })(marker, i));


                }


            }

            mapGoogle.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('legend'));

            $('#legend').append('<div><img src="' + imageLessSevere.url + '" height="22" width="22">LESS SEVERE</div>');
            $('#legend').append('<div><img src="' + imageMoreSevere.url + '" height="22" width="22">MORE SEVERE</div>');


        });


    });


};


$('#incident').click(newSource);
