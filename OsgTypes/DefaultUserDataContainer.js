ObjectClass = require("./Object");

function DefaultUserDataContainer(){
    
    ObjectClass.call(this)
    
    this.DescriptionList = [];
    this.ObjectList = [];
    this.UserData = null;
    
    this.Type = "Osg::DefaultUserDataContainer";
}

module.exports = DefaultUserDataContainer