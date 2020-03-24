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

import NfcManager, { NfcTech, NfcAdapter, tech, Nfc,} from 'react-native-nfc-manager';
import AwesomeAlert from 'react-native-awesome-alerts';

let text;
let url;

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            log: "XRPL Magic",
            text: ""
            
        }
        
    }
     
    componentDidMount() {
        NfcManager.start()
        Linking.addEventListener('url', this._handleOpenURL);
       
   
    }
 
    componentWillUnmount() {
        this._cleanUp();
    }
 
    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
    
    _handleOpenURL(event) {
    	  console.log(event.url);
    	}
 
    readData = async () => {
 
         
 
        try {
 
             
            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: 'Present Phone To Card'
            });
 
            let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;

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
        	
        	url = this.state.log;
        
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
            alert( "Error Loading URL: " + url)
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
                log: resp.toString()
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
             
 
                

               
 
                <TouchableOpacity
                    style={styles.buttonRead}
                    onPress= {this.readData}>
                    <Text style={styles.buttonText}>NFC XUMM URL</Text>
                </TouchableOpacity>
                
 
                <View style={styles.log}>
                <Text>{this.state.log}</Text>
            </View>

            <TextInput
                              style={styles.textInput1}
                               onChangeText={this.onChangeText}
                              autoCompleteType="off"
                               autoCapitalize="none"
                               autoCorrect={false}
                               placeholderTextColor="#888888"
                               placeholder="Insert XRP Address to write" />

                            	   <TouchableOpacity
                             style={styles.buttonRead}
                               onPress={this.writeData}>
                             <Text style={styles.buttonText}>Write</Text>
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
    
 
})
 

export default App;
