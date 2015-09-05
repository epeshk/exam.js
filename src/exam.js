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
    markdown.test;
  } catch (e) {
    markdown = {
      toHTML: function(text) {
        return text;
      }
    }
  }
  this.examjs = {
    currentId: 0,
    currentGroudId: 0,
    currentMathId: 0,
    currentType: '',
    getID: function() {
      return 'exam-js-' + this.currentId++;
    },
    getGroudID: function() {
      return 'exam-js-group-' + this.currentGroudId++;
    },
    getMathID: function() {
      return 'exam-js-math-' + this.currentMathId++;
    },
    setCurrentType: function(type) {
      examjs.currentType = type;
    },
    createQuestions: function(question) {
      question.htmlID = examjs.getID();
      question.onAnswer = function(e) {
        this.checkAnswer(e);
      };
      if (examjs.currentType === 'TEXT') {
        question.html = examjs.createTextQuestion(question);
        return question;
      } else if (examjs.currentType === 'VIDEO') {
        question.html = examjs.createVideoQuestion(question);
        return question;
      } else if (examjs.currentType === 'AUDIO') {
        question.html = examjs.createAudioQuestion(question);
        return question;
      } else if (examjs.currentType === 'IMAGE') {
        question.html = examjs.createImageQuestion(question);
        return question;
      } else {
        throw new Error('Wrong section type!');
      }
    },
    createImgAnswer: function(answer, type, groupID, answerNumber) {
      var tmpId = examjs.getID();
      return '<div class="exam-js-img-question"><div><input id="' + tmpId + '" type="' + type + '" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '" data-answer-type="image"/>  ' + answerNumber + ' </div><div><img src="' + answer.answer + '" class="exam-js-img"/></div></div>';
    },
    createAudioAnswer: function(answer, type, groupID, answerNumber) {
      var tmpId = examjs.getID();
      return '<div class="exam-js-media-question"><div><input id="' + tmpId + '" type="' + type + '" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '" data-answer-type="audio"/> ' + answerNumber + ' </div><div><audio controls src="' + answer.answer + '" preload="none"/></div></div>';
    },
    createVideoAnswer: function(answer, type, groupID, answerNumber) {
      var tmpId = examjs.getID();
      return '<div class="exam-js-media-question"><div><input id="' + tmpId + '" type="' + type + '" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '" data-answer-type="video"/> ' + answerNumber + ' </div><div><video controls width="400" height="300" src="' + answer.answer + '" preload="none" class="exam-js-video-answer"/></div></div>';
    },
    createTextAnswer: function(answer, type, groupID, answerNumber) {
      var tmpId = examjs.getID();
      return '<div class="exam-js-text-question"><div><input id="' + tmpId + '" type="' + type + '" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '" data-answer-type="text"/>  ' + answerNumber + ' </div><div>' + answer.answer + '</div></div>';
    },
    createMediaTypedQuestion: function(question, type, answerGenerator) {
      var groupID = examjs.getGroudID();
      return '<form id="' + question.htmlID + '" class="exam-js-question">' + '<div>' + question.question + '</div><div>' + question.answers.map(function(a) {
        return answerGenerator(a, type, groupID, (question.answers.indexOf(a) + 1))
      }).reduce(function(a, b) {
        return a + b
      }) + '</div></form>';
    },
    createMediaQuestion: function(question, answerGenerator) {
      var rightAnswersCount = question.answers.filter(function(a) {
        return a.isRight
      }).length;
      if (question.answers.length > 1 && rightAnswersCount > 1) {
        return examjs.createMediaTypedQuestion(question, 'checkbox', answerGenerator);
      } else if (question.answers.length > 1 && rightAnswersCount === 1) {
        return examjs.createMediaTypedQuestion(question, 'radio', answerGenerator);
      } else {
        throw new Error('Unknown media question type!');
      }
    },
    createVideoQuestion: function(question, answers) {
      return examjs.createMediaQuestion(question, examjs.createVideoAnswer);
    },
    createImageQuestion: function(question) {
      return examjs.createMediaQuestion(question, examjs.createImgAnswer);
    },
    createAudioQuestion: function(question) {
      return examjs.createMediaQuestion(question, examjs.createAudioAnswer);
    },
    createComplexTextQuestion: function(question) {
      return examjs.createMediaQuestion(question, examjs.createTextAnswer);
    },
    createTextQuestion: function(question) {
      if (question.answers.length === 1) {
        return examjs.createInput(question);
      } else {
        return examjs.createComplexTextQuestion(question);
      }
    },
    createInput: function(question) {
      return '<div><form class="exam-js-question">' + question.question + '<input id="' + question.htmlID + '" type="text" class="exam-js-input"/></from></div>';
    },
    createList: function(question) {
      var answersHtml = question.answers.map(function(a) {
        return '<option value="' + a.answer + '">' + a.answer + '</option>\n';
      }).reduce(function(a, b) {
        return a + b;
      });
      return '<div><form class="exam-js-question">' + question.question + '<select id="' + question.htmlID + '" class="exam-js-input">' + '<option></option>' + answersHtml + '</select></form><div>';
    },
    createCheckbox: function(question) {
      var answersHtml = question.answers.map(function(a) {
        return '<div><input type="checkbox" data-answer="' + a.answer + '" class="exam-js-text-checkbox" data-answer-type="text">  ' + a.answer + '</input></div>';
      }).reduce(function(a, b) {
        return a + b;
      });

      return '<form id="' + question.htmlID + '" class="exam-js-question">' + question.question + answersHtml + '</form>'
    },
    createVideoTest: function(question, answers) {
      return '';
    },
    createAudioTest: function(question, answers) {
      return '';
    },
    createImageTest: function(question, answers) {
      return '';
    },
    parseMarkdown: function(phrase) {
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
    },
  }
})();

