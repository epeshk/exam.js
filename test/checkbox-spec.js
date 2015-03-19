var assert = require('assert'),
  exam = require('../src/exam.js');

describe('Checkbox tests', function() {
  describe('Checkbox expressions', function() {
    it('should return object which contains expressions with type "checkbox"', function() {
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }} {{ question2? :? 1,2,3 :: 1,3 }}');
      console.log(result);
      assert.equal(result.expressions[0].html, '<div id="exam-js-0"> question1? <input id="exam-js-1" type="checkbox" class="exam-js-input"> 1</input>,<input id="exam-js-2" type="checkbox" class="exam-js-input">2</input>,<input id="exam-js-3" type="checkbox" class="exam-js-input">3 </input></div>');
      assert.equal(result.expressions[1].html, '<div id="exam-js-4"> question2? <input id="exam-js-5" type="checkbox" class="exam-js-input"> 1</input>,<input id="exam-js-6" type="checkbox" class="exam-js-input">2</input>,<input id="exam-js-7" type="checkbox" class="exam-js-input">3 </input></div>');
    });
  });
})
