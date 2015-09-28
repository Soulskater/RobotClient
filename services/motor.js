var runMode = require('./../common/enums/motorRunMode');

module.exports = function motor(pwmDriver, number) {

    var pwmPin = 0;
    var in1 = 0;
    var in2 = 0;

    _init();
    function _init() {
        if (number == 1) {
            pwmPin = 8;
            in2 = 9;
            in1 = 10;
        } else if (number == 2) {
            pwmPin = 13;
            in2 = 12;
            in1 = 11;
        }
        else if (number == 3) {
            pwmPin = 2;
            in2 = 3;
            in1 = 4;
        }
        else if (number == 4) {
            pwmPin = 7;
            in2 = 6;
            in1 = 5;
        }
        else {
            throw Error('MotorHAT Motor must be between 1 and 4 inclusive');
        }
    }

    return {
        run: _run,
        setSpeed: _setSpeed
    };

    function _setPin(pinNumber, value) {
        if (pinNumber < 0 || pinNumber > 15) {
            throw Error('PWM pin must be between 0 and 15 inclusive');
        }
        if (value != 0 && value != 1) {
            throw Error('Pin value must be 0 or 1!');
        }
        if (value == 0) {
            pwmDriver.setPWM(pinNumber, 0, 4096);
        }
        if (value == 1) {
            pwmDriver.setPWM(pinNumber, 4096, 0);
        }
    }

    function _run(command) {
        if (!pwmDriver) {
            return;
        }
        if (command == runMode.forward) {
            _setPin(in2, 0);
            _setPin(in1, 1);
        }
        if (command == runMode.backward) {
            _setPin(in1, 0);
            _setPin(in2, 1);
        }
        if (command == runMode.release) {
            _setPin(in1, 0);
            _setPin(in2, 0);
        }
    }

    function _setSpeed(speed) {
        if (speed < 0) {
            speed = 0;
        }
        if (speed > 255) {
            speed = 255;
        }
        pwmDriver.setPWM(pwmPin, 0, speed * 16);
    }
};