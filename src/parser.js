function ParsingError(message) {
    this.message = message || 'Error was ocured while parsing!';
    this.name = 'ParsingError';
}

ParsingError.prototype = Error.prototype;

function List(items, rightAnswerIndex) {
    this.items = items;
    this.rightAnswerIndex = rightAnswerIndex;
}

function Parser() {
    'use strict';
    if (!(this instanceof Parser)) {
        return new Parser();
    }
    var self = this;
    self._patterns = {
        blockPattern: /\{\{(.|\n)*?\}\}/g,
        emptyBlock: '{{}}',
    };
}

Parser.prototype._parseSyntaxBlocks = function(text) {
    var self = this;
    var regexp = new RegExp(self._patterns.blockPattern);
    var result = text.match(regexp);

    return result;
};

Parser.prototype._extractList = function(syntaxBlock) {
    var self = this;
    var tmpResult = [];

    function trim(text) {
        var result = text.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        return result;
    }

    try {
        syntaxBlock.replace(/(\{|\})+?/g, '').split(',').forEach(function(elem) {
            tmpResult.push(trim(elem));
        });
    } catch (e) {
        return null;
    }

    var result = new List(tmpResult, 0);
    return result;
};

Parser.prototype._extractObjects = function(syntaxBlocks) {
    var self = this;
    var result = [];
    if(syntaxBlocks === null){
        return result; 
    }

    function isBlockEmpty(obj) {
        if (obj === self._patterns.emptyBlock) {
            return true;
        }
        return false;
    }

    syntaxBlocks.forEach(function(block) {
        var tmpObj;
        if (!isBlockEmpty(block)) {
            tmpObj = self._extractList(block);
            if(tmpObj !== null){
                result.push(tmpObj);
            }
        } else {
            throw new ParsingError('Cannot parse empty block: {{}}');
        }
    });

    return result;
};

Parser.prototype.parse = function(text){
    var self = this;
    
    var result = self._extractObjects(self._parseSyntaxBlocks(text));
    return result;
};
