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

            expect(result.expression.getExpression().length).toEqual(3);
        });

        it('should return an expression that contains two Items and one ItemsSeparator', function(){
            var result = lexer.parse('{{1,2}}');

            expect(result.expression.getExpression()[0] instanceof Item).toBeTruthy();
            expect(result.expression.getExpression()[1] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression.getExpression()[2] instanceof Item).toBeTruthy();
        });

        it('should return an expression that contains all types of a tokens', function(){
            var result = lexer.parse('{{1,2,... :: test text :? help text}}');
            
            expect(result.expression.getExpression().length).toEqual(9);
            expect(result.expression.getExpression()[0] instanceof Item).toBeTruthy();
            expect(result.expression.getExpression()[1] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression.getExpression()[2] instanceof Item).toBeTruthy();
            expect(result.expression.getExpression()[3] instanceof ItemsSeparator).toBeTruthy();
            expect(result.expression.getExpression()[4] instanceof InputToken).toBeTruthy();
            expect(result.expression.getExpression()[5] instanceof AnswerSeparator).toBeTruthy();
            expect(result.expression.getExpression()[6] instanceof Item).toBeTruthy();
            expect(result.expression.getExpression()[7] instanceof HelpSeparator).toBeTruthy();
            expect(result.expression.getExpression()[8] instanceof Item).toBeTruthy();
        });

        it('should return an expression with a lexems that contains a correct values', function(){
            var result = lexer.parse('{{1,2}}');

            expect(result.expression.getExpression()[0].value).toEqual('1');
            expect(result.expression.getExpression()[1].value).toEqual(',');
            expect(result.expression.getExpression()[2].value).toEqual('2');
        });

        it('should return an expression with a item lexem if source contains uncompleted part of a separator token (like this ..)', function(){
            var result = lexer.parse('{{.. :: test}}');

            expect(result.expression.getExpression()[0].value).toEqual('..');
            expect(result.expression.getExpression()[0] instanceof Item).toBeTruthy();
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
});
