var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('parse()', function(){
    it('should return an object with a source', function(){
      console.log(exam.parse('{{ test 1, some text |2|3|4 }}'));
      assert.equal(1, 1);
    })
  })
})
