export declare function cond(value: boolean, message: string): asserts value;
export declare function nonNull<T>(value: T, message: string): asserts value is NonNullable<T>;
export declare function number(value: any, message: string): asserts value is number;
export declare function string(value: any, message: string): asserts value is string;
export declare function array(value: any, message: string): asserts value is any[];
export declare function numArray(value: any, message: string): asserts value is number[];
export declare function strArray(value: any, message: string): asserts value is string[];
export declare function numArray2D(value: any, message: string): asserts value is number[][];
export declare function numArray3D(value: any, message: string): asserts value is number[][][];
