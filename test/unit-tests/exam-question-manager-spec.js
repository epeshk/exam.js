'use strict';
describe('QuestionManager', function() {
  var questionManager;
  beforeEach(function() {
    var parsedSource = {
      expressions: [{
        questions: [{
          answer: 'yes',
          isRight: true,
          htmlID: 'exam-js-2'
        }],
        html: '<form class="exam-js-question">test?<input id="exam-js-78" type="text" class="exam-js-input"/></form>',
        htmlID: 'exam-js-1',
        question: 'test?'
      }],
      type: 'tests-setion'
    };
    questionManager = new QuestionManager(parsedSource);
  });

  it('should create new instance of the QuestionManager without paramsj', function() {
    var result = new QuestionManager();

    expect(result).not.toBe(null);
  });

  describe('getResults()', function() {
    it('should return a result object', function() {
      var result = questionManager.getResults();

      expect(result).not.toBe(null);
    });
  });

  describe('getResults()', function() {
    it('should return an answer object', function() {
      var result = questionManager._createAnswerObject({
        question: 'q?',
        htmlID: '',
        answers: [{
          answer: 'yes',
          isRight: true
        }],
        html: ''
      }, [{
        answer: 'yes',
        type: 'text'
      }]);

      expect(result).not.toBe(null);
    });

    it('should return an right answer object', function() {
      var result = questionManager._createAnswerObject({
        question: 'q?',
        htmlID: '',
        answers: [{
          answer: 'yes',
          isRight: true
        }],
        html: ''
      }, [{
        answer: 'yes',
        type: 'text'
      }]);

      expect(result.isRight).toBeTruthy();
    });

    it('should return an false answer object', function() {
      var result = questionManager._createAnswerObject({
        question: 'q?',
        htmlID: '',
        answers: [{
          answer: 'yes',
          isRight: true
        }],
        html: ''
      }, [{
        answer: 'no',
        type: 'text'
      }]);

      expect(result.isRight).toBeFalsy();
    });
  });

  describe('initQuestions()', function() {
    it('should bind onAnswerEvent', function() {
        spyOn(questionManager, '_bindEvent');

        questionManager.initQuestions();
        expect(questionManager._bindEvent.calls.count()).toBe(1);
    });
  });

  describe('_checkAnswer()', function() {
    it('should call _checkInputAnswer() if type of html event target is text', function() {
        spyOn(questionManager, '_checkInputAnswer');

        questionManager._checkAnswer({target: {type: 'text'}});
        expect(questionManager._checkInputAnswer.calls.count()).toBe(1);
    });

    it('should call _checkComplexAnswer() if type of html event target is checkbox', function() {
        spyOn(questionManager, '_checkComplexAnswer');

        questionManager._checkAnswer({target: {type: 'checkbox'}});
        expect(questionManager._checkComplexAnswer.calls.count()).toBe(1);
    });

    it('should call _checkComplexAnswer() if type of html event target is radio', function() {
        spyOn(questionManager, '_checkComplexAnswer');

        questionManager._checkAnswer({target: {type: 'radio'}});
        expect(questionManager._checkComplexAnswer.calls.count()).toBe(1);
    });

    it('should call _checkSelectAnswer() if type of html event target is select-one', function() {
        spyOn(questionManager, '_checkSelectAnswer');

        questionManager._checkAnswer({target: {type: 'select-one'}});
        expect(questionManager._checkSelectAnswer.calls.count()).toBe(1);
    });
  });

  describe('_getQuestionByHtmlId()', function() {
    it('should call callback', function() {
        var spy = jasmine.createSpy('spy');

        questionManager._getQuestionByHtmlId('exam-js-2', spy);
        expect(spy.calls.count()).toBe(1);
    });
  });
});

