function Lexer() {
    'use strict';
    var self = this;
    self.ANSWER_SPTR = 0;
    self.ITEMS_SPTR = 1;
    self.HELP_SPTR = 2;

    self.tokens = {
        '::': self.ANSWER_SPTR,
        ',': self.ITEMS_SPTR,
        ':?': self.HELP_SPTR
    };
}

function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}

function Lexem(value) {
    'use strict';
    var self = this;
    self.value = value;
}

function Item(value) {}
function AnswerSeparator(value) {}
function ItemsSeparator(value){}
function HelpSeparator(value){}

extend(Item,Lexem);
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
