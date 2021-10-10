export type BaseSave = {
	code: number;
	version: number;
	data: unknown;
};

export type GlobalSave = BaseSave & {
	data: Record<string, any>;
};

export type GameSave = BaseSave & {
	data: {
		comment: string;
		characters: Record<string, any>[];
		variables: Record<string, any>;
	};
};

export const savefile = {
	global: "global.sav",
	game: (i: number) => "save" + i.toString().padStart(2, "0") + ".sav",
};
