/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    createQuestion: function(question, answers){
      if(answers.length === 1){
        return helper.createInput(question);
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
      return '<div id="' + helper.getID() + '" class="exam-js-question"><select>' + answersHtml + '</select></div>';
    },
  }
%}

/* lexical grammar */
%lex
%%

(\n|\r|\r\n)"ТЕСТ"(\n|\r|\r\n)     return 'TEST'  //start test block
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
  ;

phrase
  : symbol
    {$$ = '' + $1}
  | phrase symbol
    {$$ = $1 + $2}
  ;

answer
  : phrase 'SEP'
    {$$ = {answer: $1, isRight: false}}
  | 'AM' phrase 'SEP'
    {$$ = {answer: $1, isRight: true}}
  ;

answers
  : answer
    {$$ = {answers: [$1]}}
  | answers answer
    {$$.answers.push($2)}
  ;

expression
  : 'TEST' phrase 'SEP' answers 'SEP'
    {$$ = {question: $2, answers: $4.answers, sourse: '', html: helper.createQuestion($2, $4.answers)}}
  ;

statement
  : expression
    {$$ = $1}
  | phrase
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
