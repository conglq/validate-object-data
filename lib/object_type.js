/**
 * Define object type
 */
Array.prototype.is_array = true;
var Object_type =  function(){};

var hexadecimal = /^[0-9A-F]+$/i,
    sanitizeHtml = require('sanitize-html'),
    uuid = {
        '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    },
    accented_characters = "àáạảãâầấậẩẫăằắặẳẵÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴåèéẹẻẽêềếệểễÈÉẸẺẼÊỀẾỆỂỄëìíịỉĩÌÍỊỈĨîòóọỏõôồốộổỗơờớợởỡÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠøùúụủũưừứựửữÙÚỤỦŨƯỪỨỰỬỮůûỳýỵỷỹỲÝỴỶỸđĐàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸ¡¿çÇŒœßØøÅåÆæÞþÐð",
    emailUser = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e])|(\\[\x01-\x09\x0b\x0c\x0d-\x7f])))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i,
    default_fqdn_options = {
        require_tld: true
        , allow_underscores: false
        , allow_trailing_dot: false
    },
    default_email_options = {
        allow_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    };

function sanitize_html_content(str){
    return sanitizeHtml(str, {
        allowedTags: [],
        textFilter: function(text) {
            return text.replace(/&amp;/, '&');
        }
    });
}

var isFQDN = function (str, options) {
    options =  default_fqdn_options;

    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
    }
    var parts = str.split('.');
    if (options.require_tld) {
        var tld = parts.pop();
        if (!parts.length || !/^([a-z]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
            return false;
        }
    }
    for (var part, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (options.allow_underscores) {
            if (part.indexOf('__') >= 0) {
                return false;
            }
            part = part.replace(/_/g, '');
        }
        if (!/^[a-z0-9-]+$/i.test(part)) {
            return false;
        }
        if (part[0] === '-' || part[part.length - 1] === '-' ||
            part.indexOf('---') >= 0) {
            return false;
        }
    }
    return true;
};

Object_type.prototype.email = function (str, options) {
    if(!str || str.length > 254){
        return "invalid";
    }
    options = default_email_options;
    if (/\s/.test(str)) {
        return "invalid";
    }
    var parts = str.split('@')
        , domain = parts.pop()
        , user = parts.join('@');

    if (isFQDN(domain, {require_tld: options.require_tld}) && emailUser.test(user)) {
        return str.toLowerCase();
    }
    return "invalid";
};

Object_type.prototype.boolean = function(str){
    if(str === undefined){
        return false;
    }
    str = str.toString().toLowerCase().trim();
    if(str == '1'){
        return true;
    }
    if(str == '0'){
        return false;
    }
    return str == "true";
};

Object_type.prototype.mongo_id = function(str){
    if(str === undefined){
        return "invalid";
    }
    str = str.toString().trim();
    return (str.length == 24 && hexadecimal.test(str) ) ? str : "invalid";
};

Object_type.prototype.uuid = function(str, version){
    if(str === undefined){
        return "invalid";
    }
    str = str.toString().trim();
    var pattern = uuid[version ? version : 'all'];
    return pattern && pattern.test(str) ? str : "invalid";
};

Object_type.prototype.uuid_v4 = function(str){
    if(!str){
        return "invalid"
    }
    return this.uuid(str, 4)
};

Object_type.prototype.clear_string = function(str, option){
    if(!str){
        return "invalid";
    }
    str = str.toString().trim();
    str = str.replace(/\s{2,}/g, ' ');
    if(option && !( str.length <= option.max_length && str.length >= option.min_length) ){
        return "invalid"
    }
    return str || "";
};

Object_type.prototype.clear_html_string = function(str, option){
    if(!str){
        return "invalid"
    }
    str = sanitize_html_content(this.clear_string(str, option));
    return str || "";
};

Object_type.prototype.title_case_string = function(str){
    if(!str){
        return "invalid"
    }
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Object_type.prototype.accented_characters = function(str, exception_character_reg){
    var s = accented_characters + (exception_character_reg || "");
    return reg.test(new RegExp("^(["+s+"]?)+$")) ? str : "invalid";
}

Object_type.prototype.filter_accented_characters = function(str, exception_character_reg){
    var s = accented_characters + (exception_character_reg || "");
    str = str.replace(new RegExp("[^"+s+"]", "g"),'');
    return this.clear_string(str)
}

Object_type.prototype.element_of_aray = function(ele, arr){
    var i = arr.indexOf(ele);
    if(i != -1){
        return arr[i];
    }
    return "invalid";
}

module.exports = exports = new Object_type();