import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

// _id -> id, 가상의 id라는 키를 추가해서 데이터베이스를 읽어 올때는 그것으로 적용
useVirtualId(userSchema);
const User = Mongoose.model('User', userSchema); // User 컬렉션을 userSchema와 연결

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
}

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}
