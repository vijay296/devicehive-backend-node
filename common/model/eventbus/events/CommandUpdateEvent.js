const Constants = require(`../../../Constants`);
const Event = require(`./Event`);
const DeviceCommand = require(`../../DeviceCommand`);
const Action = require(`../../../../shim/Action`);
const Filter = require(`../Filter`);


class CommandUpdateEvent extends Event {

    constructor({ deviceCommand } = {}) {
        super({ action: Action.COMMAND_UPDATE_EVENT, command: deviceCommand });

        const me = this;

        me.command = deviceCommand;
    }

    get command() {
        return this._command;
    }

    set command(value) {
        this._command = value ? new DeviceCommand(value) : value;
    }

    getApplicableFilters() {
        const me = this;

        return [
            new Filter({
                networkId: me.command.networkId,
                deviceTypeId: me.command.deviceTypeId,
                deviceId: me.command.id,
                eventName: Constants.COMMAND_UPDATE_EVENT
            }),
            new Filter({
                networkId: me.command.networkId,
                deviceTypeId:  me.command.deviceTypeId,
                deviceId: me.command.id,
                eventName: Constants.COMMAND_UPDATE_EVENT,
                name: me.command.command
            })
        ];
    }
}


module.exports = CommandUpdateEvent;
