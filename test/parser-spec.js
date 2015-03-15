var assert = require('assert'),
    exam = require('../src/exam.js');

describe('Parser tests', function(){
  describe('Simple expressions parser', function(){
    it('should return an object with a expressions', function(){
      var result = exam.parse('{{ question? :? ... :: answer }}');
      assert.equal(result.expressions != null, true);
    });

    it('should parse list expressions', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 2 }}');
      assert.equal(result.expressions != null, true);
    });

    it('should parse checkbox expressions', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }}');
      assert.equal(result.expressions != null, true);
    });

    it('should return an object with a expressions field than contains proper count of expressions', function(){
      var result = exam.parse('{{ question1? :? ... :: answer1 }} {{ question2? :? ... :: answer2 }}');
      assert.equal(result.expressions.length, 2);
    });

    it('should return a source code', function(){
      var source = 'hello exam {{question1 ? :? ... :: answer1 }} bla bla bla';
      assert.equal(exam.parse(source).source, source);
    });

    it('should return a source code', function(){
      var source = 'hello exam {{question1 ? :? 1,2,3 :: 2 }} bla bla bla';
      assert.equal(exam.parse(source).source, source);
    });

    it('should return a source code', function(){
      var source = 'hello exam {{question1 ? :? 1,2,3 :: 1,3 }} bla bla bla';
      assert.equal(exam.parse(source).source, source);
    });

    it('should return expressions which contains IDs', function(){
      var result = exam.parse('{{ question1? :? ... :: answer1 }} {{ question2? :? ... :: answer2 }}');
      assert.equal(result.expressions[0].id != null, true);
      assert.equal(result.expressions[1].id != null, true);
    });

    it('should return expressions which contains IDs', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1 }} {{ question2? :? 1,2,3 :: 3 }}');
      assert.equal(result.expressions[0].id != null, true);
      assert.equal(result.expressions[1].id != null, true);
    });

    it('should return expressions which contains IDs', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }} {{ question2? :? 1,2,3 :: 1,3 }}');
      assert.equal(result.expressions[0].id != null, true);
      assert.equal(result.expressions[1].id != null, true);
    });

    it('should return expressions which contains html', function(){
      var result = exam.parse('{{ question1? :? ... :: answer1 }} {{ question2? :? ... :: answer2 }}');
      assert.equal(result.expressions[0].html != null, true);
      assert.equal(result.expressions[1].html != null, true);
    });

    it('should return expressions which contains html', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1 }} {{ question2? :? 1,2,3 :: 3 }}');
      assert.equal(result.expressions[0].html != null, true);
      assert.equal(result.expressions[1].html != null, true);
    });

    it('should return expressions which contains html', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }} {{ question2? :? 1,2,3 :: 1,3 }}');
      assert.equal(result.expressions[0].html != null, true);
      assert.equal(result.expressions[1].html != null, true);
    });

    it('should return expressions which contains proper IDs (strings "exam-js-...")', function(){
      var result = exam.parse('{{ question1? :? ... :: answer1 }} {{ question2? :? ... :: answer2 }}');
      assert.equal(result.expressions[0].id.indexOf('exam-js-') >= 0, true);
      assert.equal(result.expressions[1].id.indexOf('exam-js-') >= 0, true);
    });

    it('should return expressions which contains proper IDs (strings "exam-js-...")', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1 }} {{ question2? :? 1,2,3 :: 3 }}');
      assert.equal(result.expressions[0].id.indexOf('exam-js-') >= 0, true);
      assert.equal(result.expressions[1].id.indexOf('exam-js-') >= 0, true);
    });

    it('should return expressions which contains proper IDs (strings "exam-js-...")', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }} {{ question2? :? 1,2,3 :: 1,3 }}');
      assert.equal(result.expressions[0].id.indexOf('exam-js-') >= 0, true);
      assert.equal(result.expressions[1].id.indexOf('exam-js-') >= 0, true);
    });

    it('should return object which contains expressions with type "input"', function(){
      var result = exam.parse('{{ question1? :? ... :: answer1 }} {{ question2? :? ... :: answer2 }}');
      assert.equal(result.expressions[0].type, 'input');
      assert.equal(result.expressions[1].type, 'input');
    });

    it('should return object which contains expressions with type "list"', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1 }} {{ question2? :? 1,2,3 :: 3 }}');
      assert.equal(result.expressions[0].type, 'list');
      assert.equal(result.expressions[1].type, 'list');
    });

    it('should return object which contains expressions with type "checkbox"', function(){
      var result = exam.parse('{{ question1? :? 1,2,3 :: 1,3 }} {{ question2? :? 1,2,3 :: 1,3 }}');
      assert.equal(result.expressions[0].type, 'checkbox');
      assert.equal(result.expressions[1].type, 'checkbox');
    });
  });
})
