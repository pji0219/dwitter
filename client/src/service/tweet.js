export default class TweetService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getTweets(username) {}

  async postTweet(text) {
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      body: JSON.stringify({ text, username: 'ellie', name: 'ellie' }),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/tweets${tweetId}`, {
      method: 'DELETE',
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    });
  }
}
