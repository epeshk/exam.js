var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Question tests', function(){
  describe('Simple question tests', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('\rТЕСТ\rWhat is your name?\r+Exam.js\rTest\r---\r');
      console.log(result);
      assert.equal(result.expressions[0].answers.length === 2, true);
    });
  });
})
