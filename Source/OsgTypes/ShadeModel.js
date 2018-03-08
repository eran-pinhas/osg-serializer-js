const StateAttribute = require('./StateAttribute');

class ShadeModel extends StateAttribute {
    constructor() {
        super();
        this.Mode = null;
    }
}

module.exports = ShadeModel;