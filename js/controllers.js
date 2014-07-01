
(function() {
  
  var app = angular.module("hogwarts");
  
  // Controller for viewing and filtering students.
  app.controller("StudentsController", ["$scope", "StudentFactory", function($scope, StudentFactory) {
    $scope._deb = 400;
    $scope.deleteButton = false;
    $scope.students = [];
    $scope.currentStudent = {};
    
    // Default configuration for searching names.
    $scope.searchName = {
      first: "",
      last: ""
    };
    
    // Default configuration for searching the houses.
    $scope.searchHouse = {
      Gryffindor: true,
      Hufflepuff : true,
      Ravenclaw: true,
      Slytherin: true
    };
    
    // Catch the event 'clearCurrentStudent', and reset $scope.currentStudent.
    $scope.$on("clearCurrentStudent", function(e, data) {
      $scope.currentStudent = {};
    });
    
    // Toggle the 'deleteStudent' button.
    $scope.toggleDelete = function() {
      $scope.deleteButton = $scope.deleteButton === true ? false : true;
    };
    
    // When you click on a student, it becomes the 'currentStudent'.
    $scope.makeCurrentStudent = function(i) {
      if(!_.isEqual($scope.currentStudent, $scope.filteredStudents[i])) {
        $scope.currentStudent = $scope.filteredStudents[i];
      }
      //else console.log("the same...");
    }
    
    // Get the list of current students.
    function getStudents() {
      StudentFactory.getStudents()
        .then(function(data) {
          $scope.students = data.students;
        });
    }
    
    // Remove a selected student by their index (i).
    $scope.removeStudent = function(i) {
      // Check if the current student is the object being deleted.
      if(_.isEqual($scope.currentStudent, $scope.students[i]))
        // Reset the current student.
        $scope.currentStudent = {};
        
      StudentFactory.deleteStudent(i).then(function(data) {
        //console.log("Student deleted");
      });
    }
    
    getStudents();
    
  }]);


  // Controller for enrolling students.
  app.controller("EnrollController", ["$scope", "$location", "StudentFactory", "EnrollConfig", function($scope, $location, StudentFactory, EnrollConfig) {
    $scope.enrollForm = {};
    $scope._newStudentFields = {};
    
    init();
    
    // Initialize the controller with form data and models.
    function init() {
      // Get the enroll-form fields
      EnrollConfig.getConfig()
        .success(function(data) {
          $scope.enrollForm = data.enrollOptions;
        })
        .error(function(err) {
          // .. handle errors/
        });
      // Get the new student model
      EnrollConfig.getStudentModel()
        .success(function(data) {
          $scope._newStudentFields = data.newStudentModel;
          // Model for the new student.
          $scope.newStudent = newStudentModel();
        })
        .error(function(err) {
          // .. handle errors/
        });
    };
    
    // After the form is submitted, the form is cleared
    // and is bound to a new student object.
    function newStudentModel() {
      // Model for the new student.
      var temp = angular.copy($scope._newStudentFields);
      return temp;
    }
    
    // Add a new student to the 'StudentFactory' service.
    $scope.newStudentSubmit = function() {
      StudentFactory.addStudent($scope.newStudent).then(function(data) {       
        // Alert the change, then go to the root.
        alert("Student '" + $scope.newStudent.name.first + "' has been enrolled!");
        
        // Clear the form fields
        $scope.newStudent = newStudentModel();
        
        $location.path("/");
      });
    };
  }]);
  
})();