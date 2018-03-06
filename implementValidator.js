
const assert = require('assert');

functionsToCheck = {
    serializer: ["read", "getMinVersion", "getMaxVersion"],
    streamOperator:["readUInt","readInt","readChar","readBool","readString","readObjectProperty","readObjectMark","advanceToCurrentEndBracket","isBinary","readWrappedString","readGLenum","readFloat"]
};

module.exports = function(classCtor,type){
    assert.equal(typeof classCtor, "function","class should be function");
    assert(functionsToCheck[type]);
    functionsToCheck[type].forEach(
        func => assert.equal(typeof (classCtor.prototype[func]), "function", func + " should be a function")
    );
};