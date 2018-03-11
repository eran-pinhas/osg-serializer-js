class ObjectGLEnum {
    constructor(_value = 0) {
        this.value = _value;
    }
}

class ObjectMark {
    constructor(_name, _indent = 0) {
        this.name = _name;
        this.indent = _indent;
    }
}


class ObjectProperty {
    constructor(_name, _value = 0, _mapProperty = false) {
        this.name = _name;
        this.value = _value;
        this.mapProperty = _mapProperty;
    }

    set(_value) {
        if (typeof _value === "string")
            this.name = _value;
        else if (typeof _value === "number")
            this.value = _value;
        return this
    }
}

module.exports = {
    ObjectProperty,
    ObjectMark,
    ObjectGLEnum
};