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
    this.id = id;
    if (helpText) {
        this._helpTagId = 'help_' + this.id;
    }
}

function TextInput(rightAnswer, syntaxBlock, id, helpText) {
    this.rightAnswer = rightAnswer;
    this.syntaxBlock = syntaxBlock;
    this.helpText = helpText;
    this.id = id;
    if (helpText) {
        this._helpTagId = 'help_' + this.id;
    }
}

function Parser() {
    'use strict';
    if (!(this instanceof Parser)) {
        return new Parser();
    }
    var self = this;
    self.lexer = new Lexer();
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
    return 'examjsid_' + (++self._currentID);
};

Parser.prototype._indexOfRightAnswer = function(items, answer) {
    'use strict';
    var self = this;
    var result = -1;
    if (answer) {
        items.forEach(function(item) {
            if (self._trim(item.toLowerCase()) === self._trim(answer.toLowerCase())) {
                result = items.indexOf(item);
            }
        });
    }
    return result;
};

Parser.prototype._createList = function(expressionObj, syntaxBlock) {
    'use strict';
    var self = this;

    var rightAnswerIndex = self._indexOfRightAnswer(expressionObj.items, expressionObj.answers[0]);
    var id = self._getNextID();

    var result = new List(expressionObj.items, rightAnswerIndex, syntaxBlock, id, expressionObj.helpText);
    return result;
};

Parser.prototype._createTextInput = function(expressionObject, syntaxBlock) {
    'use strict';
    var self = this;

    var id = self._getNextID();
    var result = new TextInput(expressionObject.answers[0], syntaxBlock, id, expressionObject.helpText);
    return result;
};

Parser.prototype._parseSyntaxBlocks = function(text) {
    'use strict';
    var self = this;
    var regexp = new RegExp(self._patterns.blockPattern);
    var result = text.match(regexp);

    return result;
};


Parser.prototype._extractObjects = function(expressions) {
    'use strict';
    var self = this;
    var result = [];
    if (expressions === null) {
        return result;
    }

    expressions.forEach(function(exp) {
        var tmpObj = self._parseExpression(exp.expression);
        if (tmpObj.hasInputToken) {
            result.push(self._createTextInput(tmpObj, exp.syntaxBlock));
        } else {
            result.push(self._createList(tmpObj, exp.syntaxBlock));
        }
    });

    return result;
};

Parser.prototype._parseExpression = function(expression) {
    'use strict';
    var self = this;
    var result = {
        items: [],
        answers: [],
        hasInputToken: false
    };
    var lastSeparator = null;

    expression.forEach(function(item) {
        if (item instanceof InputToken) {
            result.hasInputToken = true;
        } else if (item instanceof Item && lastSeparator === null) {
            result.items.push(item.value);
        } else if (item instanceof Item && lastSeparator instanceof AnswerSeparator) {
            result.answers.push(item.value);
        } else if (item instanceof Item && lastSeparator instanceof HelpSeparator) {
            result.helpText = item.value;
        } else if (item instanceof AnswerSeparator) {
            lastSeparator = item;
        } else if (item instanceof HelpSeparator) {
            lastSeparator = item;
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
    var syntaxBlocks = self._parseSyntaxBlocks(text);
    var expressions = [];
    if (syntaxBlocks) {
        syntaxBlocks.forEach(function(item) {
            expressions.push(self.lexer.parse(item));
        });
    }

    var result = self._extractObjects(expressions);
    return result;
};
