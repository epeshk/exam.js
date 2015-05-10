%{
  var examjs = {
    currentId: 0,
    currentGroudId: 0,
    currentType: '',
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    getGroudID: function(){
      return 'exam-js-group-' + this.currentGroudId++;
    },
    setCurrentType: function(type){
      examjs.currentType = type;
    },
    createQuestions: function(question){
      question.htmlID = examjs.getID();
      question.onAnswer = function(e){
        this.checkAnswer(e);
      };
      if(examjs.currentType === 'TEXT'){
        question.html = examjs.createTextQuestion(question);
        return question;
      } else if(examjs.currentType === 'VIDEO') {
        question.html = examjs.createVideoQuestion(question);
        return question;
      } else if(examjs.currentType === 'AUDIO') {
        question.html = examjs.createAudioQuestion(question);
        return question;
      } else if(examjs.currentType === 'IMAGE') {
        question.html = examjs.createImageQuestion(question);
        return question;
      } else {
        throw new Error('Wrong section type!');
      }
    },
    createImgAnswer: function(answer, type, groupID){
      var tmpId = examjs.getID();
      return '<div class="exam-js-img-question"><div><input id="' + tmpId + '" type="'+ type  +'" name="' + groupID + '" class="exam-js-input" data-answer="' + answer.answer + '"/></div><div><img src="' + answer.answer + '" class="exam-js-img"/></div></div>';
    },
    createVideoQuestion: function(question, answers){
      return '<div>VIDEO MOCK</div>';
    },
    createAudioQuestion: function(question, answers){
      return '<div>AUDIO MOCK</div>';
    },
    createImageTypedQuestion: function(question, type){
        var groupID = examjs.getGroudID();
        return '<form id="' + question.htmlID + '" class="exam-js-question">'+ '<div>' + question.question + '</div><div>' + question.answers.map(function(a){return examjs.createImgAnswer(a, type, groupID)}).reduce(function(a,b){return a + b}) +'</div></form>';
    },
    createImageQuestion: function(question){
        var rightAnswersCount = question.answers.filter(function(a){return a.isRight}).length;
        if(question.answers.length > 1 && rightAnswersCount > 1){
            return examjs.createImageTypedQuestion(question, 'checkbox');
        } else if(question.answers.length > 1 && rightAnswersCount === 1){
            return examjs.createImageTypedQuestion(question, 'radio');
        } else if(question.answers.length === 1){
            return examjs.createImageTypedQuestion(question, 'input');
        }
    },
    createTextQuestion: function(question){
      if(question.answers.length === 1){
        return examjs.createInput(question);
      } else if(question.answers.length > 1){
        var rightAnswersCount = question.answers.filter(function(a){
          return a.isRight; }).length || 0;
        if(rightAnswersCount > 1){
          return examjs.createCheckbox(question);
        } else {
          return examjs.createList(question);
        }
      }
    },
    createInput: function(question){
      return '<form class="exam-js-question">' + question.question + '<input id="' + question.htmlID + '" type="text" class="exam-js-input"/></from>';
    },
    createList: function(question){
      var answersHtml = question.answers.map(function(a){
        return '<option value="' + a.answer + '">' + a.answer + '</option>\n';
      }).reduce(function(a,b){
        return a + b;
      });
      return '<form class="exam-js-question">' + question.question + '<select id="' + question.htmlID + '" class="exam-js-input">' + answersHtml + '</select></form>';
    },
    createCheckbox: function(question){
      var answersHtml = question.answers.map(function(a){
        return '<input type="checkbox" data-answer="' + a.answer + '">' + a.answer + '</input>\n';
      }).reduce(function(a,b){
        return a + b;
      });

      return '<form id="' + question.htmlID + '" class="exam-js-question">' + question.question + answersHtml + '</form>'
    },
    createVideoTest: function(question, answers){
     return '';
    },
    createAudioTest: function(question, answers){
     return '';
    },
    createImageTest: function(question, answers){
     return '';
    },
  }
%}

/* lexical grammar */
%lex
%%

"ТЕСТЫ"                            return 'TESTS'  //start tests block
"КОНЕЦ ТЕСТОВ"                     return 'TESTS_END'
"ТЕКСТ"                            return 'TEXT'  //start text block
"ВИДЕО"                            return 'VIDEO' //type "video" marker
"АУДИО"                            return 'AUDIO' //type "audio" marker
"РИСУНОК"                          return 'IMAGE' //type "image" marker
(\n|\r|\r\n)                       return 'SEP'  //separator
\s+                                return 'SP'
^"+"                               return '+' //right answer marker
^"-"                               return '-' //wrong answer marker
[^(\s|\n|\r|\n\r)]                 return 'char'
[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/] return 'special_symbol'
<<EOF>>                            return 'EOF'
/lex

%start file

%% /* language grammar */

symbol
  : 'char'
    {$$ = $1}
  | 'SP'
    {$$ = $1}
  | 'SEP'
    {$$ = '<br/>'}
  | 'special_symbol'
    {$$ = $1}
  | '-'
    {$$ = $1}
  | '+'
    {$$ = $1}
  ;

phrase
  : symbol
    {$$ = '' + $1}
  | phrase symbol
    {$$ = $1 + $2}
  ;

AM
  : '+'
    {$$ = true}
  | '-'
    {$$ = false}
  ;

answer
  : AM phrase 'SEP'
    {$$ = {answer: $2, isRight: $1}}
  ;

answers
  : answer
    {$$ = {answers: [$1]}}
  | answers answer
    {$$.answers.push($2)}
  ;

question
  : 'SEP' phrase 'SEP' answers
    {$$ = {question: $2, answers: $4.answers}}
  ;

type
  : 'TEXT'
    {$$ = 'TEXT'}
  | 'VIDEO'
    {$$ = 'VIDEO'}
  | 'AUDIO'
    {$$ = 'AUDIO'}
  | 'IMAGE'
    {$$ = 'IMAGE'}
  ;

type_marker
  : 'SEP' type
    {$$ = $2}
  ;

test_block
  : question
    {$$ = examjs.createQuestions($1)}
  | type_marker
    {examjs.setCurrentType($1)}
  ;

test_blocks
  : test_block
    {
      if($1.html){
        $$ = {questions: [$1]};
      } else {
        $$ = {questions: []};
      }
    }
  | test_blocks test_block
    {
      if($2.html){
        $$.questions.push($2);
      }
    }
  ;

tests_section
  : 'TESTS' 'SEP' test_blocks 'SEP' 'TESTS_END'
    {$$ = {questions: $3.questions, type: 'tests-section'}}
  ;

statement
  : phrase
    {$$ = $1}
  | tests_section
    {$$ = $1}
  ;

source
  : statement
    {
      if($1.type){
        var tmpHtml = '';
        $1.questions.forEach(function(q){
          if(q.html){
            return tmpHtml += q.html;
          }
        });
        $$ = {
          expressions: [$1],
          html: tmpHtml
        }
      } else {
        $$ = {
          expressions: [],
          html: '<div>' + $1 + '</div>'
        }
      }
    }
  | source statement
    {
      if($2.type){
        var tmpHtml = '';
        $1.questions.forEach(function(q){
          if(q.html){
            return tmpHtml += q.html;
          }
        });
        $1.expressions.push($2);
        $1.html += tmpHtml
      } else {
        $1.html += '<div>' + $2 + '</div>';
      }
      $$ = $1;
    }
  ;

file
  : source 'EOF'
    {
      var result = {
        expressions: $1.expressions,
        html: $1.html,
        answers: {},
        initQuestions: function(){
          var self = this;
          self.expressions.forEach(function(e){
            if(e.questions){
              e.questions.forEach(function(q){
                var elem = document.getElementById(q.htmlID);
                if(elem){
                  if(elem.type === 'text'){
                    elem.onkeyup = q.onAnswer.bind(self);
                  } else {
                    elem.onchange = q.onAnswer.bind(self);
                  }
                }
              });
            }
          });
        },
        checkAnswer: function(e){
          var self = this;
          if(e.target.type === 'text'){
            self.checkInputAnswer(e);
          }else if(e.target.type === 'checkbox'){
            self.checkCheckboxAnswer(e);
          }else if(e.target.type === 'select-one'){
            self.checkSelectAnswer(e);
          }
        },
        checkInputAnswer: function(e){
          var self = this,
              value = e.target.value;
          self.getQuestionByHtmlID(e.target.id, function(question){
            var answer = question.answers[0].answer,
                answerObj = self.createAnswerObject(question, [answer]);

            self.answers[answerObj.htmlID] = answerObj;
          });
        },
        checkCheckboxAnswer: function(e){
          var self = this,
              id = e.target.form.id,
              childNodes = e.target.form.elements;
          self.getQuestionByHtmlID(id, function(question){
            var tmpChildArray = Array.prototype.slice.call(childNodes);
            var answers = tmpChildArray.filter(function(elem){
              return (elem.type === 'checkbox' && elem.checked);
            }).map(function(a){
              return self.getAnswerFromAttribute(a);
            });

            var answerObj = self.createAnswerObject(question, answers);
            self.answers[answerObj.htmlID] = answerObj;
          });
        },
        checkSelectAnswer: function(e){
          var self = this;
              id = e.target.id,
              answer = e.target.selectedOptions[0].value;
          self.getQuestionByHtmlID(id, function(question){
            var answerObj = self.createAnswerObject(question, [answer]);
            self.answers[answerObj.htmlID] = answerObj;
          });
        },
        createAnswerObject: function(question, answers){
          var rightAnswers = question.answers.filter(function(a){
            return a.isRight;
          });
          var isRight = rightAnswers.length === answers.length;

          rightAnswers.forEach(function(ra){
            var tmpResult = false;
            answers.forEach(function(a){
              tmpResult = tmpResult || (a === ra.answer);
            });
            isRight = isRight && tmpResult;
          });
          var obj = {
            answers: answers,
            rightAnswers: rightAnswers,
            question: question.question,
            htmlID: question.htmlID,
            isRight: isRight
          }
          return obj;
        },
        getAnswerFromAttribute: function(node){
          return node.getAttribute('data-answer');
        },
        getQuestionByHtmlID: function(htmlID, callback){
          var self = this,
              result = null;
          var tmpExp = self.expressions.forEach(function(e){
            e.questions.forEach(function(q){
              if(q.htmlID === htmlID){
                callback(q);
              }
            });
          });
        },
      }
      $$ = result;
      return $$;
    }
  ;
