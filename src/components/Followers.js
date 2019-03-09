import React, {Component} from 'react';
import {AppRegistry, Text, View, ListView, TouchableOpacity, Image, AsyncStorage, StyleSheet, TouchableHighlight} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import OcticonIcon from 'react-native-vector-icons/dist/Octicons';
import Hyperlink from 'react-native-hyperlink';

/**
 * Documentation:
 * This is the file for the followers page, it gets item from async storage and render the page
 */

var userID= '';
var userToken= '';

/**
 * Function to save user ID to asyncStorage for future usage,
 * this is called if user select a cell and want to navigate to a new follower's profile page
 * @param userId: user's Github username
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
 * Function to save a user's followers' information to asyncStorage for future usage
 * @param FollowerInfo: Other Github users that follows the current user
 * @returns {Promise.<void>}
 */
const saveFollowerInfo = async (FollowerInfo) => {
    try {
        await AsyncStorage.removeItem('FollowerInfo');
        await AsyncStorage.setItem('FollowerInfo', FollowerInfo);
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Followers class that render followers' repo page and set prop states
 */
export default class Followers extends Component{
    constructor(){
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            userDataSource: ds,
        };
    }
    componentDidMount(){
        AsyncStorage.getItem("userId").then((value) => {
            userID = value;
            AsyncStorage.getItem("userToken").then((value) => {
                userToken = value;
                if (userToken == ''){
                    var giturl = 'https://api.github.com/users/' + userID + '/followers';
                    this.fetchUsers(giturl);
                }else {
                    this.fetchUsersWithToken(userID, userToken);
                }
            });
        });
    }

    /**
     * Helper function that fetch user info if auth token is present
     * @param uid: User ID
     * @param token: Github Auth Token
     * @returns {Promise.<*>}
     */
    fetchUsersWithToken(uid, token){
        let url = 'https://api.github.com/user/followers';
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Basic '+btoa(uid+':'+token),
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
        .then((response) => response.json())
        .then((response) => {
            this.setState({
                userDataSource: this.state.userDataSource.cloneWithRows(response)
            });
            saveFollowerInfo({response});
        });

    }

    /**
     * Helper function that fetch user info if auth token is NOT present, fetch public information
     * @param giturl: This is the public url with user ID append at the end
     * @returns {Promise.<*>}
     */
    fetchUsers(giturl){
        // fetch('https://api.github.com/users/herbherbherb/followers')
        fetch(giturl)
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    userDataSource: this.state.userDataSource.cloneWithRows(response)
                });
                saveFollowerInfo({response});
            });
    }

    /**
     * Helper function send PUT request to Github API to follow a repo
     * @param username: The Github username of the cell that user click on
     * @returns {Promise.<*>}
     */
    follow(username){
        // PUT /user/following/:username
        let url = 'https://api.github.com/user/following/' + username;
        fetch(url, {
            method: 'PUT',
            headers: new Headers({
                'Authorization': 'Basic '+btoa(userID+':'+userToken),
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
    }

    renderRow(user, sectionId, rowId, highlightRow){
        return(
            <View style={styles.row}>
                <TouchableHighlight underlayColor="#f4f4f4" style={styles.button} onPress={() => {saveUserId(user.login)
                    .then(() =>
                        {this.props.navigation.navigate('Prof');
                        }
                    )
                }}>
                <Hyperlink linkDefault={ true }>
                    <Image
                        style={styles.github}
                        source={{uri: user.avatar_url}}
                    />
                    <Text style={styles.rowText}><OcticonIcon name="octoface" size={20} /> Follower: {user.login}{"\n"}</Text>
                    <Text style={styles.urlText}><OcticonIcon name="arrow-right" size={30} /> {user.html_url}</Text>
                    <TouchableOpacity onPress={() => this.follow(user.login)}
                                      style={styles.follow}>
                        <Text >  <OcticonIcon name="thumbsup" size={20} /> Follow </Text>
                    </TouchableOpacity>
                </Hyperlink>
                </TouchableHighlight>
            </View>
        )
    }

    render(){
        return(
            <View>
                <Text style={styles.titleText}>Followers Page</Text>
                <ListView
                    dataSource={this.state.userDataSource}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }
}

/**
 * Style sheet for Followers.js
 */
const styles = StyleSheet.create({
    row: {
        flexDirection:'row',
        padding:10,
        backgroundColor: '#f4f4f4',
        marginBottom:3
    },
    rowText: {
        flex:1,
        fontSize: 18,
        color: '#f49809'
    },
    urlText: {
        flex:1,
        fontSize: 18,
        color: '#093af4'
    },
    titleText: {
        fontSize: 30,
        color: '#000000'
    },
    github: {
        width: 40,
        height: 40
    },
    follow: {
        backgroundColor: '#22f41e',
        width: 90,
        borderRadius: 100,
    },
});

AppRegistry.registerComponent('Followers', () => Component6);