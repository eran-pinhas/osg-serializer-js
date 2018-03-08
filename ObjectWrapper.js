const assert = require('assert');
const Associate = require('./Associate');
const Log = require('./Log');

class ObjectWrapper {
    /**
     * constructor of ObjectWrapper
     * @param {string} name
     * @param {string[]|Associate[]}associates
     * @param {function} typeConstructor
     * @param {object} [options]
     */
    constructor(name, associates, typeConstructor, options = {}) {
        this._name = name;
        this._typeCtor = typeConstructor;
        this.associates = associates.map(associate => {
            if (typeof associate === "string")
                return new Associate(associate);
            else
                return associate;
        });
        /**
         *
         * @type {Array<BaseSerializer>}
         * @private
         */
        this._serializers = options.serializers || [];
    }


    read(inputStream, obj) {
        let inputVersion = inputStream.getVersion();
        this._serializers.forEach(serializer => {
            if (serializer.getMinVersion() <= inputVersion &&
                inputVersion <= serializer.getMaxVersion()
            //&& serializer.supportsReadWrite()
            ) {
                try {
                    serializer.read(inputStream, obj)
                } catch (e) {
                    Log.fatal(e);
                    throw ( "ObjectWrapper.read: Error reading property " + this._name + "." + serializer.getName());
                }
            }
            else {
                // version mismatch
            }
            //for ( FinishedObjectReadCallbackList::iterator itr=_finishedObjectReadCallbacks.begin();
            //      itr!=_finishedObjectReadCallbacks.end();
            //      ++itr )
            // {
            //     (*itr)->objectRead(is, obj);
            // }
        });
    };

    addSerializer(serializer) {
        assert(serializer);
        assert(serializer.getName);
        assert(serializer.read);
        this._serializers.push(serializer);
    }

    createInstance() {
        let typeCtor = this._typeCtor;
        if (typeCtor)
            return new typeCtor();
        else
            return null;
    }

    getName() {
        return this._name;
    }
}

module.exports = ObjectWrapper;