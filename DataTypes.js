class ObjectGLenum {
    constructor(_value) {
        this.value = _value || 0;
    }
}

class ObjectMark {
    constructor(_name, _indent) {
        this.name = _name;
        this.indent = _indent || 0;
    }
}


class ObjectProperty {
    constructor(_name, _value, _mapProperty) {
        this.name = _name;
        this.value = _value || 0;
        this.mapProperty = _mapProperty || false;
    }

    set(_value) {
        if (typeof _value === "string")
            this.name = _value;
        else if (typeof _value === "number")
            this._value = _value;
        return this
    }
}

module.exports = {
    ObjectProperty,
    ObjectMark,
    ObjectGLenum
};