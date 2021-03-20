 const { Console } = require('console');
let dotenv = require('dotenv');
let request = require('request')

dotenv.config();

/* var apikey = process.env.apikey;
var apisecret = process.env.apisecret; 
var Host = process.env.HOSTNAME; */

var apikey= "935c604a-3309-4700-97c0-93fab7c2478f"
var apisecret= "1511bd5b-304a-492f-ae60-b276e43768b8"

var A = "\\x90\\x00";
var B = "\\x6a\\x00";
var C = "\\x6a\\x82";

/* Create XUMm Payload*/
async function XummSign(){

	console.log("Creating XUMM Payload")

	var options = {
	  method: 'POST',
	  url: 'https://xumm.app/api/v1/platform/payload',
	  headers: {
		'content-type': 'application/json',
		'x-api-key': apikey,
		'x-api-secret': apisecret,
		authorization: 'Bearer' + apisecret
	  },
	  body: {
		  "options": {
				"submit": true,
				"return_url": {
					"web": "",
					"app": ""
						}    
				  },
			  "txjson": {
				"TransactionType": "SignIn",
				"Destination": "", 
				"Fee": "12"
			  }
			},
	  json: true,
	  jar: 'JAR'
	};

	request(options, async function (error, response, body) {
	  if (error) throw new Error(error);
	  
	  UUID = body.uuid;
 
console.log(UUID)
var data = Buffer.from(UUID, 'utf-8')
.toString('hex')
.match(/.{2}/g).map(r => {
  return '0x' + r
}).join(', ')
await data;
console.log("XUMM Payload Created : "+data)

const fs = require('fs');

/*Write new nfc-emulate-forum-tag4.c file*/

fs.writeFile('./nfc-emulate-forum-tag4.c', '#ifdef HAVE_CONFIG_H\n#  include "config.h"\n#endif // HAVE_CONFIG_H\n#include <sys/types.h>\n#include <sys/stat.h>\n#include <errno.h>\n#include <signal.h>\n#include <stdio.h>\n#include <stdlib.h>\n#include <stddef.h>\n#include <stdint.h>\n#include <string.h>\n\n#include <nfc/nfc.h>\n#include <nfc/nfc-emulation.h>\n\n#include "nfc-utils.h"\n\nstatic nfc_device *pnd;\nstatic nfc_context *context;\nstatic bool quiet_output = false;\n// Version of the emulated type4 tag:\nstatic int type4v = 2;\n\n#define SYMBOL_PARAM_fISO14443_4_PICC   0x20\n\ntypedef enum { NONE, CC_FILE, NDEF_FILE } file;\n\nstruct nfcforum_tag4_ndef_data {\n  uint8_t *ndef_file;\n  size_t   ndef_file_len;\n};\n\nstruct nfcforum_tag4_state_machine_data {\n file     current_file;\n};\n\nuint8_t nfcforum_capability_container[] = {\n 0x00, 0x0F, /* CCLEN 15 bytes */ \n 0x20,/* Mapping version 2.0, use option -1 to force v1.0 */\n 0x00, 0x54, /* MLe Maximum R-ADPU data size */\n 0x00, 0xFF, /* MLc Maximum C-ADPU data size */\n 0x04,/* T field of the NDEF File-Control TLV */\n 0x06,/* L field of the NDEF File-Control TLV */\n /* V field of the NDEF File-Control TLV */\n 0xE1, 0x04, /* File identifier */\n 0xFF, 0xFE, /* Maximum NDEF Size */\n 0x00,/* NDEF file read access condition */ \n0x00,       /* NDEF file write access condition */ \n}; \n \n/* C-ADPU offsets */\n#define CLA  0 \n#define INS  1\n#define P1   2\n#define P2   3\n#define LC   4\n#define DATA 5\n\n#define ISO144434A_RATS 0xE0\n\nstatic int\nnfcforum_tag4_io(struct nfc_emulator *emulator, const uint8_t *data_in, const size_t data_in_len, uint8_t *data_out, const size_t data_out_len)\n{\n int res = 0;\n\nstruct nfcforum_tag4_ndef_data *ndef_data = (struct nfcforum_tag4_ndef_data *)(emulator->user_data);\nstruct nfcforum_tag4_state_machine_data *state_machine_data = (struct nfcforum_tag4_state_machine_data *)(emulator->state_machine->data); \n\n if (data_in_len == 0) {  \n// No input data, nothing to do  \n return res;  \n } \n // Show transmitted command \n if (!quiet_output) { \n printf("    In: ");\n print_hex(data_in, data_in_len); \n } \n \nif (data_in_len >= 4) { \nif (data_in[CLA] != 0x00) \n return -ENOTSUP;\n#define ISO7816_SELECT         0xA4\n#define ISO7816_READ_BINARY    0xB0\n#define ISO7816_UPDATE_BINARY  0xD6  \n  \n switch (data_in[INS]) {   \n case ISO7816_SELECT:   \n  \n switch (data_in[P1]) {   \n  case 0x00: /* Select by ID */   \n if ((data_in[P2] | 0x0C) != 0x0C)   \n  return -ENOTSUP;  \n\nconst uint8_t ndef_capability_container[] = { 0xE1, 0x03 }; \nconst uint8_t ndef_file[] = { 0xE1, 0x04 }; \nif ((data_in[LC] == sizeof(ndef_capability_container)) && (0 == memcmp(ndef_capability_container, data_in + DATA, data_in[LC]))) {\n memcpy(data_out, "'+A+'", res = 2);\n state_machine_data->current_file = CC_FILE;\n } else if ((data_in[LC] == sizeof(ndef_file)) && (0 == memcmp(ndef_file, data_in + DATA, data_in[LC]))) {\n  memcpy(data_out, "'+A+'", res = 2); \n  state_machine_data->current_file = NDEF_FILE; \n } else {\n  memcpy(data_out, "'+B+'", res = 2);\n  state_machine_data->current_file = NONE;\n }\n break;\n  case 0x04: /* Select by name */\n   if (data_in[P2] != 0x00)\n     return -ENOTSUP;\n    const uint8_t ndef_tag_application_name_v1[] = { 0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x00 };\n   const uint8_t ndef_tag_application_name_v2[] = { 0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01 };\n   if ((type4v == 1) && (data_in[LC] == sizeof(ndef_tag_application_name_v1)) && (0 == memcmp(ndef_tag_application_name_v1, data_in + DATA, data_in[LC])))\n     memcpy(data_out, "'+A+'", res = 2);\n   else if ((type4v == 2) && (data_in[LC] == sizeof(ndef_tag_application_name_v2)) && (0 == memcmp(ndef_tag_application_name_v2, data_in + DATA, data_in[LC])))\n     memcpy(data_out, "'+A+'", res = 2);\n   else\n     memcpy(data_out, "'+C+'", res = 2);\n   break;\n default:\n   return -ENOTSUP;\n }\n break;\ncase ISO7816_READ_BINARY:\n  if ((size_t)(data_in[LC] + 2) > data_out_len) { \n    return -ENOSPC; \n  }\n switch (state_machine_data->current_file) {     \n   case NONE:     \n    memcpy(data_out, "'+C+'", res = 2);       \n    break;       \n case CC_FILE:       \n   memcpy(data_out, nfcforum_capability_container + (data_in[P1] << 8) + data_in[P2], data_in[LC]);       \n    memcpy(data_out + data_in[LC], "'+A+'", 2);       \n   res = data_in[LC] + 2;       \n   break;       \n case NDEF_FILE:       \n    memcpy(data_out, ndef_data->ndef_file + (data_in[P1] << 8) + data_in[P2], data_in[LC]);       \n    memcpy(data_out + data_in[LC], "'+A+'", 2); \n   res = data_in[LC] + 2; \n   break; \n}\nbreak;\n case ISO7816_UPDATE_BINARY:\n   memcpy(ndef_data->ndef_file + (data_in[P1] << 8) + data_in[P2], data_in + DATA, data_in[LC]);\n   if ((data_in[P1] << 8) + data_in[P2] == 0) {  \n     ndef_data->ndef_file_len = (ndef_data->ndef_file[0] << 8) + ndef_data->ndef_file[1] + 2;  \n   }  \n   memcpy(data_out, "'+A+'", res = 2); \n   break;  \n default: // Unknown  \n   if (!quiet_output) {      \n     printf("Unknown frame, emulated target abort.");      \n   }      \n   res = -ENOTSUP;      \n}      \n} else {           \n res = -ENOTSUP;           \n}       \n// Show transmitted command   \n if (!quiet_output) { \n if (res < 0) {  \n  ERR("%s (%d)", strerror(-res), -res);                  \n } else {  \n  printf("    Out: ");    \n print_hex(data_out, res);    \n }   \n}\nreturn res; \n} \nstatic void stop_emulation(int sig) \n{   \n(void) sig;  \nif (pnd != NULL) {  \n  nfc_abort_command(pnd);    \n} else {  \n  nfc_exit(context);  \n  exit(EXIT_FAILURE);   \n}  \n}   \nstatic int   \nndef_message_load(char *filename, struct nfcforum_tag4_ndef_data *tag_data) \n{ \n struct stat sb;     \n FILE *F;  \n if (!(F = fopen(filename, "r"))) {   \n   printf("File not found or not accessible '+'%s'+'", filename);    \n  return -1;  \n}   \nif (stat(filename, &sb) < 0) {    \n  printf("File not found or not accessible '+'%s'+'", filename);    \n  fclose(F);    \n  return -1; \n }\n /* Check file size */\nif (sb.st_size > 0xFFFF) {   \n  printf("File size too large '+'%s'+'", filename);   \n  fclose(F);   \n  return -1;   \n }   \n tag_data->ndef_file_len = sb.st_size + 2;   \ntag_data->ndef_file[0] = (uint8_t)(sb.st_size >> 8);   \ntag_data->ndef_file[1] = (uint8_t)(sb.st_size);   \nif (1 != fread(tag_data->ndef_file + 2, sb.st_size, 1, F)) {       \n  printf("Can not read from %s", filename);      \n fclose(F);       \n return -1;      \n}      \n fclose(F);      \n return sb.st_size;       \n}       \nstatic int       \nndef_message_save(char *filename, struct nfcforum_tag4_ndef_data *tag_data)       \n{           \n FILE *F;           \n  if (!(F = fopen(filename, "w"))) {  \n  printf("fopen (%s, w)", filename);    \n return -1;     \n}   \nif (1 != fwrite(tag_data->ndef_file + 2, tag_data->ndef_file_len - 2, 1, F)) { \n  printf("fwrite (%d)", (int) tag_data->ndef_file_len - 2);    \n   fclose(F);   \n  return -1;   \n}  \n fclose(F);  \n return tag_data->ndef_file_len - 2;  \n}  \nstatic void  \nusage(char *progname) \n{  \n fprintf(stderr, "usage:'+ '%s'+' [-1] [infile [outfile]]", progname); \n  fprintf(stderr, "      -1: force Tag Type 4 v1.0 (default is v2.0)");  \n}  \nint    \nmain(int argc, char *argv[])\n{    \n int options = 0;   \n nfc_target nt = {  \n  .nm = {    \n    .nmt = NMT_ISO14443A,   \n   .nbr = NBR_UNDEFINED, // Will be updated by nfc_target_init()   \n },  \n  .nti = {     \n     .nai = {    \n      .abtAtqa = { 0x00, 0x04 },\n     .abtUid = { 0x08, 0x00, 0xb0, 0x0b },   \n     .szUidLen = 4,\n     .btSak = 0x20,   \n     .abtAts = { 0x75, 0x35, 0x92, 0x03 }, /* Not used by PN532 */   \n     .szAtsLen = 4, \n   },  \n },  \n };\n uint8_t ndef_file[0xfffe] = {  \n0x00, /**/   \n   \n75, /* NDEF Length  */ //change if xumm payload is over 36 char   \n/* NDEF start */    \n0xD1, /* NDEF Header MB=1, ME=1, CF=0, SR=1, IL=0, TNF=1 */   \n0x02, /* Type Length 1 byte */   \n0x46, /* Payload remainng total length  */ //change if xumm payload is over 36 char   \n0x53, 0x70, 0x91, 0x01, 0x09,    \n0x54, 0x02, /*T */   \n0x65, 0x6e, /*EN*/  \n0x58, 0x55, 0x4d, 0x4d, 0x20,0x20,// blank 0x20/*T Payload (XUMM)*/  \n0x51, 0x01,    \n0x34, /*Payload Length*/ //change if xumm payload is over 36 char   \n0x55, /* Type U (URI) */    \n/* Payload start */    \n0x04, /* URI Record Type : https:// */    \n/* URI Data : xumm.app/sign/ */   \n0x78, 0x75, 0x6d, 0x6d, 0x2e, 0x61, 0x70, 0x70, 0x2f, 0x73, 0x69, 0x67, 0x6e, 0x2f, /*Payload URI*/   \n/* XUMM Payload */   \n//0x30, 0x64, 0x62, 0x30, 0x64, 0x38, 0x62, 0x61, 0x2d, 0x36, 0x61, 0x30, 0x38, 0x2d, 0x34, 0x32, 0x63, 0x36, 0x2d, 0x61, 0x36, 0x34, 0x38, 0x2d, 0x32, 0x32, 0x37, 0x64, 0x39, 0x38, 0x38, 0x39, 0x30, 0x66, 0x37, 0x36,  // if payload is more than 36 char then adapt the remianing bytes requried with the payload lengths.   \n'+data+'//0x64, 0x62, 0x61, 0x34, 0x63, 0x34, 0x66, 0x30, 0x2d, 0x61, 0x64, 0x32, 0x65, 0x2d, 0x34, 0x33, 0x31, 0x62, 0x2d, 0x38, 0x61, 0x32, 0x34, 0x2d, 0x66, 0x35, 0x39, 0x36, 0x65, 0x33, 0x36, 0x32, 0x63, 0x66, 0x37, 0x36 \n//need to get buffered data from route emulation in routes/index.js \n};\nstruct nfcforum_tag4_ndef_data nfcforum_tag4_data = {   \n  .ndef_file = ndef_file,   \n  .ndef_file_len = ndef_file[1] + 2,  \n printf(ndef_file)  \n }; \n struct nfcforum_tag4_state_machine_data state_machine_data = {       \n  .current_file = NONE,      \n  };      \n      \n struct nfc_emulation_state_machine state_machine = { \n   .io   = nfcforum_tag4_io,  \n   .data = &state_machine_data, \n };  \n  \n struct nfc_emulator emulator = {  \n   .target = &nt,  \n  .state_machine = &state_machine,   \n  .user_data = &nfcforum_tag4_data,   \n };   \n    \n if ((argc > (1 + options)) && (0 == strcmp("-h", argv[1 + options]))) {       \n   usage(argv[0]);      \n   exit(EXIT_SUCCESS);      \n }      \n       \nif ((argc > (1 + options)) && (0 == strcmp("-1", argv[1 + options]))) {           \n  type4v = 1;  \n  nfcforum_capability_container[2] = 0x10; \n  options += 1;  \n }  \n if (argc > (3 + options)) { \n  usage(argv[0]);  \n  exit(EXIT_FAILURE);  \n }  \n // If some file is provided load it  \n if (argc >= (2 + options)) { \n   if (ndef_message_load(argv[1 + options], &nfcforum_tag4_data) < 0) {  \n     printf("Can not load NDEF file '+'%s'+'", argv[1 + options]); \n    exit(EXIT_FAILURE);   \n  }  \n }    \n nfc_init(&context);\n if (context == NULL) {  \n  ERR("Unable to init libnfc (malloc)");   \n  exit(EXIT_FAILURE);  \n }   \n // Try to open the NFC reader   \npnd = nfc_open(context, NULL);    \nif (pnd == NULL) {    \n  ERR("Unable to open NFC device"); \n  nfc_exit(context); \n  exit(EXIT_FAILURE);  \n } \nsignal(SIGINT, stop_emulation);  \n    \nprintf("NFC device: %s opened", nfc_device_get_name(pnd));  \n printf("Emulating XUMM NDEF Payload now, please present phone to the reader!!");  \n if (0 != nfc_emulate_target(pnd, &emulator, 0)) {  // contains already nfc_target_init() call    \n   nfc_perror(pnd, "nfc_emulate_target");   \n   nfc_close(pnd);  \n  nfc_exit(context);   \n  exit(EXIT_FAILURE);    \n }   \nif (argc == (3 + options)) {  \n   if (ndef_message_save(argv[2 + options], &nfcforum_tag4_data) < 0) {    \n     printf("Can not save NDEF file '+'%s'+'", argv[2 + options]); \n   nfc_close(pnd);   \n    nfc_exit(context);    \n    exit(EXIT_FAILURE); \n  }     \n }   \n  \n  nfc_close(pnd);    \n  nfc_exit(context);  \n  exit(EXIT_SUCCESS);                     \n}', function(err) {
    if(err) {
        return console.log(err);
    }
	console.log("The file was saved!");
	/*Build/Compile nfc-emulation-forum-tag4*/

	try{
		/* var binding = require('node-gyp-build')("./nfc-emulate-forum-tag4.c")
		binding; */

		/*Make the new file */

		function makeFile(){
		//	console.log("Starting to Make New Emulation Tag with Payload")
			const exec = require('child_process').exec
			const myShellScript = exec('sh pos.sh ./');
			myShellScript.stdout.on('data', (data)=>{
				// Print Make && Makeinstall
				//console.log(data); 
				// do whatever you want here with data
			});
			myShellScript.stderr.on('data', (data)=>{
				// Print Make && Makeinstall errors and warnings
			//	console.error(data);
			});
		}

		setTimeout(makeFile, 500)
	}
	catch (error){
		console.log(error)
	}
	try {
		
		/*Run the new emulation file with Xumm payload */
	async function runPoS(){
		await makeFile();
			console.log("Starting PoS Terminal")
			console.log("Emulating XUMM NDEF Payload now, please present phone to the reader!!")
		const exec = require('child_process').exec
 const myShellScript = exec('sh run.sh ./');
myShellScript.stdout.on('data', (data)=>{
     console.log(data); 
  
 });
 myShellScript.stderr.on('data', (data)=>{
     console.error(data);
 });
}

setTimeout(runPoS, 3000)
	}
	catch (error){
		console.log(error)
	}
}); 


});


}

XummSign()


function quit(message) {
    console.log(message);
    process.exit(0);
  }

  function fail(message) {
    console.error(message);
    process.exit(1);
  }