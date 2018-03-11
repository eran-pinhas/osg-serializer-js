const StateAttribute = require('./StateAttribute');
const InternalFormatMode = require('../Enum/Texture_InternalFormatMode');
class Texture extends StateAttribute{
    constructor(){
        super();

        this.InternalFormatMode = 0;
        this.InternalFormat = 0;
        this.Type = "Osg::Texture";
    }

    computeInternalFormatType(){
        // TODO
    }

    setInternalFormat(internalFormat){
        this.InternalFormatMode = InternalFormatMode.USE_USER_DEFINED_FORMAT;
        this.InternalFormat = internalFormat;
        computeInternalFormatType();
    }

}

module.exports = Texture;