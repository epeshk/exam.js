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

answer
    : word
    | sequence
    ;

sequence
    : word ',' word
        {$$ = [$1,$3]}
    | sequence ',' word
        {$1.push($3); $$ = $1;}
    ;

block
    : '{{' sequence '}}'
        {$$ = { items: $2 }}
    | '{{' sequence '::' answer '}}'
        {$$ = {items: $2, answer: $4}}
    | '{{' sequence '::' answer ':?' word '}}'
        {$$ = {items: $2, answer: $4, help: $6}}
    ;
