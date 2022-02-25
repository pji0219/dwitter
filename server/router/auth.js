import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateCredential = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('유저이름은 최소 5자 이상이어야 합니다.'),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('비밀번호는 최소 5자 이상이어야 합니다.'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('name').notEmpty().withMessage('이름을 입력 하세요.'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효 하지 않은 이메일 입니다.'),
  body('url')
    .isURL()
    .withMessage('유효하지 않는 URL 입니다.')
    .optional({ nullable: true, checkFalsy: true }), // 옵셔널 설정, nullable: true: 데이터 없는거 허용, checkFalsy: true: 빈 문자열 허용
  validate,
];

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

router.get('/me', isAuth, authController.me); // 이건 그냥 토큰이 유효한지 테스트용인거 같음(유저가 있는지) 아닐수도 있음

export default router;
