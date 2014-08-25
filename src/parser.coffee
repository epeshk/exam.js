class ExamObject
    constructor: (syntaxBlock, helpText, id) ->
        @syntaxBlock = syntaxBlock
        @helpText = helpText
        @id = id
        if helpText
            @_helpTagId = "help_#{@id}"

class List extends ExamObject
    constructor: (syntaxBlock, helpText, id, items, rightAnswerIndex) ->
        super(syntaxBlock, helpText, id)
        @items = items
        @rightAnswerIndex = rightAnswerIndex

class TextInput extends ExamObject
    constructor: (syntaxBlock, helpText, id, rightAnswer) ->
        super(syntaxBlock,helpText,id)
        @rightAnswer = rightAnswer