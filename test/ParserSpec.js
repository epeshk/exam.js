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

    describe('_constructSection()', function(){
        it('should parse section', function(){
            var tokens = [new StartSection(''),new StartBlock(''), new Item(''), new EndBlock(''),new EndSection('')];
        });
    });

    describe('_markAllTokens()', function(){
        it('should correctly parse all tokens', function(){
            var tokens = [new StartSection(''),new StartBlock(''), new Item(''), new EndBlock(''),new EndSection('')];

            var result = parser._markAllTokens(tokens);
            expect(result.length).toBe(tokens.length);
            result.forEach(function(markedToken){
                expect(markedToken.level).toBe(1);
            });
        });

        it('should correctly parse all tokens if they contains two StartSection tokens', function(){
            var tokens = [new StartSection(''),new StartSection(''),new StartBlock(''), new Item(''), new EndBlock(''), new EndSection(''),new EndSection('')];

            var result = parser._markAllTokens(tokens);
            
            expect(result[0].level).toBe(1);
            expect(result[1].level).toBe(2);
            expect(result[5].level).toBe(2);
            expect(result[6].level).toBe(1);
        });

        it('should correcty parse all tokens if they contains a sequence of sections', function(){
            var tokens = [new StartSection(''), new EndSection(''), new StartSection(''), new EndSection('')];
            var result = parser._markAllTokens(tokens);

            result.forEach(function(markedToken){
                expect(markedToken.level).toBe(1);
            });
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

        it('should create a correct sequence of a syntax block tokens', function(){
            var tokens = [new StartBlock('1'), new Item('1'), new EndBlock('1'), new StartBlock('2'), new Item('2'), new EndBlock('2')];

            tokens.forEach(function(token) {
                parser._constructBlock(token);
            });

            expect(parser.lastBlock.length).toEqual(3);
            expect(parser.lastBlock[0].value).toEqual('2');
            expect(parser.lastBlock[1].value).toEqual('2');
            expect(parser.lastBlock[2].value).toEqual('2');
        });
    });

    describe('parse()', function() {

    });
});
