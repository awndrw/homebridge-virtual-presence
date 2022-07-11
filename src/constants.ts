import { AccessoryConfig } from 'homebridge';

export const PLUGIN_NAME = 'homebridge-virtual-presence';
export const ACCESSORY_NAME = 'Virtual Presence';
export const ACCESSORY_MANUFACTURER = 'wiggindev';

export interface VirtualPresenceConfig extends AccessoryConfig {
	name: string;
	switches?: string[];
}
