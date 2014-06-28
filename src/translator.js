function Translator(){
    'use strict';
    if(!(this instanceof Translator)){
        return new Translator();
    }
    var self = this;
    self._currentID = 0;
}

Translator.prototype._getNextID = function(){
    var self = this;
    return 'examjs_id_' + (++self._currentID); 
};

Translator.prototype._createListBox = function(listObject, id){

};
