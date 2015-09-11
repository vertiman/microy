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
        var rtn = co(generator, message);
        return rtn;
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

microy.prototype.client = function (pattern, transport, options) {
    var transportType = getTransport(transport);
    let client = new transportType(this).client(options);
    this.add(pattern, client);
};

function getTransport(transport) {
    var instance = loadTransportType(transport);
    if(!instance.prototype.client || !instance.prototype.server)
        throw new Error('transports need a client and server method');
    return instance;
}

function loadTransportType(transport) {
    if(_.isString(transport)) {
        if(transport === 'http')
            return require('./lib/httpTransport');
        var t = require(transport);
        if(!t)
            throw new Error('transport ' + transport + 'not found');
        return t;
    }
    return transport;
}

module.exports = function () {
    Promise = require('bluebird');
    return new microy();
};