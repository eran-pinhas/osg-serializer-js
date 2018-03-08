const fs = require('fs');
const InputStream = require('./Source/Input/InputStream');
const DataTypes = require('./Source/Common/DataTypes');
const BinaryStreamOperator = require('./Source/Input/BinaryStreamOperator');
const AsciiStreamOperator = require('./Source/Input/AsciiStreamOperator');
const Log = require('./Source/Common/Log');

Log.setLogOff();

//let filePath = "Samples/torus.osgt";
//let filePath = "Samples/cow.osgt";
//let filePath = "Samples/tree4.osgb";
//let filePath = "Samples/grass1.osgb";
let filePath = "Samples/streetlight.osgb";
//let filePath = "Samples/cessna.osgb";

let buf = fs.readFileSync(filePath);

let PROPERTY = new DataTypes.ObjectProperty();

const OSG_HEADER_LOW = 0x6C910EA1;
const OSG_HEADER_HIGH = 0x1AFB4545;
const OSGT_HEADER = "#Ascii";
const WriteType = {
    WRITE_UNKNOWN: 0,
    WRITE_SCENE: 1,
    WRITE_IMAGE: 2,
    WRITE_OBJECT: 3
};

const low = buf.readUInt32LE(0);
const high = buf.readUInt32LE(4);
let reader, type, version, openscenegraph_soversion, isBinary, hasDomainVersion;
if (low === OSG_HEADER_LOW && high === OSG_HEADER_HIGH) {
    isBinary = true;
    reader = new BinaryStreamOperator(buf, 8);

    //console.log("OSGB");
    let useCompressSource, useRobustBinaryFormat;
    type = reader.readUInt();// buf.readUInt32LE(ReadPosition);
    openscenegraph_soversion = reader.readUInt();
    let attributes = reader.readUInt();
    hasDomainVersion = (attributes & 0x1) !== 0;
    useCompressSource = (attributes & 0x2) !== 0;
    useRobustBinaryFormat = (attributes & 0x4) !== 0;
    reader.supportBinaryBrackets = useRobustBinaryFormat;

    //console.log("binary_hasDomainVersion", hasDomainVersion);
    //console.log("binary_useCompressSource", useCompressSource);
    //console.log("binary_useRobustBinaryFormat", useRobustBinaryFormat);

    let next = reader.readString();
    if (next !== "0") {
        throw "compresses data not supported";
    }
}
else if (buf.length >= OSGT_HEADER.length && buf.toString('ASCII', 0, OSGT_HEADER.length) === OSGT_HEADER) {
    isBinary = false;
    console.log("OSGT");
    reader = new AsciiStreamOperator(buf, OSGT_HEADER.length);
    type = reader.readString();
    reader.goToNextRow();
    type = WriteType["WRITE_" + type.toUpperCase()] || 0;
    reader.readObjectProperty(PROPERTY.set("#Version"));
    openscenegraph_soversion = reader.readUInt();
    reader.goToNextRow();
    reader.readObjectProperty(PROPERTY.set("#Generator"));
    reader.readString(); // Generator Name
    reader.goToNextRow();
    hasDomainVersion = reader.lookForward() === "#CustomDomain"
} else {
    return console.log("osg format not supported")
}

if (hasDomainVersion) {
    // TODO 
    console.log("osg DomainVersion not supported");
    return;
}
reader.version = openscenegraph_soversion;
//console.log("type", Object.keys(WriteType).filter(key => WriteType[key] === type)[0]);
//console.log("version", openscenegraph_soversion);

let is = new InputStream(reader);
//console.log("RESTULT:");
let startTime = new Date().getTime();
let obj = is.readObject();
console.log( "timeElapsed:",new Date().getTime()-startTime);
