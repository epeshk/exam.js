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
        
class CheckBox extends ExamObject
    constructor: (syntaxBlock, helpText, id, items, rightAnswerIndex) ->
        super(syntaxBlock, helpText, id)
        @items = items
        @rightAnswerIndex = rightAnswerIndex

class Parser
    constructor: (lexer) ->
        @_patterns =
            blockPattern: /\{\{(.|\n)*?\}\}/g
            emptyBlock: '{{}}'
        @_currentID = 0
        @lexer = lexer

        @_trim = (text) ->
            whiteSpacesPattern = /(?:(?:^|\n)\s+|\s+(?:$|\n))/g
            text.replace(whiteSpacesPattern, '').replace(/\s+/g,' ')

        @_getNextID = ->
            "examjsid_#{++@._currentID}"

        @_indexOfRightAnswer = (items, answer) ->
            result = -1

            if answer
                for item in items
                    if @_trim(item.toLowerCase()) is @_trim(answer.toLowerCase())
                        result = items.indexOf item

            result

        @_createList = (expressionObj, syntaxBlock) ->
            rightAnswerIndex = @_indexOfRightAnswer(expressionObj.items, expressionObj.answers[0])
            id = @_getNextID()

            new List(syntaxBlock, expressionObj.helpText, id, expressionObj.items, rightAnswerIndex)







            