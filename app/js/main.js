

(function () {
	var app = angular.module("hogwarts", ["ngRoute"]);


	app.config(function($routeProvider) {
		$routeProvider
		.when("/", {
			templateUrl: "views/students.html",
			controller: "StudentsController"
		})
		.otherwise({
			templateUrl: "views/app404.html"
		});
	});
  
  
  /// Responsible for fetching student data.
  app.factory("Faculty", ["$http", function($http) {
    var Faculty = {};
    //var studentsUrl = "http://demo7058979.mockable.io/students";
    var studentsUrl = "/temp/students.json";
    
    Faculty.getStudents = function() {
      return $http.get(studentsUrl);
    };
    
    return Faculty;
  }]);
  
  
  app.controller("StudentsController", ["$scope", "Faculty", function($scope, Faculty) {
    $scope.students = [];
    $scope.searchParams = {
      "name": {
        "first": "",
        "last": ""
      },
      "school": {
        "house": {
          "gryffindor": "Gryffindor",
          "hufflepuff" : "Hufflepuff",
          "ravenclaw": "Ravenclaw",
          "slytherin": "Slytherin"
        }
      }
    };
    
    getStudents();
    
    function getStudents() {
      Faculty.getStudents()
        .success(function(data) {
          $scope.students = data.students;
          $scope.status = "Data loaded successfully!";
        })
        .error(function(error) {
          $scope.status = error;
        });
    }
    
  }]);
  
  app.filter("houseFilter", function() {
    
    return function(items, propertyString, searchModel) {
      var out = [];
      var searchStringHouses = _.values(searchModel);
      console.log("searchStringHouses: " + searchStringHouses);
      
      console.log("PropertyString: " + propertyString);
      console.log("searchModel: " + JSON.stringify(searchModel));
      
      for(var _i = 0; _i < items.length; _i++) {
        // Get the string of the house of the student.
        var itemHouse = util.getProp(items[_i], propertyString);
        //console.log("a student's house: " + itemHouse);
        if(itemHouse) {
          if(searchStringHouses.indexOf(itemHouse) != -1)
            out.push(items[_i]);
        }
      }
      
      return out;
    }
    
  });
  
  app.filter("studentsFilter", function() {
    
    return function(items, searchModel) {
      console.log("searchModel " + JSON.stringify(searchModel));
      var out = [];
      
      if(!searchModel) return items;
      
      /// Function to check if a property exists in an object.
      var isProp = function(prop) {
        return typeof(prop) !== "undefined";
      }
      
      var lower = function(s) {
        return s.toLowerCase();
      }
      
      var propFname = isProp(searchModel.name) && isProp(searchModel.name.first);
      var propLname = isProp(searchModel.last) && isProp(searchModel.name.last);
      var propSchool = isProp(searchModel.school) && isProp(searchModel.school.house);
      
      for(var _i = 0; _i < items.length; _i++) {
        var valid = true;
        
        /// Test each item by the parameters of the search text 'searchModel'.
        /// A search is valid if there is a substring within the item.
        if(propFname && valid) {
          if(lower(items[_i].name.first).indexOf(lower(searchModel.name.first)) === -1)
            valid = false;
        }
        if(propLname && valid) {
          if(lower(items[_i].name.last).indexOf(lower(searchModel.name.last)) === -1)
            valid = false;
        }
        if(propSchool && valid) {
          if(lower(items[_i].school.house).indexOf(lower(searchModel.school.house)) === -1)
            valid = false;
        }
        
        /// If the item passes through all filters.
        if(valid)
          out.push(items[_i]);
        
      }
      
      return out;
    }
    
  });

})();