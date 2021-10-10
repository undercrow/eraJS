import Statement from "../index";
export default class Begin extends Statement {
    target: string;
    constructor(arg: string);
    run(): Generator<never, {
        readonly type: "begin";
        readonly keyword: string;
    }, unknown>;
}
