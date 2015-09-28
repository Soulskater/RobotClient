var distanceService = require('./sensors/distanceService');
var motionDirectionEnum = require('../common/enums/motionDirectionEnum');
var motionService = require('./motionService');
var deasync = require('deasync');


module.exports = {
    startDetectObstacle: _startDetectObstacle,
    stop: _stop
};

var _stopped = false;
var _moving = false;
var _minOffset = 15;
var _maxOffset = 40;

function _startDetectObstacle() {
    _detectObstacle();
}

function _detectObstacle() {
    if (_stopped) {
        return;
    }
    var obstacleResult = _checkObstacle();
    if (obstacleResult.hasObstacle) {
        _avoidObstacle(obstacleResult);
    }
    else {
        _moveForward();
        _detectObstacle();
    }
}

function _checkObstacle() {
    var sensorResult = distanceService.getDistance();
    return {
        hasObstacle: sensorResult.left <= _maxOffset || sensorResult.right <= _maxOffset,
        distance: sensorResult
    }
}

function _avoidObstacle(obstacleResult) {
    motionService.processCommand(motionDirectionEnum.none);

    if (obstacleResult.distance.left >= obstacleResult.distance.right) {
        _leftAvoidObstacle();
    }
    else {
        _rightAvoidObstacle();
    }
}

function _leftAvoidObstacle() {
    motionService.processCommand(motionDirectionEnum.left);
    setTimeout(function () {
        motionService.processCommand(motionDirectionEnum.none);
        _moving = false;
        deasync.sleep(200);
        _detectObstacle();
    }, 100);
}

function _rightAvoidObstacle() {
    motionService.processCommand(motionDirectionEnum.right);
    setTimeout(function () {
        motionService.processCommand(motionDirectionEnum.none);
        _moving = false;
        deasync.sleep(200);
        _detectObstacle();
    }, 100);
}

function _moveForward() {
    if (!_moving) {
        motionService.processCommand(motionDirectionEnum.forward, 60);
        _moving = true;
    }
}

function _stop() {
    _stopped = true;
    _moving = false;
    motionService.processCommand(motionDirectionEnum.none);
}