/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    createQuestions: function(questions, type){
      return questions;
    },
    createQuestion: function(question, answers, type){
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
  : 'SEP' 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $3, answers: $5.answers}}
  | 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $2, answers: $4.answers}}
  | 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $2, answers: $4.answers}}
  | 'SEP' 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $3, answers: $5.answers}}
  ;

questions
  : question
    {$$ = {questions: [$1]}}
  | questions question
    {$$.questions.push($2)}
  ;

type_section
  : 'TEXT' 'SEP' questions
    {$$ = helper.createQuestions($3.questions, 'TEXT')}
  | 'VIDEO' 'SEP' questions
    {$$ = helper.createQuestions($3.questions, 'VIDEO')}
  | 'AUDIO' 'SEP' questions
    {$$ = helper.createQuestions($3.questions, 'AUDIO')}
  | 'IMAGE' 'SEP' questions
    {$$ = helper.createQuestions($3.questions, 'IMAGE')}
  ;

type_sections
  : type_section
    {$$ = $1}
  | type_sections type_section
    {$$.concat($2)}
  ;


tests_section
  : 'TESTS' 'SEP' type_sections
    {$$ = {questions: $3, type: 'tests-section'}}
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
        $$ = {
          expressions: [$1],
          html: $1.html
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
        $1.expressions.push($2);
        $1.html += $2.html;
      } else {
        $1.html += $2;
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
