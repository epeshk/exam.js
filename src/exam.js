function Exam() {
    if (!(this instanceof Exam)) {
        return new Exam();
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._preprocessor = markdown.toHTML;
    self._objects = null;
    self._eventHandlerForSeparatorMode = null;
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

Exam.prototype.startExam = function (handlerForSeparatorMode) {
    var self = this;

    function eventHandlerForSeparatorMode (object, selectAnswer) {
        if (object.rightAnswer === selectAnswer) {
            window.alert("true");
        } else {
            window.alert("false");
        }
    }



    if (handlerForSeparatorMode) {
        if(typeof eventHandlerForSeparatorMode === 'function'){
            self._eventHandlerForSeparatorMode = handlerForSeparatorMode;
        }
    } else {
        self._eventHandlerForSeparatorMode = eventHandlerForSeparatorMode;
    }

    

    self._objects.forEach(function (object) {
        var currentObjectId = document.getElementById(object._id);

        if (object instanceof List) {
            currentObjectId.onselect = function () {
                var selectAnswer = currentObjectId.value;
                self._eventHandlerForSeparatorMode(object, selectAnswer);
            };
        } else {
            currentObjectId.oninput = function () {
                var selectAnswer = currentObjectId.value;
                self._eventHandlerForSeparatorMode(object, selectAnswer);
            };
        }
    });
};

