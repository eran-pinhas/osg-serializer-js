const Texture = require('./Texture');

class Texture2D extends Texture{
    constructor(){
        super();

        this.Image = null;
        this.TextureWidth = 0;
        this.TextureHeight = 0;
        this.Type = "Osg::Texture";
    }
}

module.exports = Texture2D;