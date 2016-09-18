feed-tamer
==========

Find list of users who contribute the most traffic to your Twitter home timeline.

## Details

Do you like browsing your Twitter feed but find some tweets are being drowned out by verbose users?

This app returns a list of users who contribute the most traffic to your Twitter home timeline.

If those users are no longer interesting to you, try moving them to a Twitter list or unfollow.

## How to run locally

    clone https://github.com/briangershon/feed-tamer.git

Create a Twitter app to obtain the various keys below.

Set `SCREEN_NAME` to your Twitter handle.

```
export TWITTER_CONSUMER_KEY=""
export TWITTER_CONSUMER_SECRET=""
export TWITTER_ACCESS_TOKEN_KEY=""
export TWITTER_ACCESS_TOKEN_SECRET=""

export SCREEN_NAME="my_twitter_name"
```
    npm start

Results:

```
Analyzing 194 most recent tweets for "my_twitter_name"...

Top 20 contributors to home feed:

[
  { name: 'user_one', count: 22 },
  { name: 'user_two', count: 9 },
  { name: 'user_three', count: 3 }
]
```
