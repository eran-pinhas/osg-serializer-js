let StateAttribute = require('./StateAttribute');

class Material extends StateAttribute {
    constructor() {
        super();
        this.AmbientFrontAndBack = true;
        this.AmbientFront = null;
        this.AmbientBack = null;

        this.DiffuseFrontAndBack = true;
        this.DiffuseFront = null;
        this.DiffuseBack = null;

        this.SpecularFrontAndBack = true;
        this.SpecularFront = null;
        this.SpecularBack = null;

        this.EmissionFrontAndBack = true;
        this.EmissionFront = null;
        this.EmissionBack = null;

        this.ShininessFrontAndBack = true;
        this.ShininessFront = 0;
        this.ShininessBack = 0;

        this. ColorMode = null;
        this.Type = "Osg::Material";
    }

}

module.exports = Material;