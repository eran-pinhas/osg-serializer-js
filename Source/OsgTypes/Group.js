let Node = require("./Node");
class Group extends Node{
    constructor(){
        super();

        this.Children = [];
        this.Type = "Osg::Group";
    }
}

module.exports = Group;