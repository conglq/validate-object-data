/**
 * Define object type
 */

var Object_type =  function(){};

Object_type.prototype.boolean = function(str){
    if(str === undefined){
        return false;
    }
    str = str.toString().trim();
    if(str == '1'){
        return true;
    }
    if(str == '0'){
        return false;
    }
    return str == "true";
};

module.exports = exports = new Object_type();