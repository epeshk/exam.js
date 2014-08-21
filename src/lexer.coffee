LEXER_HELPER = 
    trim: (string) -> 
        string.replace(/^\s+/, '').replace(/\s+$/, '')

class Lexer
    @tokens =
        ANSWER_SPTR: "::"
        HELP_SPTR: ":?"
        ITEMS_SPTR: ","
        INPUT_TOKEN: "..."
        START_BLOCK_TOKEN: "{{"
        END_BLOCK_TOKEN: "}}"
        START_CHECKBOX_TOKEN: "|"
        END_CHECKBOX_TOKEN: "|"

    @::_clearSyntaxBlock = (syntaxBlock) ->
        if syntaxBlock.substring(0, 2) is self.tokens.START_BLOCK_TOKEN
            syntaxBlock = syntaxBlock.substring(2)
        if syntaxBlock.substring(syntaxBlock.length - 2) is self.tokens.END_BLOCK_TOKEN
            syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2)
        syntaxBlock;

    @::_isEmpty = (string) ->
        LEXER_HELPER.trim(string) is ''

    @::_isPartOfToken = (string) ->
        ((self.tokens.ITEMS_SPTR.indexOf(string) isnt -1) or
        (self.tokens.ANSWER_SPTR.indexOf(string) isnt -1) or
        (self.tokens.HELP_SPTR.indexOf(string) isnt -1) or
        (self.tokens.INPUT_TOKEN.indexOf(string) isnt -1))

    @::_isToken = (string) -> 

    @::parse = (syntaxBlock) ->



class Item
    constructor: (@value) ->
        @value = LEXER_HELPER.trim(@value)

class InputToken extends Item
class AnswerSeparator extends Item
class ItemsSeparator extends Item
class HelpSeparator extends Item


@InputToken = InputToken
@AnswerSeparator = AnswerSeparator
@ItemsSeparator = ItemsSeparator
@HelpSeparator = @HelpSeparator
@Lexer = Lexer

