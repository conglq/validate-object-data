var expect = require('chai').expect;

describe("Validate", function(){
	var validate;
	it("successfully initialized", function(){
		validate = require('../index');
	});

	it("successfully simple test", function(){
		var result = validate.get_data({
		    is_avai: true,
		    id: "560cbdf4c1b2637d0b86d611"
		},[
			{
			    type: "boolean",
			    name: "is_avai"
			},
			{
			    type: "mongo_id",
			    name: "id"
			}
		]);
        expect(result.is_avai).to.equal(true);
        expect(result.id).to.equal("560cbdf4c1b2637d0b86d611");
	});

	it("filter_accented_characters", function(){
		var test_str = validate.check_valid.filter_accented_characters("  le  cong ^ '  ","a-zA-Z0-9 '");
        expect(test_str).to.equal("le cong '");
	});

	it("successfully add_new_object_type", function(){
		validate.add_new_object_type({
			name: "zipcode",
			validate_function: function(str_zipcode){
		    	var reg = /^\d+$/;
		    	str_zipcode = str_zipcode.toString();
		    	if (reg.test(str_zipcode) && str_zipcode.length == 5) {
		    		return str_zipcode;
		    	};
		    	return "invalid";
			}
		});
		var result = validate.get_data({
		    is_avai: true,
		    zipcode: '12345'
		},[
			{
			    type: "boolean",
			    name: "is_avai"
			},
			{
				type: "zipcode",
				err_code: 3,
			    name: "zipcode"
			}
		]);
        expect(result.is_avai).to.equal(true);
        expect(result.zipcode).to.equal("12345");
	})

	it("successfully add_familiar_object", function(){
		validate.add_familiar_object({
			name: "zipcode",
			type: "zip4",
			err_code: 4,
			validate_function: function(str_zipcode){
		    	var reg = /^\d+$/;
		    	str_zipcode = str_zipcode.toString();
		    	if (reg.test(str_zipcode) && str_zipcode.length == 5) {
		    		return str_zipcode;
		    	};
		    	return "invalid";
			}
		});
        var result = validate.get_data({
            is_avai: true,
            zipcode: '1234'
        },[
            {
                type: "boolean",
                name: "is_avai"
            },
            {
                type: "zipcode",
                err_code: 3,
                name: "zipcode"
            }
        ]);
        expect(result.err_code).to.equal(3);
	})

	it("successfully add_array_name_familiar_object", function(){
		validate.add_array_name_familiar_object({
			arr_name: [
				{ err_code: 38, name: "my_id"},
				{ err_code: 39, name: "your_id"}
			],
            err_code: 40,
			type: "mongo_id"
		});
		var result = validate.get_data({
			my_id: "560108a759ee92df740976b2",
			your_id: "560108a759ee92df740976b2"
		},[
			{
				name: "your_id"
			},
			{
				err_code: 3,
				name: "my_id"
			}
		]);
        expect(result.my_id).to.equal("560108a759ee92df740976b2");
        expect(result.your_id).to.equal("560108a759ee92df740976b2");
	})
})