// todo rename to SsgClass
const Log = require('../Common/Log');
class ObjectClass{
    constructor() {
        this.Name = "";
        this.DataVariance = null;
        /** @type {UserDataContainer} */
        this.UserDataContainer = null;
        this.Type = "Osg::Object";
    }

    /**
     * @param {string} name
     * @param {*} value
     */
    setProperty(name, value) {
        // TODO all properties in all objects should start whit LowerCase
        if(this[name] === undefined){
            Log.warn("setProperty: "+this.Type+"."+name +" have not been defined");
        }
        this[name] = value;
    }
    /**
     * @param {string} name
     * @return {*}
     */
    getProperty(name) {
        // TODO all properties in all objects should start whit LowerCase
        if(this[name] === undefined){
            Log.warn("getProperty: "+this.Type+"."+name +" have not been defined");
        }
        return this[name];
    }
}

module.exports = ObjectClass;