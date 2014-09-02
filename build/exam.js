(function() {
  var Exam;

  Exam = (function() {
    function Exam(settings) {
      this._translator = new Translator();
      this._parser = new Parser(new Lexer());
      this._objects = [];
      this._separateCheckingMode = true;
      this._preprocessor = markdown.toHTML;
      if (settings) {
        if (settings.separateCheckingMode != null) {
          if (typeof settings.separateCheckingMode === 'boolean') {
            this._separateCheckingMode = settings.separateCheckingMode;
          } else {
            throw new Error('The separateCheckingMode parameter must be a type of boolean');
          }
        }
        if (settings.finishBtnID != null) {
          if (typeof settings.finishBtnID === 'string') {
            this._finishBtnID = settings.finishBtnID;
          } else {
            throw new Error('The finishBtnID parameter must be a type of string');
          }
        }
        if (settings.preprocessor != null) {
          if (typeof settings.preprocessor === 'function') {
            this._preprocessor = settings.preprocessor;
          } else {
            throw new Error('The preprocessor parameter must be a type of function');
          }
        }
        this._setCallbacks(settings);
      }
    }

    Exam.prototype._setCallbacks = function(settings) {
      if (settings.separateCheckingModeEventHandler) {
        if (typeof settings.separateCheckingModeEventHandler !== 'function') {
          throw new Error('The separateCheckingModeEventHandler must be a type of function');
        }
        this._separateCheckingModeEventHandler = settings.separateCheckingModeEventHandler;
      }
      if (settings.finishBtnEventHandler) {
        if (typeof settings.finishBtnEventHandler !== 'function') {
          throw new Error('The finishBtnEventHandler must be a type of function');
        }
        return this._finishBtnEventHandler = settings.finishBtnEventHandler;
      }
    };

    Exam.prototype.parse = function(source) {
      var convertionResults, item, preprocessedSource, _i, _len;
      preprocessedSource = this._preprocessor(source);
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
      } else {
        result = object.rightAnswer;
      }
      return result;
    };

    Exam.prototype._separateCheckingModeEventHandler = function(object) {
      var currentId, rightAnswer, selectedAnswer;
      currentId = document.getElementById(object.id);
      selectedAnswer = currentId.value;
      rightAnswer = this._getRightAnswer(object);
      if ((selectedAnswer != null) || (rightAnswer != null)) {
        if (rightAnswer.toLowerCase() === selectedAnswer.toLowerCase()) {
          return currentId.style.color = "#7fe817";
        } else {
          return currentId.style.color = "#e42217";
        }
      }
    };

    Exam.prototype.getAnswersInformation = function() {
      var countOfRightAnswers, object, rightAnswer, selectedAnswer, tmpObjId, _i, _len, _ref;
      countOfRightAnswers = 0;
      _ref = this._objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        tmpObjId = document.getElementById(object.id);
        if (tmpObjId) {
          rightAnswer = this._getRightAnswer(object);
          selectedAnswer = tmpObjId.value;
          if ((selectedAnswer != null ? selectedAnswer.toLowerCase() : void 0) === (rightAnswer != null ? rightAnswer.toLowerCase() : void 0)) {
            countOfRightAnswers++;
            result.idOfRightAnswers.push(object.id);
          }
        }
      }
      result.tests = this._objects.length;
      result.rightAnswers = countOfRightAnswers;
      return result;
    };

    Exam.prototype._finishBtnEventHandler = function() {
      var answersInformation;
      answersInformation = this.getAnswersInformation();
      return window.alert("Count of a right answers: " + answersInformation.rightAnswers + "/" + asnwersInformation.tests);
    };

    Exam.prototype.startExam = function() {
      var currentObjectId, finishBtn, object, _i, _len, _ref;
      _ref = this._objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        currentObjectId = document.getElementById(object.id);
        if ((object instanceof List || object instanceof TextInput) && this._separateCheckingMode) {
          currentObjectId.oninput = function() {
            return this._separateCheckingModeEventHandler(object);
          };
        }
      }
      if (this._finishBtnID != null) {
        finishBtn = document.getElementById(this._finishBtnID);
        return finishBtn.onclick = function() {
          return this._finishBtnEventHandler();
        };
      }
    };

    return Exam;

  })();

  this.Exam = Exam;

}).call(this);
