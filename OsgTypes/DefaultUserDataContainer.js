UserDataContainer = require("./UserDataContainer");

class DefaultUserDataContainer extends UserDataContainer{
    constructor(){
        super();

        this.Type = "Osg::DefaultUserDataContainer";
    }
}

module.exports = DefaultUserDataContainer