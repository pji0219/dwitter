import dotenv from 'dotenv';
dotenv.config();

// 환경변수에 key가 있는지 확인 하는 것, 확인 후 있으면 환경변수의 key가 사용됨 없으면 없다고 알려줌
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;

  if (value === null) {
    throw new Error(`Key ${key} is undefined`);
  }

  return value;
}

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    // 환경변수 값이 숫자인 경우 문자열 형태로 인자를 전달할 경우 오류가 나는 경우가 있어서 parseInt를 씀
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  host: {
    port: parseInt(required('HOST_PORT', 8080)),
  },
};

// 기존 코드
// export const config = {
//   jwt: {
//     secretKey: process.env.JWT_SECRET,
//     expiresInSec: process.env.JWT_EXPIRES_SEC,
//   },
//   bcrypt: {
//     saltRounds: process.env.BCRYPT_SALT_ROUNDS,
//   },
//   host: {
//     port: process.env.HOST_PORT
//   }
// };
