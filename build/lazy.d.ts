import P from "parsimmon";
import Slice from "./slice";
export default class Lazy<T> {
    raw: Slice;
    parser: P.Parser<T>;
    isCompiled: boolean;
    cache?: T;
    constructor(raw: Slice, parser: P.Parser<T>);
    get(): T;
}
