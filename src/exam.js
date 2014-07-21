function Exam(settings) {
    'use strict';
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._objects = [];

    self._handlerForBtnFinish = function() {};
    self._handlerForSeparatorMode = function() {};
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
    self._setCallback(settings);
}

Exam.prototype._setPropertyForHelpBtn = function() {
    'use strict';
    var self = this;

    self._objects.forEach(function(object) {
        if (object instanceof Hint) {
            var currentIdHelp = document.getElementById(object._id);
            currentIdHelp.style.cssText = "display: inline;";
            currentIdHelp.style.backgroundColor = "#808080";
            currentIdHelp.style.color = "#000000";
            currentIdHelp.style.width = "100px";
            currentIdHelp.style.textAlign = "center";
        }
    });
};

Exam.prototype._setCallback = function(settings) {
    'use strict';
    var self = this;
    self._handlerForHint = self._eventHandlerForHint;
    self._handlerForSeparatorMode = self._eventHandlerForSeparatorMode;
    self._handlerForBtnFinish = self._eventHandlerForBtnFinish;

    if(settings === undefined){
        return;
    }

    if (settings.handlerForSeparatorMode) {
        if (typeof settings.handlerForSeparatorMode !== 'function') {
            throw new Error('The handlerForSeparatorMode must be a type of function');
        } else {
            self._handlerForSeparatorMode = settings.handlerForSeparatorMode;
        }
    } else {
        self._handlerForSeparatorMode = self._eventHandlerForSeparatorMode;
    }

    if (settings.handlerForBtnFinish) {
        if (typeof settings.handlerForBtnFinish !== 'function') {
            throw new Error('The handlerForBtnFinish must be a type of function');
        } else {
            self._handlerForBtnFinish = settings.handlerForBtnFinish;
        }
    } else {
        self._handlerForBtnFinish = self._eventHandlerForBtnFinish;
    }

    if (settings.handlerForHint) {
        if (typeof settings.handlerForHint !== 'function') {
            throw new Error('The handlerForHint must be a type of function');
        } else {
            self._handlerForHint = settings.handlerForHint;
        }
    } else {
        self._handlerForHint = self._eventHandlerForHint;
    }
};

Exam.prototype.parse = function(source) {
    'use strict';
    var self = this;

    var preprocessedSource = self._preprocessor(source);
    self._objects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator._convertAllObjects(self._objects);

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

    currentId.style.borderStyle = "solid";
    currentId.style.borderWidth = "4px";

    if (rightAnswer === selectAnswer) {
        currentId.style.borderColor = "#00FF00";
    } else {
        currentId.style.borderColor = "#FF0000";
    }
};

Exam.prototype._eventHandlerForBtnFinish = function(objects) {
    'use strict';
    var self = this;
    var countQuestions = objects.length;
    var countRightAnswer = 0;
    objects.forEach(function(object) {
        var tmpObjId = document.getElementById(object._id);
        var rightAnswer = self._getRightAnswer(object);
        var selectAnswer = tmpObjId.value;
        if (selectAnswer === rightAnswer) {
            countRightAnswer++;
        }
    });

    window.alert("Правильных ответов " + countRightAnswer + " из " + countQuestions);
};

Exam.prototype._eventHandlerForHint = function(object) {
    'use strict';
    window.alert(object.helpText);
};


Exam.prototype.startExam = function() {
    'use strict';
    var self = this;
    self._setPropertyForHelpBtn();

    self._objects.forEach(function(object) {
        var currentObjectId = document.getElementById(object._id);

        if ((object instanceof List || object instanceof TextInput) && self._separateCheckingMode) {
            currentObjectId.oninput = function() {
                self._handlerForSeparatorMode(object);
            };
        } 
    });

    if (self._finishBtnID !== null) {
        var btnId = document.getElementById(self._finishBtnID);
        btnId.onclick = function() {
            self._handlerForBtnFinish(self._objects);
        };
    }
};
