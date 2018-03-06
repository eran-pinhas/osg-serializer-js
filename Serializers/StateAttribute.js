const ObjectWrapperManager = require('../ObjectWrapperManager');
const ObjectCallbackSerializer = require('./Types/ObjectCallbackSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const StateAttribute = require('../OsgTypes/StateAttribute');

let objectWrapper = new ObjectWrapper(
    "osg::StateAttribute",
    ["osg::Object", "osg::StateAttribute"],
    StateAttribute
);

objectWrapper.addSerializer(new ObjectCallbackSerializer("UpdateCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("EventCallback"));

ObjectWrapperManager.addWrapper(objectWrapper);