import P from "parsimmon";

import type Property from "../property";
import Define from "../property/define";
import Dim from "../property/dim";
import DimConst from "../property/dim-const";
import DimDynamic from "../property/dim-dynamic";
import DimRef from "../property/dim-ref";
import LocalSize from "../property/localsize";
import LocalSSize from "../property/localssize";
import Method from "../property/method";
import Order from "../property/order";
import * as E from "./expr";
import * as U from "./util";

const parser = P.string("#").then(U.Identifier).chain<Property>((property) => {
	switch (property.toUpperCase()) {
		case "DEFINE": return U.arg2R1(U.Identifier, U.optional(E.expr)).map(
			([name, expr]) => new Define(name, expr),
		);
		case "PRI": return U.arg0R0().map(() => new Order("PRI"));
		case "LATER": return U.arg0R0().map(() => new Order("LATER"));
		case "DIM": {
			const dimArgument = P.seq(
				U.sepBy1(",", U.Identifier, E.expr),
				P.alt(
					P.string("=").trim(U.WS0).then(U.sepBy0(",", E.expr)),
					P.succeed(undefined),
				),
				P.string(",").fallback(null),
			);
			return P.alt<Property>(
				U.WS1.then(P.regex(/DYNAMIC/i).skip(U.WS1).then(dimArgument).map(
					([[name, ...size], value]) => new DimDynamic(name, "number", size, value),
				)),
				U.WS1.then(P.regex(/CONST/i).skip(U.WS1).then(dimArgument).map(
					([[name, ...size], value]) => new DimConst(name, "number", size, value),
				)),
				U.WS1.then(P.regex(/REF/i).skip(U.WS1).then(dimArgument).map(
					([[name]]) => new DimRef(name),
				)),
				U.WS1.then(dimArgument).map(
					([[name, ...size], value]) => new Dim(name, "number", size, value),
				),
			);
		}
		case "DIMS": {
			const dimArgument = P.seq(
				U.sepBy1(",", U.Identifier, E.expr),
				P.alt(
					P.string("=").trim(U.WS0).then(U.sepBy0(",", E.expr)),
					P.succeed(undefined),
				),
				P.string(",").fallback(null),
			);
			return P.alt<Property>(
				U.WS1.then(P.regex(/DYNAMIC/i).skip(U.WS1).then(dimArgument).map(
					([[name, ...size], value]) => new DimDynamic(name, "string", size, value),
				)),
				U.WS1.then(P.regex(/CONST/i).skip(U.WS1).then(dimArgument).map(
					([[name, ...size], value]) => new DimConst(name, "string", size, value),
				)),
				U.WS1.then(P.regex(/REF/i).skip(U.WS1).then(dimArgument).map(
					([[name]]) => new DimRef(name),
				)),
				U.WS1.then(dimArgument).map(
					([[name, ...size], value]) => new Dim(name, "string", size, value),
				),
			);
		}
		case "FUNCTION": return U.arg0R0().map(() => new Method());
		case "FUNCTIONS": return U.arg0R0().map(() => new Method());
		case "LOCALSIZE": return U.arg1R1(U.UInt).map((size) => new LocalSize(size));
		case "LOCALSSIZE": return U.arg1R1(U.UInt).map((size) => new LocalSSize(size));
		default: return P.fail(`${property} is not a valid property`);
	}
});

export default parser;
