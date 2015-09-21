'use strict';
describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rКОНЕЦ ТЕСТОВ');
      expect(result.expressions).not.toBe(null);
      expect(result.expressions.length).toBe(1);
    });

    it('should return a question without simple text in answers', function(){
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rTest question2?\r+test2\r\rКОНЕЦ ТЕСТОВ\rbla bla bla');
      expect(result.expressions[0].questions[0].answers.indexOf('bla bla bla') < 0).toBeTruthy();
    });

    it('should return an object with one type section and two questions', function(){
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rWhat is your name?\r+Exam.js\r\rTest quesion?\r+test\r\rКОНЕЦ ТЕСТОВ');
      expect(result.expressions.length).toBe(1);
      expect(result.expressions[0].questions.length).toBe(2);
    });

    it('should return an object with one type section and two questions', function(){
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rq1?\r+t1\r\rq2?\r+t2\r\rВИДЕО\r\rq3?\r+http://link.com\r-http://link.com\r\rq4?\r+http://link.com\r-http://link.com\r\rКОНЕЦ ТЕСТОВ');
      expect(result.expressions.length).toBe(1);
      expect(result.expressions[0].questions.length).toBe(4);
    });

    it('should return an object with html which contains html code for a video section', function(){
      var result = parser.parse('ТЕСТЫ\r\rТЕКСТ\r\rq1?\r+t1\r\rq2?\r+t2\r\rВИДЕО\r\rq3?\r+http://link.com\r-http://link.com\r\rq4?\r+http://link.com\r-http://link.com\r\rКОНЕЦ ТЕСТОВ');
      expect(result.expressions.length).toBe(1);
    });
  });
});
