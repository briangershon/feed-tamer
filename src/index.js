const Twitter = require('twitter');
const _ = require('lodash');
const async = require('async');

const API_BATCH_MAX = 200;

export default {
  homeFeedContributors: (creds, screenName, numberOfTweets, finalCallback) => {
    const client = new Twitter(creds);

    const NUMBER_OF_TWEETS_TO_GATHER = numberOfTweets;
    let allTweets = [];

    const q = async.queue(function(task, callback) {
      const max_id = task.max_id;
      let params = { screen_name: screenName, count: API_BATCH_MAX };
      if (max_id) {
        params.max_id = max_id;
      }

      client.get('statuses/home_timeline', params, function (err, tweets, response) {
        if (err) {
          console.log('Twitter statuses/home_timeline API error', err);
        } else {
          for (const tweet of tweets) {
            allTweets.push(tweet)
          }
          const last_max_id = _.last(tweets).id;

          if (last_max_id && allTweets.length <= NUMBER_OF_TWEETS_TO_GATHER) {
            q.push({max_id: last_max_id});
          }
        }
        callback();
      });

    }, 1);

    q.drain = function() {
      const nTweets = _.take(allTweets, NUMBER_OF_TWEETS_TO_GATHER);

      let tweetSummaries = [];
      for (var tweet of nTweets) {
        tweetSummaries.push({ tweet_screen_name: tweet.user.screen_name })
      }

      const result = _(tweetSummaries)
      .groupBy('tweet_screen_name')
      .map((items, name) => ({ name, count: items.length }))
      .sortBy('count')
      .reverse()
      .value();

      finalCallback(null, nTweets.length, result);
    };

    q.push({max_id: null}); // kick off the first API call
  }
};
