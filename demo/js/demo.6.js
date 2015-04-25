/**
 * @author Peter Banka <peter.banka@cyaninc.com>
 * @copyright 2015 Cyan, Inc. All rights reserved.
*/

'use strict';

// Need to set jQuery on window for Bootstrap
let $ = window.jQuery = require('jquery');

require('../style/demo.less');
require('bootstrap');
const React = require('react');

const Main = require('rxjs-tutorial');

$(() => {
    React.render(<Main />, document.body);
});
