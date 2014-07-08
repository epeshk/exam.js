function Exam() {
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._preprocessor = markdown.toHTML;
    self._objects = null;
    self._handlerForSeparatorMode = null;
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


Exam.prototype._eventHandlerForSeparatorMode = function (object) {
    var currentId = document.getElementById(object._id);
    var selectAnswer = currentId.value;
    var rightAnswer = "";

    if (object instanceof List) {
        rightAnswer = object.items[object.rightAnswerIndex];
    } else {
        rightAnswer = object.rightAnswer;
    }

    currentId.style.borderStyle = "solid";
    currentId.style.borderWidth = "4px";

    if (rightAnswer === selectAnswer) {
        currentId.style.borderColor = "#00FF00";
    } else {
        currentId.style.borderColor = "#FF0000";
    }
};


Exam.prototype.startExam = function (handlerForSeparatorMode) {
    var self = this;

    if (handlerForSeparatorMode) {
        if(typeof handlerForSeparatorMode === 'function'){
            self._handlerForSeparatorMode = handlerForSeparatorMode;
        }
    } else {
        self._handlerForSeparatorMode = self._eventHandlerForSeparatorMode;
    }

    
    self._objects.forEach(function (object) {
        var currentObjectId = document.getElementById(object._id);

        currentObjectId.oninput = function () {
            self._handlerForSeparatorMode(object);
        };

    });
};

