var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\r');
      assert.equal(result.expressions != null, true);
    });
  });
})
