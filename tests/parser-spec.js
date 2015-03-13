var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('parse()', function(){
    it('should return an object with a source', function(){
      console.log(exam.parse('{{ test? :? ... :: test }}'));
      assert.equal(1, 1);
    })
  })
})
