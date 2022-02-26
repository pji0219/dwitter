import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from './Banner';
import NewTweetForm from './NewTweetForm';
import TweetCard from './TweetCard';
import { useAuth } from '../context/AuthContext';

const Tweets = memo(({ tweetService, username, addable }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    tweetService
      .getTweets(username)
      .then((tweets) => setTweets([...tweets]))
      .catch(onError);

    /* 
        새로운 트윗이 생기면 onSync라는 함수를 통해서 새로운 트윗을 만듦(다른 클라이언트에서 만든 트윗이나 내가 만든 트윗이 
        생기면 소켓을 이용해서  실시간으로 렌더링 해줌)
      */
    const stopSync = tweetService.onSync((tweet) => onCreated(tweet));
    return () => stopSync(); // 그리고 컴포넌트가 언마운트될 때는 더이상 새로운 트윗이 생기는지 듣고 싶지 않으므로 콜백함수를 호출해준다.
  }, [tweetService, username, user]);

  const onCreated = (tweet) => {
    setTweets((tweets) => [tweet, ...tweets]);
  };

  const onDelete = (tweetId) =>
    tweetService
      .deleteTweet(tweetId)
      .then(() =>
        setTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId))
      )
      .catch((error) => setError(error.toString()));

  const onUpdate = (tweetId, text) =>
    tweetService
      .updateTweet(tweetId, text)
      .then((updated) =>
        setTweets((tweets) =>
          tweets.map((item) => (item.id === updated.id ? updated : item))
        )
      )
      .catch((error) => error.toString());

  const onUsernameClick = (tweet) => history.push(`/${tweet.username}`);

  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  return (
    <>
      {addable && (
        <NewTweetForm
          tweetService={tweetService}
          onError={onError}
          onCreated={onCreated}
        />
      )}
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {tweets.length === 0 && <p className="tweets-empty">No Tweets Yet</p>}
      <ul className="tweets">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            owner={tweet.username === user.username}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUsernameClick={onUsernameClick}
          />
        ))}
      </ul>
    </>
  );
});
export default Tweets;
