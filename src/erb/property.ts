import P from "parsimmon";

import type Property from "../property";
import Dim from "../property/dim";
import DimS from "../property/dims";
import LocalSize from "../property/localsize";
import LocalSSize from "../property/localssize";
import Method from "../property/method";
import Order from "../property/order";
import * as U from "./util";

const parser = U.asLine(P.string("#").then(U.Identifier).chain<Property>((property) => {
	switch (property.toUpperCase()) {
		case "PRI": return P.succeed(new Order("PRI"));
		case "LATER": return P.succeed(new Order("LATER"));
		case "DIM": return U.WS1.then(P.seqMap(
			U.sepBy(",", U.Identifier, U.Int),
			P.alt(
				P.string("=").trim(U.WS0).then(U.sepBy(",", U.Int)),
				P.succeed(undefined),
			),
			([name, ...size], value) => new Dim(name, size, value),
		));
		case "DIMS": return U.WS1.then(P.seqMap(
			U.sepBy(",", U.Identifier, U.Int),
			P.alt(
				P.string("=").trim(U.WS0).then(U.sepBy(",", U.Str)),
				P.succeed(undefined),
			),
			([name, ...size], value) => new DimS(name, size, value),
		));
		case "FUNCTION": return P.succeed(new Method());
		case "FUNCTIONS": return P.succeed(new Method());
		case "LOCALSIZE": return U.arg1R1(U.Int).map((size) => new LocalSize(size));
		case "LOCALSSIZE": return U.arg1R1(U.Int).map((size) => new LocalSSize(size));
		default: return P.fail(`${property} is not a valid property`);
	}
}));

export default parser;
