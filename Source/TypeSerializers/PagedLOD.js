const ObjectWrapperManager = require('../Serializer/ObjectWrapperManager');
const PropByValSerializer = require('../Serializer/PropByValSerializer');
const UserSerializer = require('../Serializer/UserSerializer');
const ObjectWrapper = require('../Serializer/ObjectWrapper');
const PagedLOD = require('../OsgTypes/PagedLOD');

let objectWrapper = new ObjectWrapper(
    "osg::PagedLOD",
    ["osg::Object", "osg::Node", "osg::LOD", "osg::PagedLOD"],
    PagedLOD
);

function readRangeDataList(inputStream, lod) {
    let fileNames = [], priorityOffsets = [], priorityScales = [];

    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    for (let i = 0; i < size; i++) {
        let name = inputStream.inputOperator.readWrappedString();
        fileNames.push(name);
    }
    inputStream.readEndBracket();

    inputStream.readProperty("PriorityList");
    size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    for (let i = 0; i < size; i++) {
        priorityOffsets.push(inputStream.inputOperator.readFloat());
        priorityScales.push(inputStream.inputOperator.readFloat());
    }
    inputStream.readEndBracket();

    lod.setProperty("FileNames", fileNames);
    lod.setProperty("PriorityOffsets", priorityOffsets);
    lod.setProperty("PriorityScales", priorityScales);
}

function readChildren(inputStream, lod) {
    let size = inputStream.inputOperator.readUInt();
    if (size > 0) {
        let children = [];
        inputStream.readBeginBracket();
        for (let i = 0; i < size; i++) {
            let child = inputStream.readObjectOfType("osg::Node");
            if (child) {
                children.push(child)
            }
        }
        inputStream.readEndBracket();
        lod.setProperty("Children", children);
    }
}

function readDatabasePath(inputStream, pagedLod) {
    let hasPath = inputStream.inputOperator.readBool();
    let databasePath;
    if (hasPath) {
        databasePath = inputStream.inputOperator.readWrappedString();
        pagedLod.setProperty("DatabasePath", databasePath);
    } else {
        // todo
        // if empty databasePath setted in https://github.com/openscenegraph/OpenSceneGraph/blob/31d78b7bb3994065462fb1163d006c8649e7144f/src/osgDB/Registry.cpp#L1169
    }
}

objectWrapper.addSerializer(new UserSerializer("DatabasePath", readDatabasePath));
objectWrapper.addSerializer(new PropByValSerializer("UInt", "FrameNumberOfLastTraversal", 0, {maxVersion: 69}));
objectWrapper.addSerializer(new PropByValSerializer("UInt", "NumChildrenThatCannotBeExpired", 0));
objectWrapper.addSerializer(new PropByValSerializer("Bool", "DisableExternalChildrenPaging", false));
objectWrapper.addSerializer(new UserSerializer("RangeDataList", readRangeDataList));
objectWrapper.addSerializer(new UserSerializer("Children", readChildren));

ObjectWrapperManager.addWrapper(objectWrapper);