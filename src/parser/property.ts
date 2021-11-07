import P from "parsimmon";

import type Property from "../property";
import Define from "../property/define";
import Dim from "../property/dim";
import LocalSize from "../property/localsize";
import LocalSSize from "../property/localssize";
import Method from "../property/method";
import Order from "../property/order";
import Single from "../property/single";
import * as C from "./const";
import * as X from "./expr";
import * as U from "./util";

const parser = P.string("#").then(P.alt<Property>(
	P.regex(/DEFINE/i).skip(C.WS1).then(P.seqMap(
		C.Identifier,
		C.WS1,
		X.expr,
		(name, _2, expr) => new Define(name, expr),
	)),
	P.regex(/PRI/i).then(U.arg0R0()).map(() => new Order("PRI")),
	P.regex(/LATER/i).map(() => new Order("LATER")),
	P.regex(/SINGLE/i).map(() => new Single()),
	P.regex(/FUNCTIONS/i).map(() => new Method()),
	P.regex(/FUNCTION/i).map(() => new Method()),
	P.regex(/LOCALSIZE/i).skip(C.WS1).then(X.expr).map((expr) => new LocalSize(expr)),
	P.regex(/LOCALSSIZE/i).skip(C.WS1).then(X.expr).map((expr) => new LocalSSize(expr)),
	P.regex(/DIM/i).skip(C.WS1).then(P.seqMap(
		P.alt(
			P.regex(/CONST/i).skip(C.WS1),
			P.regex(/DYNAMIC/i).skip(C.WS1),
			P.regex(/GLOBAL/i).skip(C.WS1),
			P.regex(/REF/i).skip(C.WS1),
			P.regex(/SAVEDATA/i).skip(C.WS1),
			P.regex(/CHARADATA/i).skip(C.WS1),
		).many(),
		U.sepBy1(",", C.Identifier, X.expr),
		P.alt(
			P.string("=").trim(C.WS0).then(U.sepBy0(",", X.expr)),
			P.succeed(undefined),
		),
		P.string(",").fallback(null),
		(prefix, [name, ...size], value) => new Dim(name, "number", prefix, size, value),
	)),
	P.regex(/DIMS/i).skip(C.WS1).then(P.seqMap(
		P.alt(
			P.regex(/CONST/i).skip(C.WS1),
			P.regex(/DYNAMIC/i).skip(C.WS1),
			P.regex(/GLOBAL/i).skip(C.WS1),
			P.regex(/REF/i).skip(C.WS1),
			P.regex(/SAVEDATA/i).skip(C.WS1),
			P.regex(/CHARADATA/i).skip(C.WS1),
		).many(),
		U.sepBy1(",", C.Identifier, X.expr),
		P.alt(
			P.string("=").trim(C.WS0).then(U.sepBy0(",", X.expr)),
			P.succeed(undefined),
		),
		P.string(",").fallback(null),
		(prefix, [name, ...size], value) => new Dim(name, "string", prefix, size, value),
	)),
));

export default parser;
