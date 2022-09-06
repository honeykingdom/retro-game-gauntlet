import type { Options } from 'features/rollGame/rollGameTypes';
import { LS } from './constants';

export function lsWrite(key: LS.Platforms, data: string[]): void;
export function lsWrite(key: LS.Options, data: Partial<Options>): void;
export function lsWrite(key: LS, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(e);
  }
}

export function lsRead(key: LS.Platforms): string[] | null;
export function lsRead(key: LS.Options): Partial<Options> | null;
export function lsRead(key: LS): any {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.warn(e);
    return null;
  }
}
