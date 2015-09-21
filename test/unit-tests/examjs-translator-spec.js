'use strict';
var assert = require('assert');
var ExamjsTranslator = require('../../dist/exam.js').ExamjsTranslator;

describe('ExamjsTranslator', function() {
  var transtaltor;
  beforeEach(function() {
    transtaltor = new ExamjsTranslator();
  });

  describe('_createYoutubeHtml()', function() {
    it('should create youtube iframe', function() {
      var result = transtaltor._createYoutubeHtml('https://youtu.be/test');

      assert.equal(result, '<iframe width="560" height="315" src="https://www.youtube.com/embed/test" frameborder="0" allowfullscreen></iframe>');
    });
  });

  describe('_createAnswerHtml', function() {
    it('should properly creates base part of result answers\' html', function() {
      var result = transtaltor._createAnswerHtml({answer: 'test',inputType: 'text', type: 'text', groupID: 123, number: 1}, {answerCssClass: 'test-class',html: '<div></div>'});

      assert.equal(result, '<div class=\"test-class\"><div class=\"exam-js-answer-container\"><div class=\"exam-js-answer-number\"><input id=\"exam-js-0\" type=\"text\" name=\"123\" class=\"exam-js-input\" data-answer=\"test\" data-answer-type=\"text\"/> 1)</div><div class=\"exam-js-answer\"><div></div></div></div></div>');
    });
  });

  describe('_getId()', function() {
    it('should return new id every time it was called', function() {
      var result1 = transtaltor._getId();
      var result2 = transtaltor._getId();
      var result3 = transtaltor._getId();

      assert.equal(result1, 'exam-js-0');
      assert.equal(result2, 'exam-js-1');
      assert.equal(result3, 'exam-js-2');
    });
  });

  describe('_getGroupId()', function() {
    it('should return new id every time it was called', function() {
      var result1 = transtaltor._getGroupId();
      var result2 = transtaltor._getGroupId();
      var result3 = transtaltor._getGroupId();

      assert.equal(result1, 'exam-js-group-0');
      assert.equal(result2, 'exam-js-group-1');
      assert.equal(result3, 'exam-js-group-2');
    });
  });

  describe('_getMathId()', function() {
    it('should return new id every time it was called', function() {
      var result1 = transtaltor._getMathId();
      var result2 = transtaltor._getMathId();
      var result3 = transtaltor._getMathId();

      assert.equal(result1, 'exam-js-math-0');
      assert.equal(result2, 'exam-js-math-1');
      assert.equal(result3, 'exam-js-math-2');
    });
  });
});

