const Transform = require('./Transform');
class MatrixTransform extends Transform{
    constructor(){
        super();
        this.Type = "osg::MatrixTransform";

        this.Matrix = null;
    }
}

module.exports = MatrixTransform;