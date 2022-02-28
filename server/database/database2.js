import MongoDb from 'mongodb';
import { config } from '../config.js';

let db;

// db에 연결
export async function connectDB() {
  return MongoDb.MongoClient.connect(config.db.host) //
    .then((client) => {
      db = client.db(); // db에 연결이 되면 연결된 클라이언트를 받아서 클라이언트에 있는 db를 리턴 (db에 연결되면 db를 리턴)
    });
}

// db의 user 컬렉션을 리턴
export function getUsers() {
  return db.collection('users');
}

// db의 tweets 컬렉션을 리턴
export function getTweets() {
  return db.collection('tweets');
}
