const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const ObjectSerializer = require('../Serializer/ObjectSerializer');
const UserSerializer = require('../Serializer/UserSerializer');
const ObjectCallbackSerializer = require('../Serializer/ObjectCallbackSerializer');
const PropByValSerializer = require('../Serializer/PropByValSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const Associate = require('../Serializer/Associate');
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