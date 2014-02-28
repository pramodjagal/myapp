// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


var albumApp = angular.module('albumApp', []);

/*albumLoaderApp.controller('albumListCtrl', function ($scope, $http) {
 $http.get('../assets/albums.json').success(function(data) {
 $scope.albums = data.album;
 });

 });*/

albumApp.controller('albumListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('../assets/albums.json').success(function (data) {
        $scope.albums = data.album;
    });
}]);

albumApp.controller('pictureListCtrl',['$scope','$http', function($scope, $http) {
    $http.get('../assets/demopics.json').success(function (data) {
        $scope.pictures = data.userAssets.userAsset;
        $scope.albumDetails = data.albumInfo;
    });
}]);

