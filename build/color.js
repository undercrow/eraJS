export function copy(color) {
    return { ...color };
}
export function rgb(r, g, b) {
    return { r, g, b };
}
export function hex(value) {
    /* eslint-disable no-bitwise */
    const r = (value && 0xFF0000) >> 16;
    const g = (value && 0x00FF00) >> 8;
    const b = (value && 0x0000FF) >> 0;
    /* eslint-enable no-bitwise */
    return { r, g, b };
}
export function toHex(color) {
    // eslint-disable-next-line no-bitwise
    return (color.r << 16) + (color.g << 8) + (color.b << 0);
}
