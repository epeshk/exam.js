class Translator
    constructor: ->

        @::_createTextInput = (inputObject) ->
            helpTag = ""
            result = "<input type='text' id='#{inputObject.id}' class='examjs-input'></input>"
            if inputObject.helpText
                helpTag = "<div id'#{inputObject._helpTagId}' class='examjs-help-popup' data-help='#{inputObject.helpText}'>?</div>"
                result += helpTag

            result

@Translator = Translator