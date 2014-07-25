'use strict';
describe('Lexer',function(){
    var lexer;
    beforeEach(function(){
        lexer = new Lexer();
    });

    describe('_range', function(){
        it('should return a range of a numbers starting with zero and ending with N - 1', function(){
            var result = lexer._range(10);

            expect(result.length).toEqual(10);
        });
    });
});
