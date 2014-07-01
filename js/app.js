

(function () {
  var app = angular.module("hogwarts", ["ngRoute", "ngAnimate"]);
  
  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // This is for hash-less urls.
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix("#");
    
    $routeProvider
    .when("/", {
      templateUrl: "views/students.html",
      controller: "StudentsController"
    })
    .when("/enroll", {
      templateUrl: "views/enroll.html",
      controller: "EnrollController"
    })
    .otherwise({
      templateUrl: "views/app404.html"
    });
  }]);
  
})();
