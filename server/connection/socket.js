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

class Socket {
  constructor(server) {
    // 소켓을 만듦(만들 준비를 함)
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    // 토큰을 검증
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      // 아무에게나 트윗을 알려주고 싶지 않기 때문에 토큰이 없다면 인증 에러 뜨게 함
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // 그리고 jwt로 해독을 할 수 없다면 인증 에러를 뜨게 함
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error'));
        }
        next();
      });
    });

    this.io.on('connection', (socket) => {
      console.log('Socket client connected');
    });
  }
}

let socket;
export function initSocket(server) {
  // 소켓이 만들어지지 않다면 위에서 작성한 클래스로 소켓을 만듦, (이미 만들어져 있으면 만들지 않음)
  if (!socket) {
    socket = new Socket(server);
  }
}

// 소켓을 사용하기 위한 함수
export function getSocketIO() {
  // 소켓이 만들어지지 않았다면 에러 전달
  if (!socket) {
    throw new Error('Please call init first');
  }

  // 소켓에 있는 io를 전달(io는 자기가 정한 변수명)
  return socket.io;
}
