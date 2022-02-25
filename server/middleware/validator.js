import { validationResult } from 'express-validator';

// 유효성 에러가 있으면 에러를 전달해주는 미들웨어
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  next();
};
