import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { connectDB } from './database/database.js';

const app = express();

const corsOption = {
  origin: config.cors.allowedOrign,
  optionsSuccessStatus: 200,
  Credential: true, // Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});

connectDB()
  .then(() => {
    console.log('mongoDB connected!');

    // DB에 연결된 뒤에 서버를 시작하기 위해서 여기에 넣어줌
    const server = app.listen(config.host.port, () => {
      console.log(`app listening at ${config.host.port}`);
    });

    initSocket(server);
  })
  .catch(console.error);
