const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const ObjectCallbackSerializer = require('../Serializer/ObjectCallbackSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const StateAttribute = require('../OsgTypes/StateAttribute');

let objectWrapper = new ObjectWrapper(
    "osg::StateAttribute",
    ["osg::Object", "osg::StateAttribute"],
    StateAttribute
);

objectWrapper.addSerializer(new ObjectCallbackSerializer("UpdateCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("EventCallback"));

ObjectWrapperManager.addWrapper(objectWrapper);