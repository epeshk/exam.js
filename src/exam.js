function Parser(){
    'use strict';
    if(!(this instanceof Parser)){
    	return new Parser();
    }
    var self = this;

    self._blockPattern = /\{\{(.|\n)*?\}\}/g;
}

Parser.prototype.parse = function(text){
    var self = this;
    var regexp = new RegExp(self._blockPattern);
    var result = text.match(regexp);

    return result;
};

