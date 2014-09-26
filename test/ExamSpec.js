'use strict';
describe('Exam()',function(){
    it('should set the settings default', function(){
        var exam = new Exam();

        expect(exam._separateCheckingMode).toBe(true);
        expect(exam._finishBtnID).not.toBeDefined();
        expect(exam._finishBtnEventHandler).toBeDefined();
        expect(exam._separateCheckingModeEventHandler).toBeDefined();
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

    it('should set all callback functions', function(){
        function someFunction1() {}
        function someFunction3() {}
        function someFunction4() {}
        var settings = {
            preprocessor : someFunction1,
            separateCheckingModeEventHandler: someFunction3,
            finishBtnEventHandler: someFunction4,
        };

        var exam = new Exam(settings);

        expect(exam._preprocessor).toBe(someFunction1);
        expect(exam._separateCheckingModeEventHandler).toBe(someFunction3);
        expect(exam._finishBtnEventHandler).toBe(someFunction4);
    });

});

describe('Exam', function() {
    var exam;
    beforeEach(function() {
        exam = new Exam();
    });

    describe('parse()', function(){
        it('should replace all syntax blocks to HTML tags if _preprocessor is default', function(){
            var result = exam.parse('bla bla bla {{test1,test2 :: test2}} bla');

            expect(result).toBe("<p>bla bla bla <div class='examjs-block'><select id='examjsid_1' class='examjs-input'><option>test1</option><option>test2</option></select></div> bla</p>");
        });

    });
});
