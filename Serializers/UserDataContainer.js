const ObjectWrapperManager = require('../ObjectWrapperManager');
const UserSerializer = require('./Types/UserSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const DefaultUserDataContainer = require('../OsgTypes/DefaultUserDataContainer');

let UDCobjectWrapper = new ObjectWrapper(
    "osg::UserDataContainer",
    ["osg::Object", "osg::UserDataContainer"],
    null // UserDataContainer
);

let DUDCobjectWrapper = new ObjectWrapper(
    "osg::DefaultUserDataContainer",
    ["osg::Object", "osg::UserDataContainer", "osg::DefaultUserDataContainer"],
    DefaultUserDataContainer
);



function readUserData(inputStream,obj){
    inputStream.readBeginBracket();
    obj.UserData = inputStream.readObject();
    inputStream.readEndBracket();
}

function readDescriptions(inputStream,obj){
    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    for(let i=0;i<size;i++) {
        let description = inputStream.inputOperator.readWrappedString();
        obj.DescriptionList.push(description);
    }
    inputStream.readEndBracket();
}

function readUserObject(inputStream,obj){
    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    for(let i=0;i<size;i++) {
        let objReaded = inputStream.inputOperator.readWrappedString();
        obj.ObjectList.push(objReaded);
    }
    inputStream.readEndBracket();
}

DUDCobjectWrapper.addSerializer(new UserSerializer("UDC_UserData",readUserData));
DUDCobjectWrapper.addSerializer(new UserSerializer("UDC_Descriptions",readDescriptions));
DUDCobjectWrapper.addSerializer(new UserSerializer("UDC_UserObjects",readUserObject));

ObjectWrapperManager.addWrapper(DUDCobjectWrapper);
ObjectWrapperManager.addWrapper(UDCobjectWrapper);