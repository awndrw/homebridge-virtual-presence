import type { AccessoryConfig, Service } from 'homebridge';

export const clean = (str: string) => str.replace(/\s+/g, '');

export const createId = (...segments: AnyString[]): string =>
	segments
		.reduce((prev, cur) => `${prev}.${clean(cur.toString())}`, '')
		.toString();

export type AnyString = string | { toString(): string };

export interface VirtualPresenceConfig extends AccessoryConfig {
	name: string;
	switches?: string[];
}

export interface Switch {
	readonly id: string;
	readonly isOn: () => boolean;
	readonly service: Service;
}
