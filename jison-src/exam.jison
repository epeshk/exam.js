/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                            /* skip whitespace */
"::"                           return '::'  //answer separator
":?"                           return ':?'  //help separator
","                            return ','   //items separator
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
    ;

sequence
    : word ',' word
        {$$ = [$1,$3]}
    | sequence ',' word
        {$1.push($3); $$ = $1;}
    ;

answer
    : word
    | sequence
    ;

block
    : '{{' sequence '}}'
        {$$ = {items: $2}}
    | '{{' option '::' word '}}'
        {$$ = {items: '<select>' + '<option>' + 'select answer' + $2 + '</option>' + '</select>', word: $4}}
    | '{{' char '::' answer '}}'
        {$$ = {items: '<input>', answer: $4}}
    ;

option
    : sequence
        {var opts = $1.map(function(item) {return '<option>' + item + '</option>';}); $$ = opts}
    ;