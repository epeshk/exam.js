'use strict';
describe('Parser', function() {
    var parser ;
    beforeEach(function(){
        parser = new Parser();
    });

    it('should parse spesial blocks from text', function(){
        var result = parser._parseSyntaxBlocks('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });

    it('should create an instance of Parser even Parser was called as a function', function(){
        var parser1 = Parser();
        var result = parser1._parseSyntaxBlocks('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });
});
