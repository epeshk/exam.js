(function() {
  var Translator;

  Translator = (function() {
    function Translator() {
      this._createTextInput = function(inputObject) {
        var result;
        result = "<input type='text' id='" + inputObject.id + "' class='examjs-input'></input>";
        if (inputObject.helpText) {
          result += "<div id='" + inputObject._helpTagId + "' class='examjs-help-popup' data-help='" + inputObject.helpText + "'>?</div>";
        }
        return "<div class='examjs-block'>" + result + "</div>";
      };
      this._createListBox = function(listObject) {
        var item, result, _i, _len, _ref;
        result = "<select id='" + listObject.id + "' class='examjs-input'>";
        _ref = listObject.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          result += "<option>" + item + "</option>";
        }
        result += '</select>';
        if (listObject.helpText) {
          result += "<div id='" + listObject._helpTagId + "' class='examjs-help-popup' data-help='" + listObject.helpText + "'>?</div>";
        }
        return "<div class='examjs-block'>" + result + "</div>";
      };
      this.convertAllObjects = function(objects) {
        var object, result, _i, _len;
        result = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          if (object instanceof List) {
            result.push({
              source: object.syntaxBlock,
              result: this._createListBox(object),
              block: 'list'
            });
          } else if (object instanceof TextInput) {
            result.push({
              source: object.syntaxBlock,
              result: this._createTextInput(object),
              block: 'textInput'
            });
          } else {
            throw new Error('Converting error. Translator cannot convert object that was passed into it');
          }
        }
        return result;
      };
    }

    return Translator;

  })();

  this.Translator = Translator;

}).call(this);
