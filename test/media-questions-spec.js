var assert = require('assert'),
  exam = require('../src/exam.js');

describe('Media question tests', function() {
  describe('VIDEO question', function() {
    it('should return proper type of expression', function() {
      var result = exam.parse('ТЕСТ ВИДЕО\rWhat is your name?\r+Exam.js\rTest\r\r');
      console.log(result.expressions[0].type);
      assert.equal(result.expressions[0].type === 'VIDEO-QUESTION', true);
    });
  });
})
