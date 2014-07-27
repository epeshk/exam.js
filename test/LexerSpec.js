'use strict';
describe('Lexer', function() {
    var lexer;
    beforeEach(function() {
        lexer = new Lexer();
    });

    describe('parse()', function() {
        it('should return an expression that contains items and separators', function() {
            var result = lexer.parse('{{1,2}}');

            expect(result.expression.length).toEqual(3);
        });

        it('should return an expression that contains two Items and one ItemsSeparator', function(){
            var result = lexer.parse('{{1,2}}');

            expect(result.expression[0] instanceof Item).toBeTruthy();
            expect(result.expression[1] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression[2] instanceof Item).toBeTruthy();
        });

        it('should return an expression that contains all types of a tokens', function(){
            var result = lexer.parse('{{1,2,... :: test text :? help text}}');
            
            expect(result.expression.length).toEqual(9);
            expect(result.expression[0] instanceof Item).toBeTruthy();
            expect(result.expression[1] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression[2] instanceof Item).toBeTruthy();
            expect(result.expression[3] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression[4] instanceof InputToken).toBeTruthy();
            expect(result.expression[5] instanceof AnswerSeparator).toBeTruthy();
            expect(result.expression[6] instanceof Item).toBeTruthy();
            expect(result.expression[7] instanceof HelpSeparator).toBeTruthy();
            expect(result.expression[8] instanceof Item).toBeTruthy();
        });

        it('should return an expression with a lexemes that contains a correct values', function(){
            var result = lexer.parse('{{1,2}}');

            expect(result.expression[0].value).toEqual('1');
            expect(result.expression[1].value).toEqual(',');
            expect(result.expression[2].value).toEqual('2');
        });

        it('should return an expression with a item lexeme if source contains uncompleted part of a separator token (like this ..)', function(){
            var result = lexer.parse('{{.. :: test}}');

            expect(result.expression[0].value).toEqual('..');
            expect(result.expression[0] instanceof Item).toBeTruthy();
        });

        it('should return an expression that contains 3 items if first item is a uncompleted token', function(){
            var result = lexer.parse('{{..,2,3 :: answer }}');

            expect(result.expression[0].value).toEqual('..');
        });
    });

    describe('_clearSyntaxBLock()', function(){
        it('should return syntax block without a {{ and }} tokens', function(){
            var result = lexer._clearSyntaxBlock('{{1,2,3,4}}');

            expect(result).toEqual('1,2,3,4');
        });
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

    describe('_isPartOfSeparator()', function(){
        it('shoud return True if the tokens contains a char', function(){
            var result1 = lexer._isPartOfSeparator(',');
            var result2 = lexer._isPartOfSeparator(':');
            var result3 = lexer._isPartOfSeparator('.');
            var result4 = lexer._isPartOfSeparator('?');

            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
            expect(result3).toBeTruthy();
            expect(result4).toBeTruthy();
        });  

        it('should return True if the tokens contains a string', function(){
            var result1 = lexer._isPartOfSeparator('::');
            var result2 = lexer._isPartOfSeparator(':?');
            var result3 = lexer._isPartOfSeparator('..');

            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
            expect(result3).toBeTruthy();
        });

        it('should return False if the tokens not contains a string', function(){
            var result1 = lexer._isPartOfSeparator(':.');
            var result2 = lexer._isPartOfSeparator(':,');
            var result3 = lexer._isPartOfSeparator('.,');

            expect(result1).toBeFalsy();
            expect(result2).toBeFalsy();
            expect(result3).toBeFalsy();
        });
    });
});
