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

class Lexer
    @::tokens =
        ANSWER_SPTR: "::"
        HELP_SPTR: ":?"
        ITEMS_SPTR: ","
        INPUT_TOKEN: "..."
        START_BLOCK_TOKEN: "{{"
        END_BLOCK_TOKEN: "}}"
        START_CHECKBOX_TOKEN: "|"
        END_CHECKBOX_TOKEN: "|"

Lexer::_clearSyntaxBlock = (syntaxBlock) ->
    self = this
    if syntaxBlock.substring(0, 2) is self.tokens.START_BLOCK_TOKEN
        syntaxBlock = syntaxBlock.substring(2)
    if syntaxBlock.substring(syntaxBlock.length - 2) is self.tokens.END_BLOCK_TOKEN
        syntaxBlock = syntaxBlock.substring(0, syntaxBlock.length - 2)
    syntaxBlock;

Lexer::_isEmpty = (string) ->
    LEXER_HELPER.trim(string) is ""

Lexer::_isPartOfToken = (string) ->
    self = this
    ((self.tokens.ITEMS_SPTR.indexOf(string) isnt -1) or
    (self.tokens.ANSWER_SPTR.indexOf(string) isnt -1) or
    (self.tokens.HELP_SPTR.indexOf(string) isnt -1) or
    (self.tokens.INPUT_TOKEN.indexOf(string) isnt -1))

Lexer::_isToken = (string) -> 
    self = this
    string is self.tokens.ITEMS_SPTR or
    string is self.tokens.ANSWER_SPTR or 
    string is self.tokens.HELP_SPTR or
    string is self.tokens.INPUT_TOKEN;

Lexer::parse = (syntaxBlock) ->
    self = this
    syntaxBlock = self._clearSyntaxBlock(syntaxBlock);
    expression = []
    lastToken = ""
    tmpToken = ""
    source = syntaxBlock

    tryToAddSeparator = (expression, token) ->
        if not self._isEmpty(token)
            if token is self.tokens.ITEMS_SPTR
                expression.push(new ItemsSeparator(token))
            if token is self.tokens.ANSWER_SPTR
                expression.push(new AnswerSeparator(token))
            if token is self.tokens.HELP_SPTR
                expression.push(new HelpSeparator(token))
            if token is self.tokens.INPUT_TOKEN
                expression.push(new InputToken(token))


    for i in syntaxBlock.length
        lastChar = syntaxBlock[i]
        if self._isPartOfToken(tmpToken + lastChar)
            tmpToken += lastChar
        else
            if self._isPartOfToken(lastChar)
                lastToken += tmpToken
                tmpToken = lastChar
            else
                lastToken += (tmpToken + lastChar);
                tmpToken = "";

        if self._isToken(tmpToken)
            if not self._isEmpty(lastToken)
                expression.push(new Item(lastToken))
            tryToAddSeparator(expression, tmpToken)

            lastToken = "";
            tmpToken = ""

    expression.push(new Item(lastToken))

    {
        expression: expression,
        syntaxBlock: source
    }

@Item = Item
@InputToken = InputToken
@AnswerSeparator = AnswerSeparator
@ItemsSeparator = ItemsSeparator
@HelpSeparator = HelpSeparator
@Lexer = Lexer

