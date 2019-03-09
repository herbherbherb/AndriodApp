import React, {Component} from 'react';
import {AppRegistry, Text, Image, View, ImageBackground, AsyncStorage, ListView, StyleSheet, TouchableHighlight, Dimensions} from 'react-native';
import OcticonIcon from 'react-native-vector-icons/dist/Octicons';
import { NavigationEvents } from 'react-navigation';

/**
 * Documentation:
 * This is the profile page. It is navigated from the login page
 * Once rendered, it will get user ID and user token (if it is a private login) from async storage
 * It will fetch the data again and display the corresponding user info onto the page.
 */

let width = Dimensions.get('window').width;
let userID= '';
let userToken= '';
let height = Dimensions.get('window').height;
let mypadding = 10;
let myimage = 200;
let mygithub = 100;
if (height < 695){
    myimage = 150;
    mypadding = 8;
    mygithub = 75;
}

/**
 * Function to save user Github profile information to asyncStorage for future usage
 * @param PersonalInfo
 * @returns {Promise.<void>}
 */
const savePersonalInfo = async (PersonalInfo) => {
    try {
        await AsyncStorage.removeItem('PersonalInfo');
        await AsyncStorage.setItem('PersonalInfo', PersonalInfo);
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Function that get userID (Github username) from asyncStorage that was previously stored in Login.js
 * @returns {Promise.<*>}
 */
const getUserID = async () => {
    try {
        var value = await AsyncStorage.getItem("userId");
        return value;
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Function that get user Token (Github auth token) from asyncStorage that was previously stored in Login.js
 * @returns {Promise.<*>}
 */
const getUserToken = async () => {
    try {
        var value = await AsyncStorage.getItem("userToken");
        console.log(value);
        return value;
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Profile class that render profile page and set prop states
 */
export default class Component4 extends Component{
    constructor(){
        super();
        this.state = {
            name: '',
            login: '',
            email: 'herbertwangwrt@gmail.com',
            company: '',
            location: '',
            created_at: '',
            avatar_url: '',
            public_repos:'',
            followers:'',
            following:'',
        };
    }

    componentWillMount() {
        console.log("componentWillMount");
        if(userID == ''){
            getUserID().then((value) => {
                userID = value;
                getUserToken().then((value) => {
                    userToken = value;
                    if (userToken == ''){
                        console.log(userToken);
                        var giturl = 'https://api.github.com/users/' + userID;
                        this.fetchUsers(giturl);
                    }else {
                        this.fetchUsersWithToken(userID, userToken);
                    }
                });
            });
        }
    }
    //
    // componentDidUpdate() {
    //     console.log("componentDidUpdate");
    //     if(userID == ''){
    //         console.log("Did updated");
    //         getUserID().then((value) => {
    //             userID = value;
    //             getUserToken().then((value) => {
    //                 userToken = value;
    //                 if (userToken == ''){
    //                     console.log(userToken);
    //                     var giturl = 'https://api.github.com/users/' + userID;
    //                     this.fetchUsers(giturl);
    //                 }else {
    //                     this.fetchUsersWithToken(userID, userToken);
    //                 }
    //             });
    //         });
    //     }
    // }

    static navigationOptions = {
        header: null
    }

    componentDidMount(){
        console.log("componentDidMount");
        getUserID().then((value) => {
            userID = value;
            getUserToken().then((value) => {
                userToken = value;
                if (userToken == ''){
                    console.log(userToken);
                    var giturl = 'https://api.github.com/users/' + userID;
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
        let url = 'https://api.github.com/user';
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
                name : response.name,
                login: response.login,
                email: response.email,
                company: response.company,
                location: response.location,
                created_at: response.created_at,
                avatar_url: response.avatar_url,
                public_repos: response.public_repos,
                followers: response.followers,
                following: response.following
            });
            savePersonalInfo({'name': response.name, 'login': response.login, 'email': response.email, 'company': response.company, 'location': response.location,
                'created_at':response.created_at, 'avatar_url': response.avatar_url, 'public_repos': response.public_repos, 'followers': response.followers, 'following': response.following});
        });
    }

    /**
     * Helper function that fetch user info if auth token is NOT present, fetch public information
     * @param giturl: This is the public url with user ID append at the end
     * @returns {Promise.<*>}
     */
    fetchUsers(giturl){
        // fetch('https://api.github.com/users/herbherbherb')
        fetch(giturl)
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    // userDataSource: this.state.userDataSource(response),
                    name : response.name,
                    login: response.login,
                    email: response.email,
                    company: response.company,
                    location: response.location,
                    created_at: response.created_at,
                    avatar_url: response.avatar_url,
                    public_repos: response.public_repos,
                    followers: response.followers,
                    following: response.following
                });
                savePersonalInfo({'name': response.name, 'login': response.login, 'email': response.email, 'company': response.company, 'location': response.location,
                    'created_at':response.created_at, 'avatar_url': response.avatar_url, 'public_repos': response.public_repos, 'followers': response.followers, 'following': response.following});
            });
    }

    renderRow(user, sectionId, rowId, highlightRow){
        return(
            <View style={styles.row}>
                <Text style={styles.rowText}>Name: {user.name}</Text>
                <Text style={styles.rowText}>Username: {user.login}</Text>
                <Text style={styles.rowText}>Email: {user.email}</Text>
                <Text style={styles.rowText}>Company: {user.company}</Text>
                <Text style={styles.rowText}>Location: {user.location}</Text>
                <Text style={styles.rowText}>Created Date: {user.created_at}</Text>
            </View>
        )
    }

    refresh_page(){
        getUserID().then((value) => {
            userID = value;
            getUserToken().then((value) => {
                userToken = value;
                if (userToken == ''){
                    console.log(userToken);
                    var giturl = 'https://api.github.com/users/' + userID;
                    this.fetchUsers(giturl);
                }else {
                    this.fetchUsersWithToken(userID, userToken);
                }
            });
        });
    }

    render(){
        console.log("render");
        console.log(userToken);
        console.log(userID);
        console.log("=============");
        return(
            <View style={styles.backgroundImage}>
                <NavigationEvents
                    onWillFocus={payload => this.refresh_page()}
                    onDidFocus={payload => this.refresh_page()}
                    onWillBlur={payload => this.refresh_page()}
                    onDidBlur={payload => this.refresh_page()}
                />
                <View >
                    <ImageBackground
                        style={styles.github}
                        source={{uri: 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png'}}
                    >
                        <View style={styles.reloadViewText}>
                            <TouchableHighlight onPress={this.refresh_page.bind(this)}>
                                <Text style={styles.reloadText}><OcticonIcon name="issue-reopened" size={35}/></Text>
                            </TouchableHighlight>
                        </View>
                    </ImageBackground>
                    <Image
                        style={styles.logo}
                        source={{uri: this.state.avatar_url}}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Name: {this.state.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Username: {this.state.login}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Email: {this.state.email}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Company: {this.state.company}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Location: {this.state.location}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Created Date: {this.state.created_at}</Text>
                </View>
                {/*<ListView*/}
                    {/*dataSource={this.state.userDataSource}*/}
                    {/*renderRow={this.renderRow.bind(this)}*/}
                {/*/>*/}
                <TouchableHighlight  title="Go to Repositories" onPress={() => this.props.navigation.navigate('Repo')}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Repo Page: {this.state.public_repos}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight  title="Followers Page" onPress={() => this.props.navigation.navigate('Followers')}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Followers: {this.state.followers}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight  title="Following Page" onPress={() => this.props.navigation.navigate('Following')}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Following: {this.state.following}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

/**
 * Style sheet for Profile.js
 */
const styles = StyleSheet.create({
    backgroundImage: {
        backgroundColor: '#093af4',
    },
    row: {
        flexDirection:'row',
        justifyContent:'center',
        padding: mypadding,
        backgroundColor: '#f49809',
        marginBottom:3
    },
    rowText: {
        flex:1
    },
    reloadText: {
        color: '#f41120',
    },
    reloadViewText: {
        flex: 1,
        top: 0,
        alignSelf: 'flex-end',
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        height: myimage,
        margin: 7,
        borderWidth: 2,
        borderRadius: 125,
    },
    github: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: mygithub,
        alignSelf: 'stretch',
    },

});

AppRegistry.registerComponent('Component4', () => Component4);