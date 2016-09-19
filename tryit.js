const Twitter = require('twitter');
const _ = require('lodash');
const async = require('async');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const NUMBER_OF_TWEETS_TO_GATHER = 800;
let allTweets = [];

const q = async.queue(function(task, callback) {
  const max_id = task.max_id;
  let params = { screen_name: process.env.SCREEN_NAME, count: 200 };
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
      } else {
        console.log(`Gathered at least ${NUMBER_OF_TWEETS_TO_GATHER} tweets or there are no more tweets.`);
      }
    }
    callback();
  });

}, 1);

q.drain = function() {
  const nTweets = _.take(allTweets, NUMBER_OF_TWEETS_TO_GATHER);
  console.log(`Analyzing ${nTweets.length} most recent tweets for "${process.env.SCREEN_NAME}"...`);

  let tweetSummaries = [];
  for (var tweet of nTweets) {
    tweetSummaries.push({ tweet_screen_name: tweet.user.screen_name })
  }

  const result = _(tweetSummaries)
  .groupBy('tweet_screen_name')
  .map((items, name) => ({ name, count: items.length }))
  .sortBy('count')
  .reverse()
  .take(20)
  .value();

  console.log(`\nTop 20 contributors to home feed:\n`);
  console.log(result);
};

// kick off the first API call
q.push({max_id: null});
