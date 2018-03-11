const Log = require('../Common/Log');
const BaseSerializer = require('./BaseSerializer');

function reverseMap(map) {
    ret = {};
    Object.keys(map).forEach(key => {
        let val = map[key];
        if (ret[val])
            Log.warn("EnumSerializer: Duplicate value: " + ret[val] + ", " + key);
        ret[val] = key;
    });
    return ret;
}

class EnumSerializer extends BaseSerializer {

    constructor(name, enumMap, defaultValue, options) {
        super(name, options);

        this._defaultValue = defaultValue;
        this._enumMap = enumMap;
        this._reverseMap = reverseMap(enumMap);
    }

    /** @override */
    read(inputStream, object) {
        if (inputStream.isBinary()) {
            let value = inputStream.inputOperator.readInt()
            if (!this._reverseMap.hasOwnProperty(value)) {
                Log.warn("EnumSerializer: failed to find ENUM value " + value + " for serializer " + this.getName() + ". Setting to default value.")
                value = this._defaultValue;
            }
            object.setProperty(this.getName(), value);
        }
        else if (inputStream.inputOperator.matchString(this.getName())) {
            let key = inputStream.inputOperator.readString();
            let value = this._enumMap[value];
            if (!this._enumMap.hasOwnProperty(key)) {
                Log.warn("EnumSerializer: failed to find ENUM key " + key + " for serializer " + this.getName() + ". Setting to default value.")
                value = this._defaultValue;
            }
            object.setProperty(this.getName(), value);
        }
    }
}

module.exports = EnumSerializer;