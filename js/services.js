

(function() {
  
  var app = angular.module("hogwarts");
  
  // A Factory to facilitate the management of students.
  app.factory("StudentFactory", ["$q", function($q) {
    var mainStudents = [];
    
    var getStudents = function() {
      if(mainStudents.length === 0) {
        var deffered = $q.defer();
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
        getStudents(); // should attach .then()
      
      var deffered = $q.defer();
      mainStudents.students.push(newStudent);
      deffered.resolve(mainStudents);
      return deffered.promise;
    };
    
    var deleteStudent = function(studentIndex) {
      if(mainStudents.length === 0)
        getStudents(); // should attach .then()
      
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


  // A Factory to give access to enrollment config files.
  app.factory("EnrollConfig", ["$http", function($http) {
    var configUrl = "js/enrollConfig.json";
    var newStudentUrl = "js/newStudent.json";
    
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