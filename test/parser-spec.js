var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('\nТЕСТ\nWhat is your name?\n+Exam.js\n\n');
      assert.equal(result.expressions != null, true);
    });
  });
})
