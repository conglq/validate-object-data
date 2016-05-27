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
	this.type_err_code = {};
	this.handle_error = function(err_msg){
		console.error(new Error(err_msg));
		return err_msg;
	};
}

Validate.prototype.check_valid = object_type;

Validate.prototype.set_param_property = function(param_obj){
	var self = this;
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
            // console.log(param["type"], self.check_valid[param["type"]], temp);
            if(temp === "invalid"){
                err = {
                    err_code: param["err_code"] || self.get_err_code_of_type(param["type"]) || 1
                };
            }else {
                obj[param["obj_name"] || param["name"]] = temp;
            }
        }else {
            if(options["require"] || param["require"]){
                err = {
                    err_code: param["err_code"] || self.get_err_code_of_type(param["type"]) || 1
                };
            }
        }
        return err == undefined;
    });
    return err || obj;
};

Validate.prototype.add_new_object_type = function(new_object){
	var self = this;
	// check required data
	if(!new_object.name || typeof new_object.name != 'string'){
		return self.handle_error("Invalid input name");
	}
	// is new_object.validate_function exist
	if(new_object.validate_function && typeof new_object.validate_function == 'function'){
		// self.constructor.prototype.check_valid.constructor.prototype[name] = new_object.validate_function;
		// user can overide  default existed object type
		self.constructor.prototype.check_valid[new_object.name] = new_object.validate_function;
		if(new_object.err_code){
			self.type_err_code[new_object.name] = new_object.err_code;
		}
	}else {
		return self.handle_error("Invalid input validate_function");
	}
};

Validate.prototype.add_default_obj = function(item, type){
	var self = this;
	if(!item.name || typeof item.name != "string"){
		return false;
	}
	self.default_obj[item.name] = {};
	self.default_obj[item.name]["type"] = type;
	// is valid err_code
	if(item["err_code"]){
		if(typeof item["err_code"] == "string" || typeof item["err_code"] == "number"){
			self.default_obj[item.name]["err_code"] = item["err_code"];
		}else {
			return false;
		}
	}
	return true;
}

function add_validate_function_from_familiar_object(self, new_object){
	if(new_object.validate_function){
		self.add_new_object_type({
			name: new_object.type,
			err_code: new_object.err_code,
			validate_function: new_object.validate_function
		});
	}
}

Validate.prototype.add_familiar_object = function(new_object){
	var self = this;
	// check required data
	if( !new_object.type || typeof new_object.type != 'string'){
		return self.handle_error("Invalid input name or type");
	}
	if(!self.add_default_obj(new_object, new_object.type)){
		return self.handle_error("Invalid input name or err_code");
	}
	add_validate_function_from_familiar_object(self, new_object);
};

Validate.prototype.add_array_name_familiar_object = function(new_object){
	var self = this;
	// check required data
	if(!new_object.arr_name || !new_object.type
		|| typeof new_object.type != 'string'
		|| typeof new_object.arr_name != 'object' || !new_object.arr_name.is_array){
		return self.handle_error("Invalid input arr_name or type");
	}
	// is valid type
	var is_valid = true;
	new_object.arr_name.every(function(item){
		is_valid = self.add_default_obj(item, new_object.type);
		return is_valid;
	});
	if(!is_valid){
		return self.handle_error("Invalid input name or err_code");
	}
	add_validate_function_from_familiar_object(self, new_object);
};

Validate.prototype.get_err_code_of_type = function(name){
	return this.type_err_code[name] || 1;
}

module.exports = exports = new Validate();