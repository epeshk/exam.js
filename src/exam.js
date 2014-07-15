function Exam(settings) {
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._preprocessor = markdown.toHTML;
    self._objects = null;
    self._handlerForSeparatorMode = null;
    self._handlerForBtnFinish = null;
    self._handlerForHint = null;
    self._settings = {
        'separatorMode' :   true,
        'btnFinishId'   :   null, 
    };

    if (settings) {
        if (typeof settings.separatorMode === 'boolean'){
            self._settings.separatorMode = settings.separatorMode;
        }

        if (typeof settings.btnFinishId === 'string') {
            self._settings.btnFinishId = settings.btnFinishId;
        }
    } 
}


Exam.prototype.parse = function(source, preprocessor) {
    var self = this;
    self._preprocessor = markdown.toHTML;
    if (preprocessor) {
        if (typeof preprocessor === 'function') {
            self._preprocessor = preprocessor;
        } else {
            throw new Error('The second argument must be a parsing function');
        }
    } 
    var preprocessedSource = self._preprocessor(source);
    self._objects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator._convertAllObjects(self._objects);

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


Exam.prototype.startExam = function (handlerForSeparatorMode, handlerForBtnFinish, handlerForHint) {
    var self = this;

    self._setPropertyForHelpBtn();


    if (handlerForSeparatorMode) {
        if(typeof handlerForSeparatorMode === 'function') {
            self._handlerForSeparatorMode = handlerForSeparatorMode;
        }
    } else {
        self._handlerForSeparatorMode = self._eventHandlerForSeparatorMode;
    }

    if(handlerForBtnFinish){
        if(typeof handlerForBtnFinish === 'function') {
            self._handlerForBtnFinish = handlerForBtnFinish;
        }
    } else {
        self._handlerForBtnFinish = self._eventHandlerForBtnFinish;
    }

    if(handlerForHint){
        if(typeof handlerForHint === 'function') {
            self._handlerForHint = handlerForHint;
        }
    } else {
        self._handlerForHint = self._eventHandlerForHint;
    }

    
    
    self._objects.forEach(function (object) {
        var currentObjectId = document.getElementById(object._id);

        if ((object instanceof List || object instanceof TextInput) && self._settings.separatorMode) {
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

    if (self._settings.btnFinishId !== null) {
        var btnId = document.getElementById(self._settings.btnFinishId);
        btnId.onclick = function () {
            self._handlerForBtnFinish(self._objects);
        };
    }
};

