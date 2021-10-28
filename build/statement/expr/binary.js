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
                if (typeof left === "number" && left === 0) {
                    return 0;
                }
                break;
            case "!&":
                if (typeof left === "number" && left === 0) {
                    return 1;
                }
                break;
            case "||":
                if (typeof left === "number" && left === 1) {
                    return 1;
                }
                break;
            case "!|":
                if (typeof left === "number" && left === 1) {
                    return 0;
                }
                break;
            default: { /* Do nothing */ }
        }
        const right = await this.right.reduce(vm);
        if (typeof left === "number" && typeof right === "number") {
            switch (this.op) {
                case "*": return left * right;
                case "/": return Math.floor(left / right);
                case "%": return left % right;
                case "+": return left + right;
                case "-": return left - right;
                // eslint-disable-next-line no-bitwise
                case "<<": return left << right;
                // eslint-disable-next-line no-bitwise
                case ">>": return left >> right;
                case "<": return left < right ? 1 : 0;
                case "<=": return left <= right ? 1 : 0;
                case ">": return left > right ? 1 : 0;
                case ">=": return left >= right ? 1 : 0;
                case "==": return left === right ? 1 : 0;
                case "!=": return left !== right ? 1 : 0;
                // eslint-disable-next-line no-bitwise
                case "&": return left & right;
                // eslint-disable-next-line no-bitwise
                case "|": return left | right;
                // eslint-disable-next-line no-bitwise
                case "^": return left ^ right;
                case "&&": return left !== 0 && right !== 0 ? 1 : 0;
                case "!&": return !(left !== 0 && right !== 0) ? 1 : 0;
                case "||": return left !== 0 || right !== 0 ? 1 : 0;
                case "!|": return !(left !== 0 || right !== 0) ? 1 : 0;
                case "^^": return (left !== 0) !== (right !== 0) ? 1 : 0;
            }
        }
        else if (typeof left === "string" && typeof right === "string") {
            switch (this.op) {
                case "+": return left + right;
                case "<": return left < right ? 1 : 0;
                case "<=": return left <= right ? 1 : 0;
                case ">": return left > right ? 1 : 0;
                case ">=": return left >= right ? 1 : 0;
                case "==": return left === right ? 1 : 0;
                case "!=": return left !== right ? 1 : 0;
                default: { /* Do nothing */ }
            }
        }
        else if (typeof left === "string" && typeof right === "number") {
            switch (this.op) {
                case "*": return left.repeat(right);
                default: { /* Do nothing */ }
            }
        }
        throw new Error(`Type of operands for ${this.op} is invalid`);
    }
}
