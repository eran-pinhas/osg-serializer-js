const BufferData = require('./BufferData')
class OsgArray extends BufferData{
    constructor(){
        super();
        this.Binding = null;
        this.Normalize = false;
    }
}

module.exports = OsgArray;