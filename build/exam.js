function ParsingError(message) {
    this.message = message || 'Error was ocured while parsing!';
    this.name = 'ParsingError';
}

ParsingError.prototype = Error.prototype;

function List(items, rightAnswerIndex, syntaxBlock) {
    this.items = items;
    this.rightAnswerIndex = rightAnswerIndex;
    this.syntaxBlock = syntaxBlock;
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

Parser.prototype._indexOfRightAnswer = function(items){
    var self = this;
    var result = -1;
    items.forEach(function(item){
        if(item.indexOf('!') === 0 && item.lastIndexOf('!') === item.length - 1){
            result = items.indexOf(item);
        }
    });

    return result;
};

Parser.prototype._removeExclamationPoints = function(items){
    var self = this;
    var index = self._indexOfRightAnswer(items);
    if(index === -1){
        return items;
    }
    var tmpWord = items[index];
    var result = [];

    var resultWord = tmpWord.substring(1,tmpWord.length - 1);
    items.forEach(function(item){
        if(items.indexOf(item) === index){
            result.push(resultWord);
        } else {
            result.push(item);
        }
    });

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

    var result = new List(self._removeExclamationPoints(tmpResult), self._indexOfRightAnswer(tmpResult),syntaxBlock);
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
    if(typeof text !== 'string'){
        throw new ParsingError('Parser Error: into the parse() method was passed not a string parameter');
    }
    
    var result = self._extractObjects(self._parseSyntaxBlocks(text));
    return result;
};

function Translator() {
    'use strict';
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    var self = this;
    self._currentID = 0;
}

Translator.prototype._getNextID = function() {
    var self = this;
    return 'examjs_id_' + (++self._currentID);
};

Translator.prototype._createListBox = function(listObject) {
    var self = this;
    var id = self._getNextID();
    var result = '<input list="' + id + '">';
    result += '<datalist id="' + id + '">';

    listObject.items.forEach(function(item) {
        result += '<option value="' + item + '">';
    });
    result += '</datalist>';

    return result;
};

Translator.prototype._convertAllObjects = function(objects) {
    var self = this;
    var result = [];
    objects.forEach(function(object) {
        if (object instanceof List) {
            result.push({
                source: object.syntaxBlock,
                result: self._createListBox(object)
            });
        } else {
            throw new Error('Converting error. Translator cannot convert object that was passed into it');
        }
    });

    return result;
};

function Exam(){
    if(!(this instanceof Exam)){
        return new Exam();    
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
}

Exam.prototype.parse = function(source){
    var self = this;
    var preprocessedSource = markdown.toHTML(source);
    var syntaxObjects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator._convertAllObjects(syntaxObjects);

    convertionResults.forEach(function(item){
        preprocessedSource = preprocessedSource.replace(item.source, item.result);
    });

    return preprocessedSource;
};
