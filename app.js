var eventEnum = require('./common/enums/eventEnum');
var protoBufConfig = require('./common/protoBufConfig');
var protoBufHelper = require('./common/protoBufHelper');
var socketService = require('./services/socketService');
var commandService = require('./services/commandService');
var obstacleService = require('./services/obstacleAvoidService');

//var _serverAddress = "ws://robotserver.azurewebsites.net";
var _serverAddress = "ws://192.168.1.112:8090";

var servoDriver = require('./services/servoDriver');
servoDriver.setServo(true);
setTimeout(function () {
    servoDriver.setServo(false);
}, 3000);
/*
 obstacleService.avoidObstacle();

 socketService.connect(_serverAddress);

 socketService.on(eventEnum.command, function (byteData) {
 var command = protoBufHelper.decode(protoBufConfig.command, byteData);
 if (!command) {
 console.warn("Invalid data sent from the server");
 return;
 }
 commandService.processCommand(command.name, command.subCommand);
 });

 process.on('exit', function () {
 obstacleService.stop();
 console.log('Goodbye!');
 });*/
