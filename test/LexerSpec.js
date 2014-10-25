'use strict';
describe('Lexer', function() {
    var lexer;
    beforeEach(function() {
        lexer = new Lexer();
    });

    describe('parse()', function() {
        it('should return an expression that contains items and separators', function() {
            var result = lexer.parse('{{1,2}}');

            expect(result.expression.length).toEqual(5);
        });

        it('should return an expression that contains StartBLock, two Items, one ItemsSeparator and EndBlock', function(){
            var result = lexer.parse('{{1,2}}');

            expect(result.expression[0] instanceof StartBlock).toBeTruthy();
            expect(result.expression[1] instanceof Item).toBeTruthy();
            expect(result.expression[2] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression[3] instanceof Item).toBeTruthy();
            expect(result.expression[4] instanceof EndBlock).toBeTruthy();
        });

        it('should return an expression that contains all types of a tokens', function(){
            var result = lexer.parse('{{1,2,... :: test text :? help text}}');
            
            expect(result.expression.length).toEqual(11);
            expect(result.expression[0] instanceof StartBlock).toBeTruthy();
            expect(result.expression[1] instanceof Item).toBeTruthy();
            expect(result.expression[2] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression[3] instanceof Item).toBeTruthy();
            expect(result.expression[4] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression[5] instanceof InputToken).toBeTruthy();
            expect(result.expression[6] instanceof AnswerSeparator).toBeTruthy();
            expect(result.expression[7] instanceof Item).toBeTruthy();
            expect(result.expression[8] instanceof HelpSeparator).toBeTruthy();
            expect(result.expression[9] instanceof Item).toBeTruthy();
            expect(result.expression[10] instanceof EndBlock).toBeTruthy();
        });

        it('should return an expression that contains StartSection, Item and EndSection', function(){
            var result = lexer.parse('{-- test --}');
            expect(result.expression.length).toEqual(3);

            expect(result.expression[0] instanceof StartSection).toBeTruthy();
            expect(result.expression[1] instanceof Item).toBeTruthy();
            expect(result.expression[2] instanceof EndSection).toBeTruthy();
        });

        it('should return an expression that contains StartSection, StartBlock, Item, EndBlock, EndSection', function(){
            var result = lexer.parse('{-- {{test}} --}');
            expect(result.expression.length).toEqual(5);

            expect(result.expression[0] instanceof StartSection).toBeTruthy();
            expect(result.expression[1] instanceof StartBlock).toBeTruthy();
            expect(result.expression[2] instanceof Item).toBeTruthy();
            expect(result.expression[3] instanceof EndBlock).toBeTruthy();
            expect(result.expression[4] instanceof EndSection).toBeTruthy();
        });

        it('should parse all tokens from a source', function(){
            var result = lexer.parse('{--\n Some text, some text, some text {{1,2::1:?test}} --}');

            expect(result.expression.length).toEqual(17);
        });

        it('should parse "\\n" as token', function(){
            var result = lexer.parse('\n');

            expect(result.expression[0] instanceof EndOfLine).toBeTruthy();
        });
    });

    describe('tryToAddSeparator()', function(){
        
    });

    describe('_isEmpty()', function(){
        it('should return true if string is empty', function(){
            var result = lexer._isEmpty('    ');
            
            expect(result).toBeTruthy();
        });  

        it('should return false if string is not empty', function(){
            var result = lexer._isEmpty('  test ');
            
            expect(result).toBeFalsy();
        });  
    });

    describe('_isPartOfToken()', function(){
        it('shoud return True if the tokens contains a char', function(){
            var result1 = lexer._isPartOfToken(',');
            var result2 = lexer._isPartOfToken(':');
            var result3 = lexer._isPartOfToken('.');
            var result4 = lexer._isPartOfToken('?');

            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
            expect(result3).toBeTruthy();
            expect(result4).toBeTruthy();
        });  

        it('should return True if the tokens contains a string', function(){
            var result1 = lexer._isPartOfToken('::');
            var result2 = lexer._isPartOfToken(':?');
            var result3 = lexer._isPartOfToken('..');

            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
            expect(result3).toBeTruthy();
        });

        it('should return False if the tokens not contains a string', function(){
            var result1 = lexer._isPartOfToken(':.');
            var result2 = lexer._isPartOfToken(':,');
            var result3 = lexer._isPartOfToken('.,');

            expect(result1).toBeFalsy();
            expect(result2).toBeFalsy();
            expect(result3).toBeFalsy();
        });
    });

    describe('_isToken()', function(){
        it('should return True if string that was passed into this method is a syntax token', function(){
            var result1 = lexer._isToken('...');
            var result2 = lexer._isToken('::');
            var result3 = lexer._isToken(':?');
            var result4 = lexer._isToken(',');
            
            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
            expect(result3).toBeTruthy();
            expect(result4).toBeTruthy();
        });  

        it('should return False if string that was passed into this method is not a syntax token', function(){
            var result1 = lexer._isToken('..,');
            var result2 = lexer._isToken('');

            expect(result1).toBeFalsy();
            expect(result2).toBeFalsy();
        });
    });
});
