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



class MatrixSerializer extends BaseSerializer {
    constructor(name, options = {}) {
        super(name, options);

        this._type = options.type || "Double";
    }

    /** @override */
    read(inputStream, object) {

        let matrix = [];
        if (inputStream.isBinary()) {
            inputStream.readMatrix(this._type);
        }
        else if(inputStream.inputOperator.matchString(this.getName())){
            inputStream.readMatrix(this._type);
        }

        if(matrix){
            object.setProperty(this.getName(), matrix);
        }
    }
}

module.exports = MatrixSerializer;