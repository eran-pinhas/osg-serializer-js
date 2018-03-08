const BaseSerializer = require('./BaseSerializer');

/**
 *
 * @param {InputStream} inputStream
 * @param {string} type
 * @return {function}
 */
function getTypeReaderFunction(inputStream, type) {
    let funcName = "read" + type;

    // if the function exists in the InputOperator
    let typeReaderFunction = inputStream.inputOperator[funcName];
    if(typeReaderFunction)
        return typeReaderFunction.bind(inputStream.inputOperator);

    // if the function exists in the InputStream
    typeReaderFunction = inputStream[funcName];
    if(typeReaderFunction)
        return typeReaderFunction.bind(inputStream);

    throw "reader type: " + type + " not found";
}

class VectorSerializer extends BaseSerializer {
    constructor(name, type, options) {
        super(name, options);
        this._type = type;
    }

    /** @override */
    read(inputStream, object) {

        let typeReaderFunction = getTypeReaderFunction(inputStream, this._type);
        let list = [];
        if (inputStream.isBinary()) {
            let size = inputStream.inputOperator.readUInt();

            for(let i = 0 ; i< size ; i++){
                list.push(typeReaderFunction())
            }
        }
        else if(inputStream.inputOperator.matchString(this.getName())){
            let size = inputStream.inputOperator.readUInt();
            if(size > 0){
                inputStream.readBeginBracket();

                for(let i = 0 ; i< size ; i++){
                    list.push(typeReaderFunction())
                }

                inputStream.readEndBracket();
            }
        }

        if(list.length > 0){
            object.setProperty(this._name, list);
        }
    }
}

module.exports = VectorSerializer;