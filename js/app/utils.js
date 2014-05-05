/**
 * Code borrowed from :
 * https://github.com/Esri/esri-leaflet-geocoder
 */

/**
 * Extracting Utility functions from https://github.com/Esri/esri-leaflet-geocoder/blob/master/src/esri-leaflet-geocoder.js
 *
 * Collecting of functions/code that can be used in this projct. 
 *
 * Incomplete, as of now.. 
 */

// serialize params to query string
  function serialize(params){
    var qs="?";

    for(var param in params){
      if(params.hasOwnProperty(param)){
        var key = param;
        var value = params[param];
        qs+=encodeURIComponent(key);
        qs+="=";
        qs+=encodeURIComponent(value);
        qs+="&";
      }
    }

    return qs.substring(0, qs.length - 1);
  }


  // we probably wont need this, but can be part of goecode object returned, so maps can use it
  // convert an arcgis extent to a leaflet bounds
  function extentToBounds(extent){
    var southWest = new L.LatLng(extent.ymin, extent.xmin);
    var northEast = new L.LatLng(extent.ymax, extent.xmax);
    return new L.LatLngBounds(southWest, northEast);
  }


  options: {
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
      outFields: 'Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City, Place_addr'
  }


  // Dumping here, but we will use Angular service to make ajax calls
  request: function(url, params, callback){
      var callbackId = "c"+(Math.random() * 1e9).toString(36).replace(".", "_");

      params.f="json";
      params.callback="L.esri.Services.Geocoding._callback."+callbackId;

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url + serialize(params);
      script.id = callbackId;
      this.fire('loading');

      L.esri.Services.Geocoding._callback[callbackId] = L.Util.bind(function(response){
        this.fire('load');
        callback(response);
        document.body.removeChild(script);
        delete L.esri.Services.Geocoding._callback[callbackId];
      }, this);

      document.body.appendChild(script);
    }



geocode: function(text, opts, callback){
      var defaults = {
        outFields: this.options.outFields
      };
      var options = L.extend(defaults, opts);
      options.text = text;
      this.request(this.options.url + "find", options, callback);
    },

suggest: function(text, opts, callback){
  var options = opts || {};
  options.text = text;
  this.request(this.options.url + "suggest", options, callback);
}



