class BaseSerializer {
    /**
     * @constructor
     * @param {string} name
     * @param options
     * @param {number} options.minVersion first osgb/osgb version in which this serializer is defind
     * @param {number} options.maxVersion last osgb/osgb version in which this serializer is defind
     */
    constructor(name, options = {}) {
        this._options = options;
        this._name = name;
    }

    /**
     *
     * @returns {string}
     */
    getName() {
        return this._name
    }

    /**
     *
     * @returns {number}
     */
    getMinVersion() { // TODO replace getMinVersion & getMaxVersion --> is supported in version
        return this._options.minVersion || 0;
    }

    /**
     *
     * @returns {number}
     */
    getMaxVersion() {
        return this._options.maxVersion || 1000000000;
    }

    /**
     *
     * @param {InputStream} inputStream
     * @param {ObjectClass} object
     */
    read (inputStream,object){
        throw "BaseSerializer.read not implemented";
    }
}

module.exports = BaseSerializer;