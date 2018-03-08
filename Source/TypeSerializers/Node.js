const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const ObjectCallbackSerializer = require('../Serializer/ObjectCallbackSerializer');
const ObjectSerializer = require('../Serializer/ObjectSerializer');
const UserSerializer = require('../Serializer/UserSerializer');
const PropByValSerializer = require('../Serializer/PropByValSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const Node = require('../OsgTypes/Node');

let objectWrapper = new ObjectWrapper(
    "osg::Node",
    ["osg::Object", "osg::Node"],
    Node
);

function readInitialBound(inputStream, node) {
// todo check if readVectorOfType is right
    let center, radius;
    inputStream.readBeginBracket();
    inputStream.readProperty("Center");
    center = inputStream.readVectorOfType(3,"Double");
    inputStream.readProperty("Radius");
    radius = inputStream.inputOperator.readDouble();
    inputStream.readEndBracket();

    node.InitialBound = {
        center: center,
        radius: radius
    };
}

function readDescriptions(inputStream, node) {
    let size = inputStream.inputOperator.readUInt();
    for (let i = 0; i < size; ++i) {
        let value = inputStream.inputOperator.readWrappedString();
        node.descriptions.push(value);
    }
    inputStream.readEndBracket();
}

objectWrapper.addSerializer(new UserSerializer("InitialBound", readInitialBound));
objectWrapper.addSerializer(new ObjectCallbackSerializer("ComputeBoundingSphereCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("UpdateCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("EventCallback"));
objectWrapper.addSerializer(new ObjectCallbackSerializer("CullCallback"));
objectWrapper.addSerializer(new PropByValSerializer("Bool", "CullingActive", true));
objectWrapper.addSerializer(new PropByValSerializer("HEXINT", "NodeMask", 0xffffffff));
objectWrapper.addSerializer(new UserSerializer("Descriptions", readDescriptions, {maxVersion: 76}));
objectWrapper.addSerializer(new ObjectSerializer("StateSet", null));

ObjectWrapperManager.addWrapper(objectWrapper);