'use strict';
describe('Question tests', function() {
  describe('question object', function() {
    it('should contain right answer', function() {
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      expect(result.expressions[0].questions[0].answers[0].answer).toBe('Exam.js');
    });

    it('should contain "on answer" callback', function() {
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var cb = result.expressions[0].questions[0].onAnswer;
      expect(cb != null && typeof cb === 'function').toBeTruthy();
    });

    it('should contain html markup of a question', function() {
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var html = result.expressions[0].questions[0].html;
      expect(html != null && typeof html === 'string').toBeTruthy();
    });

    it('should contain html markup of a question', function() {
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      var id = result.expressions[0].questions[0].htmlID;
      expect(id != null && typeof id === 'string').toBeTruthy();
    });

    it('should return an object that contains two answers if question ends with space', function() {
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name? \r+Exam.js\r-Exam.js2\r\rКОНЕЦ ТЕСТОВ');

      expect(result.expressions[0].questions[0].answers.length).toBe(2);
    });
  });
});

