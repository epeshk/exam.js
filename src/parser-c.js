(function() {
  var CheckBox, ExamObject, List, Parser, TextInput,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ExamObject = (function() {
    function ExamObject(syntaxBlock, helpText, id) {
      this.syntaxBlock = syntaxBlock;
      this.helpText = helpText;
      this.id = id;
      if (helpText) {
        this._helpTagId = "help_" + this.id;
      }
    }

    return ExamObject;

  })();

  List = (function(_super) {
    __extends(List, _super);

    function List(syntaxBlock, helpText, id, items, rightAnswerIndex) {
      List.__super__.constructor.call(this, syntaxBlock, helpText, id);
      this.items = items;
      this.rightAnswerIndex = rightAnswerIndex;
    }

    return List;

  })(ExamObject);

  TextInput = (function(_super) {
    __extends(TextInput, _super);

    function TextInput(syntaxBlock, helpText, id, rightAnswer) {
      TextInput.__super__.constructor.call(this, syntaxBlock, helpText, id);
      this.rightAnswer = rightAnswer;
    }

    return TextInput;

  })(ExamObject);

  CheckBox = (function(_super) {
    __extends(CheckBox, _super);

    function CheckBox(syntaxBlock, helpText, id, items, rightAnswerIndex) {
      CheckBox.__super__.constructor.call(this, syntaxBlock, helpText, id);
      this.items = items;
      this.rightAnswerIndex = rightAnswerIndex;
    }

    return CheckBox;

  })(ExamObject);

  Parser = (function() {
    function Parser(lexer) {
      this._patterns = {
        blockPattern: /\{\{(.|\n)*?\}\}/g,
        emptyBlock: '{{}}'
      };
      this._currentID = 0;
      this.lexer = lexer;
      this._trim = function(text) {
        var whiteSpacesPattern;
        whiteSpacesPattern = /(?:(?:^|\n)\s+|\s+(?:$|\n))/g;
        return text.replace(whiteSpacesPattern, '').replace(/\s+/g, ' ');
      };
      this._getNextID = function() {
        return "examjsid_" + (++this._currentID);
      };
    }

    return Parser;

  })();

}).call(this);
