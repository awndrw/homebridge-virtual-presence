import type { API } from 'homebridge';

import { VirtualPresence } from './accessory';
import { PLUGIN_NAME, ACCESSORY_NAME, clean } from './utils';

export default (api: API) =>
	api.registerAccessory(
		`homebridge-${PLUGIN_NAME}`,
		clean(ACCESSORY_NAME),
		VirtualPresence
	);
