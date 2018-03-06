require('./Serializers/_SerializerInitiator');
const ObjectWrapperManager = require('./ObjectWrapperManager');
const DataTypes = require('./DataTypes');
const Constants = require('./Constants');

function InputStream(inputOperator) {
    this.inputOperator = inputOperator;
    this._identifierMap = {};
    this._fields = [];

    this.PROPERTY = new DataTypes.ObjectProperty();
    this.BEGIN_BRACKET = new DataTypes.ObjectMark("{", +Constants.INDENT_VALUE);
    this.END_BRACKET = new DataTypes.ObjectMark("}", -Constants.INDENT_VALUE);
}

InputStream.prototype.readObject = function (existingObj) {
    let className = this.inputOperator.readString();
    if (className === "NULL")
        return null;
    this.readBeginBracket();
    this.inputOperator.readObjectProperty(this.PROPERTY.set("UniqueID"));
    let obj, id = this.inputOperator.readUInt();
    //console.log(id)
    if (this._identifierMap[id]) {
        this.advanceToCurrentEndBracket();
        obj = this._identifierMap[id];
    } else {
        obj = this.readObjectFields(className, id, existingObj);
        this.advanceToCurrentEndBracket();
    }
    return obj;
};

InputStream.prototype.readObjectOfType = function (/*type*/) {
    return this.readObject();
};

InputStream.prototype.readBeginBracket = function () {
    this.inputOperator.readObjectMark(this.BEGIN_BRACKET)
};
InputStream.prototype.readEndBracket = function () {
    this.inputOperator.readObjectMark(this.END_BRACKET)
};

// Todo: use this function
InputStream.prototype.readPropety = function (value) {
    this.inputOperator.readObjectProperty(this.PROPERTY.set(value));
};
InputStream.prototype.getVersion = function (/*domain*/) { // domain currently not implemented
    return this.inputOperator.version;
};

InputStream.prototype.advanceToCurrentEndBracket = function () {
    this.inputOperator.advanceToCurrentEndBracket();
};

InputStream.prototype.isBinary = function () {
    return this.inputOperator.isBinary();
};

InputStream.prototype.readVector = function (type,size) {
    let func = this.inputOperator["read" + type];
    if(!func){
        throw ("inputStream.readVector - read" + type + " function not found");
    }
    let returnArray = [];
    for(let i = 0 ; i<size ; i++){
        returnArray.push(func.call(this.inputOperator));
    }
    return returnArray;
};

InputStream.prototype.readObjectFields = function (classname, id, existingObj) {
    let wrapper = ObjectWrapperManager.findWrapper(classname);
    if (!wrapper) {
        throw (classname + ": wrapper for class not found")
    }
    let inputVersion = this.inputOperator.version;
    let obj = existingObj || wrapper.createInstance();
    this._identifierMap[id] = existingObj;
    wrapper.associates.forEach(associate => {
        if (associate.minVersion <= inputVersion && associate.maxVersion >= inputVersion) {
            let associateWrapper = ObjectWrapperManager.findWrapper(associate.name);
            if (!associateWrapper) {
                console.log(associate.name + ": wrapper for class not found. continuing to next associate");
            } else {
                this._fields.push(associateWrapper.name);
                associateWrapper.read(this, obj);
                this._fields.pop();
            }
        } else {
            // associate is not supported in version
        }
    });
    return obj
};

//

module.exports = InputStream;