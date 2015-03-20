/* description: Parses end executes mathematical expressions. */

%{
  var helper = {
    currentId: 0,
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    option: function(item){
      return '<option>' + item + '</option>';
    },
    toCheckboxHtml: function(question, items, id){
      return '<div id="' + id +'">' + question + items.map(function(item){
        return '<input id="' + helper.getID() + '" type="checkbox" class="exam-js-input">' + item + '</input>';
      }) + '</div>';
    },
    getInputObject: function(source, answer, question){
      var tmpId = helper.getID();
      return {
        question: question,
        type: 'input',
        source: source,
        id: tmpId,
        html: '<input type="text" id="' + tmpId + '" class="exam-js-input">'
      }
    },
    getOptionObject: function(source, answers, question){
      var tmpId = helper.getID();
      var toOption = Array.prototype.map(helper.option);
      return {
        answer: answers,
        question: question,
        type: 'list',
        source: source,
        id: tmpId,
        html: '<select id="' + tmpId + '" class="exam-js-list>' + toOption + '</select>'
      }
    },
    getCheckboxObject: function(source, items, answers, question){
      var tmpId = helper.getID();
      return {
        answers: answers,
        items: items,
        question: question,
        type: 'checkbox',
        source: source,
        id: tmpId,
        html: helper.toCheckboxHtml(question, items, tmpId),
      }
    }
  }
%}

/* lexical grammar */
%lex
%%

\s+                            return 'SP'
"::"                           return '::'  //answer separator
":?"                           return ':?'  //help separator
","                            return ','   //items separator
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
  : phrase ',' phrase
    {$$ = [$1,$3]}
  | sequence ',' phrase
    {$1.push($3); $$ = $1;}
  ;

answer
  : phrase
  | sequence
  ;

input
  : '{{' phrase ':?' 'INPUT_TOKEN' '::' answer '}}'
    {
      $$ = helper.getInputObject($1 + $2 + $3 + $4 + $5 + $6 + $7, $6, $2);
    }
  | '{{' phrase ':?' 'SP' 'INPUT_TOKEN' '::' answer '}}'
    {
      $$ = helper.getInputObject($1 + $2 + $3 + $4 + $5 + $6 + $7 + $8, $7, $2);
    }
  | '{{' phrase ':?' 'INPUT_TOKEN' 'SP' '::' answer '}}'
    {
      $$ = helper.getInputObject($1 + $2 + $3 + $4 + $5 + $6 + $7 + $8, $7, $2);
    }
  | '{{' phrase ':?' 'SP' 'INPUT_TOKEN' 'SP' '::' answer '}}'
    {
      $$ = helper.getInputObject($1 + $2 + $3 + $4 + $5 + $6 + $7 + $8 + $9, $8, $2);
    }
  ;

list
  : '{{' phrase ':?' sequence '::' phrase '}}'
    {
      $$ = helper.getOptionObject($1 + $2 + $3 + $4 + $5 + $6 + $7, $6, $2);
    }
  ;

checkbox
  : '{{' phrase ':?' sequence '::' sequence '}}'
    {
      $$ = helper.getCheckboxObject($1 + $2 + $3 + $4 + $5 + $6 + $7, $4, $6, $2);
    }
  ;

expression
  : input
    {$$ = $1}
  | list
    {$$ = $1}
  | checkbox
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
