export function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
export function assertNumber(value, message) {
    assert(typeof value === "number" && !isNaN(value), message);
}
export function assertString(value, message) {
    assert(typeof value === "string", message);
}
