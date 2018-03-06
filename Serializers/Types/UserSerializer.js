const implementValidator = require('../../implementValidator');

function UserSerializer(name, reader, options) {
    this._name = name;
    this._reader = reader;
    this._options = options || {};
    //console.log(this._name,this._options)
}

UserSerializer.prototype.read = function (inputStream, object) {
    if (inputStream.isBinary()) {
        if (!inputStream.inputOperator.readBool()) {
            return;
        }
    }
    else {
        if (!inputStream.inputOperator.matchString(this._name))
            return;
    }
    this._reader(inputStream, object);
};

UserSerializer.prototype.getName = function () {
    return this._name
};

UserSerializer.prototype.getMinVersion = function () { // TODO refactor all serializers to inherit from baseSerializer
    //console.log(this._name,this._options)
    return this._options.minVersion || 0;
};

UserSerializer.prototype.getMaxVersion = function () {
    return this._options.maxVersion || 1000000000;
};

implementValidator(UserSerializer, "serializer")

module.exports = UserSerializer;