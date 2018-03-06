class Associate {
    constructor(_name, options) {
        this.name = _name;
        if(options) {
            this.minVersion = options.minVersion || 0;
            this.maxVersion = options.maxVersion || 100000000;
        }
    }
}

module.exports = Associate;