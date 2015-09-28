var eventEnum = require('./common/enums/eventEnum');
var protoBufConfig = require('./common/protoBufConfig');
var protoBufHelper = require('./common/protoBufHelper');
var socketService = require('./services/socketService');
var commandService = require('./services/commandService');
var obstacleService = require('./services/obstacleAvoidService');

//var _serverAddress = "ws://robotserver.azurewebsites.net";
var _serverAddress = "ws://192.168.1.112:8090";

var orientationService = require('./services/sensors/bno055/orientationService')(18, '/dev/ttyAMA0');

orientationService.begin();
//orientationService.loadCalibration();
console.log(orientationService.getCalibrationStatus());
for (var i = 0; i < 10000; i++) {
    console.log(orientationService.readEuler());
}

/*process.on('SIGINT', function () {
 console.log("Closing");
 socketService.close();
 obstacleService.stop();
 process.exit();
 });

 socketService.connect(_serverAddress);

 socketService.on(eventEnum.command, function (byteData) {
 var command = protoBufHelper.decode(protoBufConfig.command, byteData);
 if (!command) {
 console.warn("Invalid data sent from the server");
 return;
 }
 commandService.processCommand(command.name, command.subCommand, command.value);
 });*/

//obstacleService.startDetectObstacle();
