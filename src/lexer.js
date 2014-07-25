function Lexer() {
    'use strict';
    var self = this;

    self.tokens = {
        ANSWER_SPTR: '::',
        HELP_SPTR: ':?',
        ITEMS_SPTR: ',',
        INPUT_TOKEN: '...'
    };
}

function Expression() {
    'use strict';
    var self = this;

    var lexems = [];
    self.addLexem = function(lexem) {
        lexems.push(lexem);
    };

    self.getExpression = function() {
        return lexems;
    };
}

function Item(value) {
    'use strict';
    var self = this;
    self.value = value;
}

function InputToken(value){
    'use strict';
    var self = this;
    self.value = value;
}

function AnswerSeparator(value) {
    'use strict';
    var self = this;
    self.value = value;
}

function ItemsSeparator(value) {
    'use strict';
    var self = this;
    self.value = value;
}

function HelpSeparator(value) {
    'use strict';
    var self = this;
    self.value = value;
}

Lexer.prototype._range = function(n) {
    'use strict';
    var self = this;

    return Array.apply(null, new Array(n)).map(function(_, i) {
        return i;
    });
};

Lexer.prototype._clearSyntaxBlock = function(syntaxBlock) {
    if (syntaxBlock.substring(0, 2) === '{{') {
        syntaxBlock = syntaxBlock.substring(2);
    }
    if (syntaxBlock.substring(syntaxBlock.length - 2) === '}}') {
        syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2);
    }
    return syntaxBlock;
};

Lexer.prototype.parse = function(syntaxBlock) {
    'use strict';
    var self = this;
    var lastToken = '';
    var tmpToken = '';
    var expression = new Expression();
    syntaxBlock = self._clearSyntaxBlock(syntaxBlock);

    for (var i = 0; i < syntaxBlock.length; i++) {
        var lastChar = syntaxBlock[i];
        if (self.tokens.ITEMS_SPTR.indexOf(lastChar) !== -1 || 
            self.tokens.ANSWER_SPTR.indexOf(lastChar) !== -1 || 
            self.tokens.HELP_SPTR.indexOf(lastChar) !== -1 ||
            self.tokens.INPUT_TOKEN.indexOf(lastChar) !== -1) {
            tmpToken += lastChar;
        } else {
            lastToken += (tmpToken + lastChar);
        }
        if (tmpToken === self.tokens.ITEMS_SPTR || 
            tmpToken === self.tokens.ANSWER_SPTR || 
            tmpToken === self.tokens.HELP_SPTR ||
            tmpToken === self.tokens.INPUT_TOKEN) {
            expression.addLexem(new Item(lastToken));
            if (tmpToken === self.tokens.ITEMS_SPTR) {
                expression.addLexem(new ItemsSeparator(tmpToken));
            }
            if (tmpToken === self.tokens.ANSWER_SPTR) {
                expression.addLexem(new AnswerSeparator(tmpToken));
            }
            if (tmpToken === self.tokens.HELP_SPTR) {
                expression.addLexem(new HelpSeparator(tmpToken));
            }
            if(tmpToken === self.tokens.INPUT_TOKEN){
                expression.addLexem(new InputToken(tmpToken));
            }
            lastToken = '';
            tmpToken = '';
        }
    }
    expression.addLexem(new Item(lastToken));

    return expression;
};
