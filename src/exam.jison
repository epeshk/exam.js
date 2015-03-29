/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
  }
%}

/* lexical grammar */
%lex
%%

(\n|\r|\r\n)"ТЕСТ"(\n|\r|\r\n)     return 'TEST'  //start test block
(\n|\r|\r\n){2}                    return 'TEST_END' //end section
(\n|\r|\r\n)                       return 'SEP'  //separator
\s+                                return 'SP'
^"+"                               return 'AM' //right answer marker
[^\s]                              return 'char'
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
  : phrase
    {$$ = {answer: $1, isRight: false}}
  | 'AM' phrase
    {$$ = {answer: $1, isRight: true}}
  ;

input
  : 'TEST' phrase 'SEP' 'AM' phrase 'TEST_END'
    {$$ = {answer: $5, source: '' + $1 + $2 + $3 + $4 + $5 + $6, type: 'input'}}
  ;

expression
  : input
    {$$ = $1}
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
          source: $1.source
        }
      } else {
        $$ = {
          expressions: [],
          source: $1
        }
      }
    }
  | source statement
    {
      if($2.type){
        $1.expressions.push($2);
        $1.source += $2.source;
      } else {
        $1.source += $2;
      }
      $$ = $1;
    }
  ;

file
  : source 'EOF'
    {
      var result = {
        expressions: $1.expressions,
        source: $1.source
      }
      $$ = result;
      return $$;
    }
  ;
