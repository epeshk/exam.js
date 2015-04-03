var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('\nТЕСТ\nWhat is your name?\n+Exam.js\n\n');
      assert.equal(result.expressions != null, true);
    });

    it('should return an object with an simple-question object', function(){
      var result = exam.parse('\nТЕСТ\nWhat is your name?\n+Exam.js\n\n');
      assert.equal(result.expressions[0].type === 'simple-question', true);
    });

    it('should return an object with an simple-question html', function(){
      var result = exam.parse('\nТЕСТ\nWhat is your name?\n+Exam.js\n\n');
      assert.equal(result.expressions[0].html.length > 0, true);
    });

    it('should return an object with an simple-question html which contains some text except expressions', function(){
      var result = exam.parse('bla bla bla\nТЕСТ\nWhat is your name?\n+Exam.js\n\nblah blah blah');
      console.log(result.html);
      assert.equal(result.html.indexOf('bla bla bla') > 0, true);
      assert.equal(result.html.indexOf('blah blah blah') > 0, true);
    });
  });
})
