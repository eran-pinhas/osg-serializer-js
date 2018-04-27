const Promise = require('bluebird')
const BufferData = require('./BufferData');
const fs = require('fs');
const Log = require('../Common/Log');

let ReadFile = Promise.promisify(fs.readFile);

class Image extends BufferData {
    constructor() {
        super();

        this.S = 0;
        this.T = 0;
        this.R = 0;
        this.InternalTextureFormat = 0;
        this.PixelFormat = 0;
        this.DataType = 0;
        this.Data = null;
        this.Mode = 0;
        this.Packing = 1;
        this.RowLength = 0;
        this.Origin = 0;
        this.FileName = "";
        this.Levels = null;
        this.WriteHint = null;
        this.Type = "Osg::Image";

        this.imagePath = null;
        this.imagePromise = null;

    }

    setImage(s, t, r, internalTextureFormat, pixelFormat, dataType, data, aloccationMode, packing = 1, rowLength = 0) {
        this.S = s;
        this.T = t;
        this.R = r;
        this.InternalTextureFormat = internalTextureFormat;
        this.PixelFormat = pixelFormat;
        this.DataType = dataType;
        this.Data = data;
        this.Packing = packing;
        this.Mode = aloccationMode;
        this.RowLength = rowLength;

    }

    getImageData() {
        if (this.Data)
            return Promise.resolve(this.Data);
        if (this.imagePromise)
            return this.imagePromise;
        if (!this.imagePath) {
            Log.fatal("No File name found for image")
            return Promise.reject("No File name found for image");
        }

        this.imagePromise = ReadFile(this.imagePath).then(data => {
            this.Data = data;
            return data;
        })
        return this.imagePromise;
    }
}

module.exports = Image;