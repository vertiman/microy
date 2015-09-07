/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const patrun = require('patrun');
const _ = require('lodash');
const co = require('co');

module.exports = function () {
    let microy = {};
    let matcher = patrun();

    microy.add = function (pattern, generator) {
        matcher.add(pattern, generator);
    };

    microy.run = function (pattern, args) {
        let message = _.extend({}, args, pattern);
        var generator = matcher.find(message);

        if (generator) {
            return co(generator);
        }

        else {
            //look for remote stuff..
            console.log('should call some remote transport');
        }
    };

    return microy;
};