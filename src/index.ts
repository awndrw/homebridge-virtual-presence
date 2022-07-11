import { API } from 'homebridge';

import { VirtualPresence } from './accessory';
import { PLUGIN_NAME, ACCESSORY_NAME } from './constants';

export default (api: API) =>
	api.registerAccessory(PLUGIN_NAME, ACCESSORY_NAME, VirtualPresence);
