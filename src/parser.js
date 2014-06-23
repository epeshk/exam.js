function Parser() {
    'use strict';
    if (!(this instanceof Parser)) {
        return new Parser();
    }
    var self = this;

    self._blockPattern = /\{\{(.|\n)*?\}\}/g;
}

Parser.prototype._parseSyntaxBlocks = function(text) {
    var self = this;
    var regexp = new RegExp(self._blockPattern);
    var result = text.match(regexp);

    return result;
};

Parser.prototype._extractObjects = function(syntaxBlocks) {
    var self = this;
    var result = [];

    function isBlockEmpty(obj) {
        if (obj === null) {
            return true;
        }
        if (obj.length > 0) {
            return false;
        }
        if (obj.length === 0) {
            return true;
        }
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }

        return true;
    }

    syntaxBlocks.forEach(function(block) {
        if(!isBlockEmpty(block)){
            
        }
    });
};
