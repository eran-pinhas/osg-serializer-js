const Node = require('./Node');

class Drawable extends Node{
    constructor(){
        super();

        this.InitialBound = null;
        this.BoundingBox = null;
        this.Shape = null;
        this.SupportsDisplayList = true;
        this.UseDisplayList = true;
        this.UseVertexBufferObjects = false;

        this.Type = "osg::Drawable"
    }
}

module.exports = Drawable;