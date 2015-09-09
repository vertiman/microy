/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const app = require('koa')();
const kb = require('koa-body');
const axios = require('axios');
const errio = require('errio');

var httpTransport = function (microy) {
    this.microy = microy;
};

httpTransport.prototype.server = function (config) {
    var microy = this.microy;

    app.use(kb());

    app.use(function *(next) {
        try {
            this.assert(this.request.method == 'POST', 404);
            var result = yield microy.run(this.request.body, true);
            this.body = encapsulateForClient(null, result);
        } catch(err) {
            this.body = encapsulateForClient(err);
        }
        yield next;
    });

    app.listen(config.port || 10900);
    console.log('microy listening on ', config.port || 10900);
};

function encapsulateForClient(err, data) {
    return {
        error : err ? true : false,
        data : err ? errio.stringify(err, {stack:true}) : JSON.stringify(data)
    };
}

httpTransport.prototype.client = function (config) {
    var host = config.host || 'localhost';
    var port = config.port || 10900;
    var url = 'http://' + host + ':' + port;

    return function *(message) {
        return axios.post(url, message).then(function (response) {
            if(response.data.error) {
                throw errio.parse(response.data.data, {stack:true});
            }
            return JSON.parse(response.data.data);
        });
    };
};

module.exports = httpTransport;