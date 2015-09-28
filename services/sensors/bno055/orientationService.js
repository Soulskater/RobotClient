var raspi = require('raspi');
var gpio = require('raspi-gpio');
var serialPort = require("../../syncSerialDataService")
var sensorAddresses = require('./BNO055Addresses');
var deasync = require('deasync');
var fs = require('fs');
var jsonB = require('json-buffer');
var path = require('path');
var q = require('q');

module.exports = function (rstPin, serialPortName) {
    var _serialPort;
    var _rstGpio;
    var _modeAddress;
    var _sensorId;
    var _lastStatus = null;

    return {
        begin: _begin,
        getCalibrationStatus: _getCalibrationStatus,
        getCalibrationData: _getCalibrationData,
        setCalibrationData: _setCalibrationData,
        loadCalibration: _loadCalibration,
        calibrateSensor: _calibrateSensor,
        getSystemStatus: _getSystemStatus,
        readMagnetometer: _readMagnetometer,
        readGyroscope: _readGyroscope,
        readAccelerometer: _readAccelerometer,
        readLinearAcceleration: _readLinearAcceleration,
        readGravity: _readGravity,
        readEuler: _readEuler,
        readQuaternion: _readQuaternion,
        readTemp: _readTemp
    };

    function _begin(modeAddress) {
        _modeAddress = modeAddress || sensorAddresses.operation_mode_ndof;
        var initialized = false;
        raspi.init(function () {
            _rstGpio = new gpio.DigitalOutput(rstPin);
            _serialPort = new serialPort(serialPortName, {
                baudrate: 115200
            });
            console.info('Writing to BNO055');
            _writeByte(sensorAddresses.bno055_page_id_addr, 0);
            deasync.sleep(650);
            _setConfigMode();
            _writeByte(sensorAddresses.bno055_page_id_addr, 0);
            _sensorId = _readByte(sensorAddresses.bno055_chip_id_addr);
            console.info('Read chip ID: 0x%s', _sensorId);
            if (_sensorId !== sensorAddresses.bno055_id) {
                throw new Error("Invalid chip id");
            }
            if (_rstGpio) {
                _rstGpio.write(gpio.LOW);
                deasync.sleep(10);
                _rstGpio.write(gpio.HIGH);
            }
            else {
                _writeByte(sensorAddresses.bno055_sys_trigger_addr, 0x20);
            }
            _writeByte(sensorAddresses.bno055_pwr_mode_addr, sensorAddresses.power_mode_normal);
            _writeByte(sensorAddresses.bno055_sys_trigger_addr, 0x0);
            _setOperationMode();
            deasync.sleep(500);
            initialized = true;
        });
        while (!initialized) {
            deasync.sleep(10);
        }
    }

    function _writeBytes(address, dataArray) {
        var hasResult = false;
        var results = [];
        var command = [];
        command[0] = 0xAA;  //Start byte
        command[1] = 0x00;  //Write
        command[2] = address & 0xFF;
        command[3] = dataArray.length & 0xFF;
        command = command.concat(dataArray.map(function (item) {
            return item & 0xFF;
        }));
        var attempts = 0;
        _serialPort.write(command, function (dataBuffer) {
            if (dataBuffer[0] != 0xEE && dataBuffer[0] != 0x01) {
                if (attempts === 5) {
                    throw Error("Register write error", dataBuffer);
                }
                attempts++;
                return false;
            }
            var dataLength = dataBuffer[1];
            results = dataBuffer.slice(2, 2 + dataLength);
            hasResult = true;
            return true;
        });
        while (!hasResult) {
            deasync.sleep(10);
        }
        return results;
    }

    function _writeByte(address, value) {
        var results = [];
        var hasResult = false;
        var command = [];
        command[0] = 0xAA;  //Start byte
        command[1] = 0x00;  //Write
        command[2] = address & 0xFF;
        command[3] = 1; // 1 byte
        command[4] = value & 0xFF;
        var attempts = 0;
        _serialPort.write(command, function (dataBuffer) {
            if (dataBuffer[0] != 0xEE && dataBuffer[0] != 0x01) {
                if (attempts === 5) {
                    throw Error("Register write error", dataBuffer);
                }
                attempts++;
                return false;
            }
            var dataLength = dataBuffer[1];
            results = dataBuffer.slice(2, 2 + dataLength);
            hasResult = true;
            return true;
        });
        while (!hasResult) {
            deasync.sleep(10);
        }
        return results;
    }

    function _readBytes(address, length) {
        var hasResult = false;
        var results = [];
        var command = [];
        command[0] = 0xAA;  //Start byte
        command[1] = 0x01;  //Read
        command[2] = address & 0xFF;
        command[3] = length & 0xFF;
        var attempts = 0;
        _serialPort.write(command, function (dataBuffer) {
            if (dataBuffer[0] != 0xBB || dataBuffer[1] !== length) {
                if (attempts === 5) {
                    console.error("Register read error, address: 0x" + address.toString(16) + ", result:", dataBuffer);
                }
                attempts++;
                return false;
            }
            var dataLength = dataBuffer[1];
            results = dataBuffer.slice(2, 2 + dataLength);
            hasResult = true;
            return true;
        });
        while (!hasResult) {
            deasync.sleep(5);
        }
        return results;
    }

    function _readByte(address) {
        return _readBytes(address, 1)[0];
    }

    function _setMode(modeAddress) {
        _writeByte(sensorAddresses.bno055_opr_mode_addr, modeAddress & 0xFF);
        deasync.sleep(30);
    }

    function _setConfigMode() {
        _setMode(sensorAddresses.operation_mode_config);
    }

    function _setOperationMode() {
        return _setMode(_modeAddress);
    }

    function _readVector(address, count) {
        count = count || 3;
        var data = _readBytes(address, count * 2);
        var result = [];
        for (var i = 0; i < count; i++) {
            result[i] = ((data[i * 2 + 1] << 8) | data[i * 2]) & 0xFFFF;
            if (result[i] > 32767) {
                result[i] -= 65536;
            }
        }
        return result;
    }

    // Read an 8-bit signed value from the provided register address.
    function _readSignedByte(address) {
        var data = _readByte(address);
        if (data > 127) {
            return data - 256;
        }
        else {
            return data;
        }
    }

    function _getSystemStatus() {
        var runSelfTest = true;
        _serialPort.flush();
        //Return a tuple with status information.  Three values will be returned:
        //- System status register value with the following meaning:
        //    0 = Idle
        //1 = System Error
        //2 = Initializing Peripherals
        //3 = System Initialization
        //4 = Executing Self-Test
        //5 = Sensor fusion algorithm running
        //6 = System running without fusion algorithms
        //- Self test result register value with the following meaning:
        //    Bit value: 1 = test passed, 0 = test failed
        //Bit 0 = Accelerometer self test
        //Bit 1 = Magnetometer self test
        //Bit 2 = Gyroscope self test
        //Bit 3 = MCU self test
        //Value of 0x0F = all good!
        //    - System error register value with the following meaning:
        //    0 = No error
        //1 = Peripheral initialization error
        //2 = System initialization error
        //3 = Self test result failed
        //4 = Register map value out of range
        //5 = Register map address out of range
        //6 = Register map write error
        //7 = BNO low power mode not available for selected operation mode
        //8 = Accelerometer power mode not available
        //9 = Fusion algorithm configuration error
        //10 = Sensor configuration error
        //If run_self_test is passed in as False then no self test is performed and
        //None will be returned for the self test result.  Note that running a
        //self test requires going into config mode which will stop the fusion
        //engine from running.
        if (runSelfTest) {
            _setConfigMode();
            var sysTrigger = _readByte(sensorAddresses.bno055_sys_trigger_addr);
            _writeByte(sensorAddresses.bno055_sys_trigger_addr, sysTrigger | 0x1);
            deasync.sleep(1000);
            var selfTest = _readByte(sensorAddresses.bno055_selftest_result_addr);
            _setOperationMode();
            var status = _readByte(sensorAddresses.bno055_sys_stat_addr);
            var error = _readByte(sensorAddresses.bno055_sys_err_addr);
            return {status: status, selfTest: selfTest, error: error};
        }
    }

    function _getCalibrationStatus() {
        //Read the calibration status of the sensors and return a 4 tuple with
        //calibration status as follows:
        // - System, 3=fully calibrated, 0=not calibrated
        // - Gyroscope, 3=fully calibrated, 0=not calibrated
        // - Accelerometer, 3=fully calibrated, 0=not calibrated
        // - Magnetometer, 3=fully calibrated, 0=not calibrated
        var calStatus = _readByte(sensorAddresses.bno055_calib_stat_addr);
        var sys = (calStatus >> 6) & 0x03;
        var gyro = (calStatus >> 4) & 0x03;
        var accel = (calStatus >> 2) & 0x03;
        var mag = calStatus & 0x03;
        return {
            sys: sys,
            gyro: gyro,
            accel: accel,
            mag: mag
        }
    }

    function _saveCalibration(calibrationData) {
        var accelCalData = jsonB.stringify(calibrationData.accelData);
        var magCalData = jsonB.stringify(calibrationData.magData);
        var gyroCalData = jsonB.stringify(calibrationData.gyroData);
        var radiusCalData = jsonB.stringify(calibrationData.radiusData);
        var filePath = path.join(__dirname, './calibrationData.txt');
        var data = accelCalData + "\n" + magCalData + "\n" + gyroCalData + "\n" + radiusCalData;
        fs.writeFile(filePath, data, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }

    function _loadCalibration() {
        var filePath = path.join(__dirname, './calibrationData.txt');
        var stringContent = fs.readFileSync(filePath, "utf8");
        var calibrationRawData = stringContent.split("\n");
        if (calibrationRawData.length != 4) {
            throw Error("Calibration data is not valid.");
        }
        var accelCalData = toByteArray(jsonB.parse(calibrationRawData[0]));
        var magCalData = toByteArray(jsonB.parse(calibrationRawData[1]));
        var gyroCalData = toByteArray(jsonB.parse(calibrationRawData[2]));
        var radiusCalData = toByteArray(jsonB.parse(calibrationRawData[3]));
        _setCalibrationData({
            accelData: accelCalData,
            magData: magCalData,
            gyroData: gyroCalData,
            radiusData: radiusCalData
        });
    }

    function _setCalibrationData(calibrationData) {
        _setConfigMode();
        _writeBytes(sensorAddresses.accel_offset_x_lsb_addr, calibrationData.accelData);
        _writeBytes(sensorAddresses.mag_offset_x_lsb_addr, calibrationData.magData);
        _writeBytes(sensorAddresses.gyro_offset_x_lsb_addr, calibrationData.gyroData);
        _writeBytes(sensorAddresses.accel_radius_lsbaddr, calibrationData.radiusData);
        _setOperationMode();
    }

    function _getCalibrationData() {
        _setConfigMode();
        var accelCalData = _readBytes(sensorAddresses.accel_offset_x_lsb_addr, 6);
        var magCalData = _readBytes(sensorAddresses.mag_offset_x_lsb_addr, 6);
        var gyroCalData = _readBytes(sensorAddresses.gyro_offset_x_lsb_addr, 6);
        var radiusCalData = _readBytes(sensorAddresses.accel_radius_lsbaddr, 4);
        _setOperationMode();
        return {
            accelData: toByteArray(accelCalData),
            magData: toByteArray(magCalData),
            gyroData: toByteArray(gyroCalData),
            radiusData: toByteArray(radiusCalData)
        };
    }

    function _calibrateSensor() {
        var status = _getCalibrationStatus();
        console.log("Calibration status", status);
        if (!_lastStatus || _lastStatus.sys < status.sys || _lastStatus.gyro < status.gyro || _lastStatus.accel < status.accel || _lastStatus.mag < status.mag) {
            var calibrationData = _getCalibrationData();
            _saveCalibration(calibrationData);
            _lastStatus = status;
        }

        if (_lastStatus.sys === 3 && _lastStatus.gyro === 3 && _lastStatus.accel === 3 && _lastStatus.mag === 3) {
            console.log("Calibration succeeded!");
        }
        /*else {
         _calibrateSensor();
         }*/
    }

    function toByteArray(buffer) {
        return Array.prototype.slice.call(buffer, 0);
    }

    function _readGyroscope() {
        var vector = _readVector(sensorAddresses.bno055_gyro_data_x_lsb_addr);
        return {
            x: Math.floor(vector[0] / 900.0),
            y: Math.floor(vector[1] / 900.0),
            z: Math.floor(vector[2] / 900.0)
        };
    }

    function _readAccelerometer() {
        var vector = _readVector(sensorAddresses.bno055_accel_data_x_lsb_addr);
        return {
            x: Math.floor(vector[0] / 100.0),
            y: Math.floor(vector[1] / 100.0),
            z: Math.floor(vector[2] / 100.0)
        };
    }

    function _readMagnetometer() {
        var vector = _readVector(sensorAddresses.bno055_mag_data_x_lsb_addr);
        return {
            x: Math.floor(vector[0] / 16.0),
            y: Math.floor(vector[1] / 16.0),
            z: Math.floor(vector[2] / 16.0)
        };
    }

    function _readEuler() {
        var vector = _readVector(sensorAddresses.bno055_euler_h_lsb_addr);
        return {
            heading: Math.floor(vector[0] / 16.0),
            roll: Math.floor(vector[1] / 16.0),
            pitch: Math.floor(vector[2] / 16.0)
        };
    }

    function _readLinearAcceleration() {
        var vector = _readVector(sensorAddresses.bno055_linear_accel_data_x_lsb_addr);
        return {
            x: Math.floor(vector[0] / 100.0),
            y: Math.floor(vector[1] / 100.0),
            z: Math.floor(vector[2] / 100.0)
        };
    }

    function _readGravity() {
        var vector = _readVector(sensorAddresses.bno055_gravity_data_x_lsb_addr);
        return {
            heading: Math.floor(vector[0] / 100.0),
            roll: Math.floor(vector[1] / 100.0),
            pitch: Math.floor(vector[2] / 100.0)
        };
    }

    function _readQuaternion() {
        var vector = _readVector(sensorAddresses.bno055_quaternion_data_w_lsb_addr, 4);
        var scale = (1.0 / (1 << 14));
        return {
            w: Math.floor(vector[0] * scale),
            x: Math.floor(vector[1] * scale),
            y: Math.floor(vector[2] * scale),
            z: Math.floor(vector[3] * scale)
        };
    }

    function _readTemp() {
        var temp = Math.floor(_readSignedByte(sensorAddresses.bno055_temp_addr));
        return isNaN(temp) ? 0 : temp;
    }
};