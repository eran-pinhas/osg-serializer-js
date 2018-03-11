const BufferData = require('./BufferData');

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
}

module.exports = Image;