'use strict';

var feedTamer = require('./index');

var creds = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

var screenName = process.env.SCREEN_NAME;
var NUMBER_OF_TWEETS_TO_GATHER = 800;

feedTamer.homeFeedContributors(creds, screenName, NUMBER_OF_TWEETS_TO_GATHER, function (err, finalTweetCount, contributors) {
  if (err) {
    console.log('homeFeedContributors error', err);
  } else {
    console.log('Analyzing ' + finalTweetCount + ' most recent tweets for "' + screenName + '"...');
    console.log('Contributors to home feed:');
    console.log(contributors);
  }
});