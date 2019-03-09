import React, {Component} from 'react';
import {AppRegistry, Text, Image, AsyncStorage, View, ListView, StyleSheet, TextInput, TouchableHighlight, Dimensions, ImageBackground} from 'react-native';
import PasswordInputText from 'react-native-hide-show-password-input';

import auth from './auth';

/**
 * Documentation:
 * Login.js render the login page, it allows user to login either with just its github username
 * or user can also login using both username and its password so that user can later interact
 * with the application including follow/unfollow, star/unstar any repos.
 */


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

/**
 * Function to save userId to asyncStorage for future usage
 * @param userId User Github Username
 * @returns {Promise.<void>}
 */
const saveUserId = async (userId) => {
    try {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.setItem('userId', userId);
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Function to save authentication token to asyncStorage for future usage
 * @param userToken Github Auth Token
 * @returns {Promise.<void>}
 */
const saveUserToken = async (userToken) => {
    try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.setItem('userToken', userToken);
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Login class that render login page and set prop states
 */
export default class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {text: '', badThing: false, goodThing: true};
        this.password = {text: ''};
        this.token = '';
    }

    static navigationOptions = {
        header: null
    }
    render(){
        return(
            <ImageBackground
                style={styles.github}
                source={{uri: 'https://assets-cdn.github.com/images/modules/open_graph/github-mark.png'}}
            >
                <View style={styles.container}>
                    <TextInput
                        style={{height: 90, fontSize:30, textAlign: 'center',}}
                        placeholder="Enter Github Name Here"
                        onChangeText={(text) => this.setState({text})}
                    />

                    { this.state.goodThing &&
                    <TextInput secureTextEntry={true}
                               style={styles.textinput}
                               placeholder="Enter Github Password"
                               onChangeText={(text) => this.password.text = text}
                    />
                    }
                    { this.state.badThing &&
                    <TextInput secureTextEntry={true}
                               style={styles.badtextinput}
                               placeholder="Invalid Password!"
                               onChangeText={(text) => this.password.text = text}
                    />
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableHighlight style={styles.button} onPress={() => {saveUserId(this.state.text)
                            .then(() =>
                                {this.props.navigation.navigate('App');}
                            );
                        }}>
                            <View>
                                <Text style={styles.rowText}>Public</Text>
                            </View>
                        </TouchableHighlight>
                        <Text>          </Text>
                        <TouchableHighlight style={styles.button}
                        onPress={() => {auth(this.state.text, this.password.text).then((userToken) => {
                            console.log(userToken);
                            if(userToken == "bad"){
                                this.setState({badThing: true});
                                this.setState({goodThing: false});
                            }
                            else{
                                saveUserToken(userToken)
                                    .then(() =>
                                        {this.props.navigation.navigate('App');}
                                    );
                            }
                        })}
                        }>
                            <View>
                                <Text style={styles.prowText}>Private</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
/**
 * Style sheet for Login.js
 */
const styles = StyleSheet.create({
    github: {
        width: width,
        height: height,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        fontSize: 50,
    },
    rowText:{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 40,
        color: '#14f44f',
        borderRadius: 100,
    },
    textinput:{
        height: 90,
        fontSize:30,
        textAlign: 'center',
    },
    badtextinput:{
        height: 90,
        fontSize:30,
        textAlign: 'center',
        color: '#040101',
        textDecorationColor: '#f41f31',
        overlayColor: '#f41f31',
        backgroundColor: '#f41f31',
    },
    prowText:{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 40,
        color: '#f41f31',
        borderRadius: 100,
    },
    button: {
        backgroundColor: '#000000',
        borderRadius: 125
      },
});

AppRegistry.registerComponent('Login', () => Login);