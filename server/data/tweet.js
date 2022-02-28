import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';
import * as UserRepository from './auth.js';

const tweetSchema = new Mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    url: String,
  },
  { timestamps: true } // 날짜를 생성 해줌
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function getAll() {
  return Tweet.find().sort({ createdAt: -1 }); // 제일 마지막에 저장된거부터 순서대로 정렬해서 트윗 전부 찾아옴(최신 순으로)
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 }); // 특정 유저의 트윗만 최신 순으로 찾음
}

export async function getById(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  // userId로 User컬렉션에서 name과 username을 받아온 다음 트윗 만들때 같이 넣어줌
  return UserRepository.findById(userId).then((user) =>
    new Tweet({
      text,
      userId,
      name: user.name,
      username: user.username,
    }).save()
  );
}

export async function update(id, text) {
  // 업데이트 된 것으로 받고 싶으면 returnOriginal: false로 설정 해줘야 함
  return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

export async function remove(id) {
  return Tweet.findByIdAndDelete(id);
}
