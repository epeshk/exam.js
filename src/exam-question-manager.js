'use strict';
var QuestionManager = (function() {
  function QuestionManager(parsedSource) {
    if (parsedSource) {
      this.expressions = parsedSource.expressions;
      this.questionsCount = parsedSource.questionsCount;
      this.html = parsedSource.html;
    } else {
      this.expressions = [];
      this.questionsCount = 0;
      this.html = '';
    }
    this.answers = {};
  }

  QuestionManager.prototype._bindEvent = function(htmlNode, callback) {
    var self = this;
    if (htmlNode) {
      if (htmlNode.type === 'text') {
        htmlNode.onkeyup = callback.bind(self);
      } else {
        htmlNode.onchange = callback.bind(self);
      }
    }
  };

  QuestionManager.prototype._checkInputAnswer = function(e) {
    var self = this,
      value = e.target.value;
    self._getQuestionByHtmlId(e.target.id, function(question) {
      var answer = question.answers[0].answer,
        answerObj = self._createAnswerObject(question, [{
          answer: value,
          type: 'text'
        }]);

      self.answers[answerObj.htmlID] = answerObj;
    });
  };
  QuestionManager.prototype._checkComplexAnswer = function(e) {
    var self = this,
      id = e.target.form.id,
      childNodes = e.target.form.elements;
    self._getQuestionByHtmlId(id, function(question) {
      var tmpChildArray = Array.prototype.slice.call(childNodes);
      var answers = tmpChildArray.filter(function(elem) {
        return ((elem.type === 'checkbox' || elem.type === 'radio') && elem.checked);
      }).map(function(a) {
        return {
          answer: self._getAnswerFromAttribute(a),
          type: self._getMediaTypeFromAttribute(a)
        };
      });

      var answerObj = self._createAnswerObject(question, answers);
      self.answers[answerObj.htmlID] = answerObj;
    });
  };
  QuestionManager.prototype._checkSelectAnswer = function(e) {
    var self = this;
    var id = e.target.id;
    var answer = e.target.selectedOptions[0].value;
    self._getQuestionByHtmlId(id, function(question) {
      var answerObj = self._createAnswerObject(question, [{
        answer: answer,
        type: 'text'
      }]);
      self.answers[answerObj.htmlID] = answerObj;
    });
  };
  QuestionManager.prototype._checkAnswer = function(e) {
    var self = this;
    var type = e.target.type;
    if (type === 'text') {
      self._checkInputAnswer(e);
    } else if (type === 'checkbox' || type === 'radio') {
      self._checkComplexAnswer(e);
    } else if (type === 'select-one') {
      self._checkSelectAnswer(e);
    }
  };
  QuestionManager.prototype._createAnswerObject = function(question, answers) {
    var rightAnswers = question.answers.filter(function(a) {
      return a.isRight;
    });
    var isRight = rightAnswers.length === answers.length;

    rightAnswers.forEach(function(ra) {
      var tmpResult = false;
      answers.forEach(function(a) {
        tmpResult = tmpResult || (a.answer === ra.answer);
      });
      isRight = isRight && tmpResult;
    });
    var obj = {
      answers: answers.map(function(a) {
        return a.answer;
      }),
      type: answers[0].type,
      rightAnswers: rightAnswers,
      question: question.question.replace(/<br\/>/g, ''),
      htmlID: question.htmlID,
      isRight: isRight
    };
    return obj;
  };
  QuestionManager.prototype._getAnswerFromAttribute = function(node) {
    return node.getAttribute('data-answer');
  };
  QuestionManager.prototype._getMediaTypeFromAttribute = function(node) {
    return node.getAttribute('data-answer-type');
  };
  QuestionManager.prototype._getQuestionByHtmlId = function(htmlID, callback) {
    var self = this,
      result = null;
    var tmpExp = self.expressions.forEach(function(e) {
      e.questions.forEach(function(q) {
        if (q.htmlID === htmlID) {
          callback(q);
        }
      });
    });
  };

  /**
   * Bind callbasck of answers to answers' html nodes
   */
  QuestionManager.prototype.initQuestions = function() {
    var self = this;
    self.expressions.forEach(function(e) {
      if (e.questions) {
        e.questions.forEach(function(q) {
          var elem = document.getElementById(q.htmlID);
          self._bindEvent(elem, q.onAnswer);
        });
      }
    });
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
  };

  /**
   * Returns an answers' results
   */
  QuestionManager.prototype.getResults = function() {
    var self = this,
      answers = [],
      rightAnswersCount = 0;

    for (var i in self.answers) {
      if (self.answers.hasOwnProperty(i)) {
        var answer = self.answers[i];
        answers.push(answer);
        if (answer.isRight) {
          rightAnswersCount++;
        }
      }
    }

    return {
      questionsCount: self.questionsCount,
      results: answers,
      rightAnswersCount: rightAnswersCount,
      percent: Math.round((rightAnswersCount / self.questionsCount) * 100)
    };
  };

  return QuestionManager;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
  exports.QuestionManager = QuestionManager;
}

