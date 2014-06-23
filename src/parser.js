function ParsingError(message){
    this.message = message || 'Error was ocured while parsing!';
    this.name = 'ParsingError';
}

ParsingError.prototype = Error.prototype;

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
        if(obj === '{{}}'){
            return true;
        }
        return false;
    }

    syntaxBlocks.forEach(function(block) {
        if (!isBlockEmpty(block)) {
            //do something
        } else {
            throw new ParsingError('Cannot parse empty block: {{}}'); 
        }
    });
};
