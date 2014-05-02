'use strict';

/* Directives */




angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
directive('myAutocompleteText', function($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            minInputLength: '@minInput',
            remoteData: '&',
            placeholder: '@placeholder',
            restrictCombo: '@restrict',
            selectedItem: '=selectedItem'
        },
        template: '<div class="dropdown search" ' +
        '     ng-class="{open: focused && choices.length>0}">' +
        '     <input type="text" class="form-control txttextSearch" ng-model="searchTerm" placeholder="{{placeholder}}"   ng-keydown="arrowBttnSrch($event)"' +
        '         tabindex="1" accesskey="s" class="input-medium search-query" focused="focused" ng-keyup="enterKeySearch($event, this.searchTerm)">' +
        '    <ul class="dropdown-menu ge-autosuggest">' +
        '         <li class="ge-autosuggest-label">Keywords <span class="ge-text-small">(About {{choices.length}} results)</span></li><li class="txtresults" ng-repeat="choice in choices | limitTo:3" ng-class="{activeLi: choice.label == activeLiTxt}">' +
        '          <a href="javascript:void(0);" ng-click="selectMe(choice, $event)" ng-bind-html="\'{{choice.label}}\'></a></li>' +
        '     </ul>' +
        '</div>',
        controller: function($scope, $rootScope, $element, $attrs) {
            if($rootScope.searchTermItem!= 'null')$scope.searchTerm =  $rootScope.searchTermItem;

            //console.log('inside controller');
            $scope.selectMe = function(choice, $event) {
               
                $scope.selectedItem = choice;
                $scope.searchTerm = $scope.lastSearchTerm = choice.label;

                //fire the search
                $rootScope.searchTermItem = choice.label;
                //$rootScope.loadStudiesTxt();
            };

            $scope.arrowBttnSrch = function($event){
               if($event.keyCode == 38||$event.keyCode == 40){
                  
                   var currLiChoices = angular.element(".txtresults");
                   var activeClassSet = false;
                   var currentPosition = ""
                  
                  angular.forEach(currLiChoices, function(v,k){
                      var thisClassList =  v.classList;                    
                      if($.inArray("activeLi", thisClassList) != -1){                       
                            activeClassSet = true;
                            currentPosition = k;
                      };                     
                  });

                  if(activeClassSet == false){                   
                    $scope.activeLiTxt = currLiChoices[0].innerText.trim();
                  }else{                   
                    if($event.keyCode == 38){                        
                       if(currentPosition>0)$scope.activeLiTxt = currLiChoices[currentPosition - 1].innerText.trim();
                    };
                    if($event.keyCode == 40){                       
                        if(currentPosition<2)$scope.activeLiTxt = currLiChoices[currentPosition + 1].innerText.trim();
                    };
                  };
                    
                    
               };
            };
            

            $scope.enterKeySearch = function($event, inputVal){   
                if($event.keyCode == 13){
                    var currLiChoices = angular.element(".txtresults");
                    var activeClassSet = false;
                    angular.forEach(currLiChoices, function(v,k){
                        var thisClassList =  v.classList;                    
                        if($.inArray("activeLi", thisClassList) != -1){                       
                              activeClassSet = true;                          
                        };                     
                    });
                    if(activeClassSet == true){
                        $scope.searchTerm = $scope.lastSearchTerm = $scope.activeLiTxt;
                        $rootScope.searchTermItem = $scope.activeLiTxt;
                    }
                    else{
                        //to mimic the dropdown choices
                        var enterKeySearchObj = {
                            value: inputVal,
                            label: inputVal
                        }
                        
                        $scope.selectedItem = enterKeySearchObj; 
                        $scope.searchTerm = $scope.lastSearchTerm = enterKeySearchObj.label;
                        $rootScope.searchTermItem = enterKeySearchObj.label;
                    }
                }
                else{
                    //to mimic the dropdown choices
                    var enterKeySearchObj = {
                        value: inputVal,
                        label: inputVal
                    }
                    
                    $scope.selectedItem = enterKeySearchObj; 
                    $scope.searchTerm = $scope.lastSearchTerm = enterKeySearchObj.label;
                    $rootScope.searchTermItem = enterKeySearchObj.label;
                } 

                
               
            }

            $scope.UpdateSearch = function() {               
                if ($scope.canRefresh()) {
                    $scope.searching = true;
                    $scope.lastSearchTerm = $scope.searchTerm;                    
                    try {
                        $scope.remoteData({
                            request: {
                                term: $scope.searchTerm
                            },
                            response: function(data) {                                                            
                                $scope.choices = data;
                                $scope.searching = false;
                            }
                        });
                    } catch (ex) {
                        //console.log(ex.message);
                        $scope.searching = false;
                    }
                }
            }
            $scope.$watch('searchTerm', $scope.UpdateSearch);
            $scope.canRefresh = function() {
                return ($scope.searchTerm !== "") && ($scope.searchTerm !== $scope.lastSearchTerm) && ($scope.searching != true);
            };
        },
        link: function(scope, iElement, iAttrs, controller) {
            scope._searchTerm = '';
            scope._lastSearchTerm = '';
            scope.searching = false;
            scope.choices = []; 
                   
            if (iAttrs.restrict == 'true') {
                var searchInput = angular.element(iElement.children()[0]);
                searchInput.bind('blur', function() {
                    if (scope.choices.indexOf(scope.selectedItem) < 0) {

                        //*************************
                        //commented out for keypress to not delete selectedItem overwrite.
                        //*************************
                        //commented out for keypress
                        //scope.selectedItem = null;
                        //scope.searchTerm = '';
                    }
                });
            }      
        }

    };
})
.directive("focused", function($timeout) {       
    return function(scope, element, attrs) {       
        element[0].focus();
        element.bind('focus', function() {
            scope.$apply(attrs.focused + '=true');
        });
        element.bind('blur', function() {
            scope.activeLiTxt = "";
            $timeout(function() {
                scope.$eval(attrs.focused + '=false');
            }, 200);
        });
        element.bind('keypress', function($event) {
            if($event.keyCode ==13){
                $timeout(function() {
                    scope.$eval(attrs.focused + '=false');
                }, 200);
            }
        });
        scope.$eval(attrs.focused + '=true')
    }
});
