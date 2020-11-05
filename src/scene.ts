import Call from "./statement/command/call";
import Input from "./statement/command/input";
import TryCall from "./statement/command/trycall";
import While from "./statement/command/while";
import Const from "./statement/expr/const";
import Thunk from "./thunk";

export const TITLE = new Thunk([new Call(new Const("SYSTEM_TITLE"), [])]);

export const FIRST = new Thunk([new Call(new Const("EVENTFIRST"), [])]);

export const SHOP = new Thunk([
	new TryCall(new Const("EVENTSHOP"), []),
	new While(new Const(1), new Thunk([
		new Call(new Const("SHOW_SHOP"), []),
		new Input(),
		new Call(new Const("USERSHOP"), []),
	])),
]);
