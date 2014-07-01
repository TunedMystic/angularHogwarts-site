
(function() {
  
  var app = angular.module("hogwarts");
  
  // Directive for viewing the details of a single student.
  app.directive("student", function() {
    return {
      restrict: "E",
      replace: true,
      scope: {
        studentDataString: "@studentData"
      },
      templateUrl: "views/directive-student.html",
      controller: ["$rootScope", "$scope", function($rootScope, $scope) {
        $scope.studentDataString;
        $scope.studentDataModel;
        $scope.emptyData = true;
        
        // Parse the string sent in the directive into an actual object.
        function parseStudentData() {
          $scope.studentDataModel = JSON.parse($scope.studentDataString);
          
          // Determine if the sent-in data is an empty object.
          $scope.emptyData = _.isEqual($scope.studentDataModel, {});
        }
        
        // Clear data from this directive.
        $scope.clearData = function() {
          // Dispatch the event: 'Clear the currentStudent variable'.         
          $rootScope.$broadcast("clearCurrentStudent", "<oh yea />");
        };
        
        // Get the picture url of the student.
        $scope.getStudentPicture = function() {
          if(!$scope.emptyData)
            return $scope.studentDataModel.race + "_" + $scope.studentDataModel.gender;
          else return "noData";
        };
        
        // Watch the incoming data ('studentDataString') to update values.
        $scope.$watch(function() { return $scope.studentDataString}, function(newVal, oldVal) {
          // If there is a change, then parse the new data.
          if(newVal != oldVal) parseStudentData();
        });
        
        parseStudentData();
      }]
    };
  });

  
  // Directive to debounce an input.
  // NOTE: This is not my directive.
  // Source: //stackoverflow.com/questions/21088845/
  app.directive('debounce', ["$timeout", function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 99,
      link: function (scope, elm, attr, ngModelCtrl) {
        if (attr.type === 'radio' || attr.type === 'checkbox') {
          return;
        }
        
        var delay = parseInt(attr.debounce, 10);
        if (isNaN(delay)) {
          delay = 1000;
        }
        
        elm.unbind('input');
        
        var timeLeft;
        elm.bind('input', function () {
          $timeout.cancel(timeLeft);
          timeLeft = $timeout(function () {
            scope.$apply(function () {
              ngModelCtrl.$setViewValue(elm.val());
            });
          }, delay);
        });
        
        elm.bind('blur', function () {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(elm.val());
          });
        });
      }
    };
  }]); // debounce
  
})();