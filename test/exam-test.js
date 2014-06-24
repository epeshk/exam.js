'use strict';
describe('Parser', function() {
    var parser;
    beforeEach(function() {
        parser = new Parser();
    });

    it('should parse spesial blocks from text', function() {
        var result = parser._parseSyntaxBlocks('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });

    it('should create an instance of Parser even Parser was called as a function', function() {
        var parser1 = Parser();
        var result = parser1._parseSyntaxBlocks('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });

    it('should throw an error if try to extract object from empty special block', function() {
        expect(function() {
            parser._extractObjects(['{{}}']);
        }).toThrow(
            new ParsingError('Cannot parse empty block: {{}}')
        );
    });

    it('should extract List from syntax block with list',function(){
        var result = parser._extractList('{{1,2,3,4}}');

        expect(result.itmes.length).toBe(4);
    });
});
