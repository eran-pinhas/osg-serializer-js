const GLEnum = require('../Enum/GLEnum');
const ArrayTableEnum = require('../Enum/ArrayTableEnum');
const PrimitiveTableEnum = require('../Enum/PrimitiveTableEnum');

const _globalMap = {
    ArrayType: ArrayTableEnum,
    PrimitiveType: PrimitiveTableEnum,
    GL: GLEnum
};

const ObjectWrapperDictionary = {};

function readWrapperObject(wrapperName) {
    return function (inputStream, obj) {
        wrapperObject = ObjectWrapperDictionary[wrapperName];
        if (!wrapperObject) throw ("ObjectWrapperManager.readWrapperObject : " + wrapperName)
    }
}

module.exports = {

    getValue: function (group, str) {
        let map = _globalMap[group] || GLEnum;
        return map[str];
    },

    findWrapper: function (classname) {
        return ObjectWrapperDictionary[classname];
    },
    addWrapper: function (objectWrapper) {
        let classname = objectWrapper.getName();
        ObjectWrapperDictionary[classname] = objectWrapper;
    },
    readWrapperObject: readWrapperObject
}