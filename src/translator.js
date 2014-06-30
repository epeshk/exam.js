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

Translator.prototype._createListBox = function(listObject){
    var self = this;
    var id = self._getNextID();
    var result = '<input list="' + id + '">';
    result += '<datalist id="' + id + '">';

    listObject.items.forEach(function(item){
        result += '<option value="' + item + '">';
    }); 
    result += '</datalist>';

    return result;
};

Translator.prototype._convertAllObjects = function(objects){
    var self = this;
    var result = [];
    objects.forEach(function(object){
        
    });
};
