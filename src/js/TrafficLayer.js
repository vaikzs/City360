/**
 * Created by vaikunth on 2/12/16.
 */
var trafficLayer = function () {
    map.eachLayer(function (layer) {

        if ( layer !=baseStyle && layer != baseStreet && layer!== baseDark && layer !== baseOutdoors && layer!== baseSatellite && layer !== markersEventful && layer !== markers && layer !== filterCircle && layer !== markersCameras) {

            map.removeLayer(layer);


        }

    });


            $.ajax({
                url: "http://na.api.inrix.com/traffic/inrix.ashx?action=getsecuritytoken&VendorID=1808895794&ConsumerID=ce1f424d-fb48-43d3-a4b8-999c0c9d913e",
                dataType: "xml"
            }).done(function (data) {
                securityToken = data.getElementsByTagName("AuthToken")[0].textContent;
                serverPath = data.getElementsByTagName("ServerPath")[0].textContent;
                var imageBounds = map.getBounds();
                console.log(map.getZoom());
                var zoom = map.getZoom();
                var frc = '';
                if (zoom <= 8) {
                    frc = '1';
                }
                else if (zoom <= 12) {
                    frc = "1,2";
                }
                else if (zoom == 13) {
                    frc = "1,2,3";
                }
                else if (zoom == 14) {
                    frc =  "1,2,3,4";
                }
                else if (zoom == 15) {
                    frc = "1,2,3,4,5";
                }
                else if(zoom == 16){
                    frc = "1,2,3,4,5,6,7";
                }
                //Map Quest Traffic Data
                //MQ.trafficLayer().addTo(map);
                overlay = L.imageOverlay('http://na-rseg-tts.inrix.com/RsegTiles/Tile.ashx?Action=GetMapTile&speedBucketId=54135&token=' + securityToken + '&corner1=' + map.getBounds()._northEast.lat + '|' + map.getBounds()._northEast.lng + '&corner2=' + map.getBounds()._southWest.lat + '|' + map.getBounds()._southWest.lng + '&width=' + map.getSize().x + '&height=' + map.getSize().y + '&opacity=80&penwidth=8&coverage=1&format=png&FRCLevel='+frc+'&layers=T&roadsegmenttype=TMC&resolution=25&starttime=2016-03-01T02%3A00%3A46.0Z', imageBounds, {



                }).addTo(map);






            });


}

