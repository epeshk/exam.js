/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,9],$V2=[1,10],$V3=[1,11],$V4=[1,7],$V5=[4,5,6,7,24,29],$V6=[2,3],$V7=[1,25],$V8=[1,26],$V9=[1,27],$Va=[1,28],$Vb=[4,5,6,7],$Vc=[1,34],$Vd=[1,35],$Ve=[6,10,11],$Vf=[2,9];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"symbol":3,"char":4,"SP":5,"SEP":6,"|":7,"phrase":8,"AM":9,"+":10,"-":11,"answer":12,"answers":13,"question":14,"type":15,"TEXT":16,"VIDEO":17,"AUDIO":18,"IMAGE":19,"type_marker":20,"test_block":21,"test_blocks":22,"tests_section":23,"TESTS":24,"TESTS_END":25,"statement":26,"source":27,"file":28,"EOF":29,"$accept":0,"$end":1},
terminals_: {2:"error",4:"char",5:"SP",6:"SEP",7:"|",10:"+",11:"-",16:"TEXT",17:"VIDEO",18:"AUDIO",19:"IMAGE",24:"TESTS",25:"TESTS_END",29:"EOF"},
productions_: [0,[3,1],[3,1],[3,1],[3,1],[8,1],[8,2],[9,1],[9,1],[12,3],[13,1],[13,2],[14,4],[15,1],[15,1],[15,1],[15,1],[20,2],[21,1],[21,1],[22,1],[22,2],[23,5],[26,1],[26,1],[27,1],[27,2],[28,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: case 2: case 4: case 17: case 23: case 24:
this.$ = $$[$0]
break;
case 3:
this.$ = '<br/>'
break;
case 5:
this.$ = '' + $$[$0]
break;
case 6:
this.$ = $$[$0-1] + $$[$0]
break;
case 7:
this.$ = true
break;
case 8:
this.$ = false
break;
case 9:
this.$ = {answer: $$[$0-1], isRight: $$[$0-2]}
break;
case 10:
this.$ = {answers: [$$[$0]]}
break;
case 11:
this.$.answers.push($$[$0])
break;
case 12:
this.$ = {question: $$[$0-2], answers: $$[$0].answers}
break;
case 13:
this.$ = 'TEXT'
break;
case 14:
this.$ = 'VIDEO'
break;
case 15:
this.$ = 'AUDIO'
break;
case 16:
this.$ = 'IMAGE'
break;
case 18:
this.$ = helper.createQuestions($$[$0])
break;
case 19:
helper.setCurrentType($$[$0])
break;
case 20:

      if($$[$0].html){
        this.$ = {questions: [$$[$0]]};
      } else {
        this.$ = {questions: []};
      }
    
break;
case 21:

      if($$[$0].html){
        this.$.questions.push($$[$0]);
      }
    
break;
case 22:
this.$ = {questions: $$[$0-2].questions, type: 'tests-section'}
break;
case 25:

      if($$[$0].type){
        var tmpHtml = '';
        $$[$0].questions.forEach(function(q){
          if(q.html){
            return tmpHtml += q.html;
          }
        });
        this.$ = {
          expressions: [$$[$0]],
          html: tmpHtml
        }
      } else {
        this.$ = {
          expressions: [],
          html: '<div>' + $$[$0] + '</div>'
        }
      }
    
break;
case 26:

      if($$[$0].type){
        var tmpHtml = '';
        $$[$0-1].questions.forEach(function(q){
          if(q.html){
            return tmpHtml += q.html;
          }
        });
        $$[$0-1].expressions.push($$[$0]);
        $$[$0-1].html += tmpHtml
      } else {
        $$[$0-1].html += '<div>' + $$[$0] + '</div>';
      }
      this.$ = $$[$0-1];
    
break;
case 27:

      var result = {
        expressions: $$[$0-1].expressions,
        html: $$[$0-1].html
      }
      this.$ = result;
      return this.$;
    
break;
}
},
table: [{3:6,4:$V0,5:$V1,6:$V2,7:$V3,8:4,23:5,24:$V4,26:3,27:2,28:1},{1:[3]},{3:6,4:$V0,5:$V1,6:$V2,7:$V3,8:4,23:5,24:$V4,26:13,29:[1,12]},o($V5,[2,25]),o([24,29],[2,23],{3:14,4:$V0,5:$V1,6:$V2,7:$V3}),o($V5,[2,24]),o($V5,[2,5]),{6:[1,15]},o($V5,[2,1]),o($V5,[2,2]),o($V5,$V6),o($V5,[2,4]),{1:[2,27]},o($V5,[2,26]),o($V5,[2,6]),{6:[1,20],14:18,20:19,21:17,22:16},{6:[1,21],14:18,20:19,21:22},{6:[2,20]},{6:[2,18]},{6:[2,19]},{3:6,4:$V0,5:$V1,6:$V2,7:$V3,8:23,15:24,16:$V7,17:$V8,18:$V9,19:$Va},{3:6,4:$V0,5:$V1,6:$V2,7:$V3,8:23,15:24,16:$V7,17:$V8,18:$V9,19:$Va,25:[1,29]},{6:[2,21]},{3:14,4:$V0,5:$V1,6:[1,30],7:$V3},{6:[2,17]},{6:[2,13]},{6:[2,14]},{6:[2,15]},{6:[2,16]},o($V5,[2,22]),o($Vb,$V6,{13:31,12:32,9:33,10:$Vc,11:$Vd}),{6:[2,12],9:33,10:$Vc,11:$Vd,12:36},o($Ve,[2,10]),{3:6,4:$V0,5:$V1,6:$V2,7:$V3,8:37},o($Vb,[2,7]),o($Vb,[2,8]),o($Ve,[2,11]),{3:14,4:$V0,5:$V1,6:[1,38],7:$V3},o([4,5,7],$V6,{6:$Vf,10:$Vf,11:$Vf})],
defaultActions: {12:[2,27],17:[2,20],18:[2,18],19:[2,19],22:[2,21],24:[2,17],25:[2,13],26:[2,14],27:[2,15],28:[2,16]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

  var helper = {
    currentId: 0,
    currentType: '',
    getID: function(){
      return 'exam-js-' + this.currentId++;
    },
    setCurrentType: function(type){
      helper.currentType = type;
    },
    createQuestions: function(question){
      if(helper.currentType === 'TEXT'){
        question.html = helper.createTextQuestion(question.question, question.answers,'');
        return question;
      } else if(helper.currentType === 'VIDEO') {
        question.html = helper.createVideoQuestion(question.question, question.answers,'');
        return question;
      } else if(helper.currentType === 'AUDIO') {
        question.html = helper.createAudioQuestion(question.question, question.answers,'');
        return question;
      } else if(helper.currentType === 'IMAGE') {
        question.html = helper.createImageQuestion(question.question, question.answers,'');
        return question;
      } else {
        throw new Error('Wrong section type!');
      }
    },
    createImgAnswer: function(answer){
      return '<img src="' + answer.answer + '" class="exam-js-img"/>';
    },
    createVideoQuestion: function(question, answers){
      return '<div>VIDEO MOCK</div>';
    },
    createAudioQuestion: function(question, answers){
      return '<div>AUDIO MOCK</div>';
    },
    createImageQuestion: function(question, answers){
      return '<div id="' + helper.getID() + '" class="exam-js-question">'+ question + answers.map(function(a){return helper.createImgAnswer(a)}).reduce(function(a,b){return a + b}) +'</div>';
    },
    createTextQuestion: function(question, answers){
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
      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + '<select class="exam-js-input">' + answersHtml + '</select></div>';
    },
    createCheckbox: function(question, answers){
      var answersHtml = answers.map(function(a){
        return '<input type="checkbox">' + a.answer + '</input>\n';
      }).reduce(function(a,b){
        return a + b;
      });

      return '<div id="' + helper.getID() + '" class="exam-js-question">' + question + answersHtml + '</div>'
    },
    createVideoTest: function(question, answers){
     return '';
    },
    createAudioTest: function(question, answers){
     return '';
    },
    createImageTest: function(question, answers){
     return '';
    },
  }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 24  //start tests block
break;
case 1:return 25
break;
case 2:return 16  //start text block
break;
case 3:return 17 //type "video" marker
break;
case 4:return 18 //type "audio" marker
break;
case 5:return 19 //type "image" marker
break;
case 6:return 6  //separator
break;
case 7:return 5
break;
case 8:return 10 //right answer marker
break;
case 9:return 11 //wrong answer marker
break;
case 10:return 4
break;
case 11:return 7
break;
case 12:return 29
break;
}
},
rules: [/^(?:ТЕСТЫ)/,/^(?:КОНЕЦ ТЕСТОВ)/,/^(?:ТЕКСТ)/,/^(?:ВИДЕО)/,/^(?:АУДИО)/,/^(?:РИСУНОК)/,/^(?:(\n|\r|\r\n))/,/^(?:\s+)/,/^(?:^\+)/,/^(?:^-)/,/^(?:[^(\s|\n|\r|\n\r)])/,/^(?:\|)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}