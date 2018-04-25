const Log = require('./Common/Log');
const TraverseNodes = require('./Common/traverseNodes');
const { readBuffer, readFile } = require('./Input/ReadFile');

const BufferData = require('./OsgTypes/BufferData')
const CullFace = require('./OsgTypes/CullFace')
const DefaultUserDataContainer = require('./OsgTypes/DefaultUserDataContainer')
const Drawable = require('./OsgTypes/Drawable')
const Geode = require('./OsgTypes/Geode')
const Geometry = require('./OsgTypes/Geometry')
const Group = require('./OsgTypes/Group')
const Image = require('./OsgTypes/Image')
const LOD = require('./OsgTypes/LOD')
const Material = require('./OsgTypes/Material')
const MatrixTransform = require('./OsgTypes/MatrixTransform')
const Node = require('./OsgTypes/Node')
const Object = require('./OsgTypes/Object')
const OsgArray = require('./OsgTypes/OsgArray')
const PagedLOD = require('./OsgTypes/PagedLOD')
const ShadeModel = require('./OsgTypes/ShadeModel')
const StateAttribute = require('./OsgTypes/StateAttribute')
const StateSet = require('./OsgTypes/StateSet')
const Texture2D = require('./OsgTypes/Texture2D')
const Texture = require('./OsgTypes/Texture')
const Transform = require('./OsgTypes/Transform')
const UserDataContainer = require('./OsgTypes/UserDataContainer')

module.exports = {
    Log,
    TraverseNodes,
    readBuffer,
    readFile,
    OsgTypes: {
        BufferData,
        CullFace,
        DefaultUserDataContainer,
        Drawable,
        Geode,
        Geometry,
        Group,
        Image,
        LOD,
        Material,
        MatrixTransform,
        Node,
        Object,
        OsgArray,
        PagedLOD,
        ShadeModel,
        StateAttribute,
        StateSet,
        Texture2D,
        Texture,
        Transform,
        UserDataContainer
    }
};

/*module.exports.readFile('./Samples/grass1.osgb',function (err, data) {
    console.log(err,data)
});*/

