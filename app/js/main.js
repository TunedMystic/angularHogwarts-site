

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