var raspi = require('raspi');
var serialPort = require("serialport").SerialPort;
var deasync = require('deasync');

module.exports = function (serialPortName, config) {

    var _opened = false;
    var _serialPort = null;
    var _queue = [];
    var _processingQueueItem = null;

    _init();
    function _init() {

        _serialPort = new serialPort(serialPortName, config);
        _serialPort.on("open", function () {
            _opened = true;
            _serialPort.on("data", _onDataReceived);
        });

        while (!_opened) {
            deasync.sleep(10);
        }
    }

    return {
        write: _writeQueueItem,
        read: _writeQueueItem,
        flush: _flush
    };

    function _onDataReceived(data) {
        if (_processingQueueItem && _processingQueueItem.callback && typeof _processingQueueItem.callback === "function") {
            var success = _processingQueueItem.callback(data);
            if (!success) {
                _reQueueItem(_processingQueueItem);
            }
        }
        _processQueue();
    }

    function _reQueueItem(queueItem) {
        _queue.unshift(queueItem);
    }

    function _writeQueueItem(command, callback) {
        _queue.push({
            command: command,
            callback: callback
        });
        if (!_processingQueueItem) {
            _processQueue();
        }

    }

    function _writeToSerialPort(queueItem) {
        _serialPort.write(queueItem.command, function (error) {
            if (error) {
                throw Error(error);
            }
        });
    }

    function _flush(callback) {
        _serialPort.flush(callback);
    }

    function _processQueue() {
        _processingQueueItem = _queue.shift();
        if (_processingQueueItem) {
            _writeToSerialPort(_processingQueueItem);
        }
    }
};