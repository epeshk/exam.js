'use strict';
var ExamjsTranslator = (function() {
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

  function ExamjsTranslator() {
    this._currentId = 0;
    this._currentGroundId = 0;
    this._currentMathId = 0;
    this._currentType = '';
  }

  ExamjsTranslator.prototype._getId = function() {
    return 'exam-js-' + this._currentId++;
  };

  ExamjsTranslator.prototype._getGroupId = function() {
    return 'exam-js-group-' + this._currentGroundId++;
  };
  ExamjsTranslator.prototype._getMathId = function() {
    return 'exam-js-math-' + this._currentMathId++;
  };
  ExamjsTranslator.prototype._createYoutubeHtml = function(youtubeLink) {
    var idx = youtubeLink.lastIndexOf('/');
    var youtubeId = youtubeLink.substring(idx + 1);
    return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen></iframe>';
  };
  ExamjsTranslator.prototype._createAnswerHtml = function(answer, type, groupID, answerNumber, dataType, answerClass, answerHTML) {
    var tmpId = this._getId();
    return '<div class="' + answerClass + '"><div class="exam-js-answer-container"><div class="exam-js-answer-number"><input id="' + tmpId + '" type="' + type + '" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '" data-answer-type="' + dataType + '"/> ' + answerNumber + ')' + '</div>' + '<div class="exam-js-answer">' + answerHTML + '</div></div></div>';
  };
  ExamjsTranslator.prototype._createImgAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div><img src="' + answer.answer + '" class="exam-js-img"/></div>';
    return this._createAnswerHtml(answer, type, groupID, answerNumber, 'image', 'exam-js-img-question', html); };
  ExamjsTranslator.prototype.createAudioAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div><audio controls src="' + answer.answer + '" preload="none"/></div>';
    return this._createAnswerHtml(answer, type, groupID, answerNumber, 'audio', 'exam-js-media-question', html);
  };
  ExamjsTranslator.prototype._createVideoAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div><video controls width="400" height="300" src="' + answer.answer + '" preload="none" class="exam-js-video-answer"/></div>';
    if (answer.answer.indexOf('youtu') >= 0) {
      html = this._createYoutubeHtml(answer.answer);
    }
    return this._createAnswerHtml(answer, type, groupID, answerNumber, 'video', 'exam-js-media-question', html);
  };
  ExamjsTranslator.prototype._createTextAnswer = function(answer, type, groupID, answerNumber) {
    var html = '<div>' + answer.answer + '</div>';
    return this._createAnswerHtml(answer, type, groupID, answerNumber, 'text', 'exam-js-text-question', html);
  };
  ExamjsTranslator.prototype._createTypedQuestion = function(question, type, answerGenerator) {
    var groupID = this._getGroupId();
    var self = this;
    return '<form id="' + question.htmlID + '" class="exam-js-question">' + '<div>' + question.question + '</div><div>' + question.answers.map(function(a) {
      return answerGenerator.call(self, a, type, groupID, (question.answers.indexOf(a) + 1));
    }).reduce(function(a, b) {
      return a + b;
    }) + '</div></form>';
  };
  ExamjsTranslator.prototype._createMediaQuesion = function(question, answerGenerator) {
    var rightAnswersCount = question.answers.filter(function(a) {
      return a.isRight;
    }).length;
    if (question.answers.length > 1 && rightAnswersCount > 1) {
      return this._createTypedQuestion(question, 'checkbox', answerGenerator);
    } else if (question.answers.length > 1 && rightAnswersCount === 1) {
      return this._createTypedQuestion(question, 'radio', answerGenerator);
    } else {
      throw new Error('Unknown media question type!');
    }
  };
  ExamjsTranslator.prototype._createVideoQuestion = function(question, answers) {
    return this._createMediaQuesion(question, this._createVideoAnswer);
  };
  ExamjsTranslator.prototype._createImageQuestion = function(question) {
    return this._createMediaQuesion(question, this._createImgAnswer);
  };
  ExamjsTranslator.prototype._createAudioQuestion = function(question) {
    return this._createMediaQuesion(question, this.createAudioAnswer);
  };
  ExamjsTranslator.prototype.createComplexTextQuestion = function(question) {
    return this._createMediaQuesion(question, this._createTextAnswer);
  };
  ExamjsTranslator.prototype._createTextQuestion = function(question) {
    if (question.answers.length === 1) {
      return this._createInput(question);
    } else {
      return this.createComplexTextQuestion(question);
    }
  };
  ExamjsTranslator.prototype._createInput = function(question) {
    return '<form class="exam-js-question">' + question.question + '<input id="' + question.htmlID + '" type="text" class="exam-js-input"/></form>';
  };
  ExamjsTranslator.prototype._createList = function(question) {
    var answersHtml = question.answers.map(function(a) {
      return '<option value="' + a.answer + '">' + a.answer + '</option>\n';
    }).reduce(function(a, b) {
      return a + b;
    });
    return '<div><form class="exam-js-question">' + question.question + '<select id="' + question.htmlID + '" class="exam-js-input">' + '<option></option>' + answersHtml + '</select></form><div>';
  };
  ExamjsTranslator.prototype._createCheckbox = function(question) {
    var answersHtml = question.answers.map(function(a) {
      return '<div><input type="checkbox" data-answer="' + a.answer + '" class="exam-js-text-checkbox" data-answer-type="text">  ' + a.answer + '</input></div>';
    }).reduce(function(a, b) {
      return a + b;
    });

    return '<form id="' + question.htmlID + '" class="exam-js-question">' + question.question + answersHtml + '</form>';
  };
  ExamjsTranslator.prototype.setCurrentType = function(type) {
    this._currentType = type;
  };
  ExamjsTranslator.prototype.createQuestions = function(question) {
    question.htmlID = this._getId();
    question.onAnswer = function(e) {
      this.checkAnswer(e);
    };
    if (this._currentType === 'TEXT') {
      question.html = this._createTextQuestion(question);
      return question;
    } else if (this._currentType === 'VIDEO') {
      question.html = this._createVideoQuestion(question);
      return question;
    } else if (this._currentType === 'AUDIO') {
      question.html = this._createAudioQuestion(question);
      return question;
    } else if (this._currentType === 'IMAGE') {
      question.html = this._createImageQuestion(question);
      return question;
    } else {
      throw new Error('Wrong section type!');
    }
  };
  ExamjsTranslator.prototype.parseMarkdown = function(phrase) {
    var self = this,
      regexp = /\{\{[^\}\}]*\}\}/gi,
      matches = {},
      found;
    var tmpMatches = phrase.match(regexp);
    if (tmpMatches && tmpMatches.length && tmpMatches.length > 0) {
      tmpMatches.forEach(function(match) {
        var mock = self._getMathId();
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

  return ExamjsTranslator;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
  exports.ExamjsTranslator = ExamjsTranslator;
}

