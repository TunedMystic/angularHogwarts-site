

(function () {
  var app = angular.module("hogwarts", ["ngRoute", "ngAnimate"]);
  
  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $routeProvider
    .when("/", {
      templateUrl: "angularHogwarts-site/views/students.html",
      controller: "StudentsController"
    })
    .when("/enroll", {
      templateUrl: "angularHogwarts-site/views/enroll.html",
      controller: "EnrollController"
    })
    .otherwise({
      templateUrl: "views/app404.html"
    });
  }]);
  
})();
