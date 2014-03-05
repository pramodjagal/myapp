// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


var builderApp = angular.module('builderApp', [
    'builderControllers',
    'ngRoute'
]);


var builderControllers =  angular.module('builderControllers', []);

builderControllers.controller('albumListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/assets/albums.json').success(function (data) {
        $scope.albums = data.album;
    });
}]);

builderControllers.controller('pictureListCtrl',['$scope','$http','$routeParams', function($scope, $http, $routeParams) {
    alert($routeParams.albumOid);
    $http.get('/assets/demopics.json').success(function (data) {
        $scope.pictures = data.userAssets.userAsset;
        $scope.albumDetails = data.albumInfo;
    });
    $scope.albumOid = $routeParams.albumOid;
}]);

/*builderControllers.controller('picturePreviewCtrl',['$scope','$http','$routeParams', function($scope, $http, $routeParams) {
    alert($routeParams.albumOid);
    $http.get('/assets/demopics.json').success(function (data) {
        $scope.pictures = data.userAssets.userAsset;
        $scope.albumDetails = data.albumInfo;
    });
    $scope.pictureOid = $routeParams.pictureOid;
}]);*/

builderControllers.controller('picInfoCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/assets/picinfo.json').success(function (data) {
        $scope.picInfo = data;
        alert(data);
    });
}]);


builderApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/albums', {
                templateUrl: '/templates/albums.html',
                controller: 'albumListCtrl'
            }).
            when('/albums/:albumOid', {
                templateUrl: '/templates/pictures.html',
                controller: 'albumListCtrl'
            }).
            when('/preview/:pictureOid', {
                templateUrl: '/templates/preview.html',
                controller: 'albumListCtrl'
            }).
            otherwise({
                redirectTo: '/albums'
            });
    }]
);

