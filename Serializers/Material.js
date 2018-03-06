const ObjectWrapperManager = require('../ObjectWrapperManager');
const EnumSerializer = require('./Types/EnumSerializer');
const ObjectSerializer = require('./Types/ObjectSerializer');
const UserSerializer = require('./Types/UserSerializer');
const PropByValSerializer = require('./Types/PropByValSerializer');
const ObjectWrapper = require('../ObjectWrapper');
const Material = require('../OsgTypes/Material');// = require('../OsgTypes/Material');
const ColorMode = require('../Enum/Material_ColorMode');// = require('../OsgTypes/Material');

let objectWrapper = new ObjectWrapper(
    "osg::Material",
    ["osg::Object", "osg::StateAttribute", "osg::Material"],
    Material
);

function readMaterialFunc(property, type){
    function reader(inputStream, material){
        // todo create function "readType" this in inputStream; also exist in typeReaderFunction
        let readerFunc;
        if(type === "Float"){
            readerFunc = inputStream.inputOperator.readFloat.bind(inputStream.inputOperator);
        } else if(type === "Vec4f") {
            readerFunc = function () {
                return inputStream.readVector("Float",4)
            }
        } else {
            throw "serializeMaterial - type not supported"
        }
        let frontAndBack = inputStream.inputOperator.readBool();
        inputStream.readPropety("Front");
        let value1 = readerFunc();
        inputStream.readPropety("Back");
        let value2 = readerFunc();
        if(frontAndBack){
            material[property + "FrontAndBack"] = true;
            material[property + "Front"] = value1;
            material[property + "Back"] = value1;
        } else {
            material[property + "FrontAndBack"] = false;
            material[property + "Front"] = value1;
            material[property + "Back"] = value2;
        }
    }
    return reader;
}

objectWrapper.addSerializer(new EnumSerializer("ColorMode", ColorMode, ColorMode.OFF));

objectWrapper.addSerializer(new UserSerializer("Ambient", readMaterialFunc("Ambient","Vec4f")));
objectWrapper.addSerializer(new UserSerializer("Diffuse", readMaterialFunc("Ambient","Vec4f")));
objectWrapper.addSerializer(new UserSerializer("Specular", readMaterialFunc("Ambient","Vec4f")));
objectWrapper.addSerializer(new UserSerializer("Emission", readMaterialFunc("Ambient","Vec4f")));
objectWrapper.addSerializer(new UserSerializer("Shininess", readMaterialFunc("Ambient","Float")));

ObjectWrapperManager.addWrapper(objectWrapper);