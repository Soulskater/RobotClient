var servoDriver = require('./servoDriver')(0x40, [{
    channel: 0,
    minValue: 150,
    maxValue: 400
}], false);

var _servo = servoDriver.getServo(0);
var _servoPosition = 90;

_init();
function _init() {
    _servo.rotate(_servoPosition);
}

function _rotate(direction, angle) {
    if (direction === "left") {
        _servoPosition += angle;
    }
    if (direction === "right") {
        _servoPosition -= angle;
    }
    _servo.rotate(_servoPosition);
}

module.exports = {
    rotate: _rotate
};