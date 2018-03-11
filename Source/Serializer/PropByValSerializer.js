const assert = require('assert');
let BaseSerializer = require('./BaseSerializer')

function getTypeReaderFunction(reader, type) {
    let funcName = "read" + type;
    let typeReaderFunction = reader[funcName];
    assert(typeReaderFunction, "reader type: " + type + " not found");
    return typeReaderFunction.bind(reader);
}

const equalTypesDictionary = {
    HEXINT: "UInt",
    GLInt: "Int" // TODO validate GLInt defined as "Int"
};

const vectorDictionary = {
    Vec4d:{
        size: 4,
        type:"Double"
    }
};

class PropByValSerializer extends BaseSerializer {
    constructor(type, name, defaultValue, options = {}) {
        super(name, options);

        this._defaultValue = defaultValue;
        this._useHex = false;
        this._vectorSize = 0;
        if(vectorDictionary[type]){
            this._vectorSize = vectorDictionary[type].size;
            this._type = vectorDictionary[type].type;
        }
        else if (equalTypesDictionary[type]) {
            this._type = equalTypesDictionary[type];
            this._useHex = true;
        } else {
            this._type = type;
        }
    }

    read(inputStream, object) {
        let value;
        if(this._vectorSize > 0){
            value = inputStream.readVectorOfType(this._vectorSize,this._type)
        }
        else if (inputStream.isBinary()) {
            let typeReaderFunction = getTypeReaderFunction(inputStream.inputOperator, this._type);
            value = typeReaderFunction();
        } else if (inputStream.inputOperator.matchString(this._name)) {
            if (this._useHex)
            // the type doesn't metter - its all Number
                value = inputStream.inputOperator.readHex();
            else {
                let typeReaderFunction = getTypeReaderFunction(inputStream.inputOperator, this._type);
                value = typeReaderFunction();
            }
        }
        object.setProperty(this._name,value);
    }
}


module.exports = PropByValSerializer;