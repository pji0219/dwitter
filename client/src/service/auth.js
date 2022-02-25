export default class AuthService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async signup(username, password, name, email, url) {
    // 클라이언트에 입력된 값으로 회원가입한다.
    const data = await this.http.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        name,
        email,
        url,
      }),
    });

    // 회원가입 후 서버로부터 받아온 토큰을 로컬스토리지에 저장, db폴더 참고
    this.tokenStorage.saveToken(data.token);

    // AuthContext 참고, 로그인페이지를 보여줄지 홈페이지를 보여줄지 결정하기 위해 리턴 값을 state에 저장하는거 같음
    return data;
  }

  async login(username, password) {
    // 클라이언트에 입력된 값으로 로그인
    const data = await this.http.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    // 로그인 후 서버로부터 받아온 토큰을 로컬스토리지에 저장
    this.tokenStorage.saveToken(data.token);

    // AuthContext 참고, 로그인페이지를 보여줄지 홈페이지를 보여줄지 결정하기 위해 리턴 값을 state에 저장하는거 같음
    return data;
  }

  async me() {
    const token = this.tokenStorage.getToken(); // 토큰을 읽어 와서
    return this.http.fetch('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }, // 헤더에 추가해줌
    });
  }

  // 로그아웃은 서버에 따로 요청할 필요가 없고 클라이언트 자체적으로 토큰을 없애주면 됨
  async logout() {
    this.tokenStorage.clearToken(); // 토큰을 없애줌
  }
}
