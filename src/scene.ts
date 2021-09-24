import parseERB from "./erb/erb";

function parseThunk(lines: string[]) {
	return parseERB("@FN\n" + lines.join("\n"), new Set())[0].thunk;
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
	"CTRAIN_COUNT = 0",
	"WHILE 1",
	"	CTRAIN_COUNT -= 1",
	"	ARRAYSHIFT SELECTCOM, -1, 0",
	"	IF NEXTCOM < 0",
	"		SIF CTRAIN_COUNT > 0",
	"			SKIPDISP 1",
	"		CALL SHOW_STATUS",
	"		IF CTRAIN_COUNT <= 0",
	"			REPEAT 1000",
	'				SIF TRAINNAME:COUNT == ""',
	"					BREAK",
	"				RESULT = 1",
	"				TRYCALLFORM COM_ABLE{COUNT}",
	"				SIF RESULT",
	"					PRINTFORMC %TRAINNAME:COUNT%[{COUNT}]",
	"			REND",
	"		ENDIF",
	"		CALL SHOW_USERCOM",
	"		VARSET UP, 0",
	"		VARSET DOWN, 0",
	"		VARSET LOSEBASE, 0",
	"		IF CTRAIN_COUNT <= 0",
	"			INPUT",
	"			SELECTCOM = RESULT",
	"		ENDIF",
	"		RESULT = 1",
	"		TRYCALLFORM COM_ABLE{SELECTCOM}",
	"		IF RESULT == 0",
	"			CALL USERCOM",
	"			CONTINUE",
	"		ENDIF",
	"	ENDIF",
	"	REPEAT CHARANUM",
	"		VARSET NOWEX:COUNT, 0",
	"	REND",
	"	TRYCALL EVENTCOM",
	"	CALLFORM COM{SELECTCOM:0}",
	"	IF RESULT != 0",
	"		CALL SOURCE_CHECK",
	"		SOURCE = 0",
	"		TRYCALL EVENTCOMEND",
	"	ENDIF",
	"	IF CTRAIN_COUNT == 0",
	"		SKIPDISP 0",
	"		TRYCALL CALLTRAINEND",
	"	ENDIF",
	"WEND",
]);
