import type { AccessoryConfig, Service } from 'homebridge';

export const PLUGIN_NAME = 'virtual-presence';
export const ACCESSORY_NAME = 'Virtual Presence';
export const ACCESSORY_MANUFACTURER = 'wiggindev';

export const OCCUPANCY_SENSOR = 'occupancy-sensor';
export const SWITCH = 'switch';

export const clean = (str: string) => str.replace(/\s+/g, '');

export type AnyString = string | { toString(): string };

export interface VirtualPresenceConfig extends AccessoryConfig {
	name: string;
	switches?: string[];
}

export interface Switch {
	id: string;
	on: boolean;
	readonly service: Service;
}
