const Log = require('./Common/Log');
const {readBuffer, readFile} = require('./Input/ReadFile');

module.exports = {
    Log,
    readBuffer,
    readFile
};

/*module.exports.readFile('./Samples/grass1.osgb',function (err, data) {
    console.log(err,data)
});*/

