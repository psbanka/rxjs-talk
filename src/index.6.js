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

const Suggestion = React.createClass({
    render: function () {
        return (
            <li>
                <img src={this.props.user.avatar_url}/>
                <a href="#" target="_blank" className="username">{this.props.user.login}</a>
                <a href="#" className="close">x</a>
            </li>
        );
    },
});

const Users = React.createClass({
    render: function () {
        return (
            <ul className="suggestions">
                <Suggestion user={this.props.users[0]}/>
                <Suggestion user={this.props.users[1]}/>
                <Suggestion user={this.props.users[2]}/>
            </ul>
        );
    },
});

const Main = React.createClass({
    getInitialState: function () {
        return {
            users: [
                {login: '', avatar_url: ''},
                {login: '', avatar_url: ''},
                {login: '', avatar_url: ''},
            ],
        };
    },

    /**
     * @param {GithubUser[]} response - list of 100 users
     */
    doSomethingWithResponse: function (response) {
        this.setState({users: response.data});
    },

    componentWillMount: function () {
        this.buttonClickedStream = FuncSubject.create();
    },

    componentDidMount: function () {
        let requestStream = this.buttonClickedStream
            .startWith('init')
            .map(() => {
                let randomOffset = Math.floor(Math.random() * 500);
                return 'https://api.github.com/users?since=' + randomOffset;
            });

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
                     <Users users={this.state.users}/>
                </div>
            </div>
        );
    },
});

module.exports = Main;
