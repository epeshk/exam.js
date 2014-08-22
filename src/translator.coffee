class Translator
    constructor: ->

        @::_createTextInput = (inputObject) ->
            result = "<input type='text' id='#{inputObject.id}' class='examjs-input'></input>"
            if inputObject.helpText
                result += "<div id'#{inputObject._helpTagId}' class='examjs-help-popup' data-help='#{inputObject.helpText}'>?</div>"

            result

        @::_createListBox = (listObject) ->


@Translator = Translator