let Node = require("./Node");
class Group extends Node{
    constructor(){
        super();

        /** 
         * @type {Array<Node>}
         */
        this.Children = [];
        
        this.Type = "Osg::Group";
    }
}

module.exports = Group;