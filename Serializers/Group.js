const ObjectWrapperManager = require('../ObjectWrapperManager');
const UserSerializer = require('./Types/UserSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const Group = require('../OsgTypes/Group');

let objectWrapper = new ObjectWrapper(
    "osg::Group",
    ["osg::Object","osg::Node","osg::Group"],
    Group
);

function readChildren(inputStream,groupNode){
    let size = inputStream.inputOperator.readUInt();
    console.log(size);
    console.log(groupNode);
    inputStream.readBeginBracket();
    for (let i=0;i<size;i++){
        let obj = inputStream.readObject();
        if (obj) {
            groupNode.children.push(obj);
        }
    }
    inputStream.readEndBracket();
}

objectWrapper.addSerializer(new UserSerializer("Children",readChildren));

ObjectWrapperManager.addWrapper(objectWrapper);