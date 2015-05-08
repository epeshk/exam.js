/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    currentType: '',
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    setCurrentType: function(type){
      helper.currentType = type;
    },
    createQuestions: function(question){
      if(helper.currentType === 'TEXT'){
        question.html = helper.createTextQuestion(question.question, question.answers,'');
        return question;
      } else if(helper.currentType === 'VIDEO') {
        question.html = helper.createVideoQuestion(question.question, question.answers,'');
        return question;
      } else if(helper.currentType === 'AUDIO') {
        question.html = helper.createAudioQuestion(question.question, question.answers,'');
        return question;
      } else if(helper.currentType === 'IMAGE') {
        question.html = helper.createImageQuestion(question.question, question.answers,'');
        return question;
      } else {
        throw new Error('Wrong section type!');
      }
    },
    createImgAnswer: function(answer){
      return '<img src="' + answer.answer + '" class="exam-js-img"/>';
    },
    createVideoQuestion: function(question, answers){
      return '<div>VIDEO MOCK</div>';
    },
    createAudioQuestion: function(question, answers){
      return '<div>AUDIO MOCK</div>';
    },
    createImageQuestion: function(question, answers){
      return '<div id="' + helper.getID() + '" class="exam-js-question">'+ '<div>' + question + '</div><div>' + answers.map(function(a){return helper.createImgAnswer(a)}).reduce(function(a,b){return a + b}) +'</div></div>';
    },
    createTextQuestion: function(question, answers){
      if(answers.length === 1){
        return helper.createInput(question);
      } else if(answers.length > 1){
        var rightAnswersCount = answers.filter(function(a){
          return a.isRight;
        }).length || 0;
        if(rightAnswersCount > 1){
          return helper.createCheckbox(question, answers);
        } else {
          return helper.createList(question, answers);
        }
      }
    },
    createInput: function(question){
      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + '<input type="text" class="exam-js-input"/></div>';
    },
    createList: function(question,answers){
      var answersHtml = answers.map(function(a){
        return '<option value="' + a.answer + '">' + a.answer + '</option>\n';
      }).reduce(function(a,b){
        return a + b;
      });
      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + '<select class="exam-js-input">' + answersHtml + '</select></div>';
    },
    createCheckbox: function(question, answers){
      var answersHtml = answers.map(function(a){
        return '<input type="checkbox">' + a.answer + '</input>\n';
      }).reduce(function(a,b){
        return a + b;
      });

      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + answersHtml + '</div>'
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
"|"                                return '|'
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
  | '|'
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
    {$$ = helper.createQuestions($1)}
  | type_marker
    {helper.setCurrentType($1)}
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
        html: $1.html
      }
      $$ = result;
      return $$;
    }
  ;
