import * as userRepository from './auth.js';

let tweets = [
  {
    id: '1',
    text: '드림코딩에서 강의 들으면 너무 좋으다',
    createdAt: new Date().toString(),
    userId: '1',
  },
];

export async function getAll() {
  return Promise.all(
    tweets.map(async (tweet) => {
      // 유저 관련 정보를 user 모델에서 받아온 뒤
      const { username, name, url } = await userRepository.findById(
        tweet.userId
      );

      // 트윗 정보와 합쳐서 응답
      return { ...tweet, username, name, url };
    })
  );
}

export async function getAllByUsername(username) {
  // 위 함수를 이용해서 username으로 찾음
  return getAll().then((tweets) =>
    tweets.filter((tweet) => tweet.username === username)
  );
}

export async function getById(id) {
  // id로 해당 트윗을 찾고
  const found = tweets.find((tweet) => tweet.id === id);

  if (!found) {
    return null;
  }

  // 해당 트윗의 userID로 유저 관련 정보를 찾은 뒤
  const { username, name, url } = await userRepository.findById(found.userId);

  // 트윗 정보와 합쳐서 응답
  return { ...found, username, name, url };
}

export async function create(text, userId) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    userId,
  };

  // 새로운 트윗 생성 후
  tweets = [tweet, ...tweets];

  // 위의 getById 함수를 이용해 새로 생성한 트윗 정보와 유저 관련 정보를 합친 뒤 응답
  return getById(tweet.id);
}

export async function update(id, text) {
  const tweet = tweets.find((tweet) => tweet.id === id);

  // 해당 트윗이 있으면 텍스트를 수정 후
  if (tweet) {
    tweet.text = text;
  }

  // 위의 getById 함수를 이용해 수정한 트윗 정보와 유저 관련 정보를 합친 뒤 응답
  return getById(tweet.id);
}

export async function remove(id) {
  return (tweets = tweets.filter((tweet) => tweet.id !== id));
}
