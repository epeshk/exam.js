/* description: Parses end executes mathematical expressions. */

%{var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
    }
  }
%}

/* lexical grammar */
%lex
%%

\s+                            return 'SP'
"::"                           return '::'  //answer separator
":?"                           return ':?'  //help separator
"|"                            return '|'   //items separator
"{{"                           return '{{'  //start block
"}}"                           return '}}'  //end block
"{--"                          return '{--' //start section
"--}"                          return '--}' //end section
"..."                          return 'INPUT_TOKEN'
[^\s]                          return 'char'
<<EOF>>                        return 'EOF'

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

sequence
  : phrase '|' phrase
    {$$ = [$1,$3]}
  | sequence '|' phrase
    {$1.push($3); $$ = $1;}
  ;

answer
  : phrase
  | sequence
  ;

input
  : '{{' phrase ':?' 'INPUT_TOKEN' '::' answer '}}'
    {
      var tmpId = helper.getID();
      $$ = {
        answer: $6,
        question: $2,
        type: 'input',
        source: $1 + $2 + $3 + $4 + $5 + $6 + $7,
        id: tmpId,
        html: '<input type="text" id="' + tmpId + '" class="exam-js-input">'
      }
    }
  | '{{' phrase ':?' 'SP' 'INPUT_TOKEN' '::' answer '}}'
    {
      var tmpId = helper.getID();
      $$ = {
        answer: $7,
        question: $2,
        type: 'input',
        source: $1 + $2 + $3 + $4 + $5 + $6 + $7 + $8,
        id: tmpId,
        html: '<input type="text" id="' + tmpId + '" class="exam-js-input">'
      }
    }
  | '{{' phrase ':?' 'INPUT_TOKEN' 'SP' '::' answer '}}'
    {
      var tmpId = helper.getID();
      $$ = {
        answer: $7,
        question: $2,
        type: 'input',
        source: $1 + $2 + $3 + $4 + $5 + $6 + $7 + $8,
        id: tmpId,
        html: '<input type="text" id="' + tmpId + '" class="exam-js-input">'
      }
    }
  | '{{' phrase ':?' 'SP' 'INPUT_TOKEN' 'SP' '::' answer '}}'
    {
      var tmpId = helper.getID();
      $$ = {
        answer: $8,
        question: $2,
        type: 'input',
        source: $1 + $2 + $3 + $4 + $5 + $6 + $7 + $8 + $9,
        id: tmpId,
        html: '<input type="text" id="' + tmpId + '" class="exam-js-input">'
      }
    }
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
