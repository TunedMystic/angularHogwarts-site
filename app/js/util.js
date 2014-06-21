var util = {};


util = (function() {
  return {
    
    // Get the value of an object's property. The objects property 'path'
    // can detail nested objects.
    // 
    // Example:
    //   var n = {'a': 1, 'b': 'two', 'c': "chocolate", 'kings': {'landing': 'stark'}};
    // 
    //   getProp(n, 'a') -> 1
    //   getProp(n, 'kings.landing') -> 'stark'
    //   getProp(n, 'b.j.k') -> undefined
    //
    // Taken from here:
    // http://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string
    //
    getProp: function(obj, path) {
      for(var i = 0, path = path.split('.'), len = path.length; i < len; i++){
          if(obj.hasOwnProperty(path[i]))
            obj = obj[path[i]];
          else return;
      };
      return obj;
    },
    
    // Returns true if 'obj' has nested property path.
    // Returns false otherwise.
    isProp: function(obj, path) {
      var res = this.getProp(obj, path);
      
      return typeof(res) !== "undefined";
    }
  };
})();