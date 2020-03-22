'use strict';
// after a Payload to XUMM has been generated and teh next.always URL response has been returned, write U Payload to NFC Card.
// NFC Card Mifare Ultralight.
// USB NFC RFID Reader, ARC122u (Requires Readers drivers)

var pcsc = require('pcsclite');
var pcsc = pcsc();
const { NFC } = require('nfc-pcsc');

const nfc = new NFC(); 

const xummPayload = 'n' + 'https://xumm.app/';	

class TransmitError  {

	constructor(code, message, previousError) {

		//super(code, message, previousError);

		this.name = 'TransmitError';

	}

}

 class MifareUltralightPasswordAuthenticationError extends TransmitError {

	constructor(code, message, previousError) {

		super(code, message, previousError);

		this.name = 'MifareUltralightPasswordAuthenticationError';

	}

}

 class MifareUltralightFastReadError extends TransmitError {

	constructor(code, message, previousError) {

		super(code, message, previousError);

		this.name = 'MifareUltralightFastReadError';

	}

}

const parseBytes = (name, data, length) => {

	if (!(data instanceof Buffer) && typeof data !== 'string') {
		throw new Error(`${name} must an instance of Buffer or a HEX string.`);
	}

	if (Buffer.isBuffer(data)) {

		if (data.length !== length) {
			throw new Error(`${name} must be ${length} bytes long.`);
		}

		return data;

	}

	if (typeof data === 'string') {

		if (data.length !== length * 2) {
			throw new Error(`${name} must be a ${length * 2} char HEX string.`);
		}

		return Buffer.from(data, 'hex');

	}

	throw new Error(`${name} must an instance of Buffer or a HEX string.`);

};

class MifareUltralight {

	constructor(reader) {
		this.reader = reader;
	}

	// PWD_AUTH
	async passwordAuthenticate(password, pack) {

		// PASSWORD (4 bytes) (stored on card in page 18)
		// PACK (2 bytes) (stored in page 19 as first two bytes)
		// PACK is the response from card in case of successful PWD_AUTH cmd

		password = parseBytes('Password', password, 4);
		pack = parseBytes('Pack', pack, 2);

		// CMD: PWD_AUTH via Direct Transmit (ACR122U) and Data Exchange (PN533)
		const cmd = Buffer.from([
			0xff, // Class
			0x00, // Direct Transmit (see ACR122U docs)
			0x00, // ...
			0x00, // ...
			0x07, // Length of Direct Transmit payload
			// Payload (7 bytes)
			0xd4, // Data Exchange Command (see PN533 docs)
			0x42, // InCommunicateThru
			0x1b, // PWD_AUTH
			...password,
		]);

		this.reader.logger.debug('pwd_auth cmd', cmd);


		const response = await this.reader.transmit(cmd, 7);

		this.reader.logger.debug('pwd_auth response', response);
		// pwd_auth response should look like the following (7 bytes)
		// d5 43 00 ab cd 90 00
		// byte 0: d5 prefix for response of Data Exchange Command (see PN533 docs)
		// byte 1: 43 prefix for response of Data Exchange Command (see PN533 docs)
		// byte 2: Data Exchange Command Status 0x00 is success (see PN533 docs, Table 15. Error code list)
		// bytes 3-4: Data Exchange Command Response – our PACK (set on card in page 19, in bytes 0-1) from card
		// bytes 5-6: ACR122U success code

		if (response.length < 5) {
			throw new MifareUltralightPasswordAuthenticationError('invalid_response_length', `Invalid response length ${response.length}. Expected minimal length was 2 bytes.`)
		}

		if (response[2] !== 0x00 || response.length < 7) {
			throw new MifareUltralightPasswordAuthenticationError('invalid_password', `Authentication failed. Might be invalid password or unsupported card.`);
		}

		if (!response.slice(3, 5).equals(pack)) {
			throw new MifareUltralightPasswordAuthenticationError('pack_mismatch', `Pack mismatch.`)
		}

		return;

	}

	// FAST_READ
	async fastRead(startPage, endPage) {

		// CMD: PWD_AUTH via Direct Transmit (ACR122U) and Data Exchange (PN533)
		const cmd = Buffer.from([
			0xff, // Class
			0x00, // Direct Transmit (see ACR122U docs)
			0x00, // ...
			0x00, // ...
			0x07, // Length of Direct Transmit payload
			// Payload (7 bytes)
			0xd4, // Data Exchange Command (see PN533 docs)
			0x42, // InCommunicateThru
			0x3a, // PWD_AUTH
			startPage,
			endPage,
		]);

		const length = 3 + ((endPage - startPage + 1) * 4) + 2;

		const response = await this.reader.transmit(cmd, length);

		if (response < length) {
			throw new MifareUltralightFastReadError('invalid_response_length', `Invalid response length ${response.length}. Expected length was ${length} bytes.`)
		}

		return response.slice(3, -2);

	}

}


nfc.on('reader', async reader => {

	console.log(reader.name + ' device attached');
console.log('Write next.always URL from XUMM to Card')

	const ultralight = new MifareUltralight(reader);

	reader.on('card', async card => {

		console.log('card detected', card);

		const password = 'FFFFFFFF'; // default password
		const pack = '0000'; // default pack

		try {

			await ultralight.passwordAuthenticate(password, pack);

			console.log('passwordAuthenticate: successfully authenticated');

		} catch (err) {
			console.log('passwordAuthenticate error:', err);
		}

		
		
		 try {
			
			 
			const data = Buffer.allocUnsafe(44).fill(0);
			  
			const payload = Buffer.from(xummPayload);
			
			
			data.write(payload.toString());
			
			await reader.write(6, data);
			
			console.log(xummPayload +": From Xumm Has Been Written To The Card")
			
		
		 } catch (err) {
			console.log('write error:', err);
			return;
		 }
		 try {

			 const data = await ultralight.fastRead(4, 19);
			 const payload =  Buffer.from(data).toString();
	
			 console.log('Data Successfully Written:' + payload);
			 
		

		 } catch (err) {
			 console.log('fastRead error:', err);
			 return;
		 }


		});

	reader.on('error', err => {
		console.log(`an error occurred`, reader, err);
	});

	reader.on('end', () => {
		console.log(`device removed`, reader);
	});

});

nfc.on('error', err => {
	console.log(`an error occurred`, err);
	
});