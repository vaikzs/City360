/**
 * Created by vaikunth on 2/12/16.
 */
    var trafficLayer = function(url){
        map.eachLayer(function (layer) {

            if (layer !== baseOutdoors && layer!== baseDark && layer!== baseStreet && layer!== baseSatellite && layer !== markersEventful && layer !== markers && layer !==filterCircle) {

                map.removeLayer(layer);



            }



        });
        if(map.getZoom() > 12) {
            $.ajax({
                url: "http://na.api.inrix.com/traffic/inrix.ashx?action=getsecuritytoken&VendorID=1808895794&ConsumerID=ce1f424d-fb48-43d3-a4b8-999c0c9d913e",
                dataType: "xml"
            }).done(function (data) {
                securityToken = data.getElementsByTagName("AuthToken")[0].textContent;
                serverPath = data.getElementsByTagName("ServerPath")[0].textContent;
                var imageBounds = map.getBounds();
                console.log(map.getZoom());
                overlay = L.imageOverlay('http://na-rseg-tts.inrix.com/RsegTiles/Tile.ashx?Action=GetMapTile&token=' + securityToken + '&corner1=' + map.getBounds()._northEast.lat + '|' + map.getBounds()._northEast.lng + '&corner2=' + map.getBounds()._southWest.lat + '|' + map.getBounds()._southWest.lng + '&width=' + map.getSize().x + '&height=' + map.getSize().y + '&coverage=255&format=png&FRCLevel=1,2,3,4,5,6,7&layers=T&roadsegmenttype=TMC', imageBounds, {
                    opacity: 0.6,
                    attribution : "Source from INRIX"

                })
                overlay.addTo(map);
                //
                //var layerr = L.tileLayer('http://na-rseg-tts.inrix.com/RsegTiles/Tile.ashx?Action=GetMapTile&token=' + securityToken + '&corner1=' + map.getBounds()._northEast.lat + '|' + map.getBounds()._northEast.lng + '&corner2=' + map.getBounds()._southWest.lat + '|' + map.getBounds()._southWest.lng + '&width=' + map.getSize().x + '&height=' + map.getSize().y + '&coverage=255&format=png&FRCLevel=1,2,3,4,5,6,7&layers=T&roadsegmenttype=TMC', {
                //    format: 'png',
                //    bounds : imageBounds,
                //    opacity : 1.0,
                //    tileSize : 1000
                //
                //                }).addTo(map);


            });
        }
    }

