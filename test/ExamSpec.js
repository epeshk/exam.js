'use strict';
describe('Exam()',function(){
    it('should set the settings default', function(){
        var exam = new Exam();

        expect(exam._separateCheckingMode).toBe(true);
        expect(exam._finishBtnID).not.toBeDefined();
        expect(exam._handlerForHint).toBe(exam._eventHandlerForHint);
        expect(exam._handlerForBtnFinish).toBe(exam._eventHandlerForBtnFinish);
        expect(exam._separateCheckingModeEventHandler).toBe(exam._eventHandlerForSeparatorMode);
        expect(exam._preprocessor).toBe(markdown.toHTML);
    });

    it('should leave the btnFinishId unchanged and setting separatorMode on false', function(){
        var setting = {separateCheckingMode: false};
        var exam = new Exam(setting);

        expect(exam._separateCheckingMode).toBe(false);
        expect(exam._finishBtnID).not.toBeDefined();
    });

    it('should leave the separatorMode unchanged and setting btnFinishId on "button_1"', function(){
        var setting = {finishBtnID : "button_1"};
        var exam = new Exam(setting);

        expect(exam._separateCheckingMode).toBe(true);
        expect(exam._finishBtnID).toBe("button_1");
    });

    it('should  setting all callback functions on other function', function(){
        function someFunction1() {/*todo*/}
        function someFunction2() {/*todo*/}
        function someFunction3() {/*todo*/}
        function someFunction4() {/*todo*/}
        var setting = {
            preprocessor : someFunction1,
            handlerForHint: someFunction2,
            handlerForSeparatorMode: someFunction3,
            handlerForBtnFinish: someFunction4,
        };

        var exam = new Exam(setting);

        expect(exam._preprocessor).toBe(someFunction1);
        expect(exam._handlerForHint).toBe(someFunction2);
        expect(exam._separateCheckingModeEventHandler).toBe(someFunction3);
        expect(exam._handlerForBtnFinish).toBe(someFunction4);
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

            expect(result).toBe('<p>bla bla bla <div><input list="examjs_id_1_data" id="examjs_id_1"><datalist id="examjs_id_1_data"><option value="test1"><option value="test2"></datalist></div> bla</p>');
        });

    });
});
