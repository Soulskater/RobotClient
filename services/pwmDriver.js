var i2c = require('raspi-i2c').I2C;
var _i2c = new i2c();

module.exports = function (address, debug) {

    var _address = address;
    var _mode1 = 0x00;
    var _mode2 = 0x01;
    var _sleep = 0x10;
    var _allCall = 0x01;
    var _outDvr = 0x04;
    var _led0onL = 0x06;
    var _led0onH = 0x07;
    var _led0offL = 0x08;
    var _led0offH = 0x09;

    var _allLedOnL = 0xFA;
    var _allLedOnH = 0xFB;
    var _allLedOffL = 0xFC;
    var _allLedOffH = 0xFD;

    var _preScale = 0xFE;

    _init();
    function _init() {
        _setPWM(0, 0, 0);
        _writeBytes(_mode2, _outDvr);
        _writeBytes(_mode1, _allCall);

        var mode1 = _i2c.readByteSync(_address, _mode1);
        if (debug) {
            console.log("I2C: Device 0x%d returned 0x%d from reg 0x%d", _address, mode1 & 0xFF, _mode1);
        }

        mode1 = mode1 & ~_sleep;
        _writeBytes(_mode1, mode1);
    }

    return {
        setServoPulse: function (channel, pulse) {
            _setPWM(channel, 0, pulse);
        },
        setPWM: _setPWM,
        setPWMFreq: _setPWMFreq
    }

    function _setPWM(channel, on, off) {
        _writeBytes(_led0onL + 4 * channel, on & 0xFF);
        _writeBytes(_led0onH + 4 * channel, on >> 8);
        _writeBytes(_led0offL + 4 * channel, off & 0xFF);
        _writeBytes(_led0offH + 4 * channel, off >> 8);
    }

    function _setPWMFreq(freq) {
        var preScaleVal = 25000000.0; // 25MHz
        preScaleVal /= 4096.0; // 12 - bit
        preScaleVal /= parseFloat(freq);
        preScaleVal -= 1.0;
        if (debug) {
            console.log("Setting PWM frequency to %d Hz", freq);
            console.log("Estimated pre-scale: %d", preScaleVal);
        }
        var preScale = Math.floor(preScaleVal + 0.5);
        if (debug) {
            console.log("Final pre-scale: %d", preScale);
        }
        var oldMode = _i2c.readByteSync(_address, _mode1);
        var newMode = (oldMode & 0x7F) | 0x10;// sleep
        _writeBytes(_mode1, newMode); // go to sleep
        _writeBytes(_preScale, parseInt(Math.floor(preScale)));
        _writeBytes(_mode1, oldMode);
        _writeBytes(_mode1, oldMode | 0x80);
    }

    function _writeBytes(register, value) {
        if (debug) {
            console.log("I2C: Wrote 0x%d to register 0x%d", value, register);
        }
        _i2c.writeByteSync(_address, register, value);
    }
};