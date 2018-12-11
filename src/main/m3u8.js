const express = require('express')
const app = express()
const port = 3000

var axios = require('axios');

app.get('/m3u8', _fixM3u8)

app.listen(port)

function _fixM3u8(req, res) {
    var inputM3u8 = axios.get(req.query.url).then(function(response){
        var oldURL = req.query.url
        var newURL = oldURL.substring(0, oldURL.lastIndexOf("/")) + "/";

        // Split response by new line
        var m3u8Array = response.data.split("\n")

        // Loop through array
        for (let i = 0; i < m3u8Array.length; i++) {
            const line = m3u8Array[i];
            
            //if found #EXT-X-STREAM-INF
            if(line.startsWith("#EXT-X-STREAM-INF"))
            {
                m3u8Array[i+1] = newURL+m3u8Array[i+1];
            }

            if(line.startsWith("#EXT-X-I-FRAME-STREAM-INF"))
            {
                m3u8Array[i] = line.replace(/URI="(.*?)"/g, "URI=\""+newURL + "$1\"")
            }
        }
            

        res.send(m3u8Array.join("\n"))
    });
}