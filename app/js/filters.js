

(function() {
  
  var app = angular.module("hogwarts");
  
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