function ParsingError(message) {
    this.message = message || 'Error was ocured while parsing!';
    this.name = 'ParsingError';
}

ParsingError.prototype = Error.prototype;

function List(items, rightAnswerIndex, syntaxBlock, id, helpText) {
    this.items = items;
    this.rightAnswerIndex = rightAnswerIndex;
    this.syntaxBlock = syntaxBlock;
    this.helpText = helpText;
    this._id = id;
    if(helpText){
        this._helpTagId = 'help_' + this._id;
    }
}

function TextInput(rightAnswer, syntaxBlock, id, helpText) {
    this.rightAnswer = rightAnswer;
    this.syntaxBlock = syntaxBlock;
    this.helpText = helpText;
    this._id = id;
    if(helpText){
        this._helpTagId = 'help_' + this._id;
    }
}

function Hint(syntaxBlock, helpText, id) {
    this.syntaxBlock = syntaxBlock;
    this.helpText = helpText;
    this._id = id;
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

    self._currentID = 0;

}

Parser.prototype._trim = function(text) {
    'use strict';
    var result = text.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    return result;
};

Parser.prototype._getNextID = function() {
    'use strict';
    var self = this;
    return 'examjs_id_' + (++self._currentID);
};

Parser.prototype._getTypeOfBlock = function(block) {
    'use strict';
    var self = this;
    var textInputPattern = /\{\{\s*\.{3}\s*\|\s*.*/g;
    var hintPattern = /\{\{\s*\?\s*.*\?\s*\}\}/g;

    if (textInputPattern.test(block)) {
        return "textInput";
    }
    if (hintPattern.test(block)) {
        return "hint";
    }

    return "list";
};

Parser.prototype._extractTextInput = function(syntaxBlock) {
    'use strict';
    var self = this;

    function getRightAnswer(syntaxBlock) {
        var firstVerticalSeparatorPosition = syntaxBlock.indexOf("|", 0);
        var rightAnswer = syntaxBlock.substring(firstVerticalSeparatorPosition + 1, syntaxBlock.length - 2).trim();

        return rightAnswer;
    }
    var rightAnswer;
    var tmpSyntaxBlock;
    if(syntaxBlock.indexOf(':?') !== -1){
        tmpSyntaxBlock = syntaxBlock.substring(0,syntaxBlock.indexOf(':?') + 1);
        rightAnswer = getRightAnswer(tmpSyntaxBlock);
    } else {
        rightAnswer = getRightAnswer(syntaxBlock);
    }
    var id = self._getNextID();
    var helpText = self._extractHelpText(syntaxBlock);

    var result = new TextInput(rightAnswer, syntaxBlock, id, helpText);
    return result;
};

Parser.prototype._extractHint = function(syntaxBlock, objects) {
    'use strict';
    var self = this;
    var result = null;

    if (objects.length > 0) {
        var lastObject = objects[objects.length - 1];
        if ((lastObject instanceof List) || (lastObject instanceof TextInput)) {
            var helpText = self._getHelpText(syntaxBlock);
            result = new Hint(syntaxBlock, helpText, lastObject._id + "_help");
        }
    }

    return result;
};

Parser.prototype._parseSyntaxBlocks = function(text) {
    'use strict';
    var self = this;
    var regexp = new RegExp(self._patterns.blockPattern);
    var result = text.match(regexp);

    return result;
};

Parser.prototype._indexOfRightAnswer = function(items) {
    'use strict';
    var self = this;
    var result = -1;
    items.forEach(function(item) {
        if (item.indexOf('!') === 0 && item.lastIndexOf('!') === item.length - 1) {
            result = items.indexOf(item);
        }
    });

    return result;
};

Parser.prototype._extractHelpText = function(syntaxBlock) {
    'use strict';
    var self = this;
    if (syntaxBlock.indexOf(':?') !== -1) {
        var startIndex = syntaxBlock.lastIndexOf(':?') + 2;
        var endIndex = syntaxBlock.lastIndexOf('}}');

        return self._trim(syntaxBlock.substring(startIndex, endIndex));
    }
    return null;
};

Parser.prototype._removeExclamationPoints = function(items) {
    'use strict';
    var self = this;
    var index = self._indexOfRightAnswer(items);
    if (index === -1) {
        return items;
    }
    var tmpWord = items[index];
    var result = [];

    var resultWord = tmpWord.substring(1, tmpWord.length - 1);
    items.forEach(function(item) {
        if (items.indexOf(item) === index) {
            result.push(resultWord);
        } else {
            result.push(item);
        }
    });

    return result;
};

Parser.prototype._getHelpText = function(syntaxBlock) {
    'use strict';
    var self = this;
    var result = "";
    var firstPosition = -1;
    var lastPosition = -1;

    firstPosition = syntaxBlock.indexOf('?');
    lastPosition = syntaxBlock.lastIndexOf('?');

    if ((firstPosition !== -1) && (lastPosition !== -1)) {
        result = syntaxBlock.substring(firstPosition + 1, lastPosition);
    }

    return result;
};

Parser.prototype._extractList = function(syntaxBlock) {
    'use strict';
    var self = this;
    var tmpResult = [];

    try {
        if (syntaxBlock.indexOf(':?') !== -1) {
            syntaxBlock.substring(0, syntaxBlock.indexOf(':?')).replace(/(\{|\})+?/g, '').split(',').forEach(function(elem) {
                tmpResult.push(self._trim(elem));
            });

        } else {
            syntaxBlock.replace(/(\{|\})+?/g, '').split(',').forEach(function(elem) {
                tmpResult.push(self._trim(elem));
            });

        }
    } catch (e) {
        return null;
    }
    var list = self._removeExclamationPoints(tmpResult);
    var rightAnswerIndex = self._indexOfRightAnswer(tmpResult);
    var id = self._getNextID();
    var helpText = self._extractHelpText(syntaxBlock);

    var result = new List(list, rightAnswerIndex, syntaxBlock, id, helpText);
    return result;
};

Parser.prototype._extractObjects = function(syntaxBlocks) {
    'use strict';
    var self = this;
    var result = [];
    if (syntaxBlocks === null) {
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
            var typeBlock = self._getTypeOfBlock(block);
            switch (typeBlock) {
                case 'textInput':
                    {
                        tmpObj = self._extractTextInput(block);
                        break;
                    }
                case 'list':
                    {
                        tmpObj = self._extractList(block);
                        break;
                    }
                case 'hint':
                    {
                        tmpObj = self._extractHint(block, result);
                        break;
                    }
            }
            if (tmpObj !== null) {
                result.push(tmpObj);
            }
        }
    });

    return result;
};

Parser.prototype.parse = function(text) {
    'use strict';
    var self = this;
    if (typeof text !== 'string') {
        throw new ParsingError('Parser Error: into the parse() method was passed not a string parameter');
    }

    var result = self._extractObjects(self._parseSyntaxBlocks(text));
    return result;
};
