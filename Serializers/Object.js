const ObjectWrapperManager = require('../ObjectWrapperManager');
const EnumSerializer = require('./Types/EnumSerializer');
const ObjectSerializer = require('./Types/ObjectSerializer');
const UserSerializer = require('./Types/UserSerializer');
const PropByValSerializer = require('./Types/PropByValSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const ObjectClass = require('../OsgTypes/Object');
const ObjectDataVariance = require('../Enum/ObjectData_Variance');

let objectWrapper = new ObjectWrapper(
    "osg::Object",
    ["osg::Object"],
    ObjectClass
);

function UserDataReader(){
    // TODO
    throw "UserDataReader not yet supported";
}

objectWrapper.addSerializer(new PropByValSerializer("String","Name",""));
objectWrapper.addSerializer(new EnumSerializer("DataVariance",ObjectDataVariance,ObjectDataVariance.UNSPECIFIED));

objectWrapper.addSerializer(new UserSerializer("UserData",UserDataReader, {maxVersion:76}));
objectWrapper.addSerializer(new ObjectSerializer("UserDataContainer",null, {minVersion:77}));

ObjectWrapperManager.addWrapper(objectWrapper);