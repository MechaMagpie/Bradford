class LexToken {
	constructor(start, end, text) {
		this.start = start; this.end = end; this.text = text
	}
}

function addX(regex) {
	return function(src, i, dest) {
		regex.lastIndex = i
		let m = src.match(regex)
		if (m) {
			let j = regex.lastIndex
			dest.push(
				new LexToken(i, j, m[0]))
			return j
		} else return false
	}
}

const num = /-?[0-9]+/y
const str = /".*"/y
const id  = /[A-z][A-z0-9]*/y
const ws  = /\s/y

const addNum = addX(num)
const addStr = addX(str)
const addId  = addX(id)

const ws = /\s/y
function eatWs(src, i) {
	ws.lastIndex = i
	if (src.match(ws))
		return i+1
	else
		return false
}

const addTokens = [addNum, addStr, addId, eatWs]
export function lexSource(src) {
	let i = 0
	let dest = []
	lexLoop: while (i < src.length)
		for(let fun of addTokens) {
			let r = fun(src, i, dest)
			if (r) {
				i = r
				continue lexLoop
			}
		}	
	return dest
}
