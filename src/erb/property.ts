import P from "parsimmon";

import type Property from "../property";
import Define from "../property/define";
import Dim from "../property/dim";
import LocalSize from "../property/localsize";
import LocalSSize from "../property/localssize";
import Method from "../property/method";
import Order from "../property/order";
import Single from "../property/single";
import * as E from "./expr";
import * as U from "./util";

const parser = P.string("#").then(U.Identifier).chain<Property>((property) => {
	switch (property.toUpperCase()) {
		case "DEFINE": return P.seqMap(
			U.WS1,
			U.Identifier,
			U.WS1,
			E.expr,
			(_1, name, _2, expr) => new Define(name, expr),
		);
		case "PRI": return U.arg0R0().map(() => new Order("PRI"));
		case "LATER": return U.arg0R0().map(() => new Order("LATER"));
		case "SINGLE": return U.arg0R0().map(() => new Single());
		case "DIM": return P.seqMap(
			U.WS1.then(P.alt(
				P.regex(/CONST/i),
				P.regex(/DYNAMIC/i),
				P.regex(/REF/i),
				P.regex(/SAVEDATA/i),
			)).many(),
			U.WS1.then(U.sepBy1(",", U.Identifier, E.expr)),
			P.alt(
				P.string("=").trim(U.WS0).then(U.sepBy0(",", E.expr)),
				P.succeed(undefined),
			),
			P.string(",").fallback(null),
			(prefix, [name, ...size], value) => new Dim(name, "number", prefix, size, value),
		);
		case "DIMS": return P.seqMap(
			U.WS1.then(P.alt(
				P.regex(/CONST/i),
				P.regex(/DYNAMIC/i),
				P.regex(/REF/i),
				P.regex(/SAVEDATA/i),
			)).many(),
			U.WS1.then(U.sepBy1(",", U.Identifier, E.expr)),
			P.alt(
				P.string("=").trim(U.WS0).then(U.sepBy0(",", E.expr)),
				P.succeed(undefined),
			),
			P.string(",").fallback(null),
			(prefix, [name, ...size], value) => new Dim(name, "string", prefix, size, value),
		);
		case "FUNCTION": return U.arg0R0().map(() => new Method());
		case "FUNCTIONS": return U.arg0R0().map(() => new Method());
		case "LOCALSIZE": return U.arg1R1(U.UInt).map((size) => new LocalSize(size));
		case "LOCALSSIZE": return U.arg1R1(U.UInt).map((size) => new LocalSSize(size));
		default: return P.fail(`${property} is not a valid property`);
	}
});

export default parser;
