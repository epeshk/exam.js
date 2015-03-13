var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('{{ test? :? ... :: test }}');
      assert.equal(result.expressions != null, true);
    });

    it('should return an object with a expressions field than contains proper count of expressions', function(){
      var result = exam.parse('{{ test? :? ... :: test }} {{ test? :? ... :: test }}');
      assert.equal(result.expressions.length, 2);
    });
  });
})
