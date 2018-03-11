class Base64Encoder{
    static decodeArray(encodedData,positions = []){
        if (encodedData.length === 0)
            return new Buffer(0);
        let buf, buffers = [],size = 0;
        for(let i=0 ; i<encodedData.length ; i++) {
            if (typeof Buffer.from === "function") { // Node 5.10+
                buf = Buffer.from(encodedData[i], 'base64');
            } else { // older Node versions
                buf = new Buffer(encodedData[i], 'base64');
            }
            size += buf.length;
            positions.push(size);

            buffers.push(buf)
        }

        if(encodedData.length === 1){
            return buffers[0];
        }
        let fullBuffer = new Buffer(size),pos = 0;
        for(let i=0 ; i<encodedData.length ; i++) {
            buffers[i].copy(fullBuffer,pos);
            pos+=buffers[i].length;
        }
        return fullBuffer;
    }
}