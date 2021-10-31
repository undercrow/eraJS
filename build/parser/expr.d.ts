import P from "parsimmon";
import Expr from "../statement/expr";
import Form from "../statement/expr/form";
import Variable from "../statement/expr/variable";
export declare const variable: P.Parser<Variable>;
export declare const expr: P.Parser<Expr>;
export declare const form: {
    "": P.Parser<Form>;
    "#": P.Parser<Form>;
    ",": P.Parser<Form>;
    "\"": P.Parser<Form>;
    "(": P.Parser<Form>;
    "(,": P.Parser<Form>;
};
