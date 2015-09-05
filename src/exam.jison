/* lexical grammar */
%lex
%%

"ТЕСТЫ"                            return 'TESTS'  //start tests block
"КОНЕЦ ТЕСТОВ"                     return 'TESTS_END'
"ТЕКСТ"                            return 'TEXT'  //start text block
"ВИДЕО"                            return 'VIDEO' //type "video" marker
"АУДИО"                            return 'AUDIO' //type "audio" marker
"РИСУНОК"                          return 'IMAGE' //type "image" marker
(\n|\r|\r\n)                       return 'SEP'  //separator
\s+                                return 'SP'
^"+"                               return '+' //right answer marker
^"-"                               return '-' //wrong answer marker
[^(\s|\n|\r|\n\r)]                 return 'char'
[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/] return 'special_symbol'
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
    {$$ = $1}
  | 'special_symbol'
    {$$ = $1}
  | '+'
    {$$ = $1}
  | '-'
    {$$ = $1}
  ;

question_symbol
  : 'char'
    {$$ = $1}
  | 'SP'
    {$$ = $1}
  | 'SEP'
    {$$ = '<br/>'}
  | 'special_symbol'
    {$$ = $1}
  | '+'
    {$$ = $1}
  | '-'
    {$$ = $1}

  ;

phrase
  : symbol
    {$$ = '' + $1}
  | phrase symbol
    {$$ = $1 + $2}
  ;

question_phrase
  : question_symbol
    {$$ = '' + $1}
  | question_phrase question_symbol
    {$$ = $1 + $2}
  ;


AM
  : '+'
    {$$ = true}
  | '-'
    {$$ = false}
  ;

answer
  : AM question_phrase 'SEP'
    {$$ = {answer: $2, isRight: $1}}
  ;

answers
  : answer
    {$$ = {answers: [$1]}}
  | answers answer
    {$$.answers.push($2)}
  ;

question
  : 'SEP' question_phrase 'SEP' answers
    {$$ = {question: $2, answers: $4.answers}}
  ;

type
  : 'TEXT'
    {$$ = 'TEXT'}
  | 'VIDEO'
    {$$ = 'VIDEO'}
  | 'AUDIO'
    {$$ = 'AUDIO'}
  | 'IMAGE'
    {$$ = 'IMAGE'}
  ;

type_marker
  : 'SEP' type
    {$$ = $2}
  ;

test_block
  : question
    {$$ = examjs.createQuestions($1)}
  | type_marker
    {examjs.setCurrentType($1)}
  ;

test_blocks
  : test_block
    {
      if($1.html){
        $$ = {questions: [$1]};
      } else {
        $$ = {questions: []};
      }
    }
  | test_blocks test_block
    {
      if($2.html){
        $$.questions.push($2);
      }
    }
  ;

tests_section
  : 'TESTS' 'SEP' test_blocks 'SEP' 'TESTS_END'
    {$$ = {questions: $3.questions, type: 'tests-section'}}
  ;

statement
  : tests_section
    {$$ = $1}
  | phrase
    {$$ = examjs.parseMarkdown($1)}
  ;

source
  : statement
    {
      if($1.type === 'tests-section'){
        var tmpHtml = '',
            questionsCount = 0;
        $1.questions.forEach(function(q){
          if(q.html){
            questionsCount++;
            return tmpHtml += q.html;
          }
        });
        $$ = {
          expressions: [$1],
          questionsCount: questionsCount,
          html: tmpHtml
        }
      } else {
        $$ = {
          expressions: [],
          questionsCount: 0,
          html: '<div>' + $1 + '</div>'
        }
      }
    }
  | source statement
    {
      if($2.type === 'tests-section'){
        var questionsCount = 0;
        $2.questions.forEach(function(q){
          if(q.html){
            questionsCount++;
            $1.html += q.html;
          }
        });
        $1.expressions.push($2);
        $1.questionsCount = $1.questionsCount + questionsCount;
      } else {
        $1.html += '<div>' + $2 + '</div>';
      }
      $$ = $1;
    }
  ;

file
  : source 'EOF'
    {
      return new QuestionManager($1);
    }
  ;
