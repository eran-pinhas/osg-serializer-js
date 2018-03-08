const assert = require('assert');
let BaseSerializer = require('./BaseSerializer')

function getTypeReaderFunction(reader, type) {
    let funcName = "read" + type;
    let typeReaderFunction = reader[funcName];
    assert(typeReaderFunction, "reader type: " + type + " not found");
    return typeReaderFunction.bind(reader);
}

const hex = {
    HEXINT: "UInt"
};

class PropByValSerializer extends BaseSerializer {
    constructor(type, name, defaultValue, options = {}) {
        super(name, options);

        this._defaultValue = defaultValue;
        if (hex[type]) {
            this._type = hex[type];
            this._useHex = true;
        } else {
            this._type = type;
            this._useHex = options.useHex || false;
        }
    }

    read(inputStream, object) {
        //     debugger;
        if (inputStream.isBinary()) {
            let typeReaderFunction = getTypeReaderFunction(inputStream.inputOperator, this._type);
            object[this._name] = typeReaderFunction();
        } else if (inputStream.inputOperator.matchString(this._name)) {
            if (this._useHex)
            // the type doesn't metter - its all Number
                object[this._name] = inputStream.inputOperator.readHex();
            else {
                let typeReaderFunction = getTypeReaderFunction(inputStream.inputOperator, this._type);
                object[this._name] = typeReaderFunction();
            }
        }
    }
}


module.exports = PropByValSerializer;