/**
 * Module dependencies.
 */
// var sanitizeHtml = require('sanitize-html');
var object_type = require('./object_type');
/**
 * Module exports.
 */



function Validate(){
	this.default_obj = {};
	this.handleError = function(err_msg){
		console.error(new Error(err_msg));
		return err_msg;
	};
	console.log("New Validate Instance")
}

Validate.prototype.check_valid = object_type;

Validate.prototype.set_param_property = function(param_obj){
	if(!param_obj["type"]){
		if(self.default_obj[param_obj["name"]]){
			param_obj["type"] = self.default_obj[param_obj["name"]]["type"];
			if(!param_obj["err_code"]){
				param_obj["err_code"] = self.default_obj[param_obj["name"]]["err_code"];
			}
		}
	}
};

Validate.prototype.get_data = function(data, params, options){
    var self = this, obj = {}, err;
    if(!options){
        options = {};
    }
    params.every(function(param){
        if(data[param["name"]]){
        	self.set_param_property(param);
            var temp = self.check_valid[param["type"]](data[param["name"]]);
            console.log(param["type"], self.check_valid[param["type"]], temp);
            if(temp === "error"){
                err = {
                    err_code: param["err_code"] || 1
                };
            }else {
                obj[param["obj_name"] || param["name"]] = temp;
            }
        }else {
            if(options["require"] || param["require"]){
                err = {
                    err_code: param["err_code"] || 1
                };
            }
        }
        return err == undefined;
    });
    return err || obj;
};

Validate.prototype.add_new_object_type = function(obj_name, validate_function){
	var self = this;
	// check required data
	if(!obj_name || typeof obj_name != 'string'){
		return self.handleError("Invalid input obj_name");
	}
	// is validate_function exist
	if(validate_function && typeof validate_function == 'function'){
		self.constructor.prototype.check_valid[obj_name] = validate_function;
	}else {
		return self.handleError("Invalid input validate_function");
	}
};

Validate.prototype.add_familiar_object = function(obj_name, obj_detail, validate_function){
	var self = this;
	// check required data
	if(!obj_name || !obj_detail || typeof obj_name != 'string' || typeof obj_detail != 'object'){
		return self.handleError("Invalid input obj_name or obj_detail");
	}
	// is valid type
	if(obj_detail["type"] && typeof obj_detail["type"] == "string"){
		self.default_obj[obj_name] = {};
		self.default_obj[obj_name]["type"] = obj_detail["type"];
	}else {
		return self.handleError("Invalid input obj_name or obj_detail");
	}
	// is valid err_code
	if(obj_detail["err_code"]){
		if(typeof obj_detail["err_code"] == "string" || typeof obj_detail["err_code"] == "number"){
			self.default_obj[obj_name]["err_code"] = obj_detail["err_code"];
		}else {
			return self.handleError("Invalid input err_code");
		}
	}
	// is validate_function exist
	if(validate_function){
		self.add_new_object_type(obj_name, validate_function);
	}
};

module.exports = exports = new Validate();