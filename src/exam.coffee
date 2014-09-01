class Exam
    constructor: (settings) ->
        @_translator = new Translator();
        @_parser = new Parser(new Lexer());
        @_objects = [];

        @_separateCheckingMode = true;
        @_preprocessor = markdown.toHTML;

        if settings
            if settings.separateCheckingMode isnt undefined
                if typeof settings.separateCheckingMode is 'boolean'
                    @_separateCheckingMode = settings.separateCheckingMode
                else
                    throw new Error('The separateCheckingMode parameter must be a type of boolean')
                if settings.finishBtnID isnt undefined
                    if typeof settings.finishBtnID is 'string'
                        @_finishBtnID = settings.finishBtnID
                    else
                        throw new Error('The finishBtnID parameter must be a type of string')
                if settings.preprocessor isnt undefined
                    if typeof settings.preprocessor is 'function'
                        @_preprocessor = settings.preprocessor
                    else
                        throw new Error('The preprocessor parameter must be a type of function')

            @_setCallbacks(settings)

        @_setCallbacks = (settings) ->
            if settings.separateCheckingModeEventHandler
                if typeof settings.separateCheckingModeEventHandler isnt 'function'
                    throw new Error('The separateCheckingModeEventHandler must be a type of function')
                @_separateCheckingModeEventHandler = settings.separateCheckingModeEventHandler
            if settings.finishBtnEventHandler
                if typeof settings.finishBtnEventHandler isnt 'function'
                    throw new Error('The finishBtnEventHandler must be a type of function')
                @_finishBtnEventHandler = settings.finishBtnEventHandler
            if settings.helpHintEventHandler
                if typeof settings.helpHintEventHandler isnt 'function'
                    throw new Error('The helpHintEventHandler must be a type of function')
                @_helpHintEventHandler = settings.helpHintEventHandler

        @parse = (source) ->
            preprocessedSource = @_preprocessor(source)
            @_objects = @_parser.parse(preprocessedSource)
            convertionResults = @_translator.convertAllObjects(@_objects)

            for item in convertionResults
                preprocessedSource = preprocessedSource.replace(item.source, item.result)

            preprocessedSource

        @_getRightAnswer = (object) ->
            if object instanceof List
                result = object.items[object.rightAnswerIndex]
            else
                result = object.rightAnswer
            result

        @_separateCheckingModeEventHandler = (object) ->
            currentId = document.getElementById(object.id)
            selectedAnswer = currentId.value
            rightAnswer = @_getRightAnswer(object)

            if selectedAnswer? or rightAnswer?
                if rightAnswer.toLowerCase() is selectedAnswer.toLowerCase()
                    currentId.style.color = "#7fe817"
                else
                    currentId.style.color = "#e42217"









