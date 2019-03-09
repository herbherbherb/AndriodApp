/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import OcticonIcon from 'react-native-vector-icons/dist/Octicons';
import {YellowBox} from 'react-native';
 YellowBox.ignoreWarnings(["Warning:"]);
import {
    createStackNavigator,
} from 'react-navigation';

import {
    createBottomTabNavigator,
} from 'react-navigation';

/**
 * Documentation:
 * This App.js is the controller, which control the navigation logic
 * It has 2 types of navigations, including AppStack navigator and BottomTab navigator
 */

import Component6 from './src/components/Component6';
import Component4 from './src/components/Component4';
import Followers from './src/components/Followers';
import Following from './src/components/Following';
import Login from './src/components/Login';

/**
 * Stack navigation that control navigation of profile, repo, following and follower page
 * It is called when say in follower page and a tab cell is selected to navigate back to profile page
 */

const AppStackNavigator = createStackNavigator({
    Prof: Component4, //Profile Page
    Repo: Component6, //Repo Page
    Login: Login,
    Followers: Followers,
    Following: Following,
})

export class App extends Component {
    render(){
        return(
            <AppStackNavigator />
        );
    }
}

/**
 * Bottom navigation, which has 2 options: Login Page && Profile Page
 */
export default createBottomTabNavigator({
    Login: {screen: Login,
        navigationOptions:{
            tabBarLabel: 'Login',
            tabBarIcon:(tintColor) => (<OcticonIcon name="sign-in" size={20} color={tintColor} />)
        }
    },
    App: {screen: App,
        navigationOptions:{
            tabBarLabel: 'App',
            tabBarIcon:(tintColor) => (<OcticonIcon name="mark-github" size={20} color={tintColor} />)
        }},
}, {initialRouteName: 'Login',
    navigationOptions:{tabBarVisible: true},
    tabBarOptions: {
    activeTintColor: 'red', inactiveTintColor: 'grey'
}});
