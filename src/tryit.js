/* eslint-disable no-console */

const feedTamer = require('./index');

const creds = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const screenName = process.env.SCREEN_NAME;
const NUMBER_OF_TWEETS_TO_GATHER = 800;   // 4 API calls. Twitter limit is 15 calls in 15 minutes.

feedTamer.homeFeedContributors(creds, screenName, NUMBER_OF_TWEETS_TO_GATHER,
  (err, finalTweetCount, contributors) => {
    if (err) {
      console.log('homeFeedContributors error', err);
    } else {
      console.log(`Analyzing ${finalTweetCount} most recent tweets for "${screenName}"...`);
      console.log('Contributors to home feed:');
      console.log(contributors);
    }
  }
);
