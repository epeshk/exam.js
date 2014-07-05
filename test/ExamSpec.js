'use strict';
describe('Exam', function() {
    var exam;
    beforeEach(function() {
        exam = new Exam();
    });

    describe('parse()', function(){
        it('should replace all syntax blocks to HTML tags if _preprocessor is markdown', function(){
            var result = exam.parse('bla bla bla {{test1,!test2!}} bla',null);

            expect(result).toBe('<p>bla bla bla <input list="examjs_id_1"><datalist id="examjs_id_1"><option value="test1"><option value="test2"></datalist> bla</p>');
        });

        it('should return text unchanged if _preprocessor is not default', function(){
            var result  = exam.parse('bla bla bla {{test1,!test2!}} bla', function(source){
                return source;
            });

            expect(result).toBe('bla bla bla <input list="examjs_id_1"><datalist id="examjs_id_1"><option value="test1"><option value="test2"></datalist> bla');
        });
    });
});
