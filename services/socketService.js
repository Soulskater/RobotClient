var socketIo = require('socket.io-client');
var eventEnum = require('../common/enums/eventEnum');

var _serverAddress;
var _socket;

module.exports = {
    connect: function (serverAddress) {
        if (!serverAddress) {
            console.error("Server address is required");
        }
        _serverAddress = serverAddress;
        _socket = socketIo(_serverAddress);
        _socket.binaryType = 'arraybuffer';

        _onConnect();
        _onConnectionError();
        _onReconnectAttempt();
    },
    close: function () {
        if (!_socket) {
            return;
        }
        _socket.close();
    },
    on: function (event, handler) {
        if (!eventEnum[event]) {
            console.error("Unsupported event type, got " + event);
            return;
        }
        _socket.on(event, handler);
    },
    emit: function (event, data) {
        if (!eventEnum[event]) {
            console.error("Unsupported event type, got " + event);
            return;
        }
        _socket.emit(event, data);
    }
};

function _onConnect() {
    _socket.on('connect', function () {
        _socket.emit("login", "robot");
        console.log("Connected to " + _serverAddress);
    });
    _socket.on('clientConnected', function (clientName) {
        if (clientName === "robot") {
            return;
        }
        _socket.emit("login", "robot");
    });
}

function _onConnectionError() {
    _socket.on('connect_error', function (error) {
        console.error("Failed to connect!", error);
    });
}

function _onReconnectAttempt() {
    _socket.on('reconnect_attempt', function () {
        console.log("Reconnecting to " + _serverAddress);
    });
}