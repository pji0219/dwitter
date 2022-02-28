import Mongoose from 'mongoose';
import { config } from '../config.js';

export async function connectDB() {
  return Mongoose.connect(config.db.host, {}); // 6.x버전부터는 옵션을 따로 명시해주지 않아도 됨
}

// _id -> id, 가상의 id라는 키를 추가해서 데이터베이스를 읽어 올때는 그것으로 적용
export function useVirtualId(schema) {
  // schema 파라미터는 스키마를 인자로 받아옴
  schema.virtual('id').get(function () {
    return this._id.toString();
  });
  schema.set('toJSON', { virtuals: true }); // json에 가상의 요소도 추가 될 수 있게 함, 이렇게 해야 json에 포함됨
  schema.set('toOject', { virtuals: true }); // object에 가상의 요소도 추가 될 수 있게 함, 이렇게 해야 콘솔 로그에 출력됨
}
