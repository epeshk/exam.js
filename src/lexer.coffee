LEXER_HELPER = 
    trim: (string) -> 
        if string
            string.replace(/^\s+/, "").replace(/\s+$/, "")

class Item
    constructor: (@value) ->
        @value = LEXER_HELPER.trim(@value)

class InputToken extends Item
class AnswerSeparator extends Item
class ItemsSeparator extends Item
class HelpSeparator extends Item
class StartBlock extends Item
class EndBlock extends Item
class StartSection extends Item
class EndSection extends Item

class Lexer
    constructor: ->
        @tokens =
            ANSWER_SPTR: "::"
            HELP_SPTR: ":?"
            ITEMS_SPTR: ","
            INPUT_TOKEN: "..."
            START_BLOCK_TOKEN: "{{"
            END_BLOCK_TOKEN: "}}"
            START_SECTION_TOKEN: "{--"
            END_SECTION_TOKEN: "--}"

    @::_clearSyntaxBlock = (syntaxBlock) ->
        if syntaxBlock.substring(0, 2) is @tokens.START_BLOCK_TOKEN
            syntaxBlock = syntaxBlock.substring(2)
        if syntaxBlock.substring(syntaxBlock.length - 2) is @tokens.END_BLOCK_TOKEN
            syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2)
        syntaxBlock;

    @::_isEmpty = (string) ->
        LEXER_HELPER.trim(string) is ""

    @::_isPartOfToken = (string) ->
        ((@tokens.ITEMS_SPTR.indexOf(string) isnt -1) or
        (@tokens.ANSWER_SPTR.indexOf(string) isnt -1) or
        (@tokens.HELP_SPTR.indexOf(string) isnt -1) or
        (@tokens.INPUT_TOKEN.indexOf(string) isnt -1))

    @::_isToken = (string) -> 
        string is @tokens.ITEMS_SPTR or
        string is @tokens.ANSWER_SPTR or 
        string is @tokens.HELP_SPTR or
        string is @tokens.INPUT_TOKEN or
        string is @tokens.START_BLOCK_TOKEN or
        string is @tokens.END_BLOCK_TOKEN or
        string is @tokens.START_SECTION_TOKEN or
        string is @tokens.END_SECTION_TOKEN;

    @::parse = (source) ->
        exp = []
        lastToken = ""
        tmpToken = ""

        tryToAddSeparator = (exp, token) =>
            if not @_isEmpty(token)
                if token is @tokens.ITEMS_SPTR
                    exp.push(new ItemsSeparator(token))
                if token is @tokens.ANSWER_SPTR
                    exp.push(new AnswerSeparator(token))
                if token is @tokens.HELP_SPTR
                    exp.push(new HelpSeparator(token))
                if token is @tokens.INPUT_TOKEN
                    exp.push(new InputToken(token))
            return

        for symbol in source
            lastChar = symbol
            if @_isPartOfToken(tmpToken + lastChar)
                tmpToken += lastChar
            else
                if @_isPartOfToken(lastChar)
                    lastToken += tmpToken
                    tmpToken = lastChar
                else
                    lastToken += (tmpToken + lastChar)
                    tmpToken = ""

            if @_isToken(tmpToken)
                if not @_isEmpty(lastToken)
                    exp.push(new Item(lastToken))
                tryToAddSeparator(exp, tmpToken)

                lastToken = ""
                tmpToken = ""

        exp.push(new Item(lastToken))
        exp = exp.filter (e) => e.value?

        {
            expression: exp
            syntaxBlock: source
        }

@Item = Item
@InputToken = InputToken
@AnswerSeparator = AnswerSeparator
@ItemsSeparator = ItemsSeparator
@HelpSeparator = HelpSeparator
@Lexer = Lexer
