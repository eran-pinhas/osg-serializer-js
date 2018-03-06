const Log = require('../../Log');
const implementValidator = require('../../implementValidator');

function reverseMap(map){
    ret = {};
    Object.keys(map).forEach(key => {
        let val = map[key];
        if(ret[val])
            Log("EnumSerializer: Duplicate value: " + ret[val] +", "+key);
        ret[val] = key;
    })
    return ret;
}

function EnumSerializer(name,enumMap,defaultValue,options){
    this._name = name;
    this._defaultValue = defaultValue;
    this._enumMap = enumMap;
    this._reverseMap = reverseMap(enumMap);
    this._options = options || {};
}

EnumSerializer.prototype.read = function(inputStream,object){
    if ( inputStream.isBinary() )
    {
        let value = inputStream.inputOperator.readInt()
        if(!this._reverseMap.hasOwnProperty(value)){
            Log.warn("EnumSerializer: failed to find ENUM value " + value + " for serializer "+this._name + ". Setting to default value.")
            value = this._defaultValue;
        }
        object[this._name] = value;
    }
    else if ( inputStream.inputOperator.matchString(this._name) ){
        let key = inputStream.inputOperator.readString();
        let value = this._enumMap[value];
        if(!this._enumMap.hasOwnProperty(key)){
            Log.warn("EnumSerializer: failed to find ENUM key " + key + " for serializer "+this._name + ". Setting to default value.")
            value = this._defaultValue;
        }
        object[this._name] = value;
    }
}

EnumSerializer.prototype.getName = function() {
    return this._name
} 

EnumSerializer.prototype.getMinVersion = function() {
    return this._options.minVersion || 0;
} 

EnumSerializer.prototype.getMaxVersion = function() {
    return this._options.maxVersion || 1000000000;
} 

implementValidator(EnumSerializer,"serializer")

module.exports = EnumSerializer;