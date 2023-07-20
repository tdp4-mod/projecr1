
console.log("server workin")
var net = require('net');  
var fs = require('fs')
var path = require('path');
var express = require('express');
var trace = console.log;
var policyfile = require('policyfile')
var app = express();

function policy() {
    var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM';
    xml += ' "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';
    xml += '<allow-access-from domain="*" to-ports="*"/>\n';
    xml += '</cross-domain-policy>\n';

    return xml;
}
var server = net.createServer(function(socket) 
{
    socket.setEncoding('utf8');    
if(socket && socket.readyState == 'open'){
     socket.write(policy() + '\0');
      }
		

    
    function on_policy_check(data) {
        socket.removeListener('data', on_policy_check);
        console.log(data == '<policy-file-request/>\0')
          if (data == '<policy-file-request/>\0'){
            socket.write(policy());
          }
        socket.on('data', onData);

      
    }

   

    socket.on('data', on_policy_check);
		//socket.fbname = "lol"
		socket.name = socket.remoteAddress + ":" + socket.remotePort 
		trace("user joined = " +socket.name)
			socket.on('connection', onConnect);  
		
	socket.on('connect', function() {
		console.log('Connection closedssssssssssssssss');
	   
	});	
		function onData(d)  
	{ 
	var messageGot = d.toString()
	trace("message = " + d.toString());

	if(messageGot == "whats my name?"){
		socket.write("AJJJJJJJJJJJJJJJJJJJJJJJJJJJJj")
	}
	else{
	 socket.write(messageGot + " returning")	
	}
	}

	function onConnect()  
	{  
	console.log("not working anyway")
	}
	 socket.on('close', function () {
        	console.log("not working anyway")

    });
	 socket.on('error', function () {
        	console.log("not working anyway")

    });
});

// serve policy file on httpPort, and also on port 843 if we can
var canOpenLowPorts = !process.getuid || process.getuid() == 0
var policyPort = canOpenLowPorts ? 843 : -1
console.log(policyPort)
policyfile.createServer().listen(policyPort, server)
server.addListener("error",function(err){trace(err);});

// grab a random port.
server.listen({
  host: "0.0.0.0",
  port: 20026,
  exclusive: false
},function(){console.log("net server listening on", server.address());});

//new error dod