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
            var result = parser._indexOfRightAnswer(['test1', 'test2', 'test3', 'test4'],'test3');

            expect(result).toBe(2);
        });
    });

    describe('parse()', function() {
        it('should extract List objects from text', function() {
            var result = parser.parse('some text bla bla bla {{elem1, elem2, elem3}} some else text {{elem1, elem2, elem3}}');

            expect(result.length).toBe(2);
        });

        it('should return an empty array if text without syntax blocks was passed into parse() method', function() {
            var result = parser.parse('some text');

            expect(result.length).toBe(0);
        });

        it('should return an empty array if empty text was passed into parse() method', function() {
            var result = parser.parse('');

            expect(result.length).toBe(0);
        });

        it('should throw an error if not a text was passed into parse() method', function() {
            expect(function() {
                parser.parse(null);
            }).toThrow(new Error('Parser Error: into the parse() method was passed not a string parameter'));
        });

        it('should parse all syntax blocks and extract List object', function() {
            var result = parser.parse('bla bla bla {{test1,test2 :: test2}}');

            expect(result.length).toBe(1);
            expect(result[0].rightAnswerIndex).toBe(1);
            expect(result[0].items[1]).toBe('test2');
        });

        it('should create List that contains syntax block', function() {
            var result = parser.parse('bla bla {{test1, !test2!}}');

            expect(result[0].syntaxBlock).toBe('{{test1, !test2!}}');
        });

        it('should create List that contains syntax block and Hint', function() {
            var result = parser.parse('bla bla {{test1, !test2!}} bla bla{{? help ?}}');

            expect(result[0].syntaxBlock).toBe('{{test1, !test2!}}');
            expect(result[1].syntaxBlock).toBe('{{? help ?}}');
        });

        it('should create List with help text', function(){
            var result = parser.parse('bla bal {{ test1, test2 :: test1 :? help text }}');
            expect(result[0].helpText).toBe('help text');
        });

        it('should create CheckBox with 3 items and 2 rightAnswers', function(){
            var result = parser.parse('bla bla {{ test1, test2, test3 :: test1,test2 }}');
            expect(result[0].items.length).toBe(3);
            expect(result[0].rightAnswers.length).toBe(2);
        });
    });
});
