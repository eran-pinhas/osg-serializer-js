const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const EnumSerializer = require('../Serializer/EnumSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const Transform = require('../OsgTypes/Transform');
const ReferenceFrameEnum = require('../Enum/Transform_ReferenceFrame');

let objectWrapper = new ObjectWrapper(
    "osg::Transform",
    ["osg::Object", "osg::Node", "osg::Group", "osg::Transform"],
    Transform
);

objectWrapper.addSerializer(new EnumSerializer("Mode", ReferenceFrameEnum, ReferenceFrameEnum.RELATIVE_RF));

ObjectWrapperManager.addWrapper(objectWrapper);