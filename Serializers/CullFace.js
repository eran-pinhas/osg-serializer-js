const ObjectWrapperManager = require('../ObjectWrapperManager');
const EnumSerializer = require('./Types/EnumSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const CullFace = require('../OsgTypes/CullFace');
const FaceMode = require('../Enum/CullFace_FaceMode');

let objectWrapper = new ObjectWrapper(
    "osg::CullFace",
    ["osg::Object", "osg::StateAttribute", "osg::CullFace"],
    CullFace
);

objectWrapper.addSerializer(new EnumSerializer("Mode",FaceMode,FaceMode.BACK));

ObjectWrapperManager.addWrapper(objectWrapper);