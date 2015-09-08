/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const app = require('koa')();
const kb = require('koa-body');
const axios = require('axios');

var httpTransport = function (microy) {
    this.microy = microy;
};

httpTransport.prototype.server = function (config) {
    var xx = this.microy;

    app.use(kb());

    app.use(function *(next) {
        this.assert(this.request.method == 'POST', 404);
        var result = yield xx.run(this.request.body, true);
        this.body = JSON.stringify(result);
        this.statusCode = 200;
        yield next;
    });

    app.listen(config.port || 10900);
    console.log('microy listening on ', config.port || 10900);
};

httpTransport.prototype.client = function (config) {
    var host = config.host || 'localhost';
    var port = config.port || 10900;
    var url = 'http://' + host + ':' + port;

    return function (message) {
        return axios.post(url, message).then(function (response) {
            return response.data;
        });
    };
};

module.exports = httpTransport;