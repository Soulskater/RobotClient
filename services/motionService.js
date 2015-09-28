var motionDirectionEnum = require('../common/enums/motionDirectionEnum');
var runMode = require('./../common/enums/motorRunMode');
var motorDriver = require('./motorDriver')(0x60, false);

//left
var motor1 = motorDriver.getMotor(1);
var motor2 = motorDriver.getMotor(2);
//right
var motor3 = motorDriver.getMotor(3);
var motor4 = motorDriver.getMotor(4);

module.exports = {
    processCommand: function (subCommand, speed) {
        if (!motionDirectionEnum[subCommand]) {
            console.warn("Unrecognized motion direction!", subCommand);
            return;
        }
        _move(subCommand, speed || 255);
    }
};

function _move(direction, speed) {
    switch (direction) {
        case motionDirectionEnum.forward:
            _moveForward(speed);
            break;
        case motionDirectionEnum.backward:
            _moveBackward(speed);
            break;
        case motionDirectionEnum.left:
            _turnLeft(speed);
            break;
        case motionDirectionEnum.right:
            _turnRight(speed);
            break;
        case motionDirectionEnum.none:
            _stopMotors();
            break;
    }
}

function _setSpeed(speed) {
    var speed = speed || 255;
    motor1.setSpeed(speed);
    motor2.setSpeed(speed);
    motor3.setSpeed(speed);
    motor4.setSpeed(speed);
}

function _turnLeft(speed) {
    motor1.run(runMode.forward);
    motor2.run(runMode.forward);
    motor3.run(runMode.backward);
    motor4.run(runMode.backward);
    _setSpeed(speed);
}

function _turnRight(speed) {
    motor1.run(runMode.backward);
    motor2.run(runMode.backward);
    motor3.run(runMode.forward);
    motor4.run(runMode.forward);
    _setSpeed(speed);
}

function _moveForward(speed) {
    motor1.run(runMode.forward);
    motor2.run(runMode.forward);
    motor3.run(runMode.forward);
    motor4.run(runMode.forward);
    _setSpeed(speed);
}

function _moveBackward(speed) {
    motor1.run(runMode.backward);
    motor2.run(runMode.backward);
    motor3.run(runMode.backward);
    motor4.run(runMode.backward);
    _setSpeed(speed);
}

function _stopMotors() {
    _setSpeed(0);
    motor1.run(runMode.release);
    motor2.run(runMode.release);
    motor3.run(runMode.release);
    motor4.run(runMode.release);
}