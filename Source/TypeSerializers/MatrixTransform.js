const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const MatrixSerializer = require('../Serializer/MatrixSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const MatrixTransform = require('../OsgTypes/MatrixTransform');

let objectWrapper = new ObjectWrapper(
    "osg::MatrixTransform",
    ["osg::Object", "osg::Node", "osg::Group", "osg::Transform", "osg::MatrixTransform"],
    MatrixTransform
);

objectWrapper.addSerializer(new MatrixSerializer("Mode"));

ObjectWrapperManager.addWrapper(objectWrapper);