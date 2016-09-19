'use strict';

var Twitter = require('twitter');
var _ = require('lodash');
var async = require('async');

var API_BATCH_MAX = 200;

module.exports.homeFeedContributors = function (creds, screenName, numberOfTweets, finalCallback) {
  var client = new Twitter(creds);

  var NUMBER_OF_TWEETS_TO_GATHER = numberOfTweets;
  var allTweets = [];

  var q = async.queue(function (task, callback) {
    var max_id = task.max_id;
    var params = { screen_name: screenName, count: API_BATCH_MAX };
    if (max_id) {
      params.max_id = max_id;
    }

    client.get('statuses/home_timeline', params, function (err, tweets, response) {
      if (err) {
        console.log('Twitter statuses/home_timeline API error', err);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = tweets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tweet = _step.value;

            allTweets.push(tweet);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var last_max_id = _.last(tweets).id;

        if (last_max_id && allTweets.length <= NUMBER_OF_TWEETS_TO_GATHER) {
          q.push({ max_id: last_max_id });
        }
      }
      callback();
    });
  }, 1);

  q.drain = function () {
    var nTweets = _.take(allTweets, NUMBER_OF_TWEETS_TO_GATHER);

    var tweetSummaries = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = nTweets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var tweet = _step2.value;

        tweetSummaries.push({ tweet_screen_name: tweet.user.screen_name });
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var result = _(tweetSummaries).groupBy('tweet_screen_name').map(function (items, name) {
      return { name: name, count: items.length };
    }).sortBy('count').reverse().value();

    finalCallback(null, nTweets.length, result);
  };

  q.push({ max_id: null }); // kick off the first API call
};