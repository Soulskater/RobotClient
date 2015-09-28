module.exports = function servo(pwmDriver, channel, servoMin, servoMax) {

    var _servoMin = servoMin;//150;
    var _servoMax = servoMax;//380;

    _init();
    function _init() {

    }

    return {
        rotate: _rotate
    };

    function _rotate(degree) {
        if (!pwmDriver) {
            return;
        }
        if (degree < 0) {
            pwmDriver.setServoPulse(channel, _servoMin);
            return;
        }
        if (degree > 180) {
            pwmDriver.setServoPulse(channel, _servoMax);
            return;
        }

        var servoLength = _servoMax - _servoMin;
        var servoValue = _servoMin + (servoLength / (180 / degree));

        if (servoValue < _servoMin || servoValue > _servoMax) {
            return;
        }
        pwmDriver.setServoPulse(channel, servoValue);
    }
};