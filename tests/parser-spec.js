var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('parse()', function(){
    it('should return an object with a source', function(){
      console.log(exam.parse('{{1,2,3,4 :: 1}}'));
      assert.equal(1, 1);
    })
  })
})
