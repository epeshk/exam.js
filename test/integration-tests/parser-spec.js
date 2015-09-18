'use strict';
var assert = require('assert');
var exam = require('../../dist/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.expressions != null, true);
      assert.equal(result.expressions.length === 1, true);
    });

    it('should return a question without simple text in answers', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rTest question2?\r+test2\r\rКОНЕЦ ТЕСТОВ\rbla bla bla');
      assert.equal(result.expressions[0].questions[0].answers.indexOf('bla bla bla') < 0, true);
    });

    it('should return an object with one type section and two questions', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rTest quesion?\r+test\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.expressions.length === 1, true);
      assert.equal(result.expressions[0].questions.length === 2, true);
    });

    it('should return an object with one type section and two questions', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rq1?\r+t1\r\rq2?\r+t2\r\rВИДЕО\r\rq3?\r+http://link.com\r-http://link.com\r\rq4?\r+http://link.com\r-http://link.com\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.expressions.length === 1, true);
      assert.equal(result.expressions[0].questions.length === 4, true);
    });

    it('should return an object with html which contains html code for a video section', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rq1?\r+t1\r\rq2?\r+t2\r\rВИДЕО\r\rq3?\r+http://link.com\r-http://link.com\r\rq4?\r+http://link.com\r-http://link.com\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.expressions.length === 1, true);
    });
  });
});
