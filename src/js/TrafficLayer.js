/**
 * Created by vaikunth on 2/12/16.
 */

var trafficLayer = function () {


    //map.eachLayer(function(layer){
    //
    //
    //
    //
    //
    //
    //
    //});
    map.eachLayer(function(layer){

        //if (layer !== baseLight && layer !== baseEmerald && layer !== baseStyle && layer !== baseStreet && layer !== baseDark && layer !== baseOutdoors && layer !== baseSatellite && layer !== markersEventful && layer !== markersInrix && layer !== filterCircle && layer !== markersCameras && typeof layer !== 'L.marker') {
        //            map.removeLayer(layer);
        //        }
       if(layer === imageOverlay || typeof imageOverlay === layer){
           map.removeLayer(layer);
       }

    });


    if (map.getZoom() <= 16) {
        $.ajax({
            url: "http://na.api.inrix.com/traffic/inrix.ashx?action=getsecuritytoken&VendorID=1808895794&ConsumerID=ce1f424d-fb48-43d3-a4b8-999c0c9d913e",
            dataType: "xml"
        }).done(function (data) {
            securityToken = data.getElementsByTagName("AuthToken")[0].textContent;
            serverPath = data.getElementsByTagName("ServerPath")[0].textContent;

            var imageBounds = map.getBounds();
            var zoom = map.getZoom();
            var frc = '';
            var penwidth = '';
            if (zoom <= 8) {
                frc = '1';
                penwidth = 4.75;
            }
            else if (zoom <= 12) {
                frc = "1,2";
                penwidth = 5;
            }
            else if (zoom == 13) {
                frc = "1,2,3";
                penwidth = 6;
            }
            else if (zoom == 14) {
                frc = "1,2,3,4";
                penwidth = 7;
            }
            else if (zoom == 15) {
                frc = "1,2,3,4,5";
                penwidth = 8;
            }
            else if (zoom == 16) {
                frc = "1,2,3,4,5,6,7";
                penwidth = 9;
            }

            imageOverlay = L.imageOverlay('http://na-rseg-tts.inrix.com/RsegTiles/Tile.ashx?Action=GetMapTile&speedBucketId=54135&token=' + securityToken + '&corner1=' + map.getBounds()._northEast.lat + '|' + map.getBounds()._northEast.lng + '&corner2=' + map.getBounds()._southWest.lat + '|' + map.getBounds()._southWest.lng + '&width=' + map.getSize().x + '&height=' + map.getSize().y + '&opacity=100&penwidth=' + penwidth + '&coverage=255&format=png&FRCLevel=' + frc + '&layers=T&roadsegmenttype=TMC&resolution=25', imageBounds, {});


            imageOverlay.addTo(map);



        });
    }
    else {

        //Popup a message, telling the traffic cannot be displayed for this zoom level
    }

}

