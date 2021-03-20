import React, { Component } from 'react'
import { 
    View,
    Text,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    Alert,
    Linking
   
} from 'react-native'

import NfcManager, { NfcTech, NfcEvents, NfcAdapter, Iso15693IOS, Ndef,tech, Nfc,} from 'react-native-nfc-manager';
import  StackNavigator from 'react-navigation';
import {Logo} from './src/image';
//import Router from './route';

let text;
let url;
let url1;
let url2;
let part = "https://xumm.app/sign/"
let PoS;

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            log: "XUMM Magic",
            log1: "XUMM Payload",
            text: ""
            
        }
        
    }
     
    componentDidMount() {
        NfcManager.start()
        NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
         // console.warn('tag', tag);
         /*  console.warn(
            'tag payload',
            String.fromCharCode(...tag.ndefMessage[0].payload),
          ); */
          
        PoS = String.fromCharCode(...tag.ndefMessage[0].payload);
        url2 = PoS.slice(32, 70)
        url = part + url2;
        this.setState({
          log1: url2
      });
        	Linking.canOpenURL(url)
        	  .then((supported) => {
        	    if (!supported) {
        	      console.log("Can't handle url: " + url);
        	    } else {
        	      return Linking.openURL(url);
        	    }
        	  })
          NfcManager.setAlertMessageIOS('I got your tag!');
          NfcManager.cancelTechnologyRequest().catch(() => 0);
        });
        if (Platform.OS === 'android') {
        Linking.getInitialURL().then(url => {
            this.navigate(url);
          });
        } else {
        	
        Linking.addEventListener('url', this._handleOpenURL);
       
        }
    }
 
    componentWillUnmount() {
        this._cleanUp();
        Linking.removeEventListener('url', this.handleOpenURL);
    }
 
    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
        NfcManager.unregisterTagEvent().catch(() => 0);   
       // NfcManager.setEventListener(NfcEvents.DiscoverTag, null); 
    }
    
    _handleOpenURL(event) {
    	  console.log(event.url);
    	  //this.navigate(event.url);
    	}
 
    navigate = (url) => {
        const { navigate } = this.props.navigation;

        const route = url.replace(/.*?:\/\//g, '');
        const routeName = route.split('/')[0];
        
        if (routeName === 'app') {
        	this._handleOpenURL()
        };
    }
    
    readNdef = async () => {
      try {
        let text = ""
       await NfcManager.registerTagEvent({alertMessage: 'Present Phone To XUMM PoS!!!'})
        if (Platform.OS === 'ios') {
         await NfcManager.requestTechnology(NfcTech.MifareIOS, NfcTech.Iso15693IOS, NfcTech.IsoDep);
        } else {
         await NfcManager.requestTechnology(NfcTech.Ndef);
        }
       // console.warn(text)
        
      /*  let tag = await NfcManager.getTag();
     //  console.warn(tag) 
       Alert.alert(tag.ndefMessage)
       this.setState({
        log1: String.fromCharCode(...tag.ndefMessage[0].payload)
    })
        this._cleanUp();
 */
      } catch (ex) {
        this._cleanUp();
      }
    

    }

    readData = async () => {
 

// Mifare Ultralight EV1
  
        try {
 
             
            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: 'Present Phone To XUMM Card!!'
            });
 
            let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;
                                // bytes 58 0x3A, 75 bytes 0x4b,
            resp = await cmd([0x3A, 4, 4]);
            let payloadLength = parseInt(resp.toString().split(",")[1]);
            let payloadPages = Math.ceil(payloadLength / 4);
            let startPage = 5;
            let endPage = startPage + payloadPages - 1;

            resp = await cmd([0x3A, startPage, endPage]);
            bytes = resp.toString().split(",");
            let text = "";

            for(let i=0; i<bytes.length; i++){
                if (i < 5){
                    continue;
                }

                if (parseInt(bytes[i]) === 254){
                    break;
                }

                text = text + String.fromCharCode(parseInt(bytes[i]));
                
            }
            	
 
            
            this.setState({
                log: text
            })

            this._cleanUp();
        } catch (ex) {
            this.setState({
                log: ex.toString()
            })
            this._cleanUp();
        }
        try
        {
        	
        	url1 = this.state.log1;
        	url = part + url1;
        	Linking.canOpenURL(url)
        	  .then((supported) => {
        	    if (!supported) {
        	      console.log("Can't handle url: " + url);
        	    } else {
        	      return Linking.openURL(url);
        	    }
        	  })
    }
        catch (error) {
            alert( "Error Loading URL: "+url )
        }

    }
 
   
 
    onChangeText = (text) => {
        this.setState({
            text
        })
    }
    
    writeData = async () => {
        if (!this.state.text){
            Alert.alert("Nothing to write");
            return;
        }
        try {
            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: 'Ready to do some custom Mifare cmd!'
            });

            let text = this.state.text;
            let fullLength = text.length + 7;
            let payloadLength = text.length + 3;

            let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;

            resp = await cmd([0xA2, 0x04, 0x03, fullLength, 0xD1, 0x01]); // 0x0C is the length of the entry with all the fluff (bytes + 7)
            resp = await cmd([0xA2, 0x05, payloadLength, 0x54, 0x02, 0x65]); // 0x54 = T = Text block, 0x08 = length of string in bytes + 3

            let currentPage = 6;
            let currentPayload = [0xA2, currentPage, 0x6E];

            for(let i=0; i<text.length; i++){
                currentPayload.push(text.charCodeAt(i));
                if (currentPayload.length == 6){
                    resp = await cmd(currentPayload);
                    currentPage += 1;
                    currentPayload = [0xA2, currentPage];
                }
            }

            // close the string and fill the current payload
            currentPayload.push(254);
            while(currentPayload.length < 6){
                currentPayload.push(0);
            }

            resp = await cmd(currentPayload);

            this.setState({
                log1: resp.toString()
            })

            this._cleanUp();
        } catch (ex) {
            this.setState({
                log: ex.toString()
            })
            this._cleanUp();
        }
    } 
 
  
     
    render() {
        
        
        return (
             
            <SafeAreaView style={styles.container}>
 
            <ScrollView>
             
 
                
            	<Image style={styles.image} source={Logo} />
               
            	<View style={styles.log}>
            	<Text>{this.state.log}</Text>
              <Text>{this.state.log1}</Text>
            	</View>
        
        
        
                <TouchableOpacity
                    style={styles.buttonRead}
                    onPress= {this.readData}>
                    <Text style={styles.buttonText}>XUMM Card</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.buttonRead}
                    onPress= {this.readNdef}>
                    <Text style={styles.buttonText}>XUMM PoS</Text>
                </TouchableOpacity>
 
                  <TextInput
                              style={styles.textInput1}
                               onChangeText={this.onChangeText}
                              autoCompleteType="off"
                               autoCapitalize="none"
                               autoCorrect={false}
                               placeholderTextColor="#888888"
                               placeholder="Write XUMM Payload" />

                            	   <TouchableOpacity
                             style={styles.buttonRead}
                               onPress={this.writeData}>
                             <Text style={styles.buttonText}>Write to XUMM Card</Text>
                          </TouchableOpacity> 
 
                </ScrollView>
 
            </SafeAreaView>
        )
    }
 
}

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    buttonRead: {
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: 'blue'
    },
    buttonText: {
        color: '#ffffff'
    },
    log: {
        marginTop: 30,
        marginBottom: 30,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: 'blue',
         
    },
    logotext: {
        color: '#ffffff',
    },
    textInput1: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        height: 50,
        textAlign: 'center',
        color: 'black'
    }
    
 
})

/* let text = ""
await NfcManager.registerTagEvent()
 if (Platform.OS === 'ios') {
  await NfcManager.requestTechnology(NfcTech.MifareIOS, NfcTech.Iso15693IOS, NfcTech.IsoDep);
 } else {
  await NfcManager.requestTechnology(NfcTech.Ndef);
 }
// console.warn(text)
 
 let tag = await NfcManager.getTag();
console.warn(tag) 

 /*Have had a response 3 times using this method but appears tempomental, when trying to change to present data, i lost the connection and cant get it back. So F*************ING frustrating*/
// this._cleanUp(); */

export default App;
