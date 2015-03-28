var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('\rТЕСТ\rWhat is your name?\r+Exam.js\r\r');
      assert.equal(result.expressions != null, true);
    });

    it('should return an object with a input object', function(){
      var result = exam.parse('\rТЕСТ\rWhat is your name?\r+Exam.js\r\r');
      console.log(result);
      assert.equal(result.expressions[0].type === 'input');
    });
  });
})
