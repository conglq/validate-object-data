var expect = require('chai').expect;

describe("Validate", function(){
	var validate;
	it("successfully initialized", function(){
		validate = require('../index');
	})
	it("successfully test", function(){
		console.log(validate._getdata({
		    is_avai: true
		},[
			{
			    type: "_boolean",
			    name: "is_avai"
			}
		]));
	});

	it("successfully test", function(){
		validate._addNewObjectType("_zipcode",  function(str_zipcode){
	    	var reg = /^\d+$/;
	    	str_zipcode = str_zipcode.toString();
	    	if (reg.test(str_zipcode) && str_zipcode.length == 5) {
	    		return str_zipcode;
	    	};
	    	return "error";
		})
		console.log(validate._getdata({
		    is_avai: true,
		    zipcode: '12345'
		},[
			{
			    type: "_boolean",
			    name: "is_avai"
			},
			{
				type: "_zipcode",
			    name: "zipcode"
			}
		]));
	})
})