var commandEnum = require('../common/enums/commandEnum');
var eventEnum = require('../common/enums/eventEnum');
var protoBufConfig = require('../common/protoBufConfig');
var protoBufHelper = require('../common/protoBufHelper');
var motionService = require('./motionService');
var telemetryService = require('./telemetryService');
var socketService = require('./socketService');
var frontServoService = require('./frontServoService');

module.exports = {
    processCommand: function (commandName, subCommandName, value) {
        switch (commandName) {
            case commandEnum.move:
                motionService.processCommand(subCommandName);
                break;
            case commandEnum.telemetry:
                var telemetryData = telemetryService.getTelemetryData();
                socketService.emit(eventEnum.telemetry, protoBufHelper.encode(protoBufConfig.telemetry, telemetryData));
                break;
            case commandEnum.moveFrontServo:
                frontServoService.rotate(subCommandName, value);
                break;
            case commandEnum.exit:
                process.exit();
                break;
            default :
                console.error("Unrecognized command", commandName);
                return;
        }
    }
};