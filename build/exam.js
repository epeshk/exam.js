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

function Translator() {
    'use strict';
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    var self = this;
}

Translator.prototype._createHint = function (hintObject) {
    'use strict';
    var self = this;
    var result = "<div id='" + hintObject._id + "'>help!?</div>";

    return result;
};

Translator.prototype._createTextInput = function(inputObject){
    'use strict';
	var self = this;
    var helpTag = '';
	var result = '<input type="text" id="' + inputObject._id +'" class="examjs-input"></input>';

    if(inputObject.helpText){
        helpTag = '<div id="' + inputObject._helpTagId + '" class="examjs-help-popup" data-help="'+ inputObject.helpText +'">?</div>';
        result += helpTag;
    }

	return '<div class="examjs-block">' + result + '</div>';
};

Translator.prototype._createListBox = function(listObject) {
    'use strict';
    var self = this;
    var helpTag = '';
    var result = '<select id="'+ listObject._id + '" class="examjs-input">';

    listObject.items.forEach(function(item) {
        result += '<option>' + item + '</option>';
    });
    result += '</select>';

    if(listObject.helpText){
        helpTag = '<div id="' + listObject._helpTagId + '" class="examjs-help-popup" data-help="'+ listObject.helpText +'">?</div>';
        result += helpTag;
    }

    return '<div class="examjs-block">' + result + '</div>';
};

Translator.prototype.convertAllObjects = function(objects) {
    'use strict';
    var self = this;
    var result = [];
    var error = true;
    objects.forEach(function(object) {
        if (object instanceof List) {
            result.push({
                source: object.syntaxBlock,
                result: self._createListBox(object),
                block: 'list'
            });
            error = false;
        } 
        if (object instanceof TextInput) {
        	result.push({
        		source: object.syntaxBlock,
        		result: self._createTextInput(object),
                block: 'textInput'
        	});
            error = false;
        }
        if (object instanceof Hint) {
            result.push({
                source: object.syntaxBlock,
                result: self._createHint(object),
                block: 'hint'
            });
            error = false;
        } 
        if (object === null) {
            error = false;
        }
        if(error){
            throw new Error('Converting error. Translator cannot convert object that was passed into it');
        }
    });

    return result;
};

function Exam(settings) {
    'use strict';
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._objects = [];

    self._handlerForBtnFinish = function() {};
    self._separateCheckingModeEventHandler = function() {};
    self._handlerForHint = function() {};

    self._separateCheckingMode = true;
    self._preprocessor = markdown.toHTML;

    if (settings) {
        if (settings.separateCheckingMode !== undefined) {
            if (typeof settings.separateCheckingMode === 'boolean') {
                self._separateCheckingMode = settings.separateCheckingMode;
            } else {
                throw new Error('The separatoMode must be a type of boolean');
            }
        }
        if (settings.finishBtnID !== undefined) {
            if (typeof settings.finishBtnID === 'string') {
                self._finishBtnID = settings.finishBtnID;
            } else {
                throw new Error('The btnFinishId must be a type of string');
            }
        }
        if (settings.preprocessor !== undefined) {
            if (typeof settings.preprocessor === 'function') {
                self._preprocessor = settings.preprocessor;
            } else {
                throw new Error('The preprocessor must be a type of function');
            }
        }
    }
    self._setCallback(settings);
}

Exam.prototype._setCallback = function(settings) {
    'use strict';
    var self = this;
    self._handlerForHint = self._eventHandlerForHint;
    self._separateCheckingModeEventHandler = self._eventHandlerForSeparatorMode;
    self._handlerForBtnFinish = self._eventHandlerForBtnFinish;

    if (settings === undefined) {
        return;
    }

    if (settings.handlerForSeparatorMode) {
        if (typeof settings.handlerForSeparatorMode !== 'function') {
            throw new Error('The handlerForSeparatorMode must be a type of function');
        } else {
            self._separateCheckingModeEventHandler = settings.handlerForSeparatorMode;
        }
    } else {
        self._separateCheckingModeEventHandler = self._eventHandlerForSeparatorMode;
    }

    if (settings.handlerForBtnFinish) {
        if (typeof settings.handlerForBtnFinish !== 'function') {
            throw new Error('The handlerForBtnFinish must be a type of function');
        } else {
            self._handlerForBtnFinish = settings.handlerForBtnFinish;
        }
    } else {
        self._handlerForBtnFinish = self._eventHandlerForBtnFinish;
    }

    if (settings.handlerForHint) {
        if (typeof settings.handlerForHint !== 'function') {
            throw new Error('The handlerForHint must be a type of function');
        } else {
            self._handlerForHint = settings.handlerForHint;
        }
    } else {
        self._handlerForHint = self._eventHandlerForHint;
    }
};

Exam.prototype.parse = function(source) {
    'use strict';
    var self = this;

    var preprocessedSource = self._preprocessor(source);
    self._objects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator.convertAllObjects(self._objects);

    convertionResults.forEach(function(item) {
        preprocessedSource = preprocessedSource.replace(item.source, item.result);
    });

    return preprocessedSource;
};

Exam.prototype._getRightAnswer = function(object) {
    'use strict';
    var self = this;
    var result;
    if (object instanceof List) {
        result = object.items[object.rightAnswerIndex];
    } else {
        result = object.rightAnswer;
    }

    return result;
};

Exam.prototype._eventHandlerForSeparatorMode = function(object) {
    'use strict';
    var self = this;
    var currentId = document.getElementById(object._id);
    var selectAnswer = currentId.value;
    var rightAnswer = self._getRightAnswer(object);

    if (rightAnswer === selectAnswer) {
        currentId.style.color = "#cde472";
    } else {
        currentId.style.color = "#e9967a";
    }
};

Exam.prototype._eventHandlerForBtnFinish = function(objects) {
    'use strict';
    var self = this;
    var countQuestions = objects.length;
    var countRightAnswer = 0;
    objects.forEach(function(object) {
        var tmpObjId = document.getElementById(object._id);
        var rightAnswer = self._getRightAnswer(object);
        var selectAnswer = tmpObjId.value;
        if (selectAnswer === rightAnswer) {
            countRightAnswer++;
        }
    });

    window.alert("Правильных ответов " + countRightAnswer + " из " + countQuestions);
};

Exam.prototype._eventHandlerForHint = function(object) {
    'use strict';
    window.alert(object.helpText);
};


Exam.prototype.startExam = function() {
    'use strict';
    var self = this;

    self._objects.forEach(function(object) {
        var currentObjectId = document.getElementById(object._id);

        if ((object instanceof List || object instanceof TextInput) && self._separateCheckingMode) {
            currentObjectId.oninput = function() {
                self._separateCheckingModeEventHandler(object);
            };
        }
    });

    if (self._finishBtnID !== null) {
        var btnId = document.getElementById(self._finishBtnID);
        btnId.onclick = function() {
            self._handlerForBtnFinish(self._objects);
        };
    }
};
