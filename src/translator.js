function Translator() {
    'use strict';
    if (!(this instanceof Translator)) {
        return new Translator();
    }
    var self = this;
}

Translator.prototype._createHint = function (hintObject) {
    'use strict';
    var self = this;
    var result = "<div id='" + hintObject._id + "'>help!?</div>";

    return result;
};

Translator.prototype._createTextInput = function(inputObject){
    'use strict';
	var self = this;
    var helpTag = '';
	var result = '<input type="text" id="' + inputObject._id +'"></input>';

    if(inputObject.helpText){
        helpTag = '<div id="' + 'help_text_' + inputObject._id + '">' + inputObject.helpText + '</div>';
        result += helpTag;
    }

	return '<div>' + result + '</div>';
};

Translator.prototype._createListBox = function(listObject) {
    'use strict';
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
    'use strict';
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
