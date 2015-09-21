'use strict';
describe('QuestionManager', function() {
  var questionManager;
  beforeEach(function() {
    var parsedSource = {
      expressions: [{
        questions: [{
          answer: 'yes',
          isRight: true
        }],
        html: '<form class="exam-js-question">test?<input id="exam-js-78" type="text" class="exam-js-input"/></form>',
        htmlID: 'exam-js-1',
        question: 'test?'
      }],
      type: 'tests-setion'
    };
    questionManager = new QuestionManager(parsedSource);
  });

  describe('getResults()', function() {
    it('should return a result object', function() {
      var result = questionManager.getResults();

      expect(result).not.toBe(null);
    });
  });

  describe('getResults()', function() {
    it('should return an answer object', function() {
      var result = questionManager.createAnswerObject({question: 'q?', htmlID: '', answers: [{answer: 'yes', isRight: true}], html: ''}, [{answer: 'yes', type: 'text'}]);

      expect(result).not.toBe(null);
    });

    it('should return an right answer object', function() {
      var result = questionManager.createAnswerObject({question: 'q?', htmlID: '', answers: [{answer: 'yes', isRight: true}], html: ''}, [{answer: 'yes', type: 'text'}]);

      expect(result.isRight).toBeTruthy();
    });

    it('should return an false answer object', function() {
      var result = questionManager.createAnswerObject({question: 'q?', htmlID: '', answers: [{answer: 'yes', isRight: true}], html: ''}, [{answer: 'no', type: 'text'}]);

      expect(result.isRight).toBeFalsy();
    });
  });
});

