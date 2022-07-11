import { AccessoryConfig } from 'homebridge';

export interface VirtualPresenceConfig extends AccessoryConfig {
	occupancyName?: string;
	switches?: string[];
}
