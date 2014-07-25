function Lexer(){
    'use strict';
    var self = this;

    self.tokens = {
        '::': "test" 
    };
}


Lexer.prototype._range = function(n){
    'use strict';
    var self = this;

    return Array.apply(null,new Array(n)).map(function (_, i) {return i;});
};
