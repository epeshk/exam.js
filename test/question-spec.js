var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Question tests', function(){
  describe('Simple question tests', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('ТЕСТ\rWhat is your name?\r+Exam.js\rTest\r\r');
      assert.equal(result.expressions[0].answers.length === 2, true);
    });

    it('should return an object with 2 right answers', function(){
      var result = exam.parse('ТЕСТ\rWhat is your name?\r+Exam.js\r+Test1\rTest2\r\r');
      var count = result.expressions[0].answers.filter(function(a){
        return a.isRight;
      }).length;
      assert.equal(count === 2, true);
    });
  });
})
