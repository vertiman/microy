/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const microy = require('..');
const httpTransport = require('../lib/httpTransport');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sc = require('sinon-chai');
chai.use(sc);

describe('when doing a simple remote match', function () {

    var testPattern = {'match': 1};
    var testGen = function *(message) {
        return 'hello';
    };

    var microyClient = microy(),
        microyServer = microy();

    before(function () {
        microyServer.listen(httpTransport, {port: 10900});
        microyServer.add(testPattern, testGen);
        microyClient.client(httpTransport, {port: 10900});
    });

    it('should access the remote server', function (done) {
        microyClient.run(testPattern).then(function (result) {
            expect(result).to.be.equal('hello');
            done();
        });
    })
});