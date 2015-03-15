var assert = require('assert'),
  exam = require('../src/exam.js');

describe('Checkbox tests', function() {
  describe('Checkbox expressions', function() {
    it('should return object which contains expressions with type "checkbox"', function() {
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }} {{ question2? :? 1,2,3 :: 1,3 }}');
      console.log(result);
      assert.equal(result.expressions[0].type, 'checkbox');
      assert.equal(result.expressions[1].type, 'checkbox');
    });
  });
})
