var raspi = require('raspi');
var gpio = require('raspi-gpio');
var sleep = require('sleep');

var _triggerOutput = null;
var _echoInput = null;

module.exports = {
    init: _init,
    read: _read
};

function _init(triggerGpioPin, echoGpioPin) {
    raspi.init(function () {
        _echoInput = new gpio.DigitalInput(echoGpioPin);
        _triggerOutput = new gpio.DigitalOutput(triggerGpioPin);
        _triggerOutput.write(gpio.LOW);
    });
}

function _read() {
    var start;
    var stop;
    var distance = 0;
    _triggerOutput.write(gpio.HIGH);
    sleep.usleep(10);
    _triggerOutput.write(gpio.LOW);
    start = new Date();
    stop = new Date();

    while (_echoInput.read() == gpio.LOW) {
        start = new Date();
    }

    while (_echoInput.read() == gpio.HIGH) {
        console.log("High");
        stop = new Date();
    }
    var elapsed = stop.getSeconds() - start.getSeconds();
    elapsed /= 1000000;
    console.log(elapsed);
    distance = (elapsed * 34300) / 2;
    console.log(distance);

    return distance;
}