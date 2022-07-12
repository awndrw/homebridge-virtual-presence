import type {
	AccessoryPlugin,
	Logger,
	API,
	Service,
	CharacteristicValue,
} from 'homebridge';

import {
	PLUGIN_NAME,
	ACCESSORY_NAME,
	ACCESSORY_MANUFACTURER,
	OCCUPANCY_SENSOR,
	SWITCH,
	VirtualPresenceConfig,
	Switch,
	clean,
	AnyString,
} from './utils';
import { version } from '../package.json';

export class VirtualPresence implements AccessoryPlugin {
	private readonly informationService: Service;
	private readonly occupancyService: Service;
	private readonly switches: Switch[];

	constructor(
		public readonly log: Logger,
		public readonly config: VirtualPresenceConfig,
		public readonly api: API
	) {
		const Service = this.api.hap.Service;
		const Characteristic = this.api.hap.Characteristic;

		this.informationService = new Service.AccessoryInformation()
			.setCharacteristic(
				Characteristic.Manufacturer,
				ACCESSORY_MANUFACTURER
			)
			.setCharacteristic(Characteristic.Model, ACCESSORY_NAME)
			.setCharacteristic(
				Characteristic.SerialNumber,
				this.getAccessoryId()
			)
			.setCharacteristic(Characteristic.FirmwareRevision, version);

		this.occupancyService = new Service.OccupancySensor(
			this.config.name,
			this.api.hap.uuid.generate(OCCUPANCY_SENSOR)
		);
		this.occupancyService
			.getCharacteristic(Characteristic.OccupancyDetected)
			.onGet(this.getOccupancyDetected);

		this.switches = [];
		this.config.switches?.forEach((name, idx) => {
			this.switches.push(this.createSwitch(name, idx));
		});

		this.log.debug('Finished initializing platform:', this.config.name);
	}

	getServices = (): Service[] => [
		this.informationService,
		this.occupancyService,
		...this.switches.map(s => s.service),
	];

	private getOccupancyDetected = () => {
		const occupancyDetected = this.switches.some(s => s.on);
		this.log.debug(
			`Getting state of occupancy sensor ${this.config.name}: ${occupancyDetected}`
		);
		return occupancyDetected;
	};

	private createSwitch = (name: string, idx: number): Switch => {
		this.log.debug(`Creating switch ${name}`);
		const id = this.getAccessoryId(SWITCH, name, idx);
		const uuid = this.api.hap.uuid.generate(id);
		let on = false;
		const service = new this.api.hap.Service.Switch(name, uuid);
		service
			.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(() => on)
			.onSet((value: CharacteristicValue) => (on = value as boolean));
		return { id, on, service };
	};

	private getAccessoryId = (...ids: Array<AnyString>) =>
		[PLUGIN_NAME, clean(this.config.name)]
			.concat(ids.map(id => clean(`${id}`)))
			.join('.');
}
