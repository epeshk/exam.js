'use strict';
describe('Parser', function() {
    var parser ;
    beforeEach(function(){
        parser = new Parser();
    });

    it('should parse spesial blocks from text', function(){
        var result = parser.parse('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });
});
