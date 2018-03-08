const LEVELS = {
    LOG: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
};

let logHandler = null;

function applyLog(message, level) {

    let messagePrefix = "";
    if (level > LEVELS.LOG) {
        messagePrefix = Object.keys(LEVELS).filter(key => LEVELS[key] === level) + " : ";
    }
    if (level > Log.level) {
        console.log(messagePrefix + message);
    }
    if (logHandler) {
        try {
            logHandler(message, level)
        } catch (e) {
        }
    }
}

let Log = message => applyLog(message, LEVELS.LOG);


Log.log = message => applyLog(message, LEVELS.LOG);

Log.warn = message => applyLog(message, LEVELS.WARN);
Log.error = message => applyLog(message, LEVELS.ERROR);
Log.fatal = message => applyLog(message, LEVELS.FATAL);
Log.setLogLog = () => {
    Log.level = LEVELS.LOG
};

Log.setLogWarn = () => {
    Log.level = LEVELS.WARN
};
Log.setLogError = () => {
    Log.level = LEVELS.ERROR
};
Log.setLogFatal = () => {
    Log.level = LEVELS.FATAL
};
Log.setLogOff = () => {
    Log.level = Number.MAX_VALUE
};

// Default logger - Warning
Log.level = LEVELS.WARN;

module.exports = Log;
