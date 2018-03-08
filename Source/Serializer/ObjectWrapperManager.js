const ObjectWrapperDictionary = {};

function readWrapperObject(wrapperName){
    return function(inputStream,obj){
        wrapperObject = ObjectWrapperDictionary[wrapperName];
        if(!wrapperObject) throw ("ObjectWrapperManager.readWrapperObject : "+wrapperName)
    }
}

module.exports = {
    findWrapper: function(classname){
        return ObjectWrapperDictionary[classname];
    },
    addWrapper: function(objectWrapper){
        let classname = objectWrapper.getName();
        ObjectWrapperDictionary[classname] = objectWrapper;
    },
    readWrapperObject: readWrapperObject
}