function Translator() {
    'use strict';
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    var self = this;
}

Translator.prototype._createHint = function (hintObject) {
    var self = this;
    var result = "<div id='" + hintObject._id + "'>help!?</div>";

    return result;
};

Translator.prototype._createTextInput = function(inputObject){
	var self = this;
	var result = "<input type=\'text\' id=\'" + inputObject._id +"\'></input>";

	return result;
};

Translator.prototype._createListBox = function(listObject) {
    var self = this;
    var result = '<input list="' + listObject._id + "_data"+'" id="'+listObject._id+'">';
    result += '<datalist id="' + listObject._id + "_data"+'">';

    listObject.items.forEach(function(item) {
        result += '<option value="' + item + '">';
    });
    result += '</datalist>';


    return result;
};

Translator.prototype._convertAllObjects = function(objects) {
    var self = this;
    var result = [];
    var error = true;
    objects.forEach(function(object) {
        if (object instanceof List) {
            result.push({
                source: object.syntaxBlock,
                result: self._createListBox(object),
                block: 'list'
            });
            error = false;
        } 
        if (object instanceof TextInput) {
        	result.push({
        		source: object.syntaxBlock,
        		result: self._createTextInput(object),
                block: 'textInput'
        	});
            error = false;
        }
        if (object instanceof Hint) {
            result.push({
                source: object.syntaxBlock,
                result: self._createHint(object),
                block: 'hint'
            });
            error = false;
        } 
        if (object === null) {
            error = false;
        }
        if(error){
            throw new Error('Converting error. Translator cannot convert object that was passed into it');
        }
    });

    return result;
};
