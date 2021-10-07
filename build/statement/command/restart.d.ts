import Statement from "../index";
export default class Restart extends Statement {
    constructor(arg: string);
    run(): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
