'use strict';
describe('Translator', function() {
    var translator;
    beforeEach(function() {
        translator = new Translator();
    });

    

    describe('_createListBox()', function() {
        it('should create a listbox from List', function() {
            var result = translator._createListBox(new List( '{{test1,!test2!}}',undefined, 'examjs_id_1',['test1', 'test2'], 1));

            expect(result).toBe("<div class='examjs-block'><select id='examjs_id_1' class='examjs-input'><option>test1</option><option>test2</option></select></div>");
        });
    });

    describe('_createTextInput()', function(){
        it('should create a textInput from TextInput', function(){
            var result = translator._createTextInput(new TextInput('{{... ::  true }}', undefined, 'examjs_id_1', 'true'));

            expect(result).toBe("<div class='examjs-block'><input type='text' id='examjs_id_1' class='examjs-input'></input></div>");
        });

        it('should create a text input tag and tag with a help text', function(){
            var result = translator._createTextInput(new TextInput('{{... :: right answer :? help text}}','help text', 'examjs_id_1', 'right answer'));

            expect(result).toBe("<div class='examjs-block'><input type='text' id='examjs_id_1' class='examjs-input'></input><div id='help_examjs_id_1' class='examjs-help-popup' data-help='help text'>?</div></div>");
        });
    });

    describe('convertAllObjects()', function() {
        it('should convert all syntax objects to the text', function() {
            var data = [new List('{{test1,!test2!}}',undefined, undefined, ['test1', 'test2'], 1), new List('{{test1,!test2!}}', undefined, undefined, ['test1', 'test2'], 1),
            new TextInput("true", "{{... :: true}}")];
            var result = translator.convertAllObjects(data);

            expect(result.length).toBe(3);
            expect(typeof result[0].result === 'string').toBeTruthy();
            expect(typeof result[1].result === 'string').toBeTruthy();
            expect(typeof result[2].result === 'string').toBeTruthy();
        });
        
        it('should throw an error if it took incorrect objects', function(){
            expect(function(){
                translator.convertAllObjects([{},{}]);
            }).toThrow(new Error('Converting error. Translator cannot convert object that was passed into it'));   
        });
    });
});
