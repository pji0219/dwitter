import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export async function createTweet(req, res, next) {
  const { text } = req.body;
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);

  // 만들어진 트윗이 tweets 카테고리에 연결된 클라이언트들에게 실시간으로 보여짐
  getSocketIO().emit('tweets', tweet);
}

export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;

  // 트윗 수정을 요청하기 이전에 트윗 작성자와 요청자의 id가 일치하는지 확인하기 위한 로직들
  const tweet = await tweetRepository.getById(id);

  // 먼저 해당 사용자의 트윗이 없다면 404
  if (!tweet) {
    return res.sendStatus(404);
  }
  // 트윗 userId와 요청 userId가 다르면 403 (권한이 없는데 수정 하려고 하니 안된다고)
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  // 위의 경우가 아닐 시에 트윗을 업데이트 하기 위한 로직
  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}

export async function deleteTweet(req, res) {
  const id = req.params.id;

  // 트윗 삭제를 요청하기 이전에 트윗 작성자와 요청자의 id가 일치하는지 확인하기 위한 로직들
  const tweet = await tweetRepository.getById(id);

  // 먼저 해당 사용자의 트윗이 없다면 404
  if (!tweet) {
    return res.sendStatus(404);
  }
  // 트윗 userId와 요청 userId가 다르면 403 (권한이 없는데 삭제 하려고 하니 안된다고)
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  // 위의 경우가 아닐 시에 트윗을 삭제하기 위한 로직
  await tweetRepository.remove(id);
  res.sendStatus(204);
}
