export default class Binary {
    left;
    right;
    op;
    constructor(op, left, right) {
        this.op = op;
        this.left = left;
        this.right = right;
    }
    async reduce(vm) {
        const left = await this.left.reduce(vm);
        switch (this.op) {
            case "&&":
                if (typeof left === "bigint" && left === 0n) {
                    return 0n;
                }
                break;
            case "!&":
                if (typeof left === "bigint" && left === 0n) {
                    return 1n;
                }
                break;
            case "||":
                if (typeof left === "bigint" && left === 1n) {
                    return 1n;
                }
                break;
            case "!|":
                if (typeof left === "bigint" && left === 1n) {
                    return 0n;
                }
                break;
            default: { /* Do nothing */ }
        }
        const right = await this.right.reduce(vm);
        if (typeof left === "bigint" && typeof right === "bigint") {
            switch (this.op) {
                case "*": return left * right;
                case "/": return left / right;
                case "%": return left % right;
                case "+": return left + right;
                case "-": return left - right;
                // eslint-disable-next-line no-bitwise
                case "<<": return left << right;
                // eslint-disable-next-line no-bitwise
                case ">>": return left >> right;
                case "<": return left < right ? 1n : 0n;
                case "<=": return left <= right ? 1n : 0n;
                case ">": return left > right ? 1n : 0n;
                case ">=": return left >= right ? 1n : 0n;
                case "==": return left === right ? 1n : 0n;
                case "!=": return left !== right ? 1n : 0n;
                // eslint-disable-next-line no-bitwise
                case "&": return left & right;
                // eslint-disable-next-line no-bitwise
                case "|": return left | right;
                // eslint-disable-next-line no-bitwise
                case "^": return left ^ right;
                case "&&": return left !== 0n && right !== 0n ? 1n : 0n;
                case "!&": return !(left !== 0n && right !== 0n) ? 1n : 0n;
                case "||": return left !== 0n || right !== 0n ? 1n : 0n;
                case "!|": return !(left !== 0n || right !== 0n) ? 1n : 0n;
                case "^^": return (left !== 0n) !== (right !== 0n) ? 1n : 0n;
            }
        }
        else if (typeof left === "string" && typeof right === "string") {
            switch (this.op) {
                case "+": return left + right;
                case "<": return left < right ? 1n : 0n;
                case "<=": return left <= right ? 1n : 0n;
                case ">": return left > right ? 1n : 0n;
                case ">=": return left >= right ? 1n : 0n;
                case "==": return left === right ? 1n : 0n;
                case "!=": return left !== right ? 1n : 0n;
                default: { /* Do nothing */ }
            }
        }
        else if (typeof left === "string" && typeof right === "bigint") {
            switch (this.op) {
                case "*": return left.repeat(Number(right));
                default: { /* Do nothing */ }
            }
        }
        throw new Error(`Type of operands for ${this.op} is invalid`);
    }
}
