/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sc = require('sinon-chai');
chai.use(sc);

describe('when doing a simple match', function () {

    var microy;

    var testPattern = {'match': 1};
    var testGen = function *(message) {
        return 'hello';
    };

    beforeEach(function () {
        microy = require('..')();
        microy.add(testPattern, testGen);
    });

    context('when there is a generator registered', function () {
        it('should resolve the generator', function (done) {
            microy.run(testPattern).then(function (result) {
                expect(result).to.be.equal('hello');
            }).then(done, done);
        })
    })
});

describe('when using a plugin', function () {
    let microy;

    beforeEach(function () {
        microy = require('..')();
    });

    it('should call the registration method', function () {
        var spy = sinon.spy();
        microy.register(spy);
        expect(spy).to.have.been.calledOnce;
    });

    it('should call the registration method with an instance of microy', function () {
        var spy = sinon.spy();
        microy.register(spy);
        expect(spy).to.have.been.calledWith(microy);
    })
});