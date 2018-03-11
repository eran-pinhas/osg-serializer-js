const Group = require('./Group');
class Transform extends Group{
    constructor(){
        super();
        this.Type = "osg::Transform";

        this.ReferenceFrame = 0;
    }
}

module.exports = Transform;