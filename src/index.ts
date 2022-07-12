import type { API } from 'homebridge';

import { VirtualPresence } from './accessory';
import { ACCESSORY_NAME, PLUGIN_NAME } from './constants';
import { clean } from './utils';

export default (api: API) =>
	api.registerAccessory(
		`homebridge-${PLUGIN_NAME}`,
		clean(ACCESSORY_NAME),
		VirtualPresence
	);
