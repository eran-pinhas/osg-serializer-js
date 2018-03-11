const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const PropByValSerializer = require('../Serializer/PropByValSerializer');
const ImageSerializer = require('../Serializer/ImageSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const Texture2D = require('../OsgTypes/Texture2D');

let objectWrapper = new ObjectWrapper(
    "osg::Texture2D",
    ["osg::Object", "osg::StateAttribute", "osg::Texture", "osg::Texture2D"],
    Texture2D
);

objectWrapper.addSerializer(new ImageSerializer("Image", null));
objectWrapper.addSerializer(new PropByValSerializer("Int","TextureWidth", 0));
objectWrapper.addSerializer(new PropByValSerializer("Int","TextureHeight", 0));

ObjectWrapperManager.addWrapper(objectWrapper);