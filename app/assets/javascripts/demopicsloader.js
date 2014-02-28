var demoPicLoaderApp = angular.module('demoPicLoaderApp', []);

/*
 demoPicLoaderApp.controller('demoPicListCtrl', function ($scope, $http) {
 $http.get('../assets/demopics.json').success(function(data) {
 $scope.pictures = data.userAssets.userAsset;
 $scope.albumDetails = data.albumInfo;
 });

 });
 */
function demoPicListCtrl($scope, $http) {
    $http.get('../assets/demopics.json').success(function (data) {
        $scope.pictures = data.userAssets.userAsset;
        $scope.albumDetails = data.albumInfo;
    });
}

demoPicListCtrl.inject = ['$scope', '$http'];
demoPicLoaderApp.controller('demoPicListCtrl', demoPicListCtrl);

