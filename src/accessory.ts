import {
	AccessoryPlugin,
	Logger,
	API,
	Service,
	CharacteristicValue,
} from 'homebridge';
import { VirtualPresenceConfig } from './types';

const OCCUPANCY_SENSOR_UUID = (idx: number) => `OccupancySensor.${idx}`;
const SWITCH_UUID = (idx: number) => `Switch.${idx}`;

export class VirtualPresence implements AccessoryPlugin {
	public readonly informationService: Service;
	public readonly occupancyService: Service;

	private switches: Switch[] = [];

	constructor(
		public readonly log: Logger,
		public readonly config: VirtualPresenceConfig,
		public readonly api: API
	) {
		const Service = this.api.hap.Service;
		const Characteristic = this.api.hap.Characteristic;

		this.config.accessory = this.config.name;

		this.informationService = new Service.AccessoryInformation()
			.setCharacteristic(Characteristic.Manufacturer, 'wiggindev')
			.setCharacteristic(Characteristic.Model, 'Default-Model');

		this.occupancyService = new Service.OccupancySensor(
			this.config.occupancyName,
			this.api.hap.uuid.generate(OCCUPANCY_SENSOR_UUID(0))
		);
		this.occupancyService
			.getCharacteristic(Characteristic.OccupancyDetected)
			.onGet(this.getOccupancyDetected.bind(this));

		(this.config.switches || []).forEach((name, idx) => {
			const uuid = this.api.hap.uuid.generate(SWITCH_UUID(idx));
			this.switches.push(new Switch(name, uuid, this.log, this.api));
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
		const occupancyDetected = this.switches.some(s => s.on);
		this.log.debug(
			`Getting state of occupancy sensor ${this.config.name}: ${occupancyDetected}`
		);
		return occupancyDetected;
	}
}

class Switch {
	public readonly service: Service;
	public on: boolean;

	constructor(
		public readonly name: string,
		public readonly uuid: string,
		public readonly log: Logger,
		private readonly api: API
	) {
		this.log.debug(`Creating switch ${name}`);
		this.on = false;
		this.service = new this.api.hap.Service.Switch(name, uuid);
		this.service
			.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(this.getState.bind(this))
			.onSet(this.setState.bind(this));
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
