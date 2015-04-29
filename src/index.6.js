/**
 * @author Peter Banka <peter.banka@cyaninc.com>
 * @copyright 2015 Cyan, Inc. All rights reserved.
 */

'use strict';

require('./style/main.less');

const _ = require('lodash');
const Q = require('q-xhr');

const React = require('react');
const Rx = require('rx');
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

const mockGet = function () {
    let deferred = Q.defer();
    deferred.resolve({data: [
        {
            login: 'mojombo',
            'avatar_url': 'https://avatars.githubusercontent.com/u/1?v=3',
            url: 'https://api.github.com/users/mojombo',
        },
        {
            login: 'mojombo',
            'avatar_url': 'https://avatars.githubusercontent.com/u/1?v=3',
            url: 'https://api.github.com/users/mojombo',
        },
        {
            login: 'mojombo',
            'avatar_url': 'https://avatars.githubusercontent.com/u/1?v=3',
            url: 'https://api.github.com/users/mojombo',
        },
    ],
    }
    );
    return deferred.promise;
};

const Suggestion = React.createClass({
    refresh: function () {
        this.props.refresh(this.props.id);
    },

    render: function () {
        return (
            <li>
                <img src={this.props.user.avatar_url}/>
                <a
                    href={this.props.user.url}
                    className="username">
                    {this.props.user.login}
                </a>
                <Button onClick={this.refresh} className="close">&times;</Button>
            </li>
        );
    },
});

const Users = React.createClass({
    render: function () {
        let suggestions = [];
        for (var i = 0, len = this.props.size; i < len; i++) {
            suggestions.push(
                    <Suggestion
                        refresh={this.props.refresh}
                        user={this.props.users[i]}
                        id={i}
                        key={i}
                    />
            );
        }
        return (
            <ul className="suggestions">
                {suggestions}
            </ul>
        );
    },
});

const Main = React.createClass({
    getInitialState: function () {
        return {
            users: [
                {login: '', 'avatar_url': ''},
                {login: '', 'avatar_url': ''},
                {login: '', 'avatar_url': ''},
            ],
        };
    },

    refresh: function (key) {
        this.buttonClickedStream.onNext(key);
    },

    componentWillMount: function () {
        this.buttonClickedStream = (value) => {
            this.buttonClickedStream.onNext(value);
        };
        for (var key in Rx.Subject.prototype) {
            this.buttonClickedStream[key] = Rx.Subject.prototype[key];
        }
        Rx.Subject.call(this.buttonClickedStream);
    },

    componentDidMount: function () {
        let requestStream = this.buttonClickedStream
            .startWith('init')
            .map((index) => {
                let randomOffset = Math.floor(Math.random() * 500);
                return {index, requestUrl: 'https://api.github.com/users?since=' + randomOffset};
            });

        let responseStream = requestStream.flatMap(requestData => {
            // let promise = mockGet(requestData.requestUrl);
            let promise = Q.xhr.get(requestData.requestUrl);
            let index = requestData.index;
            return Rx.Observable.create(function (observer) {
                promise
                    .then(
                        response => observer.onNext({data: response.data, index}),
                        response => observer.onError({response, index}))
                    .fin(() => observer.onCompleted())
                    .done();
            });
        });

        responseStream.subscribe(responseData => {
            if (_.isNumber(responseData.index)) {
                this.state.users[responseData.index] = responseData.data[0];
            } else {
                this.state.users = responseData.data;
            }
            this.setState({users: this.state.users});
        });
    },

    render: function () {
        return (
            <div className="container">
                <div className="header">
                     <h2>Who to follow</h2>
                     <ButtonToolbar>
                         <Button onClick={this.buttonClickedStream}>Refresh</Button>
                     </ButtonToolbar>
                     <Users refresh={this.refresh} size={3} users={this.state.users}/>
                </div>
            </div>
        );
    },
});

module.exports = Main;
