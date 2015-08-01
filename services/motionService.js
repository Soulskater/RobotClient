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
        //pin3 = new gpio.DigitalOutput('P1-21');
        pin1 = new gpio.DigitalOutput('P1-11');
        pin2 = new gpio.DigitalOutput('P1-7');
    });
}

function _runPython(direction) {
    if(direction === motionDirectionEnum.forward) {
        console.log("Write forward");
        //pin3.write(gpio.HIGH); // Center a servo
        pin1.write(gpio.LOW);
        pin2.write(gpio.HIGH);
    }
    if(direction === motionDirectionEnum.backward) {
       //pin3.write(gpio.HIGH);
       pin1.write(gpio.HIGH);
       pin2.write(gpio.LOW);
    }
    if(direction === motionDirectionEnum.none) {
        console.log("Write stop");
        //pin3.write(gpio.LOW); // Center a servo
        pin1.write(gpio.LOW);
        pin2.write(gpio.LOW);
    }
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
