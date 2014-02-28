// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


var albumLoaderApp = angular.module('albumLoaderApp', []);

/*albumLoaderApp.controller('albumListCtrl', function ($scope, $http) {
 $http.get('../assets/albums.json').success(function(data) {
 $scope.albums = data.album;
 });

 });*/

albumLoaderApp.controller('albumListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('../assets/albums.json').success(function (data) {
        $scope.albums = data.album;
    });
}]);