const ObjectWrapperManager = require('../ObjectWrapperManager');
const ObjectCallbackSerializer = require('./Types/ObjectCallbackSerializer');
const ObjectSerializer = require('./Types/ObjectSerializer');
const UserSerializer = require('./Types/UserSerializer');
const PropByValSerializer = require('./Types/PropByValSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const Node = require('../OsgTypes/Node');

let objectWrapper = new ObjectWrapper(
    "osg::Node",
    ["osg::Object", "osg::Node"],
    Node
);

function readInitialBound(inputStream, node) {

    let center, radius;
    inputStream.readBeginBracket();
    inputStream.inputOperator.readObjectProperty(inputStream.PROPERTY.set("Center"));
    center = inputStream.readVector("Double",3);
    inputStream.inputOperator.readObjectProperty(inputStream.PROPERTY.set("Radius"));
    radius = inputStream.inputOperator.readDouble();
    inputStream.readEndBracket();

    node.InitialBound = {
        center: center,
        radius: radius
    };
}

function readDescriptions(inputStream, node) {
    let size = inputStream.inputOperator.readUInt();
    console.log(size);
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
objectWrapper.addSerializer(new UserSerializer("Descriptions", readDescriptions, {maxVersion: 77}));
objectWrapper.addSerializer(new ObjectSerializer("StateSet", null));

ObjectWrapperManager.addWrapper(objectWrapper);