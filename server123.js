/*
var fs = require('fs')
var http = require('http')
var https = require('https')
var express = require('express')
var policyfile = require('policyfile')
var ioServer = require('socket.io')
var path = require('path');


// CONFIGURATION. Set key/cert to enable https
var httpPort = 9001
var httpsPort = 3001
var key		// = "...path to key file..."
var cert	// = "...path to cert file..."

// basic express app to serve client.html and client.swf
var expressApp = express()
expressApp.use(express.static(path.join(__dirname, 'src')));
expressApp.use('/', express.static('.', { index: 'index.html' }))

// http server
var masterHttp = http.Server(expressApp)
masterHttp.listen(httpPort, function() {
	console.log('listening to port', httpPort)
	console.log('open http://localhost:'+httpPort+'/ in your browser')
})

// https server (if key/cert are set)
if(cert) {
	var credentials = {
		key: fs.readFileSync(key),
		cert: fs.readFileSync(cert),
	}
	var masterHttps = https.Server(credentials, expressApp)
	masterHttps.listen(httpsPort)
}

// serve policy file on httpPort, and also on port 843 if we can
var canOpenLowPorts = !process.getuid || process.getuid() == 0
var policyPort = canOpenLowPorts ? 843 : -1

policyfile.createServer().listen(policyPort, masterHttp)
if(cert)
	policyfile.createServer().listen(-1, masterHttps)

// socket.io server
var io = new ioServer(masterHttp, {
	pingInterval: 5000,
	pingTimeout: 5000,
})
if(cert)
	io.attach(masterHttps)

io.on('connection', function(socket) {
	console.log('client connected')

	setTimeout(function() {
		console.log('sending foo')
		socket.emit('foo', 'bar', function(buf) {
			console.log('foo: got back', buf)
		})
	}, 1000)

	socket.on('bar', function(s, cb) {
		console.log("got 'bar' from client with data: " + s)
		console.log("sending back Buffer with 2 bytes")

		cb(new Buffer([1, 2]))
	})

	socket.on('disconnect', function() {
		console.log('client disconnected');
	})
})

*/

console.log("server workin");
var net = require("net");
var fs = require("fs");
var path = require("path");
var express = require("express");
var trace = console.log;
var policyfile = require("policyfile");
var app = express();
var sockets = [];
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");
    //socket.fbname = "lol"
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    trace("user joined = " + socket.name);
     sockets.push(socket);
    socket.on("connection", onConnect);

    socket.on("connect", function () {
        console.log("Connection closedssssssssssssssss");
    });

    function on_policy_check(data) {
        if (data.indexOf("policy") !== -1) {
            console.log("Policy Server: sending regulation file");
            socket.write(
                '<?xml version="1.0"?><!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd"><!-- Policy file for xmlsocket://MYDOMAIN.com --><cross-domain-policy><allow-access-from domain="*" to-ports="*" /><allow-access-from domain="*" to-ports="1-65535" /><allow-access-from domain="MYDOMAIN.com" to-ports="MYGAMEPORT" /><allow-access-from domain="MYIP" to-ports="*" /></cross-domain-policy>\0'
            );
        } else {
            /// socket.removeListener('data', on_policy_check);
            onData(data);
        }
    }
    socket.on("data", on_policy_check);
    function onData(d) {
        var messageGot = d.toString();
        trace("message = " + d.toString());

        if (messageGot == "whats my name?") {
            socket.write("AJJJJJJJJJJJJJJJJJJJJJJJJJJJJj");
             sockets.forEach(function(sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + messageGot + '\n');
        });
        } else {
            socket.write(messageGot + " returning");
        }
    }

    function onConnect() {
        console.log("new user login");
    }
    socket.on("close", function () {
        console.log("not working anyway");
    });
    socket.on("clientError", function (exception) {
        console.log("" + data);
    });
    socket.on("error", function () {
        console.log("not working anyway");
    });
});

// serve policy file on httpPort, and also on port 843 if we can
var canOpenLowPorts = !process.getuid || process.getuid() == 0;
var policyPort = canOpenLowPorts ? 843 : -1;
console.log(policyPort);
policyfile.createServer().listen(policyPort, server);
server.addListener("error", function (err) {
    trace(err);
});

// grab a random port.
server.listen(
    {
        host: "0.0.0.0",
        port: 20026,
        exclusive: false,
    },
    function () {
        console.log("net server listening on", server.address());
    }
);

//new error dod
