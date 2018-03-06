const ObjectWrapperManager = require('../ObjectWrapperManager');
const ObjectSerializer = require('./Types/ObjectSerializer');
const UserSerializer = require('./Types/UserSerializer');
const ObjectCallbackSerializer = require('./Types/ObjectCallbackSerializer');
const PropByValSerializer = require('./Types/PropByValSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const Associate = require('../Associate');
const Drawable = require('../OsgTypes/Drawable');


let objectWrapper = new ObjectWrapper(
    "osg::Drawable",
    ["osg::Object", new Associate("osg::Node", {minVersion: 154}), "osg::Drawable"],
    Drawable
);

function readInitialBound() {
    // TODO
    throw "InitialBound not yet implemented"
}

objectWrapper.addSerializer(new ObjectSerializer("StateSet", null));
objectWrapper.addSerializer(new UserSerializer("InitialBound", readInitialBound));
objectWrapper.addSerializer(new ObjectCallbackSerializer("ComputeBoundingBoxCallback"));
objectWrapper.addSerializer(new ObjectSerializer("Shape", null));
objectWrapper.addSerializer(new PropByValSerializer("Bool", "SupportsDisplayList", true));
objectWrapper.addSerializer(new PropByValSerializer("Bool", "UseDisplayList", true));
objectWrapper.addSerializer(new PropByValSerializer("Bool", "UseVertexBufferObjects", false));
objectWrapper.addSerializer(new ObjectCallbackSerializer("UpdateCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("EventCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("CullCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("DrawCallback"));
objectWrapper.addSerializer(new PropByValSerializer("HEXINT", "NodeMask", 0xffffffff, {minVersion: 142}));
objectWrapper.addSerializer(new PropByValSerializer("Bool", "CullingActive", true, {minVersion: 145}));

ObjectWrapperManager.addWrapper(objectWrapper);