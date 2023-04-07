const Regex = {
	number: /^\d+(\.\d+)?(e[-+]?\d+)?/i,
	id: /^[a-z]\w*/i,
	prefix: /^[-+]/,
	addsub: /^[-+]/,
	muldiv: /^[*\/]/,
};
class Queue {
	constructor(source) {
		this.source = source;
		this.buffer = source;
	}
	index() {
		return this.source.length - this.buffer.length;
	}
	empty() {
		return this.buffer === '';
	}
	match(pattern) {
		if (typeof pattern === 'string') {
			const top = this.buffer.substring(0, pattern.length);
			if (top === pattern) {
				return top;
			}
			return null;
		}
		if (pattern instanceof RegExp) {
			const match = this.buffer.match(pattern)?.[0];
			if (match !== undefined) {
				return match;
			}
			return null;
		}
		throw new Error('Invalid pattern type');
	}
	popSafe(pattern)  {
		const match = this.match(pattern);
		if (match !== null) {
			this.buffer = this.buffer.substring(match.length);
		}
		return match;
	}
	pop(pattern) {
		const match = this.popSafe(pattern);
		if (match === null) {
			throw new Error('Syntax error at ' + (this.index() + 1));
		}
		return match;
	}
}
export class ExprSolver {
	constructor(source) {
		this.queue = new Queue(source);
	}
	solveNumber() {
		return Number(this.queue.pop(Regex.number));
	}
	solveItem() {
		if (this.queue.popSafe('(') !== null) {
			const val = this.solveExpr();
			this.queue.pop(')');
			return val;
		}
		return this.solveNumber();
	}
	solvePrefixedItem() {
		const prefix = this.queue.popSafe(Regex.prefix);
		if (prefix === '+') return + this.solveItem();
		if (prefix === '-') return - this.solveItem();
		return this.solveItem();
	}
	solvePowExpr() {
		let res = this.solveItem();
		while (this.queue.popSafe('^') !== null) {
			res = Math.pow(res, this.solvePrefixedItem());
		}
		return res;
	}
	solvePrefixedPowExpr() {
		const prefix = this.queue.popSafe(Regex.prefix);
		if (prefix === '+') return + this.solvePowExpr();
		if (prefix === '-') return - this.solvePowExpr();
		return this.solvePowExpr();
	}
	solveMulDivExpr() {
		let val = this.solvePowExpr();
		for (;;) {
			const op = this.queue.popSafe(Regex.muldiv);
			if (op === null) break;
			if (op === '*') val *= this.solvePrefixedPowExpr();
			if (op === '/') val /= this.solvePrefixedPowExpr();
		}
		return val;
	}
	solveAddSubExpr() {
		let val = 0;
		let prefix = this.queue.popSafe(Regex.prefix);
		if (prefix === null) val = this.solveMulDivExpr();
		if (prefix === '+') val += this.solveMulDivExpr();
		if (prefix === '-') val -= this.solveMulDivExpr();
		for (;;) {
			const op = this.queue.popSafe(Regex.addsub);
			if (op === null) break;
			if (op === '+') val += this.solveMulDivExpr();
			if (op === '-') val -= this.solveMulDivExpr();
		}
		return val;
	}
	solveExpr() {
		return this.solveAddSubExpr();
	}
	run() {
		const val = this.solveExpr();
		if (!this.queue.empty()) {
			return 
		}
		return val;
	}
}
