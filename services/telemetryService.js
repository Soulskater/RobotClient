var distanceService = require('./sensors/distanceService');
var orientationService = require('./sensors/bno055/orientationService')(18, '/dev/ttyAMA0');
var deasync = require('deasync');
orientationService.begin();
//orientationService.loadCalibration();
console.log(orientationService.getCalibrationStatus());

function _getTelemetryData() {
    var distance = distanceService.getDistance();
    var accel = orientationService.readAccelerometer();
    var mag = orientationService.readMagnetometer();
    var gyro = orientationService.readGyroscope();
    var gravity = orientationService.readGravity();
    var euler = orientationService.readEuler();
    var linearAccel = orientationService.readLinearAcceleration();
    var temp = orientationService.readTemp();

    return {
        euler: euler,
        accelerometer: accel,
        magnetometer: mag,
        gyroscope: gyro,
        gravity: gravity,
        temperature: temp,
        distance: distance,
        linearAcceleration: linearAccel
    };
}

module.exports = {
    getTelemetryData: _getTelemetryData
};