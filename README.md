# EraJS

EraJS is a javascript implementation of [Emuera](https://osdn.net/projects/emuera/). This repository includes only the core runtime, and is not intended to be directly used by the end users. To run full ERB scripts, please use other programs that implements appropriate interface.

## Example
```typescript
// Read scripts
const erh: string[] = [];
const erb: string[] = [];
const csv = new Map<string, string>();
for (const file of await fs.readdir(ERB_PATH)) {
	if (file.endsWith(".ERB") || file.endsWith(".erb")) {
		erb.push(await fs.readFile(path.join(ERB_PATH, file)));
	} else if (file.endsWith(".ERH") || file.endsWith(".erh")) {
		erh.push(await fs.readFile(path.join(ERB_PATH, file)));
	} else if (file.endsWith(".CSV") || file.endsWith(".csv")) {
		csv.set(file, await fs.readFile(path.join(ERB_PATH, file)));
	}
}

// Compile and create VM
const vm = compile(erh, erb, csv);

// Run VM until the end
const runtime = vm.start();
let input = "";
while (true) {
	const next = runtime.next(input);
	console.log(next.value);
	if (next.value?.type === "input") {
		const input = getInput();
	}
	if (next.done === true) {
		break;
	}
}
```

## API

### compile(erh: string[], erb: string[], csv: Map<string, string>): VM

Compiles CSV, ERH, ERB scripts and returns a VM instance. Meaning of the arguments are as follows:
- `erh`: List of raw ERH scripts.
- `erb`: List of raw ERB scripts.
- `csv`: es6 Map of (filename -> csv content).

### VM.start()

Starts the VM. This returns a generator which accepts string as an argument, and yields `Output`. See `src/statement/index.ts` for details.
