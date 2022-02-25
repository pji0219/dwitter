import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

const AUTH_ERROR = { message: 'Authentication Error' };

// 로그인한 사용자가 또 다른 요청을 할 때 토큰이 아직 유효 한지 검증하는 미들웨어, 로그인이 된 사용자만 사용할 수 있게도 함

export const isAuth = async (req, res, next) => {
  // request의 헤더의 Authorization라는 키의 밸류를 할당
  const authHeader = req.get('Authorization'); // Bearer 어쩌구 저쩌구

  // authHeader가 존재하지 않고 authHeader가 Bearer로 시작 하지 않으면 에러 메세지 전달
  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    return res.status(401).json(AUTH_ERROR);
  }

  // Bearer 다음의 token을 읽어 와야 하기 때문에 스페이스로 분리 해준 다음에 Bearer 다음에 있는 토큰을 할당
  const token = authHeader.split(' ')[1];

  // 그 후 토큰이 유효한지 검증
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }

    // jwt에서 토큰을 검증이 되었다고 하더라도 실제로 그 사용자가 DB에 존재하는지 한번 더 확인
    const user = await userRepository.findById(decoded.id);

    // 사용자가 존재하지 않으면 에러 메세지 전달
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    // DB에 사용자가 있으면 사용자의 아이디를 req에 userId로 추가
    req.userId = user.id; // 다른 미들웨어에서도 계속해서 사용해야 되는 것이라면 이렇게 req.customData로 등록 되는 것임

    req.token = token;
    // 내가 추가, 테스트용인 me 라우터에만 필요 ( me가 테스트용이 아닐수도 있음 )

    next();
  });
};
