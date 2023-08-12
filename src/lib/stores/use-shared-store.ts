import { localStorageStore } from "@skeletonlabs/skeleton";
import { getContext, hasContext, setContext } from "svelte";
import { readable, writable } from "svelte/store";

// context for any type of store
export const useSharedStore = <T, A>(
    name: string,
    fn: (name: string, value: A) => T,
    defaultValue: A,
) => {
    if (hasContext(name)) {
        return getContext<T>(name);
    }
    const _value = fn(name, defaultValue);
    setContext(name, _value);
    return _value;
};

// writable store context
export const useWritable = <T>(name: string, value: T) =>
    useSharedStore(name, localStorageStore, value);