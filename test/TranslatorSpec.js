'use strict';
describe('Translator', function() {
    var translator;
    beforeEach(function() {
        translator = new Translator();
    });

    

    describe('_createListBox()', function() {
        it('should create a listbox from List', function() {
            var result = translator._createListBox(new List(['test1', 'test2'], 1, '{{test1,!test2!}}', 'examjs_id_1'));

            expect(result).toBe('<input list="examjs_id_1_data" id="examjs_id_1"><datalist id="examjs_id_1_data"><option value="test1"><option value="test2"></datalist>');
        });
    });

    describe('_createTextInput()', function(){
        it('should create a textInput from TextInput', function(){
            var result_1 = translator._createTextInput(new TextInput('true', '{{...| true }}', 'examjs_id_1'));

            expect(result_1).toBe('<input type="text" id="examjs_id_1"></input>');
        });

        it('should create a text input tag and tag with a help text', function(){
            var result = translator._createTextInput(new TextInput('right answer', '{{...|right answer :? help text}}', 'examjs_id_1', 'help text'));

            expect(result).toBe('<input type="text" id="examjs_id_1"></input><div id="help_text_examjs_id_1">help text</div>');
        });
    });

    describe('_createHint()', function() {
        it('should create a btnHelp from Hint', function() {
            var result = translator._createHint(new Hint("{{?help?}}", "help", "examjs_id_1_help"));

            expect(result).toBe("<div id='examjs_id_1_help'>help!?</div>");
        });
    });

    describe('_convertAllObjects()', function() {
        it('should convert all syntax objects to the text', function() {
            var data = [new List(['test1', 'test2'], 1, '{{test1,!test2!}}'), new List(['test1', 'test2'], 1, '{{test1,!test2!}}'),
            new TextInput("true", "{{...|true}}")];
            var result = translator._convertAllObjects(data);

            expect(result.length).toBe(3);
            expect(typeof result[0].result === 'string').toBeTruthy();
            expect(typeof result[1].result === 'string').toBeTruthy();
            expect(typeof result[2].result === 'string').toBeTruthy();
        });
        
        it('should throw an error if it took incorrect objects', function(){
            expect(function(){
                translator._convertAllObjects([{},{}]);
            }).toThrow(new Error('Converting error. Translator cannot convert object that was passed into it'));   
        });
    });
});
