export function cond(value, message) {
    if (!value) {
        throw new Error(message);
    }
}
export function nonNull(value, message) {
    cond(value != null, message);
}
export function bigint(value, message) {
    cond(typeof value === "bigint", message);
}
export function number(value, message) {
    cond(typeof value === "number" && !isNaN(value), message);
}
export function numeric(value, message) {
    cond(typeof value === "bigint" || (typeof value === "number" && !isNaN(value)), message);
}
export function string(value, message) {
    cond(typeof value === "string", message);
}
export function array(value, message) {
    cond(Array.isArray(value), message);
}
export function bigintArray(value, message) {
    array(value, message);
    for (let i = 0; i < value.length; ++i) {
        bigint(value[i], message);
    }
}
export function numArray(value, message) {
    array(value, message);
    for (let i = 0; i < value.length; ++i) {
        number(value[i], message);
    }
}
export function strArray(value, message) {
    cond(Array.isArray(value), message);
    for (let i = 0; i < value.length; ++i) {
        string(value[i], message);
    }
}
export function numArray2D(value, message) {
    array(value, message);
    for (let i = 0; i < value.length; ++i) {
        numArray(value[i], message);
    }
}
export function strArray2D(value, message) {
    array(value, message);
    for (let i = 0; i < value.length; ++i) {
        strArray(value[i], message);
    }
}
export function numArray3D(value, message) {
    array(value, message);
    for (let i = 0; i < value.length; ++i) {
        numArray2D(value[i], message);
    }
}
export function strArray3D(value, message) {
    array(value, message);
    for (let i = 0; i < value.length; ++i) {
        strArray2D(value[i], message);
    }
}
