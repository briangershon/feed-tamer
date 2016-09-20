/* eslint-disable prefer-arrow-callback, func-names, import/no-extraneous-dependencies */
// why disable prefer-arrow-callback and func-names? Mocha does not recommend arrow callbacks.

const nock = require('nock');
const assert = require('power-assert');
const feedTamer = require('../dist/index');

describe('homeFeedContributors()', function () {
  it('gathers tweets from one api call', function (done) {
    const creds = {};
    const screenName = 'testname';
    const numberOfTweets = 5;

    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200')
      .reply(200, [
        {
          id: '11',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '222',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '333',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '444',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '555',
          user: {
            screen_name: 'screen_name_one'
          }
        }
      ]);

    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200&max_id=555')
      .reply(200, []);

    feedTamer.homeFeedContributors(creds, screenName, numberOfTweets,
      (err, nTweetsLength, result) => {
        assert(nTweetsLength === 5);
        assert.deepEqual(result, [{ name: 'screen_name_one', count: 5 }]);
        done();
      }
    );
  });
});
