ObjectClass = require("./Object");

class UserDataContainer extends ObjectClass{
    constructor(){
        super();

        this.DescriptionList = [];
        this.ObjectList = [];
        this.UserData = null;

        this.Type = "Osg::UserDataContainer";
    }
}

module.exports = UserDataContainer