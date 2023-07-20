const net = require('net');
const port = 11453;
const host = '0.0.0.0';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
let socksIp =[];
let sockets = [];
server.on('connection', function(sock) {
    		sock.setEncoding('utf8');
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);
socksIp.push(sock.remoteAddress)
    sock.on('data', function(data) {
        let msgObj = {}
           if (data.indexOf("policy") !== -1) {
            console.log("Policy Server: sending regulation file");
            sock.write(
                '<?xml version="1.0"?><!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd"><!-- Policy file for xmlsocket://MYDOMAIN.com --><cross-domain-policy><allow-access-from domain="*" to-ports="*" /><allow-access-from domain="*" to-ports="1-65535" /><allow-access-from domain="MYDOMAIN.com" to-ports="MYGAMEPORT" /><allow-access-from domain="MYIP" to-ports="*" /></cross-domain-policy>\0'
            );
           }
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        
        if (isJsonString(data)){
            console.log("OK")
           

        }else{
             msgObj.type = "msg"
            msgObj.data = data
            data = JSON.stringify(msgObj)
        }
               // console.log(data);

        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {
            sock.write(data);
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        if (index !== -1) socksIp.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
     sock.on("clientError", function (exception) {
        console.log("" + exception);
    });
    sock.on("error", function (err) {
        console.log("ERROR: "+ err);
    });
});
module.exports =  {socksIp} 
