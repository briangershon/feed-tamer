const Twitter = require('twitter');
const _ = require('lodash');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const params = { screen_name: process.env.SCREEN_NAME, count: 200 };
client.get('statuses/home_timeline', params, function (error, tweets, response) {
  if (!error) {
    // console.log(tweets);
    let tweetSummaries = [];
    for (var tweet of tweets) {
      tweetSummaries.push({ tweet_screen_name: tweet.user.screen_name })
      // console.log("tweet.user id and screen_name", tweet.created_at, tweet.text, tweet.user.id, tweet.user.screen_name, tweet.user.statuses_count);
    }

    console.log(`Analyzing ${tweets.length} most recent tweets for "${process.env.SCREEN_NAME}"...`);

    const result = _(tweetSummaries)
    .groupBy('tweet_screen_name')
    .map((items, name) => ({ name, count: items.length }))
    .sortBy('count')
    .reverse()
    .take(20)
    .value();

    console.log(`\nTop 20 contributors to home feed:\n`);
    console.log(result);
  }
});
