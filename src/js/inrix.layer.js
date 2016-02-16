/**
 * Created by vaikunth on 2/12/16.
 */
/**
 * Inrix traffic layer for use with Google Maps.
 *
 * @module InrixLayer
 */
(function () {

    /**
     * Implements traffic layer.
     *
     * @class InrixTileLayer
     */
    this.InrixTileLayer = function (map) {

        this.map = map;
        /**
         * Contains created and cached tiles.
         * @property tiles
         * @type {Array}
         */
        this.tiles = [];
        /**
         * Defines size of map tiles.
         * @property tileSize
         * @type {google.maps.Size}
         */
        this.tileSize = L.mapbox.map('map');
        /**
         * Defines maximal possible zoom level to show traffic tiles.
         * @property maxZoom
         * @type {Number}
         */
        this.maxZoom = 16;
        /**
         * Defines minimal possible zoom level to show traffic tiles.
         * @property minZoom
         * @type {Number}
         */
        this.minZoom = 5;
        /**
         * Defines name of the traffic layer.
         * @property name
         * @type {String}
         */
        this.name = 'Traffic Layer';
        /**
         * Defines alternative name of the traffic layer.
         * @property alt
         * @type {String}
         */
        this.alt = 'Traffic Layer';
        /**
         * Indicates whether the traffic layer is visible.
         * @property visible
         * @default false
         * @type {Boolean}
         */
        this.visible = false;
        /**
         * Indicates whether the traffic layer is initialized.
         * @property initialized
         * @default false
         * @type {Boolean}
         */
        this.initialized = false;

        this._self = this;

        /**
         * Returns a tile for the given tile coordinate (x, y) and zoom level.
         * New tile created if not available in the cache.
         * Tile will be appended to the given ownerDocument.
         *
         * @method getTile
         * @param tilePoint coordinate of a tile to return.
         * @param zoom requested zoom level.
         * @param ownerDocument owner document to append tile to.
         * @return {Node} tile element.
         */
        this.getTile = function (tilePoint, zoom, ownerDocument) {
            for (var n = 0; n < this.tiles.length; n++) {
                if (this.tiles[n].id == 't_' + tilePoint.x + '_' + tilePoint.y + '_' + zoom) {
                    return this.tiles[n];
                }
            }

            // If the tile does not exist then create it
            var tile = ownerDocument.createElement('img');
            tile.id = 't_' + tilePoint.x + '_' + tilePoint.y + '_' + zoom;
            tile.style.width = this.tileSize.width + 'px';
            tile.style.height = this.tileSize.height + 'px';
            tile.src = this.getTileUrl(tilePoint, zoom);
            if (!this.visible) {
                tile.style.display = 'none';
            }

            this.tiles.push(tile);

            while (this.tiles.length > 100) {
                var removed = this.tiles.shift();
                removed = null;
            }
            return tile;
        };

        /**
         * Returns a string (URL) for given tile coordinate (x, y) and zoom level.
         *
         * @method getTileUrl
         * @param tilePoint coordinate of a tile.
         * @param zoom requested zoom level.
         * @return {string} URL of the requested tile.
         */
        this.getTileUrl = function (tilePoint, zoom) {
            return Inrix.trafficTileUrlFromTileXY(tilePoint, zoom, { opacity:60, comparative:false });
        };

        this._initialize = function () {
            if (this.initialized) {
                return;
            }
            this.map.overlayMapTypes.insertAt(0, this._self);
            this.initialized = true;
        };

        /**
         * Hides all available traffic layer tiles.
         *
         * @method hide
         */
        this.hide = function () {
            this.visible = false;
            for (var n = 0; n < this.tiles.length; n++) {
                this.tiles[n].style.display = 'none';
            }
        };

        /**
         * Shows all available traffic layer tiles.
         *
         * @method show
         */
        this.show = function () {
            this._initialize();
            this.visible = true;
            for (var n = 0; n < this.tiles.length; n++) {
                this.tiles[n].style.display = '';
            }
        };
    }
})();
