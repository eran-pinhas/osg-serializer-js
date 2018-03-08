const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const EnumSerializer = require('../Serializer/EnumSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const ShadeModel = require('../OsgTypes/ShadeModel');
const ShadeModel_Mode = require('../Enum/ShadeModel_Mode');

let objectWrapper = new ObjectWrapper(
    "osg::ShadeModel",
    ["osg::Object", "osg::StateAttribute", "osg::ShadeModel"],
    ShadeModel
);

objectWrapper.addSerializer(new EnumSerializer("Mode", ShadeModel_Mode, ShadeModel_Mode.SMOOTH));

ObjectWrapperManager.addWrapper(objectWrapper);