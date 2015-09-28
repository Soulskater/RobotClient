var sudo = require('sudo');
var q = require('q');

module.exports = {
    runScript: function (filePath, param) {
        var deferred = q.defer();
        var pythonProcess = sudo(['python', filePath, param || ""], {
            cachePassword: true
        });
        var output = "";
        pythonProcess.stdout.on('data', function (data) {
            output += data;
        });
        pythonProcess.on('exit', function (code) {
            if (code !== 0) {
                deferred.reject(code);
            }
            deferred.resolve(output);
        });

        return {
            process: pythonProcess,
            promise: deferred.promise
        };
    }
};
