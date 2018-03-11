require('../TypeSerializers/_SerializerInitiator');
const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const DataTypes = require('../Common/DataTypes');
const Constants = require('../Common/Constants');
const Image = require('../OsgTypes/Image');
const {ObjectProperty} = require('../Common/DataTypes');
const Log = require('../Common/Log');
const Base64Encoder = require('../Common/Base64Encoder');

const IMAGE_INLINE_DATA = 0;
const IMAGE_INLINE_FILE = 1;
const IMAGE_EXTERNAL = 2;
const IMAGE_WRITE_OUT = 3;

class InputStream {
    constructor(inputOperator) {
        /**
         * @type StreamOperator
         */
        this.inputOperator = inputOperator;
        this._identifierMap = {};
        this._arrayMap = {};
        this._fields = [];
        this.typeReaderMap = {};

        this.PROPERTY = new DataTypes.ObjectProperty();
        this.BEGIN_BRACKET = new DataTypes.ObjectMark("{", +Constants.INDENT_VALUE);
        this.END_BRACKET = new DataTypes.ObjectMark("}", -Constants.INDENT_VALUE);
    }

    readObject(existingObj) {
        let className = this.inputOperator.readString();
        if (className === "NULL")
            return null;
        this.readBeginBracket();
        this.readProperty("UniqueID");
        let obj, id = this.inputOperator.readUInt();
        if (this._identifierMap[id]) {
            this.advanceToCurrentEndBracket();
            obj = this._identifierMap[id];
        } else {
            obj = this.readObjectFields(className, id, existingObj);
            this.advanceToCurrentEndBracket();
        }
        return obj;
    };

    readObjectOfType(/*type*/) {
        return this.readObject();
    };

    readBeginBracket() {
        this.inputOperator.readObjectMark(this.BEGIN_BRACKET)
    };

    readEndBracket() {
        this.inputOperator.readObjectMark(this.END_BRACKET)
    };

    readPrimitiveSet() {
        if (this.getVersion() >= 112)
            return this.readObjectOfType("osg::PrimitiveSet");
        else {
            let numInstances = 0, primitive = null;
            let type = new ObjectProperty("PrimitiveType", 0, true);
            let mode = new ObjectProperty("PrimitiveType", 0, true);

            this.inputOperator.readObjectProperty(type);
            this.inputOperator.readObjectProperty(mode);
            if (this.getVersion() > 96)
                numInstances = this.inputOperator.readUInt();

            if (type.value === Constants.TypeIds.ID_DRAWARRAYS) {
                let first = this.inputOperator.readInt();
                let count = this.inputOperator.readInt();
                primitive = { // osg::DrawArrays
                    first,
                    count,
                    value: mode.value,
                    numInstances
                }
            } else if (type.value === Constants.TypeIds.ID_DRAWARRAY_LENGTH) {
                let first = this.inputOperator.readInt();
                let size = this.inputOperator.readUInt();
                this.readBeginBracket();
                primitive = { // osg::DrawArrayLengths
                    first,
                    value: mode.value,
                    data: [],
                    numInstances
                };
                for (let i = 0; i < size; i++) {
                    primitive.data.push(this.inputOperator.readInt());
                }
                this.readEndBracket();

            } else if (type.value === Constants.TypeIds.ID_DRAWELEMENTS_UBYTE) {
                primitive = { // osg::DrawElementsUByte
                    value: mode.value,
                    data: [],
                    numInstances
                };
                let size = this.inputOperator.readUInt();
                this.readBeginBracket();
                for (let i = 0; i < size; i++) {
                    primitive.data.push(this.inputOperator.readUByte());
                }
                this.readEndBracket();
            } else if (type.value === Constants.TypeIds.ID_DRAWELEMENTS_USHORT) {
                primitive = { // osg::DrawElementsUShort
                    value: mode.value,
                    data: [],
                    numInstances
                };
                let size = this.inputOperator.readUInt();
                this.readBeginBracket();
                for (let i = 0; i < size; i++) {
                    primitive.data.push(this.inputOperator.readUShort());
                }
                this.readEndBracket();
            } else if (type.value === Constants.TypeIds.ID_DRAWELEMENTS_UINT) {
                primitive = { // osg::DrawElementsUInt
                    value: mode.value,
                    data: [],
                    numInstances
                };
                let size = this.inputOperator.readUInt();
                this.readBeginBracket();
                for (let i = 0; i < size; i++) {
                    primitive.data.push(this.inputOperator.readUInt());
                }
                this.readEndBracket();
            } else {
                throw "InputStream.readPrimitiveSet: " + type.value + " ID not found";
            }
            return primitive;
        }
    }

    readProperty(value) {
        this.inputOperator.readObjectProperty(this.PROPERTY.set(value));
    }

    getTypeReader(type) {
        if (this.typeReaderMap[type]) {
            return this.typeReaderMap[type];
        }

        let funcName = "read" + type;

        let reader;
        // if the function exists in the InputOperator
        let typeReaderFunction = this.inputOperator[funcName];
        if (typeReaderFunction)
            reader = typeReaderFunction.bind(this.inputOperator);

        // if the function exists in the InputStream
        typeReaderFunction = this[funcName];
        if (typeReaderFunction)
            reader = typeReaderFunction.bind(this);

        if (reader) {
            this.typeReaderMap[type] = reader;
            return reader;
        }
        throw "reader type: " + type + " not found";
    }

    readVectorFromReader(size, reader) {
        let arr = []; // todo when reading array of vectors - maybe use single array fot all
        for (let i = 0; i < size; i++)
            arr.push(reader());
        return arr;
    }

    readVectorOfType(size, type) {
        return this.readVectorFromReader(size, this.getTypeReader(type));
    }

    readArray() {
        let array = null;
        this.readProperty("ArrayID");
        let id = this.inputOperator.readUInt("ArrayID");
        if (this._arrayMap[id])
            return this._arrayMap[id];

        let type = new ObjectProperty("ArrayType", 0, true);
        this.inputOperator.readObjectProperty(type);
        let io = this.inputOperator;
        if (type.value === Constants.TypeIds.ID_BYTE_ARRAY) {
            array = this.readArrayImplementation(() => io.readByte())
        } else if (type.value === Constants.TypeIds.ID_UBYTE_ARRAY) {
            array = this.readArrayImplementation(() => io.readUByte())
        } else if (type.value === Constants.TypeIds.ID_SHORT_ARRAY) {
            array = this.readArrayImplementation(() => io.readShort())
        } else if (type.value === Constants.TypeIds.ID_USHORT_ARRAY) {
            array = this.readArrayImplementation(() => io.readUShort())
        } else if (type.value === Constants.TypeIds.ID_INT_ARRAY) {
            array = this.readArrayImplementation(() => io.readInt())
        } else if (type.value === Constants.TypeIds.ID_UINT_ARRAY) {
            array = this.readArrayImplementation(() => io.readUInt())
        } else if (type.value === Constants.TypeIds.ID_FLOAT_ARRAY) {
            array = this.readArrayImplementation(() => io.readFloat())
        } else if (type.value === Constants.TypeIds.ID_DOUBLE_ARRAY) {
            array = this.readArrayImplementation(() => io.readDouble())
        } else if (type.value === Constants.TypeIds.ID_VEC2B_ARRAY) {
            let reader = this.getTypeReader("Byte");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3B_ARRAY) {
            let reader = this.getTypeReader("Byte");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4B_ARRAY) {
            let reader = this.getTypeReader("Byte");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2UB_ARRAY) {
            let reader = this.getTypeReader("UByte");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3UB_ARRAY) {
            let reader = this.getTypeReader("UByte");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4UB_ARRAY) {
            let reader = this.getTypeReader("UByte");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2S_ARRAY) {
            let reader = this.getTypeReader("Short");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3S_ARRAY) {
            let reader = this.getTypeReader("Short");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4S_ARRAY) {
            let reader = this.getTypeReader("Short");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2US_ARRAY) {
            let reader = this.getTypeReader("UShort");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3US_ARRAY) {
            let reader = this.getTypeReader("UShort");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4US_ARRAY) {
            let reader = this.getTypeReader("UShort");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2_ARRAY) {
            let reader = this.getTypeReader("Float");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3_ARRAY) {
            let reader = this.getTypeReader("Float");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4_ARRAY) {
            let reader = this.getTypeReader("Float");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2D_ARRAY) {
            let reader = this.getTypeReader("Double");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3D_ARRAY) {
            let reader = this.getTypeReader("Double");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4D_ARRAY) {
            let reader = this.getTypeReader("Double");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2I_ARRAY) {
            let reader = this.getTypeReader("Int");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3I_ARRAY) {
            let reader = this.getTypeReader("Int");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4I_ARRAY) {
            let reader = this.getTypeReader("Int");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC2UI_ARRAY) {
            let reader = this.getTypeReader("UInt");
            array = this.readArrayImplementation(() => this.readVectorFromReader(2, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC3UI_ARRAY) {
            let reader = this.getTypeReader("UInt");
            array = this.readArrayImplementation(() => this.readVectorFromReader(3, reader));
        } else if (type.value === Constants.TypeIds.ID_VEC4UI_ARRAY) {
            let reader = this.getTypeReader("UInt");
            array = this.readArrayImplementation(() => this.readVectorFromReader(4, reader));
        } else {
            throw "InputStream.readArray(): Unsupported array type."
        }
        this._arrayMap[id] = array;
        return array;

    }

    readArrayImplementation(readFunction) {
        let size = this.inputOperator.readInt();
        this.readBeginBracket();

        let arr = [];
        if (size > 0) {
            // presets the size of arr so the array will not be extended with every push
            arr[size - 1] = null;
            for (let i = 0; i < size; i++) {
                arr[i] = readFunction();
            }
        }

        this.readEndBracket();
        return arr
    }

    getVersion(/*domain*/) { // domain currently not implemented
        return this.inputOperator.version;
    }

    advanceToCurrentEndBracket() {
        this.inputOperator.advanceToCurrentEndBracket();
    };

    isBinary() {
        return this.inputOperator.isBinary();
    }

    readObjectFields(classname, id, existingObj) {
        let wrapper = ObjectWrapperManager.findWrapper(classname);
        if (!wrapper) {
            throw (classname + ": wrapper for class not found")
        }
        let inputVersion = this.inputOperator.version;
        let obj = existingObj || wrapper.createInstance();
        this._identifierMap[id] = obj;
        wrapper.associates.forEach(associate => {
            if (associate.minVersion <= inputVersion && associate.maxVersion >= inputVersion) {
                let associateWrapper = ObjectWrapperManager.findWrapper(associate.name);
                if (!associateWrapper) {
                    Log.warn(associate.name + ": wrapper for associate not found. continuing to next associate");
                } else {
                    this._fields.push(associateWrapper.getName());
                    associateWrapper.read(this, obj);
                    this._fields.pop();
                }
            } else {
                // associate is not supported in version
            }
        });
        return obj
    }

    readImage(readFromExternal = true) {
        if (this.getVersion() > 94) {
            this.readProperty("ClassName");
            this.inputOperator.readString();
        }
        this.readProperty("UniqueID");
        let id = this.inputOperator.readUInt();
        if (this._identifierMap[id]) {
            return this._identifierMap[id];
        }
        this.readProperty("FileName");
        let name = this.inputOperator.readWrappedString();
        this.readProperty("WriteHint");
        let writeHint = this.inputOperator.readInt();
        let decision = this.inputOperator.readInt();
        let image = null;

        if (decision === IMAGE_INLINE_DATA) {
            if (this.isBinary()) {
                let origin = this.inputOperator.readInt();
                let s = this.inputOperator.readInt();
                let t = this.inputOperator.readInt();
                let r = this.inputOperator.readInt();
                let internalFormat = this.inputOperator.readInt();
                let pixelFormat = this.inputOperator.readInt();
                let dataType = this.inputOperator.readInt();
                let packing = this.inputOperator.readInt();
                let mode = this.inputOperator.readInt();
                let size = this.inputOperator.readUInt();

                if (size > 0) {
                    let data = this.inputOperator.readBuffer(size);
                    image = new Image();
                    image.setProperty("Origin", origin);
                    image.setImage(s, t, r, internalFormat, pixelFormat, dataType, data, 1);
                }
                let levelSize = this.inputOperator.readUInt();
                let levels = [];
                for (let i = 0; i < levelSize; i++) {
                    levels.push(this.inputOperator.readUInt());
                }
                if ( image && levelSize>0 )
                    image.setProperty("Levels", levels );
                readFromExternal = false;
            } else { //Ascii
                this.readProperty("Origin");
                let origin = this.inputOperator.readInt();
                this.readProperty("Size");
                let s = this.inputOperator.readInt();
                let t = this.inputOperator.readInt();
                let r = this.inputOperator.readInt();
                this.readProperty("InternalTextureFormat");
                let internalFormat = this.inputOperator.readInt();
                this.readProperty("PixelFormat");
                let pixelFormat = this.inputOperator.readInt();
                this.readProperty("DataType");
                let dataType = this.inputOperator.readInt();
                this.readProperty("Packing");
                let packing = this.inputOperator.readInt();
                this.readProperty("AllocationMode");
                this.readProperty("Data");
                let levelSize = this.inputOperator.readUInt()-1;
                this.readBeginBracket();
                let encodedData = [];
                 // total size: levelSize+1
                for(let i = 0 ; i<=levelSize ; i++){
                    encodedData.push(this.inputOperator.readWrappedString());
                }

                let levels = [];
                Base64Encoder.decodeArray(encodedData,levels);
                levels.pop();
                this.readEndBracket();

                image = new Image();
                image.setProperty("Origin", origin);
                image.setImage(s, t, r, internalFormat, pixelFormat, dataType, data,mode, packing);

                if ( levelSize>0 )
                    image.setProperty("Levels", levels );

                readFromExternal = false;
            }
        } else if (decision === IMAGE_INLINE_FILE){
            if(this.isBinary()){
                let size = this.inputOperator.readUInt();
                let data = this.inputOperator.readBuffer(size);
                image = new Image();
                image.setProperty("Data",data);
                readFromExternal = false;
            }
        }

        // let loadedFromCache = false; // not implemented

        if ( readFromExternal && name !== ""){
            Log.warn("InputStream,readImage - reading from external file - not implemented")
        }

        //if(loadedFromCache){}else{}

        image = this.readObjectFields("osg::Object", id, image);
        image.setProperty("Name",name);
        image.setProperty("WriteHint",name);

        this._identifierMap[id] = image;
    }
}

module.exports = InputStream;