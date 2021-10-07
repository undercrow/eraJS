import P from "parsimmon";
export default class Lazy<T> {
    parser: P.Parser<T>;
    raw: string;
    isCompiled: boolean;
    cache?: T;
    constructor(raw: string, parser: P.Parser<T>);
    get(): T;
}
