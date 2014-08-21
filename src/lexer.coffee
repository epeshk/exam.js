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

    @parse = (syntaxBlock) ->



class Item
    constructor: (@value) ->

class InputToken extends Item
class AnswerSeparator extends Item
class ItemsSeparator extends Item
class HelpSeparator extends Item


@InputToken = InputToken
@AnswerSeparator = AnswerSeparator
@ItemsSeparator = ItemsSeparator
@HelpSeparator = @HelpSeparator
@Lexer = Lexer

