'use strict';
describe('Translator', function() {
    var translator;
    beforeEach(function() {
        translator = new Translator();
    });

    describe('_createListBox()', function() {
        it('should create a listbox from List', function() {
            var result = translator._createListBox(new List(['test1','test2'],1,'{{test1,!test2!}}'));    

           expect(result).toBe('<input list="testID"><datalist id="testID"i><option value="test1"><option value="test2"'); 
        });
    });
});
