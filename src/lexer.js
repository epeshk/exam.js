function Lexer() {
    'use strict';
    var self = this;

    self.tokens = {
        ANSWER_SPTR: '::',
        HELP_SPTR: ':?',
        ITEMS_SPTR: ','
    };
}

function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
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

function Lexem(value) {
    'use strict';
    var self = this;
    self.value = value;
}

function Item(value) {}

function AnswerSeparator(value) {}

function ItemsSeparator(value) {}

function HelpSeparator(value) {}

extend(Item, Lexem);
extend(AnswerSeparator, Lexem);
extend(ItemsSeparator, Lexem);
extend(HelpSeparator, Lexem);

Lexer.prototype._range = function(n) {
    'use strict';
    var self = this;

    return Array.apply(null, new Array(n)).map(function(_, i) {
        return i;
    });
};

Lexer.prototype.parse = function(syntaxBlock) {
    'use strict';
    var self = this;
    var lastToken = '';
    var tmpToken = '';
    var expression = new Expression();
    syntaxBlock = syntaxBlock.substring(2,syntaxBlock.length - 2);

    for (var i = 0; i < syntaxBlock.length; i++) {
        var lastChar = syntaxBlock[i];
        if (lastChar === self.tokens.ITEMS_SPTR) {
            expression.addLexem(new Item(lastToken));
            expression.addLexem(new ItemsSeparator(lastChar));
            lastToken = '';
        } else {
            lastToken += lastChar;
        }
    }
    expression.addLexem(new Item(lastToken));

    return expression;
};
