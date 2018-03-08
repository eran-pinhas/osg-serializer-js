const Drawable = require('./Drawable');

class Geometry extends Drawable{
    constructor(){
        super();
        this.Type = "osg::Geometry";

        this.InitialBound = null;
        this.BoundingBox = null;

        this.PrimitiveSetList = [];

    }
}

module.exports = Geometry;