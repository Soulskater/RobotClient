var pythonService = require('./pythonService');
var socketService = require('./socketService');
var path = require('path');
var q = require('q');
var pythonFile = path.join(__dirname, '../python/distancemeter.py');

function _getDistance() {
    var processPromise = pythonService.runScript(pythonFile);
    return processPromise.promise;
}

module.exports = {
    processRequest: function () {
        var data = new Message({
            text: "distance",
            distance: {
                value: _getDistance()
            }
        });
    }
};