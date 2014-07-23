function Exam(settings) {
    'use strict';
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._objects = [];

    self._finishBtnEventHandler = function() {};
    self._separateCheckingModeEventHandler = function() {};
    self._handlerForHint = function() {};

    self._separateCheckingMode = true;
    self._preprocessor = markdown.toHTML;

    if (settings) {
        if (settings.separateCheckingMode !== undefined) {
            if (typeof settings.separateCheckingMode === 'boolean') {
                self._separateCheckingMode = settings.separateCheckingMode;
            } else {
                throw new Error('The separatoMode must be a type of boolean');
            }
        }
        if (settings.finishBtnID !== undefined) {
            if (typeof settings.finishBtnID === 'string') {
                self._finishBtnID = settings.finishBtnID;
            } else {
                throw new Error('The btnFinishId must be a type of string');
            }
        }
        if (settings.preprocessor !== undefined) {
            if (typeof settings.preprocessor === 'function') {
                self._preprocessor = settings.preprocessor;
            } else {
                throw new Error('The preprocessor must be a type of function');
            }
        }
    }
    self._setCallbacks(settings);
}

Exam.prototype._setCallbacks = function(settings) {
    'use strict';
    var self = this;

    if (settings === undefined) {
        return;
    }

    if (settings.separateCheckingModeEventHandler) {
        if (typeof settings.separateCheckingModeEventHandler !== 'function') {
            throw new Error('The separateCheckingModeEventHandler must be a type of function');
        }
        self._separateCheckingModeEventHandler = settings.separateCheckingModeEventHandler;
    }

    if (settings.handlerForBtnFinish) {
        if (typeof settings.handlerForBtnFinish !== 'function') {
            throw new Error('The handlerForBtnFinish must be a type of function');
        }
        self._finishBtnEventHandler = settings.handlerForBtnFinish;
    }

    if (settings.handlerForHint) {
        if (typeof settings.handlerForHint !== 'function') {
            throw new Error('The handlerForHint must be a type of function');
        }
        self._handlerForHint = settings.handlerForHint;
    }
};

Exam.prototype.parse = function(source) {
    'use strict';
    var self = this;

    var preprocessedSource = self._preprocessor(source);
    self._objects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator.convertAllObjects(self._objects);

    convertionResults.forEach(function(item) {
        preprocessedSource = preprocessedSource.replace(item.source, item.result);
    });

    return preprocessedSource;
};

Exam.prototype._getRightAnswer = function(object) {
    'use strict';
    var self = this;
    var result;
    if (object instanceof List) {
        result = object.items[object.rightAnswerIndex];
    } else {
        result = object.rightAnswer;
    }

    return result;
};

Exam.prototype._eventHandlerForSeparatorMode = function(object) {
    'use strict';
    var self = this;
    var currentId = document.getElementById(object._id);
    var selectAnswer = currentId.value;
    var rightAnswer = self._getRightAnswer(object);

    if (rightAnswer === selectAnswer) {
        currentId.style.color = "#7fe817";
    } else {
        currentId.style.color = "#e42217";
    }
};

Exam.prototype._eventHandlerForBtnFinish = function(objects) {
    'use strict';
    var self = this;
    var countOfQuestions = objects.length;
    var countOfRightAnswer = 0;
    objects.forEach(function(object) {
        var tmpObjId = document.getElementById(object._id);
        var rightAnswer = self._getRightAnswer(object);
        var selectAnswer = tmpObjId.value;
        if (selectAnswer === rightAnswer) {
            countOfRightAnswer++;
        }
    });

    window.alert("Count of a right answers: " + countOfRightAnswer + "/" + countOfQuestions);
};

Exam.prototype._eventHandlerForHint = function(object) {
    'use strict';
    window.alert(object.helpText);
};

Exam.prototype.startExam = function() {
    'use strict';
    var self = this;

    self._objects.forEach(function(object) {
        var currentObjectId = document.getElementById(object._id);

        if ((object instanceof List || object instanceof TextInput) && self._separateCheckingMode) {
            currentObjectId.oninput = function() {
                self._separateCheckingModeEventHandler(object);
            };
        }
    });

    if (self._finishBtnID !== null) {
        var btnId = document.getElementById(self._finishBtnID);
        btnId.onclick = function() {
            self._finishBtnEventHandler(self._objects);
        };
    }
};
