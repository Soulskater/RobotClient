var eventEnum = require('./common/enums/eventEnum');
var protoBufConfig = require('./common/protoBufConfig');
var protoBufHelper = require('./common/protoBufHelper');
var socketService = require('./services/socketService');
var commandService = require('./services/commandService');

var _serverAddress = "ws://robotserver.azurewebsites.net";
//var _serverAddress = "ws://192.168.1.112:8090";

socketService.connect(_serverAddress);

socketService.on(eventEnum.command, function (byteData) {
    var command = protoBufHelper.decode(protoBufConfig.command, byteData);
    if (!command) {
        console.warn("Invalid data sent from the server");
        return;
    }
    commandService.processCommand(command.name, command.subCommand);
});