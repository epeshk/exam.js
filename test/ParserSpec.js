'use strict';
describe('Parser', function() {
    var parser;
    beforeEach(function() {
        parser = new Parser(new Lexer());
    });

    describe('_getNextID()', function() {
        it('should return the next id each time it was called', function() {
            var result1 = parser._getNextID();
            var result2 = parser._getNextID();
            var result3 = parser._getNextID();

            expect(result1).toBe('examjsid_1');
            expect(result2).toBe('examjsid_2');
            expect(result3).toBe('examjsid_3');
        });
    });

    describe('_parseSyntaxBlocks()', function() {
        it('should parse spesial blocks from text', function() {
            var result = parser._parseSyntaxBlocks('Text text {{special}} text text');
            expect(result[0]).toBe('{{special}}');
        });

        it('should create an instance of Parser even Parser was called as a function', function() {
            var parser1 = new Parser(new Lexer());
            var result = parser1._parseSyntaxBlocks('Text text {{special}} text text');
            expect(result[0]).toBe('{{special}}');
        });
    });

    describe('_indexOfRightAnswer()', function() {
        it('should parse index of right answer in List syntax block', function() {
            var result = parser._indexOfRightAnswer(['test1', 'test2', 'test3', 'test4'], 'test3');

            expect(result).toBe(2);
        });
    });

    describe('_constructBlock()', function() {
        it('should iteratively construct a sequence of syntax block tokens', function() {
            var tokens = [new StartBlock(''), new Item(''), new EndBlock('')];

            tokens.forEach(function(token) {
                parser._constructBlock(token);
            });

            expect(parser.lastBlock.length).toEqual(3);
            expect(parser.lastBlock[0] instanceof StartBlock).toBeTruthy();
            expect(parser.lastBlock[1] instanceof Item).toBeTruthy();
            expect(parser.lastBlock[2] instanceof EndBlock).toBeTruthy();
        });

        it('should throw an error if first block will not be a StartBlock', function() {
            var tokens = [new Item(''), new EndBlock('')];

            expect(function() {
                tokens.forEach(function(token) {
                    parser._constructBlock(token);
                });
            }).toThrow();
        });
    });

    describe('parse()', function() {

    });
});
