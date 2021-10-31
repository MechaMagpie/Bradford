class Ident extends Node {}
const parseIdent = singleReg(Ident, /[A-z][A-z0-9]*/)

class String extends Node {}
const parseString = singleReg(/".*"/)

class Number extends Node {}
const parseNumber = singleReg(/-?[0-9]+/)

class Builtin extends Node {}
const parseBuiltin =
	  singleReg(Builtin, new Regexp(String.raw`
/(acc)|(accn)|(push)|(pop)|(rot)|(ptrd)|(ptwt)|(add)|(sub)|(print)
|(jmp)/
`.replace(/\s/g, ''))

class Invocation extends Node {}
const parseInvocation = sequence(Invocation, ["name", parseIdent])

class Expression extends Node {}
const parseExpression = disjunction(parseBuiltin, parseInvocation,
									parseNumber, parseString)

class Declaration extends Node {}
const parseDeclaration
	  = sequence(Declaration, "def", [name, parseIdent], "as",
				 [body, indefList(parseExpression)])

const parseStatement =
	  sequence(Statement, ["expressions", indefList(parseExpression)])

const parseLine = disjunction(parseDeclaration, parseStatement)

class Program extends Node {}
const parseProgram =
	  sequence(Program, ["lines", indefList(parseLine)])
