var usonic = require('r-pi-usonic');
var sleep = require('sleep');
var deasync = require('deasync');

var _sensorLeft;
var _sensorRight;
var _initialized = false;

_init();
function _init() {
    usonic.init(function (error) {
        if (error) {
            console.error(error);
        } else {
            _sensorLeft = usonic.createSensor(27, 17);
            _sensorRight = usonic.createSensor(7, 8);
            _initialized = true;
        }
    });
    while (!_initialized) {
        deasync.sleep(10);
    }
}

function _getSensorMeasurement(sensor) {
    var measurement1 = sensor();
    sleep.usleep(10);
    var measurement2 = sensor();
    sleep.usleep(10);
    var measurement3 = sensor();

    return (measurement1 + measurement2 + measurement3) / 3;
}

function _getDistance() {
    if (!_sensorLeft || !_sensorRight) {
        console.error("Sensor not initialized!");
    }
    var distanceLeft = Math.floor(_getSensorMeasurement(_sensorLeft));
    var distanceRight = Math.floor(_getSensorMeasurement(_sensorRight));

    return {
        left: distanceLeft,
        right: distanceRight
    };
}

module.exports = {
    getDistance: _getDistance
};
