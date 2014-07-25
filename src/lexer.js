function Lexer(){
    'use strict';
    var self = this;
    self.ANSWER_SPTR = 0;
    self.ITEMS_SPTR = 1;
    self.HELP_SPTR = 2;

    self.tokens = {
        '::': self.ANSWER_SPTR,
        ',' : self.ITEMS_SPTR,
        ':?' : self.HELP_SPTR
    };
}


Lexer.prototype._range = function(n){
    'use strict';
    var self = this;

    return Array.apply(null,new Array(n)).map(function (_, i) {return i;});
};
