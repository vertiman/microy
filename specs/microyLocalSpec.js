/**
 * Created by mwertman on 15-09-07.
 */
'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('when doing a simple match', function () {
    context('when there is a generator registered', function () {
        var testPattern = {'match': 1};
        var testGen = function *(message) {
            return 'hello';
        };

        var microy = require('..')();
        microy.add(testPattern, testGen);

        it('should resolve the generator', function (done) {
            microy.run(testPattern).then(function (result) {
                expect(result).to.be.equal('hello');
            }).then(done, done);
        })
    })
});