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
	var result = '<input type="text" id="' + inputObject._id +'" class="examjs-input"></input>';

    if(inputObject.helpText){
        helpTag = '<div id="' + inputObject._helpTagId + '" class="examjs-help-popup" data-help="'+ inputObject.helpText +'">?</div>';
        result += helpTag;
    }

	return '<div class="examjs-block">' + result + '</div>';
};

Translator.prototype._createListBox = function(listObject) {
    'use strict';
    var self = this;
    var helpTag = '';
    var result = '<select id="'+ listObject._id + '" class="examjs-input">';

    listObject.items.forEach(function(item) {
        result += '<option>' + item + '</option>';
    });
    result += '</select>';

    if(listObject.helpText){
        helpTag = '<div id="' + listObject._helpTagId + '" class="examjs-help-popup" data-help="'+ listObject.helpText +'">?</div>';
        result += helpTag;
    }

    return '<div class="examjs-block">' + result + '</div>';
};

Translator.prototype.convertAllObjects = function(objects) {
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
        if (object === null) {
            error = false;
        }
        if(error){
            throw new Error('Converting error. Translator cannot convert object that was passed into it');
        }
    });

    return result;
};
