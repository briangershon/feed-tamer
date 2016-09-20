/* eslint-disable no-console */

const Twitter = require('twitter');
const _ = require('lodash');
const async = require('async');

const API_BATCH_MAX = 200;

export default {
  homeFeedContributors: (creds, screenName, numberOfTweets, finalCallback) => {
    const client = new Twitter(creds);

    const NUMBER_OF_TWEETS_TO_GATHER = numberOfTweets;
    const allTweets = [];

    const q = async.queue((task, callback) => {
      const maxId = task.max_id;
      const params = { screen_name: screenName, count: API_BATCH_MAX };
      if (maxId) {
        params.max_id = maxId;
      }

      client.get('statuses/home_timeline', params, (err, tweets) => {
        if (err) {
          console.log('Twitter statuses/home_timeline API error', err);
        } else if (tweets.length) {
          for (const tweet of tweets) {
            allTweets.push(tweet);
          }
          const lastMaxId = _.last(tweets).id;

          if (lastMaxId && allTweets.length <= NUMBER_OF_TWEETS_TO_GATHER) {
            q.push({ max_id: lastMaxId });
          }
        }
        callback();
      });
    }, 1);

    q.drain = () => {
      const nTweets = _.take(allTweets, NUMBER_OF_TWEETS_TO_GATHER);

      const tweetSummaries = [];
      for (const tweet of nTweets) {
        tweetSummaries.push({ tweet_screen_name: tweet.user.screen_name });
      }

      const result = _(tweetSummaries)
      .groupBy('tweet_screen_name')
      .map((items, name) => ({ name, count: items.length }))
      .sortBy('count')
      .reverse()
      .value();

      finalCallback(null, nTweets.length, result);
    };

    q.push({ max_id: null }); // kick off the first API call
  }
};
