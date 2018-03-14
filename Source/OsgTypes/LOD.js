const Group = require("./Group");
const CenterMode = require('../Enum/LOD_CenterMode');
const RangeMode = require('../Enum/LOD_RangeMode');

class LOD extends Group {
    constructor() {
        super();

        this.CenterMode = CenterMode.USE_BOUNDING_SPHERE_CENTER;
        this.Center = null;
        this.Radius = null;
        this.RangeMode = RangeMode.DISTANCE_FROM_EYE_POINT;
        this.RangeList = null;

        this.Type = "Osg::Group";
    }
}

module.exports = LOD;