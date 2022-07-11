import { API } from 'homebridge';

import { VirtualPresence } from './accessory';

export default (api: API) =>
	api.registerAccessory('VirtualPresence', VirtualPresence);
