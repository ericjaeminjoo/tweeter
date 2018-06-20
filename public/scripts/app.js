/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
function createTweetElement(tweetData) {
  return tweetElement =
    `<div class="tweet border rounded">
    <header class="rounded-top">
      <div class="d-flex justify-content-between">
        <div class="align-self-center">
          <img src="${tweetData.user.avatars.small}" class="img-fluid" alt="Tweeter logo"> 
          ${tweetData.user.name}
        </div>
        <div class="align-self-center">
          ${tweetData.user.handle}
        </div>
      </div>
    </header>

    <p id="tweet_text">${tweetData.content.text}</p>
    <hr>

    <footer>
      <div class="row justify-content-between">
        <div class="col-3">
          <p>10 days ago</p>
        </div>
        <div class="col-3 icons">
          <i class="fal fa-flag"></i>
          <i class="far fa-retweet-alt"></i>
          <i class="fal fa-heart"></i>
        </div>
      </div>
    </footer>
  </div>`;
}

function renderTweets(tweets, newTweet) {
  if (newTweet) {
    $('.tweets').prepend(createTweetElement(tweets[tweets.length - 1]));
  } else if (!newTweet) {
    tweets.forEach(tweet => {
      $('.tweets').prepend(createTweetElement(tweet));
    });
  }
}

$(document).ready(function () {
  function loadTweets(newTweet) {
    $.ajax({
        url: '/tweets',
        method: 'GET'
      })
      .done((tweets) => {
        renderTweets(tweets, newTweet);
        console.log("Rendering tweets");
      })
      .fail((error) => {
        console.log("Error!");
      })
      .always(() => {
        console.log("Function complete.");
      });
  };

  function sendTweet(tweet) {
    $.ajax({
        url: '/tweets',
        method: 'POST',
        data: tweet
      })
      .done(() => {
        loadTweets(newTweet = true);
        console.log("Loading tweets");
      })
      .fail((error) => {
        console.log("Error!");
      })
      .always(() => {
        console.log("Function complete.");
      });
  };

  $("#new_tweet").keyup(function () {
    let tweetLength = $(this).val().length;
    let characterNumber = $('#character-count').text();

    if (tweetLength > 140) {
      $('#character-count').css('color', 'red');
    } else {
      $('#character-count').css('color', 'black');
    }

    $('#character-count').text(140 - tweetLength);
  });

  $(".new_tweet_container form").submit(function (event) {
    if ($("#new_tweet").val().length === 0) {
      alert("You cannot tweet an empty message!");
    } else if ($("#new_tweet").val().length > 140) {
      alert("You cannot tweet a message that has more than 140 character!");
    } else {
      sendTweet($(this).serialize());
    }
    event.preventDefault();
  });

  loadTweets(newTweet = false);
});