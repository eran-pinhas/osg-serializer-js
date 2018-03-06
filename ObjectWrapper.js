const assert = require('assert');
const Associate = require('./Associate');
const Log = require('./Log');

function ObjectWrapper(name,associates,typeCtor,options){
    options = options|| {};
    this._name = name;
    this._typeCtor = typeCtor;
    this.associates = associates.map(function(associate){
        if(typeof associate === "string")
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

ObjectWrapper.prototype.read = function(inputStream,obj)
{
    let inputVersion = inputStream.getVersion();
    this._serializers.forEach(serializer => {
        //console.log(serializer.getMinVersion(),inputVersion,serializer.getMaxVersion() )
        if ( serializer.getMinVersion() <= inputVersion &&
             inputVersion <= serializer.getMaxVersion()
             //&& serializer.supportsReadWrite()
             )
        {
            try {
                //console.log("serializer",serializer.getName());//,inputStream.inputOperator.lookForward()
                serializer.read(inputStream, obj) 
            } catch (e) {
                Log.fatal(e);
                throw ( "ObjectWrapper.read: Error reading property " + this._name + "." + serializer.getName());
            }
        }
        else
        {
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

ObjectWrapper.prototype.addSerializer = function(serializer){
    assert(serializer);
    assert(serializer.getName);
    assert(serializer.read);
    this._serializers.push(serializer);
};

ObjectWrapper.prototype.createInstance = function(){
    let typeCtor = this._typeCtor;
    if(typeCtor)
        return new typeCtor();
    else
        return null;
};

ObjectWrapper.prototype.getName = function(){
    return this._name;
};

module.exports = ObjectWrapper;