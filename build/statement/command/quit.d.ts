import Statement from "../index";
export default class Quit extends Statement {
    constructor(arg: string);
    run(): Generator<never, {
        readonly type: "quit";
    }, unknown>;
}
