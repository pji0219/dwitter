import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;

  // 유저가 이미 있으면 있다고 응답
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }

  // 유저 없으면 비밀번호 암호화 후 회원가입
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  // 사용자를 회원가입 시킨 후 사용자의 고유한 id를 줌
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });

  // 토큰 만들어서 클라이언트에게 username하고 같이 전달, 토큰: { id }, jwtSecretKey, { expiresIn: jwtExpiresInDays }
  const token = createJwtToken(userId); // 사용자의 고유한 id를 이용해서 위와 같이 토큰을 만듦, createJwtToken 함수는 맨아래에서 두번째에 있음
  res.status(201).json({ token, username }); // 클라이언트에게 토큰과 username을 같이 전달
}

export async function login(req, res) {
  const { username, password } = req.body;

  // 해당 아이디(유저네임)가 있는지 확인
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }

  // 비밀번호가 일치하는지 확인(비교)
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }

  // 로그인 된 유저의 id를 이용해서 토큰을 만들고 클라이언트에게 토큰과 유저네임을 전달
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
}

// 토큰 생성, 로그인과 회원가입에서 모두 사용하기 때문에 함수로 만듦(재사용성을 위함)
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// 이건 그냥 토큰이 유효한지 테스트용인거 같음 (유저가 있는지)
export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
