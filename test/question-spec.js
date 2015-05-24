var assert = require('assert'),
    exam = require('../dist/exam.js');

describe('Question tests', function(){
  describe('question object', function(){
    it('should contain right answer', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.expressions[0].questions[0].answers[0].answer === 'Exam.js', true);
    });

    it('should contain "on answer" callback', function(){
      var result = exam.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var cb = result.expressions[0].questions[0].answers[0].onAnswer;
      assert.equal(cb != null && typeof cb === 'Function', true);
    });
  });
})
