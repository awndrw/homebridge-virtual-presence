import { AccessoryConfig } from 'homebridge';

export interface VirtualPresenceConfig extends AccessoryConfig {
	name: string;
	switches?: string[];
}
