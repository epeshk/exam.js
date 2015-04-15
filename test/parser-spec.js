var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('ТЕСТ\rWhat is your name?\r+Exam.js\r\r');
      assert.equal(result.expressions != null, true);
    });

    it('should return an object with an question object', function(){
      var result = exam.parse('ТЕСТ\rWhat is your name?\r+Exam.js\r\r');
      assert.equal(result.expressions[0].type === 'question', true);
    });

    it('should return an object with an question html', function(){
      var result = exam.parse('ТЕСТ\rWhat is your name?\r+Exam.js\r\r');
      assert.equal(result.expressions[0].html.length > 0, true);
    });

    it('should return an object with an question html which contains some text except expressions', function(){
      var result = exam.parse('bla bla bla\rТЕСТ\rWhat is your name?\r+Exam.js\r\rblah blah blah');
      console.log(result.html);
      assert.equal(result.html.indexOf('bla bla bla') > 0, true);
      assert.equal(result.html.indexOf('blah blah blah') > 0, true);
    });
  });
})
