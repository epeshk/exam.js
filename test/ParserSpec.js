'use strict';
describe('Parser', function() {
    var parser;
    beforeEach(function() {
        parser = new Parser();
    });

    describe('_getHelpText()', function() {
        it('should return helpText if help is exist', function() {
            var result_1 = parser._getHelpText("{{1,2,3,4 ?help? }}");
            var result_2 = parser._getHelpText("{{...|dafs?help?}}");
            expect(result_1).toBe("help");
            expect(result_2).toBe("help");
        });

        it('should return empty string if help is not exist', function() {
            var result_1 = parser._getHelpText("{{1,2,3,4}}");
            var result_2 = parser._getHelpText("{{...|dafs}}");
            expect(result_1).toBe("");
            expect(result_2).toBe("");
        });
    });

    describe('_getNextID()', function() {
        it('should return the next id each time it was called', function() {
            var result1 = parser._getNextID();
            var result2 = parser._getNextID();
            var result3 = parser._getNextID();

            expect(result1).toBe('examjs_id_1');
            expect(result2).toBe('examjs_id_2');
            expect(result3).toBe('examjs_id_3');
        });
    });

    describe('_getTypeBlock()', function() {
        it('should return string: "textInput" if received textInputBlock', function(){
            var result = parser._getTypeBlock("{{...|hkfds}}");
            expect(result).toBe('textInput');
        });

        it('should return string: "list" if received listBlock', function(){
            var result = parser._getTypeBlock("{{1, 3,!4!}}");
            expect(result).toBe('list');
        });
    });

    describe('_extractTextInput()',function(){
        it('should return rightAnswer',function(){
            var result = parser._extractTextInput("{{...|true}}");
            expect(result.rightAnswer).toBe('true');
        });

        it('should create unique id for each textInput', function(){
            var result_1 = parser._extractTextInput('bla bla bla {{...|fnkjdsh}}');
            var result_2 = parser._extractTextInput('bla bla bla {{...|fnkjdsh}}');

            expect(result_1._id).toBe('examjs_id_1');
            expect(result_2._id).toBe('examjs_id_2');
        });
    });

    describe('_parseSyntaxBlocks()', function() {
        it('should parse spesial blocks from text', function() {
            var result = parser._parseSyntaxBlocks('Text text {{special}} text text');
            expect(result[0]).toBe('{{special}}');
        });

        it('should create an instance of Parser even Parser was called as a function', function() {
            var parser1 = Parser();
            var result = parser1._parseSyntaxBlocks('Text text {{special}} text text');
            expect(result[0]).toBe('{{special}}');
        });
    });

    describe('_extractObjects()', function() {
        it('should throw an error if try to extract object from empty special block', function() {
            expect(function() {
                parser._extractObjects(['{{}}']);
            }).toThrow(
                new ParsingError('Cannot parse empty block: {{}}')
            );
        });
    });

    describe('_extractList()', function() {
        it('should extract List from syntax block with list', function() {
            var result = parser._extractList('{{1,2,3,4}}');

            expect(result.items.length).toBe(4);
        });

        it('should extract List from syntax block with list and trim all spaces', function() {
            var result = parser._extractList('{{ 1,   2,    3,    4 }}');

            expect(result.items[0]).toBe('1');
            expect(result.items[1]).toBe('2');
            expect(result.items[2]).toBe('3');
            expect(result.items[3]).toBe('4');
        });

        it('should trim elements in list but keep spaces between words in elements', function() {
            var result = parser._extractList('{{test1 test1, test2 test2,  test3 test3  ,test4 test4}}');

            expect(result.items[0]).toBe('test1 test1');
            expect(result.items[1]).toBe('test2 test2');
            expect(result.items[2]).toBe('test3 test3');
            expect(result.items[3]).toBe('test4 test4');
        });

        it('should creates list object with correct index of answer', function() {
            var result = parser._extractList('{{test1,test2,!test3!,test4}}');

            expect(result.rightAnswerIndex).toBe(2);
        });

        it('should create unique id for each List', function(){
            var result_1 = parser._extractList('{{test1,test2,!test3!,test4}}');
            var result_2 = parser._extractList('{{test1,test2,!test3!,test4}}');

            expect(result_1._id).toBe('examjs_id_1');
            expect(result_2._id).toBe('examjs_id_2');
        });
    });


    describe('_indexOfRightAnswer()', function() {
        it('should parse index of right answer in List syntax block', function() {
            var result = parser._indexOfRightAnswer(['test1', 'test2', '!test3!', 'test4']);

            expect(result).toBe(2);
        });
    });

    describe('_removeExclamationPoints()', function() {
        it('should removes exclamation points from right answer', function() {
            var result = parser._removeExclamationPoints(['test1', 'test2', '!test3!', 'test4']);

            expect(result[2]).toBe('test3');
        });

        it('should returns same array that was passed into the _removeExclamationPoints() method if this array doesn\'t countains a right answer', function() {
            var result = parser._removeExclamationPoints(['test1', 'test2']);

            expect(result[0]).toBe('test1');
            expect(result[1]).toBe('test2');
            expect(result.length).toBe(2);
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
            }).toThrow(new ParsingError('Parser Error: into the parse() method was passed not a string parameter'));
        });

        it('should parse all syntax blocks and extract List object', function() {
            var result = parser.parse('bla bla bla {{test1,!test2!}}');

            expect(result.length).toBe(1);
            expect(result[0].rightAnswerIndex).toBe(1);
            expect(result[0].items[1]).toBe('test2');
        });

        it('should create List that contains syntax block', function() {
            var result = parser.parse('bla bla {{test1, !test2!}}');

            expect(result[0].syntaxBlock).toBe('{{test1, !test2!}}')
        });
    });
});
