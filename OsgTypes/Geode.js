let Group = require("./Group");
function Geode(){
    Group.call(this);
    
    this.Bbox = null;
    this.Type = "Osg::Geode";
}

module.exports = Geode;