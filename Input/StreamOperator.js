function notImplemented(name,funcName){
    throw "function " + funcName + "Not Implemented in " + name
}
class StreamOperator {
    constructor(name){
        this.name = name;
    }
    readUInt(){notImplemented(this.name,"readUInt")}
    readInt(){notImplemented(this.name,"readInt")}
    readChar(){notImplemented(this.name,"readChar")}
    readBool(){notImplemented(this.name,"readBool")}
    readString(){notImplemented(this.name,"readString")}
    readObjectProperty(){notImplemented(this.name,"readObjectProperty")}
    readObjectMark(){notImplemented(this.name,"readObjectMark")}
    advanceToCurrentEndBracket(){notImplemented(this.name,"advanceToCurrentEndBracket")}
    isBinary(){notImplemented(this.name,"isBinary")}
    readWrappedString(){notImplemented(this.name,"readWrappedString")}
    readGLenum(){notImplemented(this.name,"readGLenum")}
    readFloat(){notImplemented(this.name,"readFloat")}
    readDouble(){notImplemented(this.name,"readDouble")}
}

module.exports = StreamOperator;