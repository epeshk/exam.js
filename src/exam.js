'use strict';
(function() {
  try {
    MathJax.Hub.Config({
      asciimath2jax: {
        delimiters: [
          ['{{', '}}']
        ]
      }
    });
  } catch (e) {}
  //mock of a markdonw parser (for testing)
  try {
    var tmp = markdown.test;
  } catch (e) {
    markdown = {
      toHTML: function(text) {
        return text;
      }
    };
  }

  function ExamJS() {
    this.currentId = 0;
    this.currentGroudId = 0;
    this.currentMathId = 0;
    this.currentType = '';
  }

  ExamJS.prototype.getID = function() {
    return 'exam-js-' + this.currentId++;
  };

  ExamJS.prototype.getGroudID = function() {
    return 'exam-js-group-' + this.currentGroudId++;
  };
  ExamJS.prototype.getMathID = function() {
    return 'exam-js-math-' + this.currentMathId++;
  };
  ExamJS.prototype.setCurrentType = function(type) {
    this.currentType = type;
  };
  ExamJS.prototype.createQuestions = function(question) {
    question.htmlID = this.getID();
    question.onAnswer = function(e) {
      this.checkAnswer(e);
    };
    if (this.currentType === 'TEXT') {
      question.html = this.createTextQuestion(question);
      return question;
    } else if (this.currentType === 'VIDEO') {
      question.html = this.createVideoQuestion(question);
      return question;
    } else if (this.currentType === 'AUDIO') {
      question.html = this.createAudioQuestion(question);
      return question;
    } else if (this.currentType === 'IMAGE') {
      question.html = this.createImageQuestion(question);
      return question;
    } else {
      throw new Error('Wrong section type!');
    }
  };
  ExamJS.prototype.getBasePartOfAnswer = function(answer, type, groupID, answerNumber, dataType, answerClass, answerHTML) {
    var tmpId = this.getID();
    return '<div class="' + answerClass + '"><input id="' + tmpId + '" type="' + type + '" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '" data-answer-type="' + dataType + '"/> ' + answerNumber + ')' + '<div class="exam-js-answer">' + answerHTML + '</div></div>';
  };
  ExamJS.prototype.createImgAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div><img src="' + answer.answer + '" class="exam-js-img"/></div>';
    return this.getBasePartOfAnswer(answer, type, groupID, answerNumber, 'image', 'exam-js-img-question', html);
  };
  ExamJS.prototype.createAudioAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div><audio controls src="' + answer.answer + '" preload="none"/></div>';
    return this.getBasePartOfAnswer(answer, type, groupID, answerNumber, 'audio', 'exam-js-media-question', html);
  };
  ExamJS.prototype.createVideoAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div><video controls width="400" height="300" src="' + answer.answer + '" preload="none" class="exam-js-video-answer"/></div>';
    return this.getBasePartOfAnswer(answer, type, groupID, answerNumber, 'video', 'exam-js-media-question', html);
  };
  ExamJS.prototype.createTextAnswer = function(answer, type, groupID, answerNumber) {
    return this.getBasePartOfAnswer(answer, type, groupID, answerNumber, 'text', 'exam-js-text-question', answer.answer);
  };
  ExamJS.prototype.createMediaTypedQuestion = function(question, type, answerGenerator) {
    var groupID = this.getGroudID();
    var self = this;
    return '<form id="' + question.htmlID + '" class="exam-js-question">' + '<div>' + question.question + '</div><div>' + question.answers.map(function(a) {
      return answerGenerator.call(self, a, type, groupID, (question.answers.indexOf(a) + 1));
    }).reduce(function(a, b) {
      return a + b;
    }) + '</div></form>';
  };
  ExamJS.prototype.createMediaQuestion = function(question, answerGenerator) {
    var rightAnswersCount = question.answers.filter(function(a) {
      return a.isRight;
    }).length;
    if (question.answers.length > 1 && rightAnswersCount > 1) {
      return this.createMediaTypedQuestion(question, 'checkbox', answerGenerator);
    } else if (question.answers.length > 1 && rightAnswersCount === 1) {
      return this.createMediaTypedQuestion(question, 'radio', answerGenerator);
    } else {
      throw new Error('Unknown media question type!');
    }
  };
  ExamJS.prototype.createVideoQuestion = function(question, answers) {
    return this.createMediaQuestion(question, this.createVideoAnswer);
  };
  ExamJS.prototype.createImageQuestion = function(question) {
    return this.createMediaQuestion(question, this.createImgAnswer);
  };
  ExamJS.prototype.createAudioQuestion = function(question) {
    return this.createMediaQuestion(question, this.createAudioAnswer);
  };
  ExamJS.prototype.createComplexTextQuestion = function(question) {
    return this.createMediaQuestion(question, this.createTextAnswer);
  };
  ExamJS.prototype.createTextQuestion = function(question) {
    if (question.answers.length === 1) {
      return this.createInput(question);
    } else {
      return this.createComplexTextQuestion(question);
    }
  };
  ExamJS.prototype.createInput = function(question) {
    return '<div><form class="exam-js-question">' + question.question + '<input id="' + question.htmlID + '" type="text" class="exam-js-input"/></from></div>';
  };
  ExamJS.prototype.createList = function(question) {
    var answersHtml = question.answers.map(function(a) {
      return '<option value="' + a.answer + '">' + a.answer + '</option>\n';
    }).reduce(function(a, b) {
      return a + b;
    });
    return '<div><form class="exam-js-question">' + question.question + '<select id="' + question.htmlID + '" class="exam-js-input">' + '<option></option>' + answersHtml + '</select></form><div>';
  };
  ExamJS.prototype.createCheckbox = function(question) {
    var answersHtml = question.answers.map(function(a) {
      return '<div><input type="checkbox" data-answer="' + a.answer + '" class="exam-js-text-checkbox" data-answer-type="text">  ' + a.answer + '</input></div>';
    }).reduce(function(a, b) {
      return a + b;
    });

    return '<form id="' + question.htmlID + '" class="exam-js-question">' + question.question + answersHtml + '</form>';
  };
  ExamJS.prototype.parseMarkdown = function(phrase) {
    var self = this,
      regexp = /\{\{[^\}\}]*\}\}/gi,
      matches = {},
      found;
    var tmpMatches = phrase.match(regexp);
    if (tmpMatches && tmpMatches.length && tmpMatches.length > 0) {
      tmpMatches.forEach(function(match) {
        var mock = self.getMathID();
        matches[mock] = match;
        phrase = phrase.replace(match, mock);
      });
      if (window.markdown) {
        phrase = markdown.toHTML(phrase);
      }
      for (var index in matches) {
        if (matches.hasOwnProperty(index)) {
          phrase = phrase.replace(new RegExp(index, 'g'), matches[index]);
        }
      }
    } else {
      return markdown.toHTML(phrase);
    }
    return phrase;
  };

  this.ExamJS = ExamJS;
})();

