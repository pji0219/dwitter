import { getUsers } from '../database/database.js';
import MongoDb from 'mongodb';

const ObjectId = MongoDb.ObjectId;

export async function findByUsername(username) {
  return getUsers()
    .findOne({ username }) //
    .then(mapOptionalUser); // username으로 찾은 사용자의 id, password등등 모든 정보가 리턴
  // (user) => mapOptionalUser(user) 이처럼 전달 받은 인자와 호출하는 인자가 같으면 mapOptionalUser 이렇게 줄일수 있음
}

export async function findById(id) {
  return getUsers()
    .findOne({ _id: new ObjectId(id) }) // 몽고DB에서 사용하는 오브젝트 형식의 id로 바꿔줘서 그 id로 찾음
    .then(mapOptionalUser); // id로 찾은 사용자의 id, password등등 모든 정보가 리턴
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString()); // 사용자를 만든 후 사용자의 id를 리턴(id가 오브젝트 형식이기 때문에 문자열로 바꿔줌)
}

// 받아온 유저가 있으면 맵핑을 한다는 의미에서 이름 지음
function mapOptionalUser(user) {
  /* 
    id가 오브젝트 형식이기 때문에 문자열로 바꿔주고 id라는 키를 새로 만들어서 data에 넣어주고 리턴 
    왜냐하면 서버 어플리케이션에서 내가 id로 지정해서 사용하기 때문
  */
  return user ? { ...user, id: user._id.toString() } : user; // 찾는 사용자가 없으면 null 리턴
}
