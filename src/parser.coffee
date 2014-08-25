class ExamObject
	constructor: (syntaxBlock, helpText, id) ->
		@syntaxBlock = syntaxBlock
		@helpText = helpText
		@id = id

class List extends ExamObject
	constructor: (syntaxBlock, helpText, id, items, rightAnswerIndex) ->
		super(syntaxBlock, helpText, id)
		@items = items
		@rightAnswerIndex = rightAnswerIndex
		if helpText
			@_helpTagId = "help_#{@id}"
