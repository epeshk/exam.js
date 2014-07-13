'use strict';
describe('Exam()',function(){
    it('should set the settings default', function(){
        var exam = new Exam();
        exam._setSettings();
        expect(exam._settings.separatorMode).toBe(true);
        expect(exam._settings.btnFinishId).toBe(null);
        expect(exam._settings.handlerForHint).toBe(exam._eventHandlerForHint);
        expect(exam._settings.handlerForBtnFinish).toBe(exam._eventHandlerForBtnFinish);
        expect(exam._settings.handlerForSeparatorMode).toBe(exam._eventHandlerForSeparatorMode);
        expect(exam._settings.preprocessor).toBe(markdown.toHTML);
    });

    it('should should leave the btnFinishId unchanged and setting separatorMode on false', function(){
        var setting = {'separatorMode':false};
        var exam = new Exam(setting);
        exam._setSettings();
        expect(exam._settings.separatorMode).toBe(false);
        expect(exam._settings.btnFinishId).toBe(null);
    });

    it('should should leave the separatorMode unchanged and setting btnFinishId on "button_1"', function(){
        var setting = {'btnFinishId': "button_1"};
        var exam = new Exam(setting);
        exam._setSettings();
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

    });
});
