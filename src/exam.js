function Exam(settings) {
    'use strict';
    if (!(this instanceof Exam)) {
        return new Exam();
    }

    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._objects = [];

    self._separateCheckingMode = true;
    self._preprocessor = markdown.toHTML;

    if (settings) {
        if (settings.separateCheckingMode !== undefined) {
            if (typeof settings.separateCheckingMode === 'boolean') {
                self._separateCheckingMode = settings.separateCheckingMode;
            } else {
                throw new Error('The separateCheckingMode parameter must be a type of boolean');
            }
        }
        if (settings.finishBtnID !== undefined) {
            if (typeof settings.finishBtnID === 'string') {
                self._finishBtnID = settings.finishBtnID;
            } else {
                throw new Error('The finishBtnID parameter must be a type of string');
            }
        }
        if (settings.preprocessor !== undefined) {
            if (typeof settings.preprocessor === 'function') {
                self._preprocessor = settings.preprocessor;
            } else {
                throw new Error('The preprocessor parameter must be a type of function');
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

    if (settings.finishBtnEventHandler) {
        if (typeof settings.finishBtnEventHandler !== 'function') {
            throw new Error('The finishBtnEventHandler must be a type of function');
        }
        self._finishBtnEventHandler = settings.finishBtnEventHandler;
    }

    if (settings.helpHintEventHandler) {
        if (typeof settings.helpHintEventHandler !== 'function') {
            throw new Error('The helpHintEventHandler must be a type of function');
        }
        self._helpHintEventHandler = settings.helpHintEventHandler;
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
    var self = this,
        result;

    if (object instanceof List) {
        result = object.items[object.rightAnswerIndex];
    } else {
        result = object.rightAnswer;
    }

    return result;
};

Exam.prototype._separateCheckingModeEventHandler = function(object) {
    'use strict';
    var self = this,
        currentId = document.getElementById(object.id),
        selectAnswer = currentId.value,
        rightAnswer = self._getRightAnswer(object);

    if (rightAnswer.toLowerCase() === selectAnswer.toLowerCase()) {
        currentId.style.color = "#7fe817";
    } else {
        currentId.style.color = "#e42217";
    }
};

Exam.prototype._finishBtnEventHandler = function(objects) {
    'use strict';
    var self = this,
        countOfQuestions = objects.length,
        countOfRightAnswer = 0,
        tmpObjId,
        rightAnswer,
        selectedAnswer;

    objects.forEach(function(object) {
        tmpObjId = document.getElementById(object.id);
        rightAnswer = self._getRightAnswer(object);
        selectedAnswer = tmpObjId.value;

        if (selectedAnswer === rightAnswer) {
            countOfRightAnswer++;
        }
    });

    window.alert("Count of a right answers: " + countOfRightAnswer + "/" + countOfQuestions);
};

Exam.prototype._helpHintEventHandler = function(object) {
    'use strict';
    window.alert(object.helpText);
};

Exam.prototype.startExam = function() {
    'use strict';
    var self = this,
        currentObjectId,
        btnId;
        
    self._objects.forEach(function(object) {
        currentObjectId = document.getElementById(object.id);

        if ((object instanceof List || object instanceof TextInput) && self._separateCheckingMode) {
            currentObjectId.oninput = function() {
                self._separateCheckingModeEventHandler(object);
            };
        }
    });

    if (self._finishBtnID !== null) {
        btnId = document.getElementById(self._finishBtnID);
        btnId.onclick = function() {
            self._finishBtnEventHandler(self._objects);
        };
    }
};
