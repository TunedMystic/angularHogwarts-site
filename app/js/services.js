

(function() {
  
  var app = angular.module("hogwarts");
  
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
  
})();