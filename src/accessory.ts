import {
	AccessoryPlugin,
	Logger,
	API,
	Service,
	CharacteristicValue,
} from 'homebridge';
import { VirtualPresenceConfig } from './types';

const BASE_PATH = 'virtual-presence';
const MANUFACTURER = 'wiggindev';
const MODEL = 'Virtual Presence';

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

		this.config.accessory = this.config.name;

		const informationService = new Service.AccessoryInformation()
			.setCharacteristic(Characteristic.Manufacturer, MANUFACTURER)
			.setCharacteristic(Characteristic.Model, MODEL);

		const occupancyService = new Service.OccupancySensor(
			this.config.name,
			this.generateUuid('OccupancySensor')
		);
		occupancyService
			.getCharacteristic(Characteristic.OccupancyDetected)
			.onGet(this.getOccupancyDetected.bind(this));

		const switches: Switch[] = [];
		this.config.switches?.forEach((name, idx) => {
			const uuid = this.generateUuid('Switch', idx);
			switches.push(new Switch(name, uuid, this.log, this.api));
		});

		this.informationService = informationService;
		this.occupancyService = occupancyService;
		this.switches = switches;

		this.log.debug('Finished initializing platform:', this.config.name);
	}

	getServices = (): Service[] => [
		this.informationService,
		this.occupancyService,
		...this.switches.map(s => s.service),
	];

	getOccupancyDetected = () => {
		const occupancyDetected = this.switches.some(s => s.on);
		this.log.debug(
			`Getting state of occupancy sensor ${this.config.name}: ${occupancyDetected}`
		);
		return occupancyDetected;
	};

	private generateUuid = (...ids: Array<string | number>): string => {
		const path = [BASE_PATH, this.config.name, ...ids];
		return this.api.hap.uuid.generate(path.join('.'));
	};
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
			.onGet(this.getState)
			.onSet(this.setState);
	}

	getState = () => {
		this.log.debug(`Getting state of switch ${this.name}: ${this.on}`);
		return this.on;
	};

	setState = (value: CharacteristicValue) => {
		this.log.debug(`Setting switch ${this.name} to ${value}`);
		this.on = value as boolean;
	};
}
