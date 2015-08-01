var pythonService = require('./pythonService');
var motionDirectionEnum = require('../common/enums/motionDirectionEnum');
var path = require('path');

//var pythonServoControlFile = path.join(__dirname, '../python/4wd_motor_control.py');
//var _runningProcess = null;

var raspi = require('raspi');
var PWM = require('raspi-pwm').PWM;
var gpio = require('raspi-gpio');
var pin1;
var pin2;
var pin3;

_init();
function _init() {
    raspi.init(function () {
        pin3 = new PWM(21);
        pin1 = new gpio.DigitalOutput('P1-11');
        pin2 = new gpio.DigitalOutput('P1-7');
    });
}

function _runPython(direction) {
    pin3.write(500); // Center a servo
    pin1.write(gpio.LOW);
    pin2.write(gpio.HIGH);
    /*if (_runningProcess) {
     _runningProcess.kill('SIGKILL');
     }
     _runningProcess = pythonService.runScript(pythonServoControlFile, direction);*/
}

module.exports = {
    processCommand: function (subCommand) {
        if (!motionDirectionEnum[subCommand]) {
            console.warn("Unrecognized motion direction!", subCommand);
            return;
        }
        _runPython(subCommand);
    }
};
