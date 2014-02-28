// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function($scope) {
    $scope.phones = [
        {'name': 'Nexus S',
            'snippet': 'b Fast just got faster with Nexus S.',
            'age': 1},
        {'name': 'Motorola XOOM™ with Wi-Fi',
            'snippet': 'c The Next, Next Generation tablet.',
            'age': 2},
        {'name': 'MOTOROLA XOOM™',
            'snippet': 'a The Next, Next Generation tablet.',
            'age': 3}
    ];

    $scope.orderops = 'age';
});



