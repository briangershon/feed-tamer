feed-tamer
==========

Find list of users who contribute the most traffic to your Twitter home timeline.

## Details

Do you like browsing your Twitter feed but find some tweets are being drowned out by prolific users?

This app returns a list of users who contribute the most traffic to your Twitter home timeline.

If those users are no longer interesting to you, try moving them to a Twitter list or unfollow.

## Usage

    npm install feed-tamer --save

## Sample application using feed-tamer

The following sample app returns:

```
Analyzing 800 most recent tweets for "my_twitter_name"...
Contributors to home feed:
[ { name: 'user_abc', count: 74 },
  { name: 'user_123', count: 28 },
  ...
  ...
]
```

To run app:

    clone https://github.com/briangershon/feed-tamer.git
    cd feed-tamer

```
export TWITTER_CONSUMER_KEY=""
export TWITTER_CONSUMER_SECRET=""
export TWITTER_ACCESS_TOKEN_KEY=""
export TWITTER_ACCESS_TOKEN_SECRET=""

export SCREEN_NAME="my_twitter_name"
```

```
npm start
```

which runs the following code:

```
const feedTamer = require('feed-tamer');

const creds = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const screenName = process.env.SCREEN_NAME;
const NUMBER_OF_TWEETS_TO_GATHER = 800;   // 4 API calls. Twitter limit is 15 calls in 15 minutes.

feedTamer.homeFeedContributors(creds, screenName, NUMBER_OF_TWEETS_TO_GATHER, (err, finalTweetCount, contributors) => {
  if (err) {
    console.log('homeFeedContributors error', err);
  } else {
    console.log(`Analyzing ${finalTweetCount} most recent tweets for "${screenName}"...`);
    console.log(`Contributors to home feed:`);
    console.log(contributors);
  }
});
```
