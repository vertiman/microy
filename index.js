/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const patrun = require('patrun');
const _ = require('lodash');
const co = require('co');
const httpTransport = require('./lib/httpTransport');

var microy = function () {
    this.matcher = patrun();
};

microy.prototype.add = function (pattern, generator) {
    this.matcher.add(pattern, generator);
};

microy.prototype.run = function (pattern, remote) {
    let message = _.extend({}, pattern);
    var generator = this.matcher.find(message);

    if (generator) {
        return co(generator);
    }

    else if (!remote && this.client) {
        return this.client(message);
    }
};

microy.prototype.register = function (plugin) {
    if (!_.isFunction(plugin))
        throw new Error('plugin expected');
    plugin(this);
};

microy.prototype.listen = function (transport, options) {
    new transport(this).server(options);
};

microy.prototype.client = function (transport, options) {
    this.client = new transport(this).client(options);
};

module.exports = function () {
    return new microy();
};