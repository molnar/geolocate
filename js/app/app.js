'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).factory('Serv', function($http, $resource) {   
    return {
        AutoComplete: function(request, response) {            
            var retArray, dataToPost, config;
            var masterArray = [];            
            dataToPost = {
                f:'jsonp',
                term: request.term,
                maxRows: 3,                
                callback: 'JSON_CALLBACK'                             
            };             
            config = {
                method: 'JSONP',
                url: 'http://webqa.csc.noaa.gov/dataservices/geoESPIS/AutoComplete',
                params: dataToPost
            };      
            //console.log(config)      
            $http.jsonp(config.url, config).
            success(function(data, status, headers, config) {                
                //console.log('1');                                               
                retArray = data.AutoComplete[0].Terms.map(function(item) {                    
                    return {
                        label: item.Term,
                        value: item.Term
                    }
                }); 
                if(retArray[0].label != 'undefined')response(retArray);
            }).
            error(function(data, status, headers, config) {
                response([]);
            });
            

        }
        
    }
})
