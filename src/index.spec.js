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
          id: '111',
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

  it('gathers tweets from multiple api calls', function (done) {
    const creds = {};
    const screenName = 'testname';
    const numberOfTweets = 10;

    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200')
      .reply(200, [
        {
          id: '111',
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

    // 2nd call with max_id returns last record from previous call as first one in next
    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200&max_id=555')
      .reply(200, [
        {
          id: '555',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '666',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '777',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '888',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: '999',
          user: {
            screen_name: 'screen_name_one'
          }
        },
        {
          id: 'AAA',
          user: {
            screen_name: 'screen_name_one'
          }
        }
      ]);


    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200&max_id=AAA')
      .reply(200, []);

    feedTamer.homeFeedContributors(creds, screenName, numberOfTweets,
      (err, nTweetsLength, result) => {
        assert(nTweetsLength === 10);
        assert.deepEqual(result, [{ name: 'screen_name_one', count: 10 }]);
        done();
      }
    );
  });

  it('tallies and sorts the contributors correctly', function (done) {
    const creds = {};
    const screenName = 'testname';
    const numberOfTweets = 10;

    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200')
      .reply(200, [
        {
          id: '111',
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
            screen_name: 'screen_name_two'
          }
        },
        {
          id: '555',
          user: {
            screen_name: 'screen_name_two'
          }
        }
      ]);

    // 2nd call with max_id returns last record from previous call as first one in next
    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200&max_id=555')
      .reply(200, [
        {
          id: '555',
          user: {
            screen_name: 'screen_name_two'
          }
        },
        {
          id: '666',
          user: {
            screen_name: 'screen_name_two'
          }
        },
        {
          id: '777',
          user: {
            screen_name: 'screen_name_three'
          }
        },
        {
          id: '888',
          user: {
            screen_name: 'screen_name_three'
          }
        },
        {
          id: '999',
          user: {
            screen_name: 'screen_name_three'
          }
        },
        {
          id: 'AAA',
          user: {
            screen_name: 'screen_name_three'
          }
        }
      ]);


    nock('https://api.twitter.com')
      .get('/1.1/statuses/home_timeline.json?screen_name=testname&count=200&max_id=AAA')
      .reply(200, []);

    feedTamer.homeFeedContributors(creds, screenName, numberOfTweets,
      (err, nTweetsLength, result) => {
        assert(nTweetsLength === 10);
        assert.deepEqual(result,
          [
            {
              count: 4,
              name: 'screen_name_three'
            },
            {
              count: 3,
              name: 'screen_name_two'
            },
            {
              count: 3,
              name: 'screen_name_one'
            }
          ]);
        done();
      }
    );
  });
});
