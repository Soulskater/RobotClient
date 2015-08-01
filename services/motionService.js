var pythonService = require('./pythonService');
var motionDirectionEnum = require('../common/enums/motionDirectionEnum');
var path = require('path');

var pythonServoControlFile = path.join(__dirname, '../python/4wd_motor_control.py');
var _runningProcess = null;
function _runPython(direction) {
    if (_runningProcess) {
        _runningProcess.kill('SIGINT');
    }
    _runningProcess = pythonService.runScript(pythonServoControlFile, direction);
}

module.exports = {
    processCommand: function (subCommand) {
        if (!motionDirectionEnum[subCommand]) {
            console.warn("Unrecognized motion direction!", subCommand);
            return;
        }
        _runPython(subCommand);
    }
};