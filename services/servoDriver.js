var i2c = require('i2c');

var _registerAddress = 0x40;
var _mode1 = 0x00;
var _mode2 = 0x01;
var _sleep = 0x10;
var _allCall = 0x01;
var _outDvr = 0x04;
var _led0onL = 0x06;
var _led0onH = 0x07;
var _led0offL = 0x08;
var _led0offH = 0x09;
var _preScale = 0xFE;
var servoMin = 150;
var servoMax = 850;

//__SUBADR1            = 0x02
//__SUBADR2            = 0x03
//__SUBADR3            = 0x04
//__ALL_LED_ON_L       = 0xFA
//__ALL_LED_ON_H       = 0xFB
//__ALL_LED_OFF_L      = 0xFC
//__ALL_LED_OFF_H      = 0xFD
//__RESTART            = 0x80
//__INVRT              = 0x10

var _i2c = new i2c(_registerAddress, {device: '/dev/i2c-1'});

_init();
function _init() {
    _setPWMFreq(60);
    _i2c.writeBytes(_mode2, [_outDvr]);
    _i2c.writeBytes(_mode1, [_allCall]);
    //time.sleep(0.005) # wait for oscillator

    var mode1 = _i2c.readByte(_mode1, 8);
    mode1 = mode1 & ~_sleep; //wake up (reset sleep)
    _i2c.writeBytes(_mode1, mode1)
}

module.exports = {
    setServo: function (isCw) {
        if (isCw) {
            _setPWM(0, 0, servoMin);
        }
        else {
            _setPWM(0, 0, 0);
        }
    }
}

function _setPWM(channel, on, off) {
    //"Sets a single PWM channel"
    _i2c.writeBytes(_led0onL + 4 * channel, [on & 0xFF]);
    _i2c.writeBytes(_led0onH + 4 * channel, [on >> 8]);
    _i2c.writeBytes(_led0offL + 4 * channel, [off & 0xFF]);
    _i2c.writeBytes(_led0offH + 4 * channel, [off >> 8]);
}

function _setPWMFreq(freq) {
    //"Sets the PWM frequency"
    var preScaleVal = 25000000.0; // 25MHz
    preScaleVal /= 4096.0; // 12 - bit
    preScaleVal /= parseFloat(freq);
    preScaleVal -= 1.0;
    console.log("Setting PWM frequency to %d Hz", freq);
    console.log("Estimated pre-scale: %d", preScaleVal);
    var preScale = Math.floor(preScaleVal + 0.5);
    console.log("Final pre-scale: %d", preScale);

    var oldMode = _i2c.readBytes(_mode1, 8);
    var newMode = (oldMode & 0x7F) | 0x10;// sleep
    _i2c.writeBytes(_mode1, [newMode]); // go to sleep
    _i2c.writeBytes(_preScale, parseInt(Math.floor(preScale)));
    _i2c.writeBytes(_mode1, oldMode);
    //time.sleep(0.005)
    _i2c.writeBytes(_mode1, oldMode | 0x80)
}