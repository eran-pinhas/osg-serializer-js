const BaseSerializer = require('./BaseSerializer');

class ObjectSerializer extends BaseSerializer {
    constructor(name, defaultValue, options) {
        super(name, options);
        this._defaultValue = defaultValue;
    }

    read(inputStream, object) {
        if (inputStream.isBinary()) {
            let hasObject = inputStream.inputOperator.readBool();
            if (hasObject) {
                object[this._name] = inputStream.readObjectOfType()
            }
        } else if (inputStream.inputOperator.matchString(this._name)) {
            let hasObject = inputStream.inputOperator.readBool();
            if (hasObject) {
                inputStream.readBeginBracket();
                object[this._name] = inputStream.readObjectOfType()
                inputStream.readEndBracket();
            }
        }
    }
}

module.exports = ObjectSerializer;