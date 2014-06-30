function Exam(){
    if(!(this instanceof Exam)){
        return new Exam();    
    }
    var self = this,
        translator = new Translator(),
        parser = new Parser();
    
}

Exam.prototype.convert = function(source){

};
