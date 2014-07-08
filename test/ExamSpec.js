'use strict';
describe('Exam()',function(){
    it('should should leave the settings unchanged', function(){
        var exam = new Exam();
        expect(exam._settings.separatorMode).toBe(true);
        expect(exam._settings.btnFinishId).toBe(null);
    });

    it('should should leave the btnFinishId unchanged and setting separatorMode on false', function(){
        var setting = {'separatorMode':false};
        var exam = new Exam(setting);
        expect(exam._settings.separatorMode).toBe(false);
        expect(exam._settings.btnFinishId).toBe(null);
    });

    it('should should leave the separatorMode unchanged and setting btnFinishId on "button_1"', function(){
        var setting = {'btnFinishId': "button_1"};
        var exam = new Exam(setting);
        expect(exam._settings.separatorMode).toBe(true);
        expect(exam._settings.btnFinishId).toBe("button_1");
    });

});

describe('Exam', function() {
    var exam;
    beforeEach(function() {
        exam = new Exam();
    });

    describe('parse()', function(){
        it('should replace all syntax blocks to HTML tags if _preprocessor is default', function(){
            var result = exam.parse('bla bla bla {{test1,!test2!}} bla');

            expect(result).toBe('<p>bla bla bla <input list="examjs_id_1_data" id="examjs_id_1"><datalist id="examjs_id_1_data"><option value="test1"><option value="test2"></datalist> bla</p>');
        });

        it('should return text unchanged if _preprocessor is not default', function(){
            var result  = exam.parse('bla bla bla {{test1,!test2!}} bla', function(source){
                return source;
            });

            expect(result).toBe('bla bla bla <input list="examjs_id_1_data" id="examjs_id_1"><datalist id="examjs_id_1_data"><option value="test1"><option value="test2"></datalist> bla');
        });

        it('should show exception if _preprocessor is not function', function(){
            var text = "pam pam pam";
            var number = 156;

            expect(function(){
                exam.parse('bla bla bla {{test1,!test2!}} bla', text);
            }).toThrow(new Error('The second argument must be a parsing function'));

            expect(function(){
                exam.parse('bla bla bla {{test1,!test2!}} bla', number);
            }).toThrow(new Error('The second argument must be a parsing function'));
        });

    });
});
