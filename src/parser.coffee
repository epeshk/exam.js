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

        @_createTextInput = (expressionObj, syntaxBlock) ->
            id = @_getNextID()
            new TextInput(syntaxBlock, expressionObj.helpText, id, expressionObj.answers[0])

        @_parseSyntaxBlocks = (text) ->
            regexp = new RegExp(@_patterns.blockPattern)
            text.match(regexp)

        @_extractObjects = (expressions) ->
            result = []

            if expressions isnt null
                for exp in expressions
                    tmpObj = @_parseExpression(exp.expression)
                    if tmpObj.hasInputToken
                        result.push(@_createTextInput(tmpObj, exp.syntaxBlock))
                    else
                        result.push(@_createList(tmpObj, exp.syntaxBlock))

            result

        @_parseExpression = (expression) ->
            result = {
                items: []
                answers: []
                hasInputToken: false
            }
            lastSeparator = null

            for token in expression
                if not (token instanceof ItemsSeparator)
                    switch
                        when token instanceof InputToken then result.hasInputToken = true
                        when token instanceof AnswerSeparator then lastSeparator = token
                        when token instanceof HelpSeparator then lastSeparator = token
                        when token instanceof Item and lastSeparator is null then result.items.push(token.value)
                        when token instanceof Item and lastSeparator instanceof AnswerSeparator then result.answers.push(token.value)
                        when token instanceof Item and lastSeparator instanceof HelpSeparator then result.helpText = token.value
                        else null
            result

        @parse = (text) ->
            if typeof text isnt 'string'
                throw new Error('Parser Error: into the parse() method was passed not a string parameter');

            syntaxBlocks = @_parseSyntaxBlocks text
            expressions = []

            if syntaxBlocks
                for block in syntaxBlocks
                    expressions.push(@lexer.parse(block))

            @_extractObjects(expressions)

@Parser = Parser
@List = List
@TextInput = TextInput
@CheckBox = CheckBox