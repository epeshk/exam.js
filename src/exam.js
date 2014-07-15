function Exam(settings) {
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._objects = null;

    self._handlerForBtnFinish = null;
    self._handlerForSeparatorMode = null;
    self._handlerForHint = null;
    self._separatorMode = true;
    self._btnFinishId = null;
    self._preprocessor = markdown.toHTML;

    if (settings) {
        self._settings = settings;
    } else {
        self._settings = null;
    }
        
}


Exam.prototype._setSettings =  function() {
    var self = this;
    var settings = self._settings;

    if (settings === null) {
        return;
    }

    if (typeof settings.separatorMode !== 'undefined') {
        if (typeof settings.separatorMode !== 'boolean') {
            throw new Error('The separatoMode must be a type of boolean');
        } else {
            self._separatorMode = settings.separatorMode;
        }
    }

    if (settings.btnFinishId) {
        if (typeof settings.btnFinishId !== 'string') {
            throw new Error('The btnFinishId must be a type of string');
        } else {
            self._btnFinishId = settings.btnFinishId;
        }
    }

    if (settings.preprocessor) {
        if (typeof settings.preprocessor !== 'function') {
            throw new Error('The preprocessor must be a type of function');
        } else {
            self._preprocessor = settings.preprocessor;
        }
    }

};


Exam.prototype.parse = function(source) {
    var self = this;
    self._setSettings();

    var preprocessedSource = self._preprocessor(source);
    self._objects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator._convertAllObjects(self._objects);
    var currentPointer = 0;

    convertionResults.forEach(function(item) {
        if (item.block === 'hint') {
            var positionCurrentHint = preprocessedSource.indexOf(item.source, currentPointer);
            currentPointer = positionCurrentHint + item.source.length;
            var positionLastPrev = preprocessedSource.lastIndexOf("}", positionCurrentHint);
            var leftPartText = preprocessedSource.substr(0, positionLastPrev + 1);
            var rightPartText = preprocessedSource.substr(positionCurrentHint);
            preprocessedSource = leftPartText + rightPartText;
        }
    });

    convertionResults.forEach(function(item) {
        preprocessedSource = preprocessedSource.replace(item.source, item.result);
    });


    return preprocessedSource;
};

Exam.prototype._getRightAnswer = function (object) {
    var self = this;
    var result;
    if (object instanceof List) {
        result = object.items[object.rightAnswerIndex];
    } else {
        result = object.rightAnswer;
    }

    return result;
};

Exam.prototype._eventHandlerForSeparatorMode = function (object) {
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

Exam.prototype._eventHandlerForBtnFinish = function (objects) {
    var self = this;
    var countQuestions = objects.length;
    var countRightAnswer = 0;
    objects.forEach(function (object) {
        var tmpObjId = document.getElementById(object._id);
        var rightAnswer = self._getRightAnswer(object);
        var selectAnswer = tmpObjId.value;
        if (selectAnswer === rightAnswer) {
            countRightAnswer++;
        }
    });

    window.alert("Правильных ответов "+ countRightAnswer + " из "+countQuestions);
};

Exam.prototype._eventHandlerForHint = function (object) {
    window.alert(object.helpText);
};

Exam.prototype._setPropertyForHelpBtn = function() {
    var self = this;

    self._objects.forEach(function (object) {
        if (object instanceof Hint){
            var currentIdHelp = document.getElementById(object._id);
            currentIdHelp.style.backgroundColor = "#00FF00";
            currentIdHelp.style.color = "#000000";
            currentIdHelp.style.width = "100px";
            currentIdHelp.style.textAlign = "center";
        }
    });
};


Exam.prototype._setCallback = function() {
    var self = this;
    var settings = self._settings;
    if (settings === null) {
        self._handlerForHint = self._eventHandlerForHint;
        self._handlerForSeparatorMode = self._eventHandlerForSeparatorMode;
        self._handlerForBtnFinish = self._eventHandlerForBtnFinish;
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


Exam.prototype.startExam = function () {
    var self = this;

    self._setPropertyForHelpBtn();

    self._setCallback();

    self._objects.forEach(function (object) {
        var currentObjectId = document.getElementById(object._id);

        if ((object instanceof List || object instanceof TextInput) && self._separatorMode) {
            currentObjectId.oninput = function () {
                self._handlerForSeparatorMode(object);
            };
        } else {
            if (object instanceof Hint) {
                currentObjectId.onclick = function () {
                    self._handlerForHint(object);
                };
            } 
        }

    });  

    if (self._btnFinishId !== null) {
        var btnId = document.getElementById(self._btnFinishId);
        btnId.onclick = function () {
            self._handlerForBtnFinish(self._objects);
        };
    }
};

