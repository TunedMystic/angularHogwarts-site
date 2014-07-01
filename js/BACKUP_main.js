

(function () {
	var app = angular.module("hogwarts", ["ngRoute"]);


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
  
  
  /*/// Responsible for fetching student data.
  app.factory("StudentFactory", ["$http", function($http) {
    var StudentFactory = {};
    //var studentsUrl = "http://demo7058979.mockable.io/students";
    var studentsUrl = "/temp/students.json";
    
    StudentFactory.getStudents = function() {
      return $http.get(studentsUrl);
    };
    
    return StudentFactory;
  }]);*/

  app.factory("StudentFactory", ["$q", function($q) {
    var mainStudents = [];
    
    var getStudents = function() {
      if(mainStudents.length === 0) {
        var deffered = $q.defer();
        console.log("$http call");
        mainStudents = _mainStudentList;
        deffered.resolve(mainStudents);
        return deffered.promise;
      }
      else {
        var deffered = $q.defer();
        deffered.resolve(mainStudents);
        return deffered.promise;
      }
    };
    
    var addStudent = function(newStudent) {
      if(mainStudents.length === 0)
        getStudents();
      
      var deffered = $q.defer();
      mainStudents.students.push(newStudent);
      deffered.resolve(mainStudents);
      return deffered.promise;
    };
    
    var deleteStudent = function(studentIndex) {
      if(mainStudents.length === 0)
        getStudents();
      
      var deffered = $q.defer();
      mainStudents.students.splice(studentIndex, 1);
      deffered.resolve(mainStudents);
      return deffered.promise;
    };
    
    return {
      getStudents: getStudents,
      addStudent: addStudent,
      deleteStudent: deleteStudent
    }
    
  }]);

  
  app.controller("StudentsController", ["$scope", "StudentFactory", function($scope, StudentFactory) {
    $scope.students = [];
    
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

    getStudents();
    
    function getStudents() {
      StudentFactory.getStudents()
        .then(function(data) {
          //$scope.students = data;
          $scope.students = data.students;
        });
    }
    
    $scope.removeStudent = function(i) {
      StudentFactory.deleteStudent(i).then(function(data) {
        console.log("Student deleted");
        console.log(data);
      });
    }
    
    $scope.testUpdate = function () {
      var testStudent = {
        "name": {
          "first": "Ron",
          "last": "Bombad Jedi"
        },
        "gender": "Male",
        "race": "Troll",
        "school": {
          "house": "Gryffindor",
          "year": "3"
        } 
      };
      StudentFactory.addStudent(testStudent).then(function(data) {
        console.log("Updated...");
        console.log(data);
      });
    };
    
  }]);
  
  
  app.factory("EnrollConfig", ["$http", function($http) {
    var configUrl = "/temp/enrollConfig.json";
    var newStudentUrl = "/temp/newStudent.json";
    
    var getConfigObject = function() {
      return $http.get(configUrl);
    };
    
    var getNewStudentModel = function() {
      return $http.get(newStudentUrl);
    }
    
    return {
      getConfig: getConfigObject,
      getStudentModel: getNewStudentModel
    };
    
  }]);
  
  
  app.controller("EnrollController", ["$scope", "StudentFactory", "EnrollConfig", function($scope, StudentFactory, EnrollConfig) {
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
          
        });
      // Get the new student model
      EnrollConfig.getStudentModel()
        .success(function(data) {
          $scope._newStudentFields = data.newStudentModel;
          
          // Model for the new student.
          $scope.newStudent = newStudentModel();
        })
        .error(function(err) {
          
        });
    };
    
    // After the form is submitted, the form is cleared
    // and is bound to a new student object.
    function newStudentModel() {
      // Model for the new student.
      var temp = angular.copy($scope._newStudentFields);
      return temp;
    }
    
    $scope.newStudentSubmit = function() {
      alert(JSON.stringify($scope.newStudent, null, 2));
      StudentFactory.addStudent($scope.newStudent).then(function(data) {
        console.log("enroll updated");
        console.log(data);
        // Clear the form fields
        $scope.newStudent = newStudentModel();
      });
    };
    
  }]);
  
  
  app.filter("studentHouseFilter", function() {
    
    return function(items, searchModel) {
      var out = [];
      
      // Get the names of the houses.
      var houseNames = _.keys(searchModel);      
      
      // Discard the house(s) which point to a false value.
      _.each(searchModel, function(value, key) {
        if(value === false)
          // Cut the value out.
          houseNames.splice(houseNames.indexOf(key), 1);
      });
      
      // If 'searchModel' has no data in it, then return nothing.
      if(houseNames.length === 0) return out;
      // If 'searchModel' has all the data in it, then return everything.
      if(houseNames.length === 4) return items;
      
      // Add the item if it's house is in the list 'houseNames'.
      _.each(items, function(el, idx) {
        if(houseNames.indexOf(el["school"]["house"]) !== -1)
          out.push(el);
      });
      
      return out;
    }
    
  });
  
  
  app.filter("studentNameFilter", function() {
    
    return function(items, searchModel) {
      var out = [];
      var studentNames = _.values(searchModel);
      
      // If no names are given, then return everything.
      if(_.isEqual(studentNames, ['', ''])) return items;
      
      _.each(items, function(el, idx) {
        var valid = true;
        
        // Check if the search data is a substring of the actual name.
        if(searchModel.first != "")
          if(util.lower(el.name.first).indexOf(util.lower(searchModel.first)) === -1)
            valid = false;
        if(searchModel.last != "")
          if(util.lower(el.name.last).indexOf(util.lower(searchModel.last)) === -1)
            valid = false;
        if(valid)
          
          out.push(el);
      });
      
      return out;
    }
    
  });

})();