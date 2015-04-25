/**
 * @author Peter Banka <peter.banka@cyaninc.com>
 * @copyright 2015 Cyan, Inc. All rights reserved.
 */

'use strict';

require('./style/main.less');

const Q = require('q-xhr');

const React = require('react');
const Rx = require('rx');
const FuncSubject = require('rx-react/lib/funcSubject');

const ReactBootstrap = require('react-bootstrap');

// ReactBootstrap widgets
const ButtonToolbar = ReactBootstrap.ButtonToolbar;
const Button = ReactBootstrap.Button;

/**
 * @typedef GithubUser
 * @property {String} avatar_url - "https://avatars.githubusercontent.com/u/1?v=3"
 * @property {String} events_url - "https://api.github.com/users/mojombo/events{/privacy}"
 * @property {String} followers_url - "https://api.github.com/users/mojombo/followers"
 * @property {String} following_url - "https://api.github.com/users/mojombo/following{/other_user}"
 * @property {String} gists_url - "https://api.github.com/users/mojombo/gists{/gist_id}"
 * @property {String} gravatar_id - ""
 * @property {String} html_url - "https://github.com/mojombo"
 * @property {Number} id - 1
 * @property {String} login - "mojombo"
 * @property {String} organizations_url - "https://api.github.com/users/mojombo/orgs"
 * @property {String} received_events_url - "https://api.github.com/users/mojombo/received_events"
 * @property {String} repos_url - "https://api.github.com/users/mojombo/repos"
 * @property {Boolean} site_admin - false
 * @property {String} starred_url - "https://api.github.com/users/mojombo/starred{/owner}{/repo}"
 * @property {String} subscriptions_url - "https://api.github.com/users/mojombo/subscriptions"
 * @property {String} type - "User"
 * @property {String} url - "https://api.github.com/users/mojombo"
 */

var Main = React.createClass({

    /**
     * @param {GithubUser[]} response - list of 100 users
     */
    doSomethingWithResponse: function (response) {
        console.log(response);
    },

    componentWillMount: function () {
        this.buttonClickedStream = FuncSubject.create();
    },

    componentDidMount: function () {
        let requestStream = Rx.Observable.just('https://api.github.com/users');
        let responseStream = requestStream.flatMap(requestUrl => {
            let promise = Q.xhr.get(requestUrl);
            return Rx.Observable.fromPromise(promise);
        });
        responseStream.subscribe(response => {
            this.doSomethingWithResponse(response);
        });
        this.buttonClickedStream.subscribe(function (event) {
            console.log('button clicked', event);
        });
    },

    render: function () {
        return (
            <div className="container">
                <div className="header">
                     <h2>Who to follow</h2>
                     <ButtonToolbar onClick={this.refresh}>
                         <Button onClick={this.buttonClickedStream}>Refresh</Button>
                     </ButtonToolbar>
                </div>
                <ul className="suggestions">
                    <li className="suggestion1">
                        <img />
                        <a href="#" target="_blank" className="username">dummy1</a>
                        <a href="#" className="close close1">x</a>
                    </li>
                    <li className="suggestion2">
                        <img />
                        <a href="#" target="_blank" className="username">dummy2</a>
                        <a href="#" className="close close2">x</a>
                    </li>
                    <li className="suggestion3">
                        <img />
                        <a href="#" target="_blank" className="username">dummy3</a>
                        <a href="#" className="close close3">x</a>
                    </li>
                </ul>
            </div>
        );
    },
});

module.exports = Main;
