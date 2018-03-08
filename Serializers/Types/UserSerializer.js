const BaseSerializer = require('./BaseSerializer');

class UserSerializer extends BaseSerializer {
    constructor(name, reader, options) {
        super(name, options);
        this._reader = reader;
    }

    read(inputStream, object) {
        if (inputStream.isBinary()) {
            if (!inputStream.inputOperator.readBool()) {
                return;
            }
        }
        else {
            if (!inputStream.inputOperator.matchString(this.getName()))
                return;
        }
        this._reader(inputStream, object);
    }
}

module.exports = UserSerializer;