var pwmDriver = require('./pwmDriver');
var servo = require('./servo');

module.exports = function servoDriver(address, servoDefinitions, debug) {
    var _address = address || 0x40;
    var _freq = 60;
    var _servos = [];
    var _pwm = pwmDriver(_address, debug);

    _init();
    function _init() {
        _pwm.setPWMFreq(_freq);
        servoDefinitions.forEach(function (definition) {
            _servos.push(servo(_pwm, definition.channel, definition.minValue, definition.maxValue));
        });
    }

    return {
        getServo: _getServo
    };

    function _getServo(num) {
        if (num < 0 || num > 14) {
            throw Error('16 channel servo driver must be between 0 and 14 inclusive');
        }
        return _servos[num]
    }
};
