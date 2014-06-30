'use strict';
describe('ExamJS', function(){
    var exam;
    beforeEach(function(){
       exam = new Exam(); 
    });

    it('should be created', function(){
        var result = new Exam();
    });

    describe('parse()', function(){
        it('should parse source text and replace all syntax blocks to HTML elements', function(){
            var result = exam.parse('bla bla bla {{test1,!test2!}} bla');

            expect(result).toBe('bla bla bla <input list="examjs_id_1"><datalist id="examjs_id_1"><option value="test1"><option value="test2"></datalist> bla');
        }); 
    });
});
