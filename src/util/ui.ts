export const classNames = (cls: Array<string | undefined | boolean | null | void>) =>
	cls.filter(Boolean).join(' ');
