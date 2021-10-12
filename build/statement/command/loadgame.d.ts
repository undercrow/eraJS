import Statement from "../index";
export default class LoadGame extends Statement {
    constructor(arg: string);
    run(): ReturnType<Statement["run"]>;
}
