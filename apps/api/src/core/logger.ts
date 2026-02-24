export interface Logger {
	debug(_obj: Record<string, unknown>, _msg?: string): void;
	debug(_msg: string): void;
	info(_obj: Record<string, unknown>, _msg?: string): void;
	info(_msg: string): void;
	warn(_obj: Record<string, unknown>, _msg?: string): void;
	warn(_msg: string): void;
	error(_obj: Record<string, unknown>, _msg?: string): void;
	error(_msg: string): void;
}

export const log: Logger = {
	debug: console.debug.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console),
};
