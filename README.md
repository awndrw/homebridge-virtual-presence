# Homebridge Virtual Presence Plugin

- [Why](#why)
- [Example](#example)
  - [Example config.json](#example-configjson)
- [Automations](#automations)
  - [Person automations:](#person-automations)
  - [Sensor Automations](#sensor-automations)

# Why
While it is possible to make automations when the whole home has left in HomeKit, it isn't possible to run an automation when a specific group has left. This plugin allows you to create groups of housemembers that each have their own automations when they arrive and leave.

# Example
I highly recommend installing and configuring this plugin via the Homebridge UI.
## Example config.json
```json
"accessories": [
    {
        "switches": [
            "Person 1 Present",
            "Person 2 Present"
        ],
        "name": "Person 1/2 Occupancy Sensor",
        "accessory": "VirtualPresence"
    },
],
```
# Automations
## Person automations:
- When Person 1 Arrives -> Turn on Person 1 Present
- When Person 1 Leaves -> Turn off Person 1 Present
- When Person 2 Arrives -> Turn on Person 2 Present
- When Person 2 Leaves -> Turn off Person 2 Present
## Sensor Automations
- When Person 1 or 2 Occupancy turns on -> Turn on the lights in Bedroom 1
- When Person 1 or 2 Occupancy turns off -> Turn off the lights in Bedroom 1
