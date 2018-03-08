function notImplemented(name,funcName){
    throw "function " + funcName + " Not Implemented in " + name
}
class StreamOperator {
    constructor(name){
        this.name = name;
    }
    readChar(){notImplemented(this.name,"readChar")}
    readUByte(){notImplemented(this.name,"readUByte")} // TODO implement in binary
    readByte(){notImplemented(this.name,"readByte")} // TODO implement in binary
    readShort(){notImplemented(this.name,"readShort")} // TODO implement in binary
    readUShort(){notImplemented(this.name,"readUShort")} // TODO implement in binary
    readInt(){notImplemented(this.name,"readInt")}
    readUInt(){notImplemented(this.name,"readUInt")}
    readBool(){notImplemented(this.name,"readBool")}
    readString(){notImplemented(this.name,"readString")}
    /** @param {ObjectProperty} prop */
    readObjectProperty(prop){notImplemented(this.name,"readObjectProperty")}
    /** @param {ObjectMark} mark */
    readObjectMark(mark){notImplemented(this.name,"readObjectMark")}
    advanceToCurrentEndBracket(){notImplemented(this.name,"advanceToCurrentEndBracket")}
    isBinary(){notImplemented(this.name,"isBinary")}
    readWrappedString(){notImplemented(this.name,"readWrappedString")}
    readGLEnum(objectGLEnum){notImplemented(this.name,"readGLenum")}
    readFloat(){notImplemented(this.name,"readFloat")}
    readDouble(){notImplemented(this.name,"readDouble")}
}

module.exports = StreamOperator;