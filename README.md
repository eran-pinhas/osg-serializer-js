# osg-serializer-js
osg-serializier-js is PureJS module for serializing `.osgt` and `.osgb` files. 

**The tool is still in development** but I will be happy to your issues and contributions

UPDATE: Consider using `wasm` using OpenSceneGraph's most updated code ([osg-wasm](https://github.com/cubicool/osg-wasm), [openscenegraph-cross-platform-guide](https://github.com/OGStudio/openscenegraph-cross-platform-guide/tree/master/1.10.SampleWeb)).

##  installation and usage

In terminal: `npm install --save osg-serializer-js`

In code:
```javascript
const osg = require('osg-serializer-js');

file = osg.readFile("MyAwesome3DModel.osgb");

// start workin with 3d data

```
