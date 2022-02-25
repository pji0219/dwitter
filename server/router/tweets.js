import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import * as tweetController from '../controller/tweet.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// 유효성 검사
const validateTweet = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('텍스트를 입력해!')
    .isLength({ min: 2 })
    .withMessage('텍스트는 두글자 이상!'),
  validate,
];

// GET /tweets
// GET /tweets?username=:username
// query에 대해서는 어짜피 잘못된 값이 입력될 경우 없는 페이지라고 나오기 때문에 유효성 검사를 안해줘도 된다.
router.get('/', isAuth, tweetController.getTweets);

// GET /tweets/:id
// param에 대해서는 잘못된 값을 입력할 경우 어짜피 찾을 수 없는 페이지라고 나오기 때문에 유효성 검사를 안해줘도 된다.
router.get('/:id', isAuth, tweetController.getTweet);

// POST /tweets
router.post('/', isAuth, validateTweet, tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;
