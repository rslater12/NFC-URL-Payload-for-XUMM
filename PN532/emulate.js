var pn532 = require('./src/pn532.js');
var SerialPort = require('serialport');
var ndef = require('ndef');

var serialPort = new SerialPort('/dev/tty.usbserial-AQ00PCSL', { baudRate: 115200 });
var rfid = new pn532.PN532(serialPort);

/*Scan Tag*/
function ScanTag(){
    console.log('Waiting for rfid ready event...');
rfid.on('ready', function() {
    console.log('Listening for a tag scan...');
    rfid.on('tag', function(tag) {
        console.log(Date.now(), 'UID:', tag.uid);
    });
});
}
//ScanTag()

/*Read Ultralight Tag*/
function ReadTag(){
console.log('Waiting for rfid ready event...');
rfid.on('ready', function() {

    console.log('Listening for a tag scan...');
    rfid.on('tag', function(tag) {
        console.log('Tag', tag);

        console.log('Reading tag data...');
        rfid.readNdefData().then(function(data) {
            console.log('Tag data:', data);

            var records = ndef.decodeMessage(Array.from(data));
            console.log(records);
        });
    });
});
}

//ReadTag()

/* write with PN532 */
function write() {
 rfid.on('ready', function() {
console.log('rfid ready');
 rfid.scanTag().then(function(tag) {
    console.log('Waiting for a tag...');
        var messages = [
            ndef.uriRecord('http://www.google.com'),
            ndef.textRecord('test')
        ];
        console.log('messages: ',messages);
        var data = ndef.encodeMessage(messages);
        console.log('data: ',data);

        rfid.writeNdefData(data).then(function(response) {
            console.log('Write successful');
        });
    });
}); 
}

//write()

/*Read Mifare Classic*/
function ReadClassic(){
console.log('Waiting for rfid ready event...');
rfid.on('ready', function() {

    console.log('Listening for a tag scan...');
    rfid.on('tag', function(tag) {
        console.log('Tag', tag);

        console.log('Authenticating...');
        rfid.authenticateBlock(tag.uid).then(function() {
            console.log('Reading tag data...');
            rfid.readData().then(function(data) {
                console.log('Tag data:', data);

                var records = ndef.decodeMessage(data.toJSON());
                console.log(records);
            });
        });
    });
});
}

//ReadClassic() 

/*Emulate a Tag*/
function EmulateTag(){
rfid.on('ready', function() {
    var messages = [
       
/* XUMM Payload */
//0x30, 0x64, 0x62, 0x30, 0x64, 0x38, 0x62, 0x61, 0x2d, 0x36, 0x61, 0x30, 0x38, 0x2d, 0x34, 0x32, 0x63, 0x36, 0x2d, 0x61, 0x36, 0x34, 0x38, 0x2d, 0x32, 0x32, 0x37, 0x64, 0x39, 0x38, 0x38, 0x39, 0x30, 0x66, 0x37, 0x36,  // if payload is more than 36 char then adapt the remianing bytes requried with the payload lengths.
0x64, 0x62, 0x61, 0x34, 0x63, 0x34, 0x66, 0x30, 0x2d, 0x61, 0x64, 0x32, 0x65, 0x2d, 0x34, 0x33, 0x31, 0x62, 0x2d, 0x38, 0x61, 0x32, 0x34, 0x2d, 0x66, 0x35, 0x39, 0x36, 0x65, 0x33, 0x36, 0x32, 0x63, 0x66, 0x37, 0x36
//need to get buffered data from route emulation in routes/index.js

    ];
    //console.log('messages: ',messages);
    var data = messages;
   // var data = ndef.encodeMessage(messages);
    //console.log('data: ',data);
	rfid.emulateSetData(data).then(function() {
        console.log('dataSet : ', data);
		  rfid.emulateTag().then(function(data) {
            console.log('emulateTag initialized');
		  
		});
});
});

}
EmulateTag()

function getFirmware(){
    
rfid.on('ready', function() {
    rfid.getFirmwareVersion().then(function(data) {
        console.log('firmware: ', data);
    });
});
}

//getFirmware()