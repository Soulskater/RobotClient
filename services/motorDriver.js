var pwmDriver = require('./pwmDriver');
var motor = require('./motor');


module.exports = function motorDriver(address, debug) {
    var _address = address || 0x60;
    var _freq = 1600;
    var _motors = [];
    var _pwm = pwmDriver(_address, debug);

    _init();
    function _init() {
        for (var i = 1; i <= 4; i++) {
            _motors.push(motor(_pwm, i));
        }
        _pwm.setPWMFreq(_freq);
    }

    return {
        getMotor: _getMotor
    };

    function _getMotor(num) {
        if (num < 1 || num > 4) {
            throw Error('MotorHAT Motor must be between 1 and 4 inclusive');
        }
        return _motors[num - 1]
    }
};