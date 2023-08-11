import { writable } from 'svelte/store';

export const exerciseTimer = writable(Array<{ exerciseId: string, startTime: number }>())