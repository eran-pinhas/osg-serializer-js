const Group = require('../OsgTypes/Group')

/**
 * Sync function for traversing threw all the OSG tree
 * @param {Node} node 
 * @param {Function} callback 
 */
function traverse(rootNode, callback){
    let nodes = [rootNode];
    let index = 0;
    while(index < nodes.length){
        let node = nodes[index++];
        callback(node);
        if(node instanceof Group){
            nodes.push(...node.Children) // Pushes all children 
        }
    }
 
}

module.exports = traverse;