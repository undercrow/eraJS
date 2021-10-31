import Value from "./value";
declare type ValueDefinition = [
    string,
    (new (name: string, size?: number[]) => Value<any>),
    number[]?,
    string[]?
];
declare const valueList: ValueDefinition[];
export default valueList;
