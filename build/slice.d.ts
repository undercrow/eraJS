export default class Slice {
    file: string;
    line: number;
    from: number;
    to: number;
    content: string;
    constructor(file: string, line: number, content: string, from?: number, to?: number);
    slice(from?: number, to?: number): Slice;
    get(): string;
    length(): number;
}
