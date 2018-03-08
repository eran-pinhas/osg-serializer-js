StreamOperator = require('./StreamOperator');
Log = require('../Common/Log');

class BinaryStreamOperator extends StreamOperator{
    constructor(buffer, initPosition) {
        super("BinaryStreamOperator");

        this.supportBinaryBrackets = false;
        this.version = -1;
        this._buffer = buffer;
        this._position = initPosition;
        this._beginPositions = [];
        this._blockSizes = [];
    }

    isBinary() {
        return true;
    }

    advanceToCurrentEndBracket() {
        if (this.supportBinaryBrackets && this._beginPositions.length > 0) {
            let position = this._beginPositions.pop();
            position += this._blockSizes.pop();
            this._position = position;
        }
    }

    readObjectProperty(prop) {
        let value = 0;
        if (prop.mapProperty)
            value = this.readInt();
        prop.set(value)
    }

    readObjectMark(mark) {
        if (this.supportBinaryBrackets) {
            if (mark.name === "{") {
                this._beginPositions.push(this._position);
                if (this.version !== -1 && this.version > 148) {
                    // 64bit size
                    let sizeLow = this.readInt();
                    let sizeHigh = this.readInt();
                    if (sizeHigh > Math.pow(2, 21))
                        throw "Too high value - size of file. nodeJS can manage 2^53 numbers only";
                    let size = Math.pow(2, 32) * sizeHigh + sizeLow;
                    this._blockSizes.push(size);
                } else {
                    let size = this.readInt();
                    this._blockSizes.push(size);
                }
            }
            else if (mark.name === "}" && this._beginPositions.length > 0) {
                this._beginPositions.pop();
                this._blockSizes.pop();
            }
        }
    }

    readBool() {
        let ch = this.readChar().charCodeAt(0);
        if(ch > 1)
            Log.warn("found boolean who is not 0 or 1 - "+ch+". may indicate failure in reading binary")
        return (ch !== 0)
    }

    readByte() {
        this._position += 1;
        return this._buffer.readInt8(this._position - 1);
    }

    readUByte() {
        this._position += 1;
        return this._buffer.readUInt8(this._position - 1);
    }

    readShort() {
        this._position += 2;
        return this._buffer.readInt16LE(this._position - 2);
    }

    readUShort() {
        this._position += 2;
        return this._buffer.readUInt16LE(this._position - 2);
    }

    readInt() {
        this._position += 4;
        return this._buffer.readInt32LE(this._position - 4);
    }

    readUInt() {
        this._position += 4;
        return this._buffer.readUInt32LE(this._position - 4);
    }

    readFloat() {
        this._position += 4;
        return this._buffer.readFloatLE(this._position - 4);
    }

    readDouble() {
        this._position += 8;
        return this._buffer.readDoubleLE(this._position - 4);
    }

    readChar() {
        this._position += 1;
        return this._buffer.toString("ASCII", this._position - 1, this._position);
    }

    readString() {
        let size = this.readUInt();
        this._position += size;
        return this._buffer.toString("ASCII", this._position - size, this._position);
    }

    readWrappedString() {
        return this.readString();
    }

    readGLEnum(objectGLEnum) {
        objectGLEnum.value = this.readUInt();
    }

}

module.exports = BinaryStreamOperator;