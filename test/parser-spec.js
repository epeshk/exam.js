var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('ТЕСТЫ\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r');
      assert.equal(result.expressions != null, true);
      assert.equal(result.expressions.length === 1, true);
    });

    it('should return a question without simple text in answers', function(){
      var result = exam.parse('ТЕСТЫ\rТЕКСТ\r\rTest question2?\r+test2\rbla bla bla');
      assert.equal(result.expressions[0].questions[0].answers.indexOf('bla bla bla') < 0, true);
    });

    it('should return an object with one type section and two questions', function(){
      var result = exam.parse('ТЕСТЫ\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rTest quesion?\r+test\r');
      assert.equal(result.expressions.length === 1, true);
      assert.equal(result.expressions[0].questions.length === 2, true);
    });

    it('should return an object with one type section and two questions', function(){
      var result = exam.parse('ТЕСТЫ\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rTest quesion?\r+test\rВИДЕО\r\rWhat is your name?\r+http://link.com\r\rTest quesion?\r+http://link.com\r');
      assert.equal(result.expressions.length === 1, true);
      assert.equal(result.expressions[0].questions.length === 4, true);
    });
  });
})
