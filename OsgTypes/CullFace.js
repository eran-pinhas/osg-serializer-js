const StateAttribute = require('./StateAttribute');
const FaceMode = require('../Enum/CullFace_FaceMode');

class CullFace extends StateAttribute{
    constructor(){
        super();
        this.Type = "osg::CullFace";
        this.Mode = FaceMode.BACK;
    }
}

module.exports = CullFace;