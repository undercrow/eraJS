export declare type BaseSave = {
    code: number;
    version: number;
    data: unknown;
};
export declare type GlobalSave = BaseSave & {
    data: Record<string, any>;
};
export declare type GameSave = BaseSave & {
    data: {
        comment: string;
        characters: Record<string, any>[];
        variables: Record<string, any>;
    };
};
export declare const savefile: {
    global: string;
    game: (i: number) => string;
};
