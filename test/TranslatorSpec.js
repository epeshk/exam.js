'use strict';
describe('Translator', function() {
    var translator;
    beforeEach(function() {
        translator = new Translator();
    });

    describe('_getNextID()', function() {
        it('should return the next id each time it was called', function() {
            var result1 = translator._getNextID();
            var result2 = translator._getNextID();
            var result3 = translator._getNextID();

            expect(result1).toBe('examjs_id_1');
            expect(result2).toBe('examjs_id_2');
            expect(result3).toBe('examjs_id_3');
        });
    });

    describe('_createListBox()', function() {
        it('should create a listbox from List', function() {
            var result = translator._createListBox(new List(['test1', 'test2'], 1, '{{test1,!test2!}}'));

            expect(result).toBe('<input list="examjs_id_1"><datalist id="examjs_id_1"><option value="test1"><option value="test2"></datalist>');
        });
    });

    describe('_createTextInput()', function(){
        it('should create a textInput from TextInput', function(){
            var result = translator._createTextInput(new TextInput('true', '{{...| true }}'));
            expect(result).toBe("<input type='text' id='examjs_id_1'></input>");
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
