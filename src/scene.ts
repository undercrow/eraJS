import parseERB from "./erb/erb";

function parseThunk(lines: string[]) {
	return parseERB("@FN\n" + lines.join("\n"))[0].thunk;
}

export const TITLE = parseThunk(["CALL SYSTEM_TITLE"]);

export const FIRST = parseThunk(["CALL EVENTFIRST"]);

export const SHOP = parseThunk([
	"TRYCALL EVENTSHOP",
	"WHILE 1",
	"	CALL SHOW_SHOP",
	"	INPUT",
	"	CALL USERSHOP",
	"WEND",
]);

export const TRAIN = parseThunk([
	"ASSIPLAY = 0",
	"PREVCOM = -1",
	"NEXTCOM = -1",
	"VARSET TFLAG, 0",
	"REPEAT CHARANUM",
	"	VARSET GOTJUEL:COUNT, 0",
	"	VARSET TEQUIP:COUNT, 0",
	"	VARSET EX:COUNT, 0",
	"	VARSET PALAM:COUNT, 0",
	"	VARSET SOURCE:COUNT, 0",
	"	VARSET STAIN:COUNT, 0",
	"	STAIN:COUNT:2 = 2",
	"	STAIN:COUNT:3 = 1",
	"	STAIN:COUNT:4 = 8",
	"REND",
	"TRYCALL EVENTTRAIN",
	"WHILE 1",
	"	IF NEXTCOM < 0",
	"		CALL SHOW_STATUS",
	"		REPEAT 1000",
	'			SIF TRAINNAME:COUNT == ""',
	"				BREAK",
	"			RESULT = 1",
	"			TRYCALLFORM COM_ABLE{COUNT}",
	"			SIF RESULT",
	"				PRINTFORMC %TRAINNAME:COUNT%[{COUNT}]",
	"		REND",
	"		CALL SHOW_USERCOM",
	"		VARSET UP, 0",
	"		VARSET DOWN, 0",
	"		VARSET LOSEBASE, 0",
	"		INPUT",
	"		COM = RESULT",
	"		RESULT = 1",
	"		TRYCALLFORM COM_ABLE{COM}",
	"		IF RESULT == 0",
	"			CALL USERCOM",
	"			CONTINUE",
	"		ENDIF",
	"	ENDIF",
	"	REPEAT CHARANUM",
	"		VARSET NOWEX:COUNT, 0",
	"	REND",
	"	TRYCALL EVENTCOM",
	"	CALLFORM COM{COM}",
	"	IF RESULT != 0",
	"		CALL SOURCE_CHECK",
	"		SOURCE = 0",
	"		TRYCALL EVENTCOMEND",
	"	ENDIF",
	"WEND",
]);
