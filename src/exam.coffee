class Exam
    constructor: (settings) ->
        @_translator = new Translator();
        @_parser = new Parser(new Lexer());
        @_objects = [];

        @_separateChecking = true;
        @_preprocessor = markdown.toHTML;
        if settings
            if settings.separateChecking?
                if typeof settings.separateChecking is 'boolean'
                    @_separateChecking = settings.separateChecking
                else
                    throw new Error('separateChecking must be a type of boolean')
            if settings.finishBtnID?
                if typeof settings.finishBtnID is 'string'
                    @_finishBtnID = settings.finishBtnID
                else
                    throw new Error('finishBtnID must be a type of string')
            if settings.preprocessor?
                if typeof settings.preprocessor is 'function'
                    @_preprocessor = settings.preprocessor
                else
                    throw new Error('preprocessor must be a type of function')

            @_setCallbacks(settings)

    @::_setCallbacks = (settings) ->
        if settings.separateCheckingEventHandler
            if typeof settings.separateCheckingEventHandler isnt 'function'
                throw new Error('The separateCheckingEventHandler must be a type of function')
            @_separateCheckingEventHandler = settings.separateCheckingEventHandler
        if settings.finishBtnEventHandler
            if typeof settings.finishBtnEventHandler isnt 'function'
                throw new Error('The finishBtnEventHandler must be a type of function')
            @_finishBtnEventHandler = settings.finishBtnEventHandler

    @::parse = (source) ->
        preprocessedSource = @_preprocessor(source)
        @_objects = @_parser.parse(preprocessedSource)
        convertionResults = @_translator.convertAllObjects(@_objects)

        for item in convertionResults
            preprocessedSource = preprocessedSource.replace(item.source, item.result)

        preprocessedSource

    @::_getRightAnswer = (object) ->
        if object instanceof List
            result = object.items[object.rightAnswerIndex]
        else if object instanceof TextInput
            result = object.rightAnswer
        else
            result = object.rightAnswers
        result

    @::_validateCheckBox = (object) ->
        isValid = true
        checkboxes = document.querySelectorAll("##{object.id} .examjs-checkbox")
        values = []
        for checkbox in checkboxes
            if checkbox.checked
                values.push(checkbox.nextSibling.data)
        rightAnswers = @_getRightAnswer(object)
        if rightAnswers.length is values.length           
            for a in rightAnswers
                isValid = isValid && values.indexOf(a) isnt -1
        else
            isValid = false
        isValid


    @::_separateCheckingEventHandler = (object) ->
        elem = document.getElementById(object.id)
        selectedAnswer = elem.value
        rightAnswer = @_getRightAnswer(object)
        if object instanceof CheckBox
            if @_validateCheckBox(object)
                elem.style.color = "#7fe817"
            else
                elem.style.color = "#e42217"
            return

        if selectedAnswer? or rightAnswer?
            if rightAnswer.toLowerCase() is selectedAnswer.toLowerCase()
                elem.style.color = "#7fe817"
            else
                elem.style.color = "#e42217"

    @::getAnswersInformation = ->
        countOfRightAnswers = 0
        result = {
            idOfRightAnswers: [] 
        }

        for object in @_objects
            tmpObjId = document.getElementById(object.id)
            if tmpObjId
                if object instanceof CheckBox
                    if @_validateCheckBox(object)
                        countOfRightAnswers++
                        result.idOfRightAnswers.push(object.id)
                else      
                    rightAnswer = @_getRightAnswer object
                    selectedAnswer = tmpObjId.value

                    if selectedAnswer?.toLowerCase() is rightAnswer?.toLowerCase()
                        countOfRightAnswers++
                        result.idOfRightAnswers.push(object.id)

        result.tests = @_objects.length
        result.rightAnswers = countOfRightAnswers
        result

    @::onAnswer = (tagId, callback) ->
        tags = []
        if tagId instanceof Array
            for tId in tagId
                tags.push(document.getElementById tId)
        else
            tags.push(document.getElementById tagId)

        for tag in tags
            tag.oninput = =>
                info = do @getAnswersInformation
                callback(info.tests, info.rightAnswers)
            tag.onchange = => 
                info = do @getAnswersInformation
                callback(info.tests, info.rightAnswers)

    @::_finishBtnEventHandler = ->
        answersInformation = @getAnswersInformation()
        window.alert("Count of a right answers: #{answersInformation.rightAnswers}/#{asnwersInformation.tests}")

    @::startExam = ->
        self = @;
        self._objects.forEach (object)->
            currentObjectId = document.getElementById(object.id)

            if (object instanceof List or object instanceof TextInput) and self._separateChecking
                currentObjectId.oninput = -> self._separateCheckingEventHandler(object)
            else if (object instanceof CheckBox) and self._separateChecking
                currentObjectId.onchange = -> self._separateCheckingEventHandler(object)
        if self._finishBtnID?
            finishBtn = document.getElementById(self._finishBtnID)
            finishBtn.onclick = -> self._finishBtnEventHandler()

@Exam = Exam