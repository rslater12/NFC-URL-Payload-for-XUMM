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

//let text;

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
       
   
    }
 
    componentWillUnmount() {
        this._cleanUp();
    }
 
    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
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
        	Linking.openURL(text)
        	
        }
        catch (error) {
            alert( "Error Loading URL")
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
