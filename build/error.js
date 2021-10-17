export var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["Parser"] = 0] = "Parser";
    ErrorType[ErrorType["NotFound"] = 1] = "NotFound";
    ErrorType[ErrorType["InvalidIndex"] = 2] = "InvalidIndex";
    ErrorType[ErrorType["NotImpl"] = 3] = "NotImpl";
    ErrorType[ErrorType["Internal"] = 4] = "Internal";
})(ErrorType || (ErrorType = {}));
export default class EraJSError extends Error {
    line;
    trace;
    constructor(message, line, trace) {
        super(message);
        this.line = line;
        this.trace = trace;
    }
}
export function parser(message) {
    return new Error(`Parser error found: ${message}`);
}
export function notFound(type, name) {
    return new Error(`${type} ${name} does not exist`);
}
export function invalidIndex(type, name, index) {
    return new Error(`${type} variable ${name} cannot be indexed by [${index.join(",")}]`);
}
export function notImpl(target) {
    return new Error(`${target} is not implemented yet`);
}
export function internal(message) {
    return new Error(`Unexpected internal error found: ${message}`);
}
