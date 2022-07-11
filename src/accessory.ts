import {
	AccessoryPlugin,
	Logger,
	API,
	Service,
	CharacteristicValue,
} from 'homebridge';
import { VirtualPresenceConfig } from './types';

const DEFAULT_OCCUPANCY_SENSOR_NAME = 'Occupancy Sensor';
const DEFAULT_SWITCH_NAME = 'Switch';

export class VirtualPresence implements AccessoryPlugin {
	public readonly informationService: Service;
	public readonly occupancyService: Service;

	private readonly Service: API['hap']['Service'];
	private readonly Characteristic: API['hap']['Characteristic'];

	private switches: Switch[] = [];

	constructor(
		public readonly log: Logger,
		public readonly config: VirtualPresenceConfig,
		public readonly api: API
	) {
		this.log.debug('VirtualPresence plugin loaded');

		this.Service = this.api.hap.Service;
		this.Characteristic = this.api.hap.Characteristic;

		this.informationService = new this.Service.AccessoryInformation()
			.setCharacteristic(this.Characteristic.Manufacturer, 'wiggindev')
			.setCharacteristic(this.Characteristic.Model, 'Default-Model');

		this.occupancyService = new this.Service.OccupancySensor(
			this.config.occupancyName || DEFAULT_OCCUPANCY_SENSOR_NAME
		);
		this.occupancyService
			.getCharacteristic(this.Characteristic.OccupancyDetected)
			.onGet(this.getOccupancyDetected);

		(this.config.switches || []).forEach((name, idx) => {
			const switchName = name || `${DEFAULT_SWITCH_NAME} ${idx}`;
			this.switches.push(new Switch(switchName, this.log, this.api));
		});

		this.log.debug('Finished initializing platform:', this.config.name);
	}

	getServices(): Service[] {
		return [
			this.informationService,
			this.occupancyService,
			...this.switches.map(s => s.service),
		];
	}

	getOccupancyDetected() {
		this.log.debug('Triggered GET OccupancyDetected');
		const occupancyDetected = this.switches.some(s => s.on);
		return occupancyDetected
			? this.Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
			: this.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
	}
}

class Switch {
	public readonly service: Service;
	public on: boolean;

	constructor(
		public readonly name: string,
		public readonly log: Logger,
		private readonly api: API
	) {
		this.log.debug(`Creating switch ${name}`);
		this.on = false;
		this.service = new this.api.hap.Service.Switch(name);
		this.service
			.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(this.getState)
			.onSet(this.setState);
	}

	getState() {
		this.log.debug(`Getting state of switch ${this.name}: ${this.on}`);
		return this.on;
	}

	setState(value: CharacteristicValue) {
		this.log.debug(`Setting switch ${this.name} to ${value}`);
		this.on = value as boolean;
	}
}
