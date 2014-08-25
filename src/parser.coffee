class ExamObject
	constructor: (syntaxBlock, helpText, id) ->
		@syntaxBlock = syntaxBlock
		@helpText = helpText
		@id = id

class List
	constructor: (items, rightAnswerIndex, syntaxBlock, id, helpText) ->