/**
 * @author Peter Banka <peter.banka@cyaninc.com>
 * @copyright 2015 Cyan, Inc. All rights reserved.
 */

'use strict';

require('./style/main.less');

const React = require('react');

var Main = React.createClass({
    render: function () {
        return (
            <div class="container">
                <div class="header">
                     <h2>Who to follow</h2><a href="#" class="refresh">Refresh</a>
                </div>
                <ul class="suggestions">
                    <li class="suggestion1">
                        <img />
                        <a href="#" target="_blank" class="username">dummy1</a>
                        <a href="#" class="close close1">x</a>
                    </li>
                    <li class="suggestion2">
                        <img />
                        <a href="#" target="_blank" class="username">dummy2</a>
                        <a href="#" class="close close2">x</a>
                    </li>
                    <li class="suggestion3">
                        <img />
                        <a href="#" target="_blank" class="username">dummy3</a>
                        <a href="#" class="close close3">x</a>
                    </li>
                </ul>
            </div>
        );
    },
});

module.exports = Main;
