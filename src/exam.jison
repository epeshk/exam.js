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
[^\s]                          return 'char'
<<EOF>>                        return 'EOF'

/lex

%start expressions

%% /* language grammar */

expressions
  : block EOF
    {return $$}
  ;

word
  : char
    {$$ = ('' + $1)}
  | word char
    {$$ = ($1 + $2)}
  | word 'SP'
   {$$ = $1 + $2}
  | 'SP' word
   {$$ = $1 + $2}
  ;

phrase
  : word
   {$$ = '' + $1}
  | phrase word
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

block
  : '{{' sequence '}}'
    {$$ = {items: $2}}
  ;
