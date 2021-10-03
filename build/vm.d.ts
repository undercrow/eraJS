import Character from "./character";
import type Config from "./config";
import type Color from "./color";
import { Template, Data } from "./data";
import Fn from "./fn";
import type Property from "./property";
import Define from "./property/define";
import PRNG from "./random";
import type { default as Statement } from "./statement";
import type { Align } from "./statement/command/alignment";
import Value from "./value";
declare type Context = {
    fn: Fn;
    dynamicMap: Map<string, Value>;
    refMap: Map<string, string>;
};
export default class VM {
    random: PRNG;
    code: {
        header: Property[];
        fnList: Fn[];
        data: Data;
    };
    DEFAULT_STORAGE: Record<string, string>;
    storage: {
        get: (key: string) => string | undefined;
        set: (key: string, value: string) => void;
        del: (key: string) => void;
    };
    eventMap: Map<string, Fn[]>;
    fnMap: Map<string, Fn>;
    macroMap: Map<string, Define>;
    templateMap: Map<number, Template>;
    globalMap: Map<string, Value>;
    staticMap: Map<string, Map<string, Value>>;
    characterList: Array<Character>;
    private contextStack;
    alignment: Align;
    draw: boolean;
    skipDisp: boolean;
    font: {
        name: string;
        bold: boolean;
        italic: boolean;
        strike: boolean;
        underline: boolean;
    };
    color: {
        defaultFront: Color;
        defaultBack: Color;
        front: Color;
        back: Color;
        focus: Color;
    };
    printCPerLine: number;
    constructor(code: VM["code"], storage?: VM["storage"]);
    reset(): void;
    configure(config: Config): void;
    context(): Context;
    pushContext(fn: Fn): Context;
    popContext(): void;
    getValue<T extends Value>(name: string, scope?: string): T;
    start(): ReturnType<Statement["run"]>;
}
export {};
