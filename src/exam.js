function Exam(){
    if(!(this instanceof Exam)){
        return new Exam();    
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
    self._preprocessor = markdown.toHTML;
    self._objects = null;
}


Exam.prototype.parse = function(source, preprocessor){
    var self = this;
    if(typeof preprocessor === 'function'){
        self._preprocessor = preprocessor;
    }else{
        if(typeof preprocessor ==='undefined'){
            self._preprocessor = markdown.toHTML;
        }else{
            throw new Error('The second argument must be a function of parsing');
        }
    }
    var preprocessedSource = self._preprocessor(source);
    var syntaxObjects = self._parser.parse(preprocessedSource, function(objects){
        self._objects = objects;
    });
    var convertionResults = self._translator._convertAllObjects(syntaxObjects);

    convertionResults.forEach(function(item){
        preprocessedSource = preprocessedSource.replace(item.source, item.result);
    });

    return preprocessedSource;
};
