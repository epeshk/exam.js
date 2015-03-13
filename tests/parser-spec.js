var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('parse()', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('{{ test? :? ... :: test }}');
      assert.equal(result.expressions != null, true);
    })
  })
})
