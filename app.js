var eventEnum = require('./common/enums/eventEnum');
var protoBufConfig = require('./common/protoBufConfig');
var protoBufHelper = require('./common/protoBufHelper');
var socketService = require('./services/socketService');
var commandService = require('./services/commandService');
var obstacleService = require('./services/obstacleAvoidService');

//var _serverAddress = "ws://robotserver.azurewebsites.net";
var _serverAddress = "ws://192.168.1.112:8090";

/*var servoMin = 150;
 var servoMax = 850;
 var servoDriver = require('./services/servoDriver');
 servoDriver.setPWMFreq(60);
 servoDriver.setServoPulse(0, servoMin);
 setTimeout(function () {
 servoDriver.setServoPulse(0, servoMax);
 setTimeout(function () {
 servoDriver.setServoPulse(0, 0);
 }, 1000);
 }, 1000);*/

var usonic = require('r-pi-usonic');
console.log("Reading distance");
var sensor = usonic.createSensor(26, 24, 10);
var distance = sensor();

console.log(distance);

/*
var ultraSonicService = require('./services/sensors/ultraSonicSensorService');
ultraSonicService.init('P1-24', 'P1-26');
setTimeout(function () {
    var distance = ultraSonicService.read();
    console.log(distance);
}, 2000);
*/


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
