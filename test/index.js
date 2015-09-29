var expect = require('chai').expect;

describe("Validate", function(){
	var validate;
	it("successfully initialized", function(){
		validate = require('../index');
	});
	it("successfully simple test", function(){
		console.log(validate.get_data({
		    is_avai: true
		},[
			{
			    type: "boolean",
			    name: "is_avai"
			}
		]));
	});

	it("successfully add_new_object_type", function(){
		validate.add_new_object_type("zipcode",  function(str_zipcode){
	    	var reg = /^\d+$/;
	    	str_zipcode = str_zipcode.toString();
	    	if (reg.test(str_zipcode) && str_zipcode.length == 5) {
	    		return str_zipcode;
	    	};
	    	return "error";
		});
		console.log(validate.get_data({
		    is_avai: true,
		    zipcode: '12345'
		},[
			{
			    type: "boolean",
			    name: "is_avai"
			},
			{
				type: "zipcode",
			    name: "zipcode"
			}
		]));
	})
})