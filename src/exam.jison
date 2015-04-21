/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    createQuestion: function(question, answers){
      console.log(answers);
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
      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + '<select>' + answersHtml + '</select></div>';
    },
    createCheckbox: function(question, answers){
      var answersHtml = answers.map(function(a){
        return '<input type="checkbox">' + a.answer + '</input>\n';
      }).reduce(function(a,b){
        return a + b;
      });

      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + answersHtml + '</div>'
    },
  }
%}

/* lexical grammar */
%lex
%%

"ТЕСТ"                             return 'TEST'  //start test block
"ВИДЕО"                            return 'VIDEO'
"АУДИО"                            return 'AUDIO'
(\n|\r|\r\n)                       return 'SEP'  //separator
\s+                                return 'SP'
^"+"                               return 'AM' //right answer marker
[^(\s|\n|\r|\n\r)]                 return 'char'
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
  ;

phrase
  : symbol
    {$$ = '' + $1}
  | phrase symbol
    {$$ = $1 + $2}
  ;

answer
  : 'AM' phrase 'SEP'
    {$$ = {answer: $2, isRight: true}}
  | phrase 'SEP'
    {$$ = {answer: $1, isRight: false}}
  ;

answers
  : answer
    {$$ = {answers: [$1]}}
  | answers answer
    {$$.answers.push($2)}
  ;

expression
  : 'TEST' 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $3, answers: $5.answers, sourse: '', html: helper.createQuestion($3, $5.answers), type: 'question'}}
  | 'SEP' 'TEST' 'SEP' phrase 'SEP' answers 'SEP'
    {$$ = {question: $4, answers: $6.answers, sourse: '', html: helper.createQuestion($4, $6.answers), type: 'question'}}
  ;

statement
  : phrase
    {$$ = $1}
  | expression
    {$$ = $1}
  ;

source
  : statement
    {
      if($1.type === 'question'){
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
      if($2.type === 'question'){
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
