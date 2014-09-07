class Translator
    @::_createTextInput = (inputObject) ->
        result = "<input type='text' id='#{inputObject.id}' class='examjs-input'></input>"
        if inputObject.helpText
            result += "<div id='#{inputObject._helpTagId}' class='examjs-help-popup' data-help='#{inputObject.helpText}'>?</div>"

        "<div class='examjs-block'>#{result}</div>"

    @::_createListBox = (listObject) ->
        result = "<select id='#{listObject.id}' class='examjs-input'>"

        for item in listObject.items
            result += "<option>#{item}</option>"
        result += '</select>'

        if listObject.helpText
            result += "<div id='#{listObject._helpTagId}' class='examjs-help-popup' data-help='#{listObject.helpText}'>?</div>"

        "<div class='examjs-block'>#{result}</div>"

    @::_createCheckBox = (checkBoxObject) ->
        result = "<ul id='#{checkBoxObject.id}' class='examjs-input'>"

        for item in checkBoxObject.items
            result += "<li><input type='checkbox'>#{item}</input></li>"

        if checkBoxObject.helpText
            result += "<div id='#{checkBoxObject._helpTagId}' class='examjs-help-popup' data-help='#{checkBoxObject.helpText}'>?</div>"

        result += "</ul>"
        "<div class='examjs-block'>#{result}</div>"

    @::convertAllObjects = (objects) ->
        result = []

        for object in objects
            if (object instanceof List)
                result.push {
                    source: object.syntaxBlock
                    result: @_createListBox(object)
                    block: 'list'
                }
            else if (object instanceof TextInput)
                result.push {
                    source: object.syntaxBlock,
                    result: @_createTextInput(object),
                    block: 'textInput'
                }
            else if (object instanceof CheckBox)
                result.push {
                    source: object.syntaxBlock,
                    result: @_createCheckBox(object),
                    block: 'checkBox'
                }
            else
                throw new Error('Converting error. Translator cannot convert object that was passed into it')

        result

@Translator = Translator