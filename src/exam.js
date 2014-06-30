function Exam(){
    if(!(this instanceof Exam)){
        return new Exam();    
    }
    var self = this;
    self._translator = new Translator();
    self._parser = new Parser();
}

Exam.prototype.parse = function(source){
    var self = this;
    var syntaxObjects = self._parser.parse(source);
    var convertionResults = self._translator._convertAllObjects(syntaxObjects);

    convertionResults.forEach(function(item){
        source = source.replace(item.source, item.result);
    });

    return source;
};
