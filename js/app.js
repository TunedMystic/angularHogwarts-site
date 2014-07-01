

(function () {
  var app = angular.module("hogwarts", ["ngRoute", "ngAnimate"]);
  
  app.config(function($routeProvider) {
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
  });

})();