class Exam
	constructor: (settings) ->
		@_translator = new Translator();
		@_parser = new Parser(new Lexer());
		@_objects = [];

		@_separateCheckingMode = true;
		@_preprocessor = markdown.toHTML;

		