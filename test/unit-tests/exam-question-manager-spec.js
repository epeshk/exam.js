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
});

