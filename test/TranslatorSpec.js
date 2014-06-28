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

            expect(result).toBe('<input list="testID"><datalist id="testID"i><option value="test1"><option value="test2"');
        });
    });
});
