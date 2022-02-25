/* 
  web socket: 기존 http통신 방식은 클라이언트에서 요청이 있어야만 서버가 응답하는데
  웹 소켓은 클라이언트와 서버가 연결만 되면 클라이언트가 요청이 없어도 서버에서 먼저 데이터를 전달할 수 있고
  클라이언트에서도 실시간으로 서버와 데이터를 주고 받을 수 있다.
*/
// const socketIO = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// socket.io는 이벤트 베이스, 누군가가 connection을 했다면 아래 콜백함수가 실행
// socketIO.on('connection', (socket) => {
//   console.log('client is here!');

//   카테고리별로 메세지를 전달할 수 있다, 첫 인자: 카테고리, 둘째 인자: 메세지
//   socketIO.emit('dwitter', 'hello');
//   socketIO.emit('dwitter', 'hello');
// });

// setInterval(() => {
//   socketIO.emit('dwitter', 'hello');
// }, 10000);

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
