(function() {
  function QuestionManager(parsedSource) {
    this.expressions = parsedSource.expressions;
    this.questionsCount = parsedSource.questionsCount;
    this.html = parsedSource.html;
    this.answers = {};
  }

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
    }
  };
  QuestionManager.prototype.initQuestions = function() {
    var self = this;
    self.expressions.forEach(function(e) {
      if (e.questions) {
        e.questions.forEach(function(q) {
          var elem = document.getElementById(q.htmlID);
          if (elem) {
            if (elem.type === 'text') {
              elem.onkeyup = q.onAnswer.bind(self);
            } else {
              elem.onchange = q.onAnswer.bind(self);
            }
          }
        });
      }
    });
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
  };
  QuestionManager.prototype.checkAnswer = function(e) {
    var self = this;
    if (e.target.type === 'text') {
      self.checkInputAnswer(e);
    } else if (e.target.type === 'checkbox' || e.target.type === 'radio') {
      self.checkComplexAnswer(e);
    } else if (e.target.type === 'select-one') {
      self.checkSelectAnswer(e);
    }
  };
  QuestionManager.prototype.checkInputAnswer = function(e) {
    var self = this,
      value = e.target.value;
    self.getQuestionByHtmlID(e.target.id, function(question) {
      var answer = question.answers[0].answer,
        answerObj = self.createAnswerObject(question, [{
          answer: value,
          type: 'text'
        }]);

      self.answers[answerObj.htmlID] = answerObj;
    });
  };
  QuestionManager.prototype.checkComplexAnswer = function(e) {
    var self = this,
      id = e.target.form.id,
      childNodes = e.target.form.elements;
    self.getQuestionByHtmlID(id, function(question) {
      var tmpChildArray = Array.prototype.slice.call(childNodes);
      var answers = tmpChildArray.filter(function(elem) {
        return ((elem.type === 'checkbox' || elem.type === 'radio') && elem.checked);
      }).map(function(a) {
        return {
          answer: self.getAnswerFromAttribute(a),
          type: self.getMediaTypeFromAttribute(a)
        };
      });

      var answerObj = self.createAnswerObject(question, answers);
      self.answers[answerObj.htmlID] = answerObj;
    });
  };
  QuestionManager.prototype.checkSelectAnswer = function(e) {
    var self = this;
    id = e.target.id,
      answer = e.target.selectedOptions[0].value;
    self.getQuestionByHtmlID(id, function(question) {
      var answerObj = self.createAnswerObject(question, [{
        answer: answer,
        type: 'text'
      }]);
      self.answers[answerObj.htmlID] = answerObj;
    });
  };
  QuestionManager.prototype.createAnswerObject = function(question, answers) {
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
        return a.answer
      }),
      type: answers[0].type,
      rightAnswers: rightAnswers,
      question: question.question.replace(/<br\/>/g, ''),
      htmlID: question.htmlID,
      isRight: isRight
    }
    return obj;
  };
  QuestionManager.prototype.getAnswerFromAttribute = function(node) {
    return node.getAttribute('data-answer');
  };
  QuestionManager.prototype.getMediaTypeFromAttribute= function(node) {
    return node.getAttribute('data-answer-type');
  };
  QuestionManager.prototype.getQuestionByHtmlID = function(htmlID, callback) {
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

  this.QuestionManager = QuestionManager;
})();

