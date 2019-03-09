import React, {Component} from 'react';
import {AppRegistry, Text, View, TouchableOpacity, AsyncStorage, ListView, StyleSheet, TouchableHighlight} from 'react-native';
import OcticonIcon from 'react-native-vector-icons/dist/Octicons';
import Hyperlink from 'react-native-hyperlink';
// import Button from 'apsl-react-native-button';

/**
 * Documentation:
 * This is the repository page, it is naviagted from the profile page
 * Once the page is render, it will get user ID from async storage
 * and fetch the data from Github again and reset the prop state.
 */

var userID= '';
var userToken= '';

/**
 * Function to save user's Github repository information to asyncStorage for future usage
 * @param RepoInfo: repository info
 * @returns {Promise.<void>}
 */
const saveRepoInfo = async (RepoInfo) => {
    try {
        await AsyncStorage.removeItem('RepoInfo');
        await AsyncStorage.setItem('RepoInfo', RepoInfo);
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};

/**
 * Repo class that render repository page and set prop states
 */
 export default class Component6 extends Component{
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
                     var giturl = 'https://api.github.com/users/' + userID + '/repos';
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
         let url = 'https://api.github.com/user/repos';
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
             saveRepoInfo({response});
         });
     }

    /**
     * Helper function that fetch user info if auth token is NOT present, fetch public information
     * @param giturl: This is the public url with user ID append at the end
     * @returns {Promise.<*>}
     */
     fetchUsers(giturl){
         fetch(giturl)
             .then((response) => response.json())
             .then((response) => {
                 this.setState({
                     userDataSource: this.state.userDataSource.cloneWithRows(response)
                 });
                 saveRepoInfo({response});
             });
     }

    /**
     * Helper function send PUT request to Github API to star a repo that user like
     * @param owner: User ID/Github username
     * @param repo: The Github repo name of the cell that user click on
     * @returns {Promise.<*>}
     */
     star(owner, repo){
         // PUT /user/starred/:owner/:repo
         let url = 'https://api.github.com/user/starred/' + owner  + '/' + repo;
         console.log('PUT:');
         fetch(url, {
             method: 'PUT',
             headers: new Headers({
                 'Authorization': 'Basic '+btoa(userID+':'+userToken),
                 'Content-Type': 'application/x-www-form-urlencoded'
             })
         });
     }

    /**
     * Helper function send DELETE request to Github API to un-star a repo that user dislike
     * @param owner: User ID/Github username
     * @param repo: The Github repo name of the cell that user click on
     * @returns {Promise.<*>}
     */
     unstar(owner, repo){
         // DELETE /user/starred/:owner/:repo
         let url = 'https://api.github.com/user/starred/' + owner  + '/' + repo;
         console.log('DELETE:');
         fetch(url, {
             method: 'DELETE',
             headers: new Headers({
                 'Authorization': 'Basic '+btoa(userID+':'+userToken),
                 'Content-Type': 'application/x-www-form-urlencoded'
             })
         });
     }

     renderRow(user, sectionId, rowId, highlightRow){
         return(
             <View style={styles.row}>
                 <Hyperlink linkDefault={ true }>
                     <Text style={styles.rowText}><OcticonIcon name="octoface" size={20} /> User: {user.owner.login}{"\n"}</Text>
                     <Text style={styles.rowText}><OcticonIcon name="project" size={20} /> Name: : {user.name}{"\n"}</Text>
                     <Text style={styles.rowText}>{user.description}</Text>
                     <Text style={styles.urlText}><OcticonIcon name="arrow-right" size={30} /> {user.html_url}</Text>
                     <View>
                         <TouchableOpacity onPress={() => this.star(user.owner.login, user.name)}
                                           style={styles.star}>
                             <Text >  <OcticonIcon name="star" size={20} /> Star </Text>
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => this.unstar(user.owner.login, user.name)}
                                           style={styles.unstar}>
                             <Text >  <OcticonIcon name="x" size={22} /> UnStar</Text>
                         </TouchableOpacity>
                     </View>
                 </Hyperlink>
             </View>
         )
     }

     render(){
         return(
             <View>
                 <Text style={styles.titleText}>Repositorie Page</Text>
                 <ListView
                     dataSource={this.state.userDataSource}
                     renderRow={this.renderRow.bind(this)}
                 />
             </View>
         );
     }
 }

/**
 * Style sheet for Repo.js
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
     button: {
         flex:1,
         borderColor: 'grey',
         backgroundColor: 'grey',
         height:35,
         width:35,
     },
     buttonPress: {
         flex:1,
         borderColor: 'yellow',
         backgroundColor: 'yellow',
         width:45,
         height:45
     },
     star: {
         backgroundColor: '#22f41e',
         width:75,
         borderRadius: 100,
     },
     unstar: {
         backgroundColor: '#f41120',
         width:75,
         borderRadius: 100,
     },
 });


AppRegistry.registerComponent('Component6', () => Component6);