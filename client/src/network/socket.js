// import { io } from 'socket.io-client';

// const socketIO = io(baseURL);

// socketIO.on('connect_error', (error) => {
//   console.log('socket error', error);
// });

// 클라이언트가 서버로부터 듣고자 하는 카테고리가 발생하면 메세지 전달 받아서 출력
// socketIO.on('dwitter', (message) => console.log(message));

import { io } from 'socket.io-client';

export default class Socket {
  constructor(baseURL, getAccessToken) {
    this.io = io(baseURL, {
      auth: (cb) => cb({ token: getAccessToken() }), // 소켓에 있는 auth라는 필드를 이용해서 토큰을 전달
    });

    this.io.on('connect_error', (err) => {
      console.log('socket error', err.message);
    });
  }

  // 서버로부터 어떤 것을 듣고 싶은지 주제를 event로 전달 받고 event가 발생했을 때 콜백으로 뭘하고 싶은지 전달 받는다.
  onSync(event, callback) {
    // io에 연결이 되어 있지 않으면 연결 시킴
    if (!this.io.connected) {
      this.io.connect();
    }

    // 이벤트가 발생하면 전달 받은 콜백 함수를 호출한다.
    this.io.on(event, (message) => callback(message));

    /* 
      리턴값으로 이 io에 대해서 해당 event를 더이상 듣지 않도록 끌 수 있는 함수를 전달 해준다.
      그러면 사용하는 사람이 이 함수를 가지고 있다가 더 이상 듣고 싶지 않을 때 이 함수를 호출하면 된다.
    */
    return () => this.io.off(event);
  }
}
