export type Loadable<T> = { isLoading: true } | (T & { isLoading: false });

export const unload = <T>(value: T) => Object.assign(value, { isLoading: false as const });