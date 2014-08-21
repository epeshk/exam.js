(function() {
  var AnswerSeparator, HelpSeparator, InputToken, Item, ItemsSeparator, LEXER_HELPER, Lexer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LEXER_HELPER = {
    trim: function(string) {
      if (string) {
        return string.replace(/^\s+/, "").replace(/\s+$/, "");
      }
    }
  };

  Item = (function() {
    function Item(value) {
      this.value = value;
      this.value = LEXER_HELPER.trim(this.value);
    }

    return Item;

  })();

  InputToken = (function(_super) {
    __extends(InputToken, _super);

    function InputToken() {
      return InputToken.__super__.constructor.apply(this, arguments);
    }

    return InputToken;

  })(Item);

  AnswerSeparator = (function(_super) {
    __extends(AnswerSeparator, _super);

    function AnswerSeparator() {
      return AnswerSeparator.__super__.constructor.apply(this, arguments);
    }

    return AnswerSeparator;

  })(Item);

  ItemsSeparator = (function(_super) {
    __extends(ItemsSeparator, _super);

    function ItemsSeparator() {
      return ItemsSeparator.__super__.constructor.apply(this, arguments);
    }

    return ItemsSeparator;

  })(Item);

  HelpSeparator = (function(_super) {
    __extends(HelpSeparator, _super);

    function HelpSeparator() {
      return HelpSeparator.__super__.constructor.apply(this, arguments);
    }

    return HelpSeparator;

  })(Item);

  Lexer = (function() {
    function Lexer() {
      this.tokens = {
        ANSWER_SPTR: "::",
        HELP_SPTR: ":?",
        ITEMS_SPTR: ",",
        INPUT_TOKEN: "...",
        START_BLOCK_TOKEN: "{{",
        END_BLOCK_TOKEN: "}}",
        START_CHECKBOX_TOKEN: "|",
        END_CHECKBOX_TOKEN: "|"
      };
      this._clearSyntaxBlock = (function(_this) {
        return function(syntaxBlock) {
          if (syntaxBlock.substring(0, 2) === _this.tokens.START_BLOCK_TOKEN) {
            syntaxBlock = syntaxBlock.substring(2);
          }
          if (syntaxBlock.substring(syntaxBlock.length - 2) === _this.tokens.END_BLOCK_TOKEN) {
            syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2);
          }
          return syntaxBlock;
        };
      })(this);
      this._isEmpty = function(string) {
        return LEXER_HELPER.trim(string) === "";
      };
      this._isPartOfToken = (function(_this) {
        return function(string) {
          return (_this.tokens.ITEMS_SPTR.indexOf(string) !== -1) || (_this.tokens.ANSWER_SPTR.indexOf(string) !== -1) || (_this.tokens.HELP_SPTR.indexOf(string) !== -1) || (_this.tokens.INPUT_TOKEN.indexOf(string) !== -1);
        };
      })(this);
      this._isToken = (function(_this) {
        return function(string) {
          return string === _this.tokens.ITEMS_SPTR || string === _this.tokens.ANSWER_SPTR || string === _this.tokens.HELP_SPTR || string === _this.tokens.INPUT_TOKEN;
        };
      })(this);
      this.parse = (function(_this) {
        return function(syntaxBlock) {
          var exp, lastChar, lastToken, source, symbol, tmpToken, tryToAddSeparator, _i, _len;
          exp = [];
          lastToken = "";
          tmpToken = "";
          source = syntaxBlock;
          syntaxBlock = _this._clearSyntaxBlock(syntaxBlock);
          tryToAddSeparator = function(exp, token) {
            if (!_this._isEmpty(token)) {
              if (token === _this.tokens.ITEMS_SPTR) {
                exp.push(new ItemsSeparator(token));
              }
              if (token === _this.tokens.ANSWER_SPTR) {
                exp.push(new AnswerSeparator(token));
              }
              if (token === _this.tokens.HELP_SPTR) {
                exp.push(new HelpSeparator(token));
              }
              if (token === _this.tokens.INPUT_TOKEN) {
                exp.push(new InputToken(token));
              }
            }
          };
          for (_i = 0, _len = syntaxBlock.length; _i < _len; _i++) {
            symbol = syntaxBlock[_i];
            lastChar = symbol;
            if (_this._isPartOfToken(tmpToken + lastChar)) {
              tmpToken += lastChar;
            } else {
              if (_this._isPartOfToken(lastChar)) {
                lastToken += tmpToken;
                tmpToken = lastChar;
              } else {
                lastToken += tmpToken + lastChar;
                tmpToken = "";
              }
            }
            if (_this._isToken(tmpToken)) {
              if (!_this._isEmpty(lastToken)) {
                exp.push(new Item(lastToken));
              }
              tryToAddSeparator(exp, tmpToken);
              lastToken = "";
              tmpToken = "";
            }
          }
          exp.push(new Item(lastToken));
          exp = exp.filter(function(e) {
            return e.value !== void 0 && e.value !== null;
          });
          return {
            expression: exp,
            syntaxBlock: source
          };
        };
      })(this);
    }

    return Lexer;

  })();

  this.Item = Item;

  this.InputToken = InputToken;

  this.AnswerSeparator = AnswerSeparator;

  this.ItemsSeparator = ItemsSeparator;

  this.HelpSeparator = HelpSeparator;

  this.Lexer = Lexer;

}).call(this);
