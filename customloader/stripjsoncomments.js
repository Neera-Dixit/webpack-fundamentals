var stripJson = require('strip-json-comments');

module.exports = function(source){
    this.cacheable();
    console.log("source "+source);
    console.log("edited "+stripJson(source));
    
    return stripJson(source);
}