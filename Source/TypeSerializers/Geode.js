const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const UserSerializer = require('../Serializer/UserSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const Geode = require('../OsgTypes/Geode');

let objectWrapper = new ObjectWrapper(
    "osg::Geode",
    ["osg::Object","osg::Node","osg::Geode"],
    Geode
);

function readDrawables(inputStream,geodeNode){
    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    for (let i=0;i<size;i++){
        let obj = inputStream.readObjectOfType("osg::Drawable");
        if (obj) {
            geodeNode.Children.push(obj);
        }
    }
    inputStream.readEndBracket();
}

objectWrapper.addSerializer(new UserSerializer("Drawables",readDrawables));

ObjectWrapperManager.addWrapper(objectWrapper);