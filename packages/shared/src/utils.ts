import { z } from 'zod';

export type RequiredNotNull<Object, Key extends keyof Object> = ExpandType<RequiredKey<RemoveNullOn<Object, Key>, Key>>;

export type RemoveNullOn<T, O extends keyof T = never> = {
	[P in keyof T]: P extends O ? Exclude<T[P], null> : T[P];
};

export type RemoveNullExcept<T, E extends keyof T = never> = {
	[P in keyof T]: P extends E ? T[P] : Exclude<T[P], null>;
};

export type AddOptionalTo<T, O extends keyof T = never> = Pick<T, Exclude<keyof T, O>> & {
	[P in O]?: T[P];
};

export type RequiredKey<Obj, Key extends keyof Obj = keyof Obj> = Omit<Obj, Key> & { [P in Key]-?: Obj[P] };

export type NonOptional<Obj, Key extends string> = Key extends `${infer K}.${infer Rest}`
	? K extends keyof Obj
		? Obj[K] extends object
			? { [P in keyof Obj]: P extends K ? NonOptional<Required<Obj>[K], Rest> : Obj[P] }
			: never
		: never
	: Key extends keyof Obj
		? { [P in keyof RequiredKey<Obj, Key>]: P extends Key ? NonNullable<Required<Obj>[P]> : Obj[P] }
		: never;

export type ExpandType<T> = T extends unknown ? { [K in keyof T]: T[K] } : never; // This is purely useful for improving intelisense

export type Extend<ObjA, ObjB> = ExpandType<ObjA extends unknown ? ObjA & ObjB : never>;

export type DiscriminatedUnion<
	Key extends string,
	Options extends Partial<Record<Key, Record<string, unknown>>>,
	DefaultOption extends Record<string, unknown> = Record<string, never>,
	SwitchKey extends string = 'method',
	SharedProperties extends Record<string, unknown> | undefined = undefined,
> = SharedProperties extends undefined
	? ExpandType<
			{
				[K in Key]: ExpandType<{ [_key in SwitchKey]: K } & (K extends keyof Options ? Options[K] : DefaultOption)>;
			}[Key]
		>
	: Extend<DiscriminatedUnion<Key, Options, DefaultOption, SwitchKey>, SharedProperties>;

export type DiscriminatedUnionPick<
	Union extends { [_key in SwitchKey]: Options } & Record<string, unknown>,
	PickOption extends Options,
	SwitchKey extends string = 'method',
	Options extends string = Union[SwitchKey],
> = Union extends { [_key in SwitchKey]: PickOption } ? Union : never;

export type DiscrimatedUnionRemove<
	Union extends { [_key in SwitchKey]: Options } & Record<string, unknown>,
	RemoveOption extends Options,
	SwitchKey extends string = 'method',
	Options extends string = Union[SwitchKey],
> = Union extends { [_key in SwitchKey]: RemoveOption } ? never : Union;

export type SingleOrArray<T> = T | T[];

export type PickFromShared<PrimaryObj, SharedKeyObj> = {
	[K in keyof PrimaryObj & keyof SharedKeyObj]: PrimaryObj[K];
};

export type EditObject<
	Object,
	Replace extends Partial<Record<keyof Object, unknown>>,
	Remove extends keyof Object | never = never,
> = ExpandType<Omit<Object, Remove | keyof Replace> & Replace>;

export type RenameKeys<Object, NewKeys extends Record<string, keyof Object>> = {
	[Key in keyof NewKeys]: Object[NewKeys[Key]];
} & Omit<Object, NewKeys[keyof NewKeys]>;

export type AsyncZodParser<Return> = (
	_data: unknown,
	_params?: z.core.ParseContext<z.core.$ZodIssue>,
) => Promise<z.ZodSafeParseResult<z.core.output<Return>>>;
