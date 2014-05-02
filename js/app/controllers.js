'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);

  function autocompleteCtrl($scope, Serv) {    
      $scope.selectedItem = {
          value: 0,
          label: ''
      };
      $scope.Wrapper = Serv;    
  };