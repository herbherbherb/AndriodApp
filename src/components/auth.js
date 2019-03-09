import base64 from 'base-64';
const CLIENT_ID = 'aa9269137ede89a711bc';
const CLIENT_SECRET = '261158c039354d48fee9a62ee64453381ae37fda';
const GITHUB_AUTH_API = 'https://api.github.com/authorizations';

/**
 * Documentation:
 * This auth.js is called when user choose the private login option and login using
 * both the username and password.
 * This function validate the password and fetch the token. If the token is valid, it
 * will be stored in the async storage and persist through ouit the rest of the application.
 * This function is called by login.js
 */

export default (username = '', password = '') => {
    /**
     * the username and password input by user is passed in from login.js
     * @type {string}
     */
    const bytes = username.trim() + ':' + password.trim();
    const encoded = base64.encode(bytes);
    return fetch(GITHUB_AUTH_API, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + encoded,
            'User-Agent': 'Awesome',
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scopes: ['user', 'repo', 'notifications'],
        }),
    }).then(response => {
        const isValid = response.status < 400;
        return response.json().then(json => {
            /**
             * If the response json is invalid, return a hard-coded token call "bad"
             */
            if (isValid) {
                return json.token;
            } else {
                return 'bad';

            }
        });
    });
};

