'use strict';
var assert = require('assert'),
  exam = require('../../dist/exam.js');

describe('Question tests', function() {
  describe('question object', function() {
    it('should contain right answer', function() {
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.expressions[0].questions[0].answers[0].answer === 'Exam.js', true);
    });

    it('should contain "on answer" callback', function() {
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var cb = result.expressions[0].questions[0].onAnswer;
      assert.equal(cb != null && typeof cb === 'function', true);
    });

    it('should contain html markup of a question', function() {
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var html = result.expressions[0].questions[0].html;
      assert.equal(html != null && typeof html === 'string', true);
    });

    it('should contain html markup of a question', function() {
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var id = result.expressions[0].questions[0].htmlID;
      assert.equal(id != null && typeof id === 'string', true);
    });

    it('should return an object that contains two answers if question ends with space', function() {
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name? \r+Exam.js\r-Exam.js2\r\rКОНЕЦ ТЕСТОВ');

      assert.equal(result.expressions[0].questions[0].answers.length, 2);
    });
  });
});

