var pythonService = require('../pythonService');
var q = require('q');
var path = require('path');

var ultrasonicSensorPythonFile = path.join(__dirname, '../../python/Distance.py');

function _getDistance() {
    var deferred = q.defer();
    pythonService.runScript(ultrasonicSensorPythonFile).promise.then(function (data) {
        deferred.resolve(Math.floor(parseFloat(data)));
    });

    return deferred.promise;
}

module.exports = {
    getDistance: _getDistance
};
