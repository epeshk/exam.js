function Exam(){
    if(!(this instanceof Exam)){
        return new Exam();    
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._preprocessor = null;
}

Exam.prototype.setPreprocessor = function(newPreprocessor){
    var self = this;
    self._preprocessor = newPreprocessor;
};

Exam.prototype.parse = function(source){
    var self = this;
    var preprocessedSource;

    if(self._preprocessor !== null){
        preprocessedSource = self._preprocessor(source);
    }else{
        preprocessedSource = source;
    }
    var syntaxObjects = self._parser.parse(preprocessedSource);
    var convertionResults = self._translator._convertAllObjects(syntaxObjects);

    convertionResults.forEach(function(item){
        preprocessedSource = preprocessedSource.replace(item.source, item.result);
    });

    return preprocessedSource;
};
