/* description: Parses end executes mathematical expressions. */

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
    %{
      $$ = {
        answer: $6,
        question: $2,
        type: 'input'
      }
    %}
  | '{{' phrase ':?' 'SP' 'INPUT_TOKEN' '::' answer '}}'
    %{
      $$ = {
        answer: $7,
        question: $2,
        type: 'input'
      }
    %}
  | '{{' phrase ':?' 'INPUT_TOKEN' 'SP' '::' answer '}}'
    %{
      $$ = {
        answer: $7,
        question: $2,
        type: 'input'
      }
    %}
  | '{{' phrase ':?' 'SP' 'INPUT_TOKEN' 'SP' '::' answer '}}'
    %{
      $$ = {
        answer: $8,
        question: $2,
        type: 'input'
      }
    %}
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
    %{
      if($1.type){
        $$ = [$1]
      }
    %}
  | source statement
    %{
      if($2.type){
        $1.push($2);
      }
      $$ = $1;
    %}
  ;

file
  : source 'EOF'
    %{
      var result = {
        expressions: $1
      }

      $$ = result;
      return $$;
    %}
  ;
