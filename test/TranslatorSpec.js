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

    describe('_convertAllObjects()', function() {
        it('should convert all syntax objects to the text', function() {
            var data = [new List(['test1', 'test2'], 1, '{{test1,!test2!}}'), new List(['test1', 'test2'], 1, '{{test1,!test2!}}')];
            var result = translator._convertAllObjects(data);

            expect(result.length).toBe(2);
            expect(typeof result[0] === 'string').toBeTruthy();
            expect(typeof result[1] === 'string').toBeTruthy();
        });
    });
});
