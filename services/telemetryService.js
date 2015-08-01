var pythonService = require('./pythonService');
var q = require('q');
var path = require('path');

var telemetryPythonFile = path.join(__dirname, '../python/telemetry.py');

function _getTelemetryData() {
    var deferred = q.defer();
    pythonService.runScript(telemetryPythonFile).promise.then(function (data) {
        var dataArray = JSON.parse(data);
        deferred.resolve({
            roll: Math.floor(dataArray[0]),
            pitch: Math.floor(dataArray[1]),
            heading: Math.floor(dataArray[2]),
            distance: Math.floor(dataArray[3])
        });
    });

    return deferred.promise;
}

module.exports = {
    getTelemetryData: _getTelemetryData
};