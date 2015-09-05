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
    {$$ = $1}
  | 'special_symbol'
    {$$ = $1}
  | '+'
    {$$ = $1}
  | '-'
    {$$ = $1}
  ;

question_symbol
  : 'char'
    {$$ = $1}
  | 'SP'
    {$$ = $1}
  | 'SEP'
    {$$ = '<br/>'}
  | 'special_symbol'
    {$$ = $1}
  | '+'
    {$$ = $1}
  | '-'
    {$$ = $1}

  ;

phrase
  : symbol
    {$$ = '' + $1}
  | phrase symbol
    {$$ = $1 + $2}
  ;

question_phrase
  : question_symbol
    {$$ = '' + $1}
  | question_phrase question_symbol
    {$$ = $1 + $2}
  ;



AM
  : '+'
    {$$ = true}
  | '-'
    {$$ = false}
  ;

answer
  : AM question_phrase 'SEP'
    {$$ = {answer: $2, isRight: $1}}
  ;

answers
  : answer
    {$$ = {answers: [$1]}}
  | answers answer
    {$$.answers.push($2)}
  ;

question
  : 'SEP' question_phrase 'SEP' answers
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
  : tests_section
    {$$ = $1}
  | phrase
    {$$ = examjs.parseMarkdown($1)}
  ;

source
  : statement
    {
      if($1.type === 'tests-section'){
        var tmpHtml = '',
            questionsCount = 0;
        $1.questions.forEach(function(q){
          if(q.html){
            questionsCount++;
            return tmpHtml += q.html;
          }
        });
        $$ = {
          expressions: [$1],
          questionsCount: questionsCount,
          html: tmpHtml
        }
      } else {
        $$ = {
          expressions: [],
          questionsCount: 0,
          html: '<div>' + $1 + '</div>'
        }
      }
    }
  | source statement
    {
      if($2.type === 'tests-section'){
        var questionsCount = 0;
        $2.questions.forEach(function(q){
          if(q.html){
            questionsCount++;
            $1.html += q.html;
          }
        });
        $1.expressions.push($2);
        $1.questionsCount = $1.questionsCount + questionsCount;
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
        questionsCount: $1.questionsCount,
        html: $1.html,
        answers: {},
        getResults: function(){
          var self = this,
              answers = [],
              rightAnswersCount = 0;

          for(var i in self.answers) {
            if (self.answers.hasOwnProperty(i)) {
              var answer = self.answers[i];
              answers.push(answer);
              if(answer.isRight){
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
        },
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
          if(window.MathJax && window.MathJax.Hub){
            window.MathJax.Hub.Queue(["Typeset",window.MathJax.Hub]);
          }
        },
        checkAnswer: function(e){
          var self = this;
          if(e.target.type === 'text'){
            self.checkInputAnswer(e);
          }else if(e.target.type === 'checkbox' || e.target.type === 'radio'){
            self.checkComplexAnswer(e);
          }else if(e.target.type === 'select-one'){
            self.checkSelectAnswer(e);
          }
        },
        checkInputAnswer: function(e){
          var self = this,
              value = e.target.value;
          self.getQuestionByHtmlID(e.target.id, function(question){
            var answer = question.answers[0].answer,
                answerObj = self.createAnswerObject(question, [{answer: value, type: 'text'}]);

            self.answers[answerObj.htmlID] = answerObj;
          });
        },
        checkComplexAnswer: function(e){
          var self = this,
              id = e.target.form.id,
              childNodes = e.target.form.elements;
          self.getQuestionByHtmlID(id, function(question){
            var tmpChildArray = Array.prototype.slice.call(childNodes);
            var answers = tmpChildArray.filter(function(elem){
              return ((elem.type === 'checkbox' || elem.type === 'radio') && elem.checked);
            }).map(function(a){
              return {
                      answer: self.getAnswerFromAttribute(a),
                      type: self.getMediaTypeFromAttribute(a)
                    };
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
            var answerObj = self.createAnswerObject(question, [{answer: answer, type: 'text'}]);
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
              tmpResult = tmpResult || (a.answer === ra.answer);
            });
            isRight = isRight && tmpResult;
          });
          var obj = {
            answers: answers.map(function(a){return a.answer}),
            type: answers[0].type,
            rightAnswers: rightAnswers,
            question: question.question.replace(/<br\/>/g,''),
            htmlID: question.htmlID,
            isRight: isRight
          }
          return obj;
        },
        getAnswerFromAttribute: function(node){
          return node.getAttribute('data-answer');
        },
        getMediaTypeFromAttribute: function(node){
          return node.getAttribute('data-answer-type');
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
