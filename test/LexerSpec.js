'use strict';
describe('Lexer', function() {
    var lexer;
    beforeEach(function() {
        lexer = new Lexer();
    });

    describe('_range()', function() {
        it('should return a range of a numbers starting with zero and ending with N - 1', function() {
            var result = lexer._range(10);

            expect(result[0]).toEqual(0);
            expect(result[9]).toEqual(9);
        });

        it('should return a range of a numbers with length equal N - 1', function() {
            var result = lexer._range(10);

            expect(result.length).toEqual(10);
        });
    });

    describe('parse()', function() {
        it('should return an expression that contains items and separators', function() {
            var result = lexer.parse('{{1,2}}');

            expect(result.getExpression().length).toEqual(3);
        });
    });
});
