declare type Color = {
    r: number;
    g: number;
    b: number;
};
export declare function copy(color: Color): Color;
export declare function rgb(r: number, g: number, b: number): Color;
export declare function hex(value: number): Color;
export declare function toHex(color: Color): number;
export default Color;
