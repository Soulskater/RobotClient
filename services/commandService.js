var commandEnum = require('../common/enums/commandEnum');
var eventEnum = require('../common/enums/eventEnum');
var protoBufConfig = require('../common/protoBufConfig');
var protoBufHelper = require('../common/protoBufHelper');
var motionService = require('./motionService');
var telemetryService = require('./telemetryService');
var socketService = require('./socketService');

module.exports = {
    processCommand: function (commandName, subCommandName) {
        switch (commandName) {
            case commandEnum.move:
                motionService.processCommand(subCommandName);
                break;
            case commandEnum.telemetry:
                telemetryService.getTelemetryData().then(function (data) {
                    console.log(data);
                    socketService.emit(eventEnum.telemetry, protoBufHelper.encode(protoBufConfig.telemetry, data));
                });
                break;
            default :
                console.error("Unrecognized command", commandName);
                return;
        }
    }
};