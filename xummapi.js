var request = require('request);

// works
function genpayload()
var jar = request.jar();
jar.setCookie(request.cookie("__cfduid=d29c9663e0e4444bede81bf4adb7f79891585045754"), "https://xumm.app/api/v1/platform/payload");

var options = {
  method: 'POST',
  url: 'https://xumm.app/api/v1/platform/payload',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apikey,
    'x-api-secret': apisecret,
    authorization: 'Bearer 1511bd5b-304a-492f-ae60-b276e43768b8'
  },
  body: {
		  "txjson": {
		    "TransactionType": "Payment",
		    "Destination": "rhAb9uew2PLRjKBm5D945LsGai3qHUCtJg",
				"Amount": "1",
		    "Fee": "12"
		  }
		},
  json: true,
  jar: 'JAR'
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
xummPayload = body.next.always;
var len = xummPayload.length;
p = xummPayload.slice(22, len);
b = body.uuid;
web = body.refs.websocket_status;
  console.log("Payload URL: " + body.next.always);
 console.log("Payload uuid: " + b);
 console.log("websocket: " + web);
  
});




// only works wiht Body
function status(){
	
	var data = String("5ecd56d2-4048-4180-8731-ee249cb1fa84");

	var jar = request.jar();
	jar.setCookie(request.cookie("__cfduid=d29c9663e0e4444bede81bf4adb7f79891585045754"), "https://xumm.app/api/v1/platform/payload/" + data);

	var options = {
	  method: 'GET',
	  url: 'https://xumm.app/api/v1/platform/payload/' + data,
	  qs: {'': ''},
	  headers: {
	    'x-api-key': apikey,
	    'x-api-secret': apisecret,
	    'content-type': 'application/json',
	    authorization: 'Bearer 1511bd5b-304a-492f-ae60-b276e43768b8'
	  },
	  jar: 'JAR'
	};

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	 // console.log(body.meta.exists);
	 // console.log(body.meta.uuid);
	 // console.log(body.meta.resolved);
	 // console.log(body.meta.cancelled);
	//  console.log(body.meta.app_opened);
	  
	 exists =  body.meta;
	//var uuid = body.meta.uuid;
	//var resolved =  body.meta.resolved;
	//var cancelled =  body.meta.cancelled;
	//var opened =  body.meta.app_opened;
	  console.log(exists)
	 
	});
	
}

function authenticate(){
		var data = String(b);

		var jar = request.jar();
		
		
		var http = require("https");

		var options = {
		  "method": "GET",
		  "hostname": "xumm.app",
		  "port": null,
		  "path": "/api/v1/platform/payload/99e2e466-a629-4aa7-b801-a1742571ab2a?=",
		  "headers": {
		    "cookie": "__cfduid=d29c9663e0e4444bede81bf4adb7f79891585045754",
		    "x-api-key": "935c604a-3309-4700-97c0-93fab7c2478f",
		    "x-api-secret": "1511bd5b-304a-492f-ae60-b276e43768b8",
		    "content-type": "application/json",
		    "content-length": "0",
		    "authorization": "Bearer 1511bd5b-304a-492f-ae60-b276e43768b8"
		  }
		};

		var req = http.request(options, function (res) {
		  var chunks = [];

		  res.on("data", function (chunk) {
		    chunks.push(chunk);
		  });

		  res.on("end", function () {
		    var body = Buffer.concat(chunks);
		    var L = body;
		    console.log("this is L: " + L);
		    
		   var Loginaddress ;
			  module.exports.Loginaddress = L.meta.destination;
			  console.log('\x1b[34m%s\x1b[0m',"Login Address: " + L.meta.destination);

			
		    
		  });
		});

		req.end();
		
				  

		  
	}
	
