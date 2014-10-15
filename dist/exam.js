var Exam;

Exam = (function() {
  function Exam(settings) {
    this._translator = new Translator();
    this._parser = new Parser(new Lexer());
    this._objects = [];
    this._separateChecking = true;
    this._lang = markdown.toHTML;
    if (settings) {
      if (settings.separateChecking != null) {
        if (typeof settings.separateChecking === 'boolean') {
          this._separateChecking = settings.separateChecking;
        } else {
          throw new Error('parameter "separateChecking" must be a type of boolean');
        }
      }
      if (settings.finishBtnID != null) {
        if (typeof settings.finishBtnID === 'string') {
          this._finishBtnID = settings.finishBtnID;
        } else {
          throw new Error('parameter "finishBtnID" must be a type of string');
        }
      }
      if (settings.lang != null) {
        if (typeof settings.lang === 'function') {
          this._lang = settings.lang;
        } else {
          throw new Error('parameter "lang" must be a type of function');
        }
      }
      this._setCallbacks(settings);
    }
  }

  Exam.prototype._setCallbacks = function(settings) {
    if (settings.separateCheckingHandler) {
      if (typeof settings.separateCheckingHandler !== 'function') {
        throw new Error('parameter "separateCheckingHandler" must be a type of function');
      }
      this._separateCheckingHandler = settings.separateCheckingHandler;
    }
    if (settings.finishBtnHandler) {
      if (typeof settings.finishBtnHandler !== 'function') {
        throw new Error('parameter "finishBtnHandler" must be a type of function');
      }
      return this._finishBtnHandler = settings.finishBtnHandler;
    }
  };

  Exam.prototype.parse = function(source) {
    var convertionResults, item, preprocessedSource, _i, _len;
    preprocessedSource = this._lang(source);
    this._objects = this._parser.parse(preprocessedSource);
    convertionResults = this._translator.convertAllObjects(this._objects);
    for (_i = 0, _len = convertionResults.length; _i < _len; _i++) {
      item = convertionResults[_i];
      preprocessedSource = preprocessedSource.replace(item.source, item.result);
    }
    return preprocessedSource;
  };

  Exam.prototype._getRightAnswer = function(object) {
    var result;
    if (object instanceof List) {
      result = object.items[object.rightAnswerIndex];
    } else if (object instanceof TextInput) {
      result = object.rightAnswer;
    } else {
      result = object.rightAnswers;
    }
    return result;
  };

  Exam.prototype._validateCheckBox = function(object) {
    var a, checkbox, checkboxes, isValid, rightAnswers, values, _i, _j, _len, _len1;
    isValid = true;
    checkboxes = document.querySelectorAll("#" + object.id + " .examjs-checkbox");
    values = [];
    for (_i = 0, _len = checkboxes.length; _i < _len; _i++) {
      checkbox = checkboxes[_i];
      if (checkbox.checked) {
        values.push(checkbox.nextSibling.data);
      }
    }
    rightAnswers = this._getRightAnswer(object);
    if (rightAnswers.length === values.length) {
      for (_j = 0, _len1 = rightAnswers.length; _j < _len1; _j++) {
        a = rightAnswers[_j];
        isValid = isValid && values.indexOf(a) !== -1;
      }
    } else {
      isValid = false;
    }
    return isValid;
  };

  Exam.prototype._separateCheckingHandler = function(object) {
    var elem, rightAnswer, selectedAnswer;
    elem = document.getElementById(object.id);
    selectedAnswer = elem.value;
    rightAnswer = this._getRightAnswer(object);
    if (object instanceof CheckBox) {
      if (this._validateCheckBox(object)) {
        elem.style.color = "#7fe817";
      } else {
        elem.style.color = "#e42217";
      }
      return;
    }
    if ((selectedAnswer != null) || (rightAnswer != null)) {
      if (rightAnswer.toLowerCase() === selectedAnswer.toLowerCase()) {
        return elem.style.color = "#7fe817";
      } else {
        return elem.style.color = "#e42217";
      }
    }
  };

  Exam.prototype.getAnswersInformation = function() {
    var countOfRightAnswers, object, result, rightAnswer, selectedAnswer, tmpObjId, _i, _len, _ref;
    countOfRightAnswers = 0;
    result = {
      idOfRightAnswers: []
    };
    _ref = this._objects;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      object = _ref[_i];
      tmpObjId = document.getElementById(object.id);
      if (tmpObjId) {
        if (object instanceof CheckBox) {
          if (this._validateCheckBox(object)) {
            countOfRightAnswers++;
            result.idOfRightAnswers.push(object.id);
          }
        } else {
          rightAnswer = this._getRightAnswer(object);
          selectedAnswer = tmpObjId.value;
          if ((selectedAnswer != null ? selectedAnswer.toLowerCase() : void 0) === (rightAnswer != null ? rightAnswer.toLowerCase() : void 0)) {
            countOfRightAnswers++;
            result.idOfRightAnswers.push(object.id);
          }
        }
      }
    }
    result.tests = this._objects.length;
    result.rightAnswers = countOfRightAnswers;
    return result;
  };

  Exam.prototype.onAnswer = function(tagId, callback) {
    var tId, tag, tags, _i, _j, _len, _len1, _results;
    tags = [];
    if (tagId instanceof Array) {
      for (_i = 0, _len = tagId.length; _i < _len; _i++) {
        tId = tagId[_i];
        tags.push(document.getElementById(tId));
      }
    } else {
      tags.push(document.getElementById(tagId));
    }
    _results = [];
    for (_j = 0, _len1 = tags.length; _j < _len1; _j++) {
      tag = tags[_j];
      tag.oninput = (function(_this) {
        return function() {
          var info;
          info = _this.getAnswersInformation();
          return callback(info.tests, info.rightAnswers);
        };
      })(this);
      _results.push(tag.onchange = (function(_this) {
        return function() {
          var info;
          info = _this.getAnswersInformation();
          return callback(info.tests, info.rightAnswers);
        };
      })(this));
    }
    return _results;
  };

  Exam.prototype._finishBtnHandler = function() {
    var answersInformation;
    answersInformation = this.getAnswersInformation();
    return window.alert("Count of a right answers: " + answersInformation.rightAnswers + "/" + asnwersInformation.tests);
  };

  Exam.prototype.startExam = function() {
    var finishBtn, self;
    self = this;
    self._objects.forEach(function(object) {
      var currentObjectId;
      currentObjectId = document.getElementById(object.id);
      if ((object instanceof List || object instanceof TextInput) && self._separateChecking) {
        return currentObjectId.oninput = function() {
          return self._separateCheckingHandler(object);
        };
      } else if ((object instanceof CheckBox) && self._separateChecking) {
        return currentObjectId.onchange = function() {
          return self._separateCheckingHandler(object);
        };
      }
    });
    if (self._finishBtnID != null) {
      finishBtn = document.getElementById(self._finishBtnID);
      return finishBtn.onclick = function() {
        return self._finishBtnHandler();
      };
    }
  };

  return Exam;

})();

this.Exam = Exam;

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
      END_BLOCK_TOKEN: "}}"
    };
  }

  Lexer.prototype._clearSyntaxBlock = function(syntaxBlock) {
    if (syntaxBlock.substring(0, 2) === this.tokens.START_BLOCK_TOKEN) {
      syntaxBlock = syntaxBlock.substring(2);
    }
    if (syntaxBlock.substring(syntaxBlock.length - 2) === this.tokens.END_BLOCK_TOKEN) {
      syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2);
    }
    return syntaxBlock;
  };

  Lexer.prototype._isEmpty = function(string) {
    return LEXER_HELPER.trim(string) === "";
  };

  Lexer.prototype._isPartOfToken = function(string) {
    return (this.tokens.ITEMS_SPTR.indexOf(string) !== -1) || (this.tokens.ANSWER_SPTR.indexOf(string) !== -1) || (this.tokens.HELP_SPTR.indexOf(string) !== -1) || (this.tokens.INPUT_TOKEN.indexOf(string) !== -1);
  };

  Lexer.prototype._isToken = function(string) {
    return string === this.tokens.ITEMS_SPTR || string === this.tokens.ANSWER_SPTR || string === this.tokens.HELP_SPTR || string === this.tokens.INPUT_TOKEN;
  };

  Lexer.prototype.parse = function(syntaxBlock) {
    var exp, lastChar, lastToken, source, symbol, tmpToken, tryToAddSeparator, _i, _len;
    exp = [];
    lastToken = "";
    tmpToken = "";
    source = syntaxBlock;
    syntaxBlock = this._clearSyntaxBlock(syntaxBlock);
    tryToAddSeparator = (function(_this) {
      return function(exp, token) {
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
    })(this);
    for (_i = 0, _len = syntaxBlock.length; _i < _len; _i++) {
      symbol = syntaxBlock[_i];
      lastChar = symbol;
      if (this._isPartOfToken(tmpToken + lastChar)) {
        tmpToken += lastChar;
      } else {
        if (this._isPartOfToken(lastChar)) {
          lastToken += tmpToken;
          tmpToken = lastChar;
        } else {
          lastToken += tmpToken + lastChar;
          tmpToken = "";
        }
      }
      if (this._isToken(tmpToken)) {
        if (!this._isEmpty(lastToken)) {
          exp.push(new Item(lastToken));
        }
        tryToAddSeparator(exp, tmpToken);
        lastToken = "";
        tmpToken = "";
      }
    }
    exp.push(new Item(lastToken));
    exp = exp.filter((function(_this) {
      return function(e) {
        return e.value != null;
      };
    })(this));
    return {
      expression: exp,
      syntaxBlock: source
    };
  };

  return Lexer;

})();

this.Item = Item;

this.InputToken = InputToken;

this.AnswerSeparator = AnswerSeparator;

this.ItemsSeparator = ItemsSeparator;

this.HelpSeparator = HelpSeparator;

this.Lexer = Lexer;

var CheckBox, ExamObject, ImageCheckBox, List, Parser, TextInput,
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

  function CheckBox(syntaxBlock, helpText, id, items, rightAnswers) {
    CheckBox.__super__.constructor.call(this, syntaxBlock, helpText, id);
    this.items = items;
    this.rightAnswers = rightAnswers;
  }

  return CheckBox;

})(ExamObject);

ImageCheckBox = (function(_super) {
  __extends(ImageCheckBox, _super);

  function ImageCheckBox(syntaxBlock, helpText, id, items, rightAnswers) {
    ImageCheckBox.__super__.constructor.call(this, syntaxBlock, helpText, id);
    this.items = items;
    this.rightAnswers = rightAnswers;
  }

  return ImageCheckBox;

})(ExamObject);

Parser = (function() {
  function Parser(lexer) {
    this._patterns = {
      blockPattern: /\{\{(.|\n)*?\}\}/g,
      emptyBlock: '{{}}'
    };
    this._currentID = 0;
    this.lexer = lexer;
  }

  Parser.prototype._trim = function(text) {
    var whiteSpacesPattern;
    whiteSpacesPattern = /(?:(?:^|\n)\s+|\s+(?:$|\n))/g;
    return text.replace(whiteSpacesPattern, '').replace(/\s+/g, ' ');
  };

  Parser.prototype._getNextID = function() {
    return "examjsid_" + (++this._currentID);
  };

  Parser.prototype._indexOfRightAnswer = function(items, answer) {
    var item, result, _i, _len;
    result = -1;
    if (answer) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (this._trim(item.toLowerCase()) === this._trim(answer.toLowerCase())) {
          result = items.indexOf(item);
        }
      }
    }
    return result;
  };

  Parser.prototype._createList = function(expressionObj, syntaxBlock) {
    var id, rightAnswerIndex;
    rightAnswerIndex = this._indexOfRightAnswer(expressionObj.items, expressionObj.answers[0]);
    id = this._getNextID();
    return new List(syntaxBlock, expressionObj.helpText, id, expressionObj.items, rightAnswerIndex);
  };

  Parser.prototype._createTextInput = function(expressionObj, syntaxBlock) {
    var id;
    id = this._getNextID();
    return new TextInput(syntaxBlock, expressionObj.helpText, id, expressionObj.answers[0]);
  };

  Parser.prototype._createCheckBox = function(expressionObj, syntaxBlock) {
    var id;
    id = this._getNextID();
    return new CheckBox(syntaxBlock, expressionObj.helpText, id, expressionObj.items, expressionObj.answers);
  };

  Parser.prototype._parseSyntaxBlocks = function(text) {
    var regexp;
    regexp = new RegExp(this._patterns.blockPattern);
    return text.match(regexp);
  };

  Parser.prototype._extractObjects = function(expressions) {
    var exp, result, tmpObj, _i, _len;
    result = [];
    if (expressions !== null) {
      for (_i = 0, _len = expressions.length; _i < _len; _i++) {
        exp = expressions[_i];
        tmpObj = this._parseExpression(exp.expression);
        if (tmpObj.hasInputToken) {
          result.push(this._createTextInput(tmpObj, exp.syntaxBlock));
        } else if (tmpObj.answers.length > 1) {
          result.push(this._createCheckBox(tmpObj, exp.syntaxBlock));
        } else {
          result.push(this._createList(tmpObj, exp.syntaxBlock));
        }
      }
    }
    return result;
  };

  Parser.prototype._parseExpression = function(expression) {
    var lastSeparator, result, token, _i, _len;
    result = {
      items: [],
      answers: [],
      hasInputToken: false
    };
    lastSeparator = null;
    for (_i = 0, _len = expression.length; _i < _len; _i++) {
      token = expression[_i];
      if (!(token instanceof ItemsSeparator)) {
        switch (false) {
          case !(token instanceof InputToken):
            result.hasInputToken = true;
            break;
          case !(token instanceof AnswerSeparator):
            lastSeparator = token;
            break;
          case !(token instanceof HelpSeparator):
            lastSeparator = token;
            break;
          case !(token instanceof Item && lastSeparator === null):
            result.items.push(token.value);
            break;
          case !(token instanceof Item && lastSeparator instanceof AnswerSeparator):
            result.answers.push(token.value);
            break;
          case !(token instanceof Item && lastSeparator instanceof HelpSeparator):
            result.helpText = token.value;
            break;
          default:
            null;
        }
      }
    }
    return result;
  };

  Parser.prototype.parse = function(text) {
    var block, expressions, syntaxBlocks, _i, _len;
    if (typeof text !== 'string') {
      throw new Error('Parser Error: into the parse() method was passed not a string parameter');
    }
    syntaxBlocks = this._parseSyntaxBlocks(text);
    expressions = [];
    if (syntaxBlocks) {
      for (_i = 0, _len = syntaxBlocks.length; _i < _len; _i++) {
        block = syntaxBlocks[_i];
        expressions.push(this.lexer.parse(block));
      }
    }
    return this._extractObjects(expressions);
  };

  return Parser;

})();

this.Parser = Parser;

this.List = List;

this.TextInput = TextInput;

this.CheckBox = CheckBox;

var Translator;

Translator = (function() {
  function Translator() {}

  Translator.prototype._createTextInput = function(inputObject) {
    var result;
    result = "<input type='text' id='" + inputObject.id + "' class='examjs-input'></input>";
    if (inputObject.helpText) {
      result += "<div id='" + inputObject._helpTagId + "' class='examjs-help-popup' data-help='" + inputObject.helpText + "'>?</div>";
    }
    return "<div class='examjs-block'>" + result + "</div>";
  };

  Translator.prototype._createListBox = function(listObject) {
    var item, result, _i, _len, _ref;
    result = "<select id='" + listObject.id + "' class='examjs-input'>";
    result += "<option></option>";
    _ref = listObject.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      result += "<option>" + item + "</option>";
    }
    result += '</select>';
    if (listObject.helpText) {
      result += "<div id='" + listObject._helpTagId + "' class='examjs-help-popup' data-help='" + listObject.helpText + "'>?</div>";
    }
    return "<div class='examjs-block'>" + result + "</div>";
  };

  Translator.prototype._createCheckBox = function(checkBoxObject) {
    var item, result, _i, _len, _ref;
    result = "<div id='" + checkBoxObject.id + "' class='examjs-block'>";
    _ref = checkBoxObject.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      result += "<div><input type='checkbox' class='examjs-checkbox'>" + item + "</input></div>";
    }
    result += "</div>";
    if (checkBoxObject.helpText) {
      result += "<div id='" + checkBoxObject._helpTagId + "' class='examjs-help-popup examjs-checkbox-popup' data-help='" + checkBoxObject.helpText + "'>?</div>";
    }
    return "<div class='examjs-checkbox-block'>" + result + "</div>";
  };

  Translator.prototype.convertAllObjects = function(objects) {
    var object, result, _i, _len;
    result = [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      if (object instanceof List) {
        result.push({
          source: object.syntaxBlock,
          result: this._createListBox(object),
          block: 'list'
        });
      } else if (object instanceof TextInput) {
        result.push({
          source: object.syntaxBlock,
          result: this._createTextInput(object),
          block: 'textInput'
        });
      } else if (object instanceof CheckBox) {
        result.push({
          source: object.syntaxBlock,
          result: this._createCheckBox(object),
          block: 'checkBox'
        });
      } else {
        throw new Error('Converting error. Translator cannot convert object that was passed into it');
      }
    }
    return result;
  };

  return Translator;

})();

this.Translator = Translator;
