import Statement from "../index";
export default class MouseX extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
