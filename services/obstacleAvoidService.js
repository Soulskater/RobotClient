var q = require('q');
var distanceService = require('./sensors/distanceService');
var motionDirectionEnum = require('../common/enums/motionDirectionEnum');
var motionService = require('./motionService');

module.exports = {
    avoidObstacle: _avoidObstacle,
    stop: _stop
};

var _stopped = false;
var _minOffset = 15;
var _maxOffset = 30;

function _avoidObstacle() {
    if (_stopped) {
        return;
    }
    var deferred = q.defer();
    distanceService.getDistance().then(function (distance) {
        console.log(distance);
        if (_checkObstacle(distance)) {
            _leftAvoidObstacle(distance);
        }
        else {
            _moveForward();
        }
    });

    return deferred.promise;
}

function _checkObstacle(distance) {
    return distance <= _maxOffset;
}

function _leftAvoidObstacle() {
    motionService.processCommand(motionDirectionEnum.left);
    setTimeout(function () {
        motionService.processCommand(motionDirectionEnum.none);
        _avoidObstacle();
    }, 500);
}

function _rightAvoidObstacle() {
    motionService.processCommand(motionDirectionEnum.left);
    setTimeout(function () {
        motionService.processCommand(motionDirectionEnum.none);
        _avoidObstacle();
    }, 500);
}

function _moveForward() {
    motionService.processCommand(motionDirectionEnum.forward);
    setTimeout(function () {
        motionService.processCommand(motionDirectionEnum.none);
        _avoidObstacle();
    }, 500);
}

function _stop() {
    _stopped = true;
    motionService.processCommand(motionDirectionEnum.none);
}