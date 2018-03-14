const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const EnumSerializer = require('../Serializer/EnumSerializer');
const UserSerializer = require('../Serializer/UserSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const LOD = require('../OsgTypes/LOD');
const CenterMode = require('../Enum/LOD_CenterMode');
const RangeMode = require('../Enum/LOD_RangeMode');

let objectWrapper = new ObjectWrapper(
    "osg::LOD",
    ["osg::Object", "osg::Node", "osg::Group", "osg::LOD"],
    LOD
);

function readRangeList(inputStream, lod) {
    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    let ranges = [];
    for(let i = 0 ; i<size ; i++){
        let min = inputStream.inputOperator.readFloat();
        let max = inputStream.inputOperator.readFloat();
        ranges.push({min,max});
    }
    inputStream.readEndBracket();
    lod.setProperty("RangeList",ranges);
}

function readUserCenter(inputStream, groupNode) {
    let center = inputStream.readVectorOfType(3,"Double");
    let radius = inputStream.inputOperator.readDouble();
    groupNode.setProperty("Radius",radius);
    groupNode.setProperty("Center",center);
}

objectWrapper.addSerializer(new EnumSerializer("CenterMode", CenterMode, CenterMode.USE_BOUNDING_SPHERE_CENTER));
objectWrapper.addSerializer(new UserSerializer("UserCenter", readUserCenter));
objectWrapper.addSerializer(new EnumSerializer("RangeMode", RangeMode, RangeMode.DISTANCE_FROM_EYE_POINT));
objectWrapper.addSerializer(new UserSerializer("RangeList", readRangeList));

ObjectWrapperManager.addWrapper(objectWrapper);