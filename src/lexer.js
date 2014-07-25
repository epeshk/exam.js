var LEXER_HELPER = {
    trim: function(string) {
        return string.replace(/^\s+/, '').replace(/\s+$/, '');
    }
};

function Lexer() {
    'use strict';
    var self = this;

    self.tokens = {
        ANSWER_SPTR: '::',
        HELP_SPTR: ':?',
        ITEMS_SPTR: ',',
        INPUT_TOKEN: '...',
        START_BLOCK_TOKEN: '{{',
        END_BLOCK_TOKEN: '}}'
    };
}

function Item(value) {
    'use strict';
    var self = this;
    self.value = LEXER_HELPER.trim(value);
}

function InputToken(value) {
    'use strict';
    var self = this;
    self.value = value;
}

function AnswerSeparator(value) {
    'use strict';
    var self = this;
    self.value = LEXER_HELPER.trim(value);
}

function ItemsSeparator(value) {
    'use strict';
    var self = this;
    self.value = LEXER_HELPER.trim(value);
}

function HelpSeparator(value) {
    'use strict';
    var self = this;
    self.value = LEXER_HELPER.trim(value);
}

Lexer.prototype._range = function(n) {
    'use strict';
    var self = this;

    return Array.apply(null, new Array(n)).map(function(_, i) {
        return i;
    });
};

Lexer.prototype._clearSyntaxBlock = function(syntaxBlock) {
    'use strict';
    var self = this;
    if (syntaxBlock.substring(0, 2) === self.tokens.START_BLOCK_TOKEN) {
        syntaxBlock = syntaxBlock.substring(2);
    }
    if (syntaxBlock.substring(syntaxBlock.length - 2) === self.tokens.END_BLOCK_TOKEN) {
        syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2);
    }
    return syntaxBlock;
};

Lexer.prototype._isEmpty = function(string) {
    'use strict';
    var self = this;
    return LEXER_HELPER.trim(string) === '';
};

Lexer.prototype.parse = function(syntaxBlock) {
    'use strict';
    var self = this,
        lastToken = '',
        tmpToken = '',
        expression = [],
        source = syntaxBlock;
        
    syntaxBlock = self._clearSyntaxBlock(syntaxBlock);

    function tryToAddSeparator(expression, token) {
        if (!self._isEmpty(token)) {
            if (token === self.tokens.ITEMS_SPTR) {
                expression.push(new ItemsSeparator(token));
            }
            if (token === self.tokens.ANSWER_SPTR) {
                expression.push(new AnswerSeparator(token));
            }
            if (token === self.tokens.HELP_SPTR) {
                expression.push(new HelpSeparator(token));
            }
            if (token === self.tokens.INPUT_TOKEN) {
                expression.push(new InputToken(token));
            }
        }
    }

    for (var i = 0; i < syntaxBlock.length; i++) {
        var lastChar = syntaxBlock[i];
        if (self.tokens.ITEMS_SPTR.indexOf(lastChar) !== -1 ||
            self.tokens.ANSWER_SPTR.indexOf(lastChar) !== -1 ||
            self.tokens.HELP_SPTR.indexOf(lastChar) !== -1 ||
            self.tokens.INPUT_TOKEN.indexOf(lastChar) !== -1) {
            tmpToken += lastChar;
        } else {
            lastToken += (tmpToken + lastChar);
            tmpToken = '';
        }
        if (tmpToken === self.tokens.ITEMS_SPTR ||
            tmpToken === self.tokens.ANSWER_SPTR ||
            tmpToken === self.tokens.HELP_SPTR ||
            tmpToken === self.tokens.INPUT_TOKEN) {
            if (!self._isEmpty(lastToken)) {
                expression.push(new Item(lastToken));
            }
            tryToAddSeparator(expression, tmpToken);

            lastToken = '';
            tmpToken = '';
        }
    }
    expression.push(new Item(lastToken));

    return {
        expression: expression,
        syntaxBlock: source
    };
};
