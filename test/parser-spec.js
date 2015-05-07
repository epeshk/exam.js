var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('ТЕСТЫ\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\r');
      assert.equal(result.expressions != null, true);
      assert.equal(result.expressions.length === 1, true);
    });

    it('should return an object with one type section and two questions', function(){
      var result = exam.parse('ТЕСТЫ\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\r\rTest quesion?\r+test\r\r');
      assert.equal(result.expressions.length === 1, true);
      console.log(result.expressions[0]);
      assert.equal(result.expressions[0].questions.length === 2, true);
    });
  });
})
