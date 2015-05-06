/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
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
    {$$ = {question: $5, answers: $7.answers, sourse: '', html: helper.createQuestion($5, $7.answers), type: $3 + '-QUESTION'}}
  | 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $4, answers: $6.answers, sourse: '', html: helper.createQuestion($4, $6.answers), type: $2 + '-QUESTION'}}
  | 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $3, answers: $5.answers, sourse: '', html: helper.createQuestion($3, $5.answers), type: 'QUESTION'}}
  | 'SEP' 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $4, answers: $6.answers, sourse: '', html: helper.createQuestion($4, $6.answers), type: 'QUESTION'}}
  ;

statement
  : phrase
    {$$ = $1}
  | question
    {$$ = $1}
  ;

source
  : statement
    {
      if($1.type){
        $$ = {
          expressions: [$1],
          source: $1.source,
          html: $1.html
        }
      } else {
        $$ = {
          expressions: [],
          source: $1,
          html: '<div>' + $1 + '</div>'
        }
      }
    }
  | source statement
    {
      if($2.type){
        $1.expressions.push($2);
        $1.source += $2.source;
        $1.html += $2.html;
      } else {
        $1.source += $2;
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
        source: $1.source,
        html: $1.html
      }
      $$ = result;
      return $$;
    }
  ;
