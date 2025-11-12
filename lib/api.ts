import axios from 'axios'; // (중요) 'axios' 전역 라이브러리 import

// Next.js 프록시 API의 기본 경로를 가진 'api' 인스턴스 생성
const api = axios.create({
  baseURL: '/api', // 모든 요청은 Next.js의 /api 폴더를 통하도록 함
  headers: {
    'Content-Type': 'application/json',
  },
  // (중요) Next.js 서버와 쿠키 등을 주고받기 위해 필요할 수 있음
  withCredentials: true,
});

/*
  1. 요청 인터셉터 (Request Interceptor)
  [프론트엔드]
  - 브라우저가 API 요청을 보내기 직전에 가로챕니다.
  - localStorage에서 'access_token'을 꺼내 'Authorization' 헤더에 자동으로 추가합니다.
*/
api.interceptors.request.use(
  (config) => {
    // 'window'는 브라우저 환경에만 존재하므로, 'window'가 있는지 확인합니다.
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        // 'Authorization' 헤더에 Bearer 토큰 추가
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  2. 응답 인터셉터 (Response Interceptor)
  [프론트엔드]
  - API 요청이 '401 Unauthorized' (Access Token 만료) 에러로 실패했을 때 작동합니다.
  - 'refresh_token'을 사용하여 자동으로 새 'access_token'을 발급받고,
  - 실패했던 원래 요청을 새 토큰으로 재시도합니다.
*/


// 토큰 갱신 중 다른 API 요청이 동시에 발생할 경우를 대비한 큐(Queue)
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

// 큐에 쌓인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response; // 2xx 응답은 그대로 반환
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(토큰 만료)이고, 아직 재시도하지 않았다면
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 1. 토큰 갱신 중이라면, 다른 요청들은 큐에 대기
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest); // (수정) 'api' 인스턴스로 재요청
        });
      }

      // 2. 재시도 플래그 설정
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        // 리프레시 토큰이 없으면 로그아웃 처리
        if (typeof window !== 'undefined') window.location.href = '/login'; 
        return Promise.reject(error);
      }

      try {
        // 3. [프론트엔드]의 Next.js 프록시(/api/auth/refresh)를 통해 토큰 갱신 API 호출
        // (★★★★★ 중요 ★★★★★)
        // 'api' 인스턴스가 아닌 전역 'axios'를 사용해야 합니다.
        // 'api' 인스턴스를 사용하면, 이 요청이 401을 반환할 때
        // 인터셉터가 다시 작동하여 무한 루프에 빠집니다.
        const rs = await axios.post('/api/auth/refresh', {
          refresh_token: refreshToken,
        }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        const { access_token: newAccessToken } = rs.data;

        // 4. 새 토큰을 localStorage에 저장
        localStorage.setItem('access_token', newAccessToken);
        
        // 5. 'api' 인스턴스의 기본 헤더 및 실패했던 원래 요청의 헤더 수정
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 6. 큐에 대기 중이던 요청들 모두 실행
        processQueue(null, newAccessToken);
        
        // 7. 실패했던 원래 요청 재시도 (이번에는 'api' 인스턴스 사용)
        return api(originalRequest);

      } catch (_error: any) {
        // 8. Refresh Token 마저 만료된 경우 (갱신 실패)
        // 모든 토큰 삭제 및 전역 로그아웃 처리
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        processQueue(_error, null);
        isRefreshing = false;
        
        // (로그아웃 처리)
        if (typeof window !== 'undefined') {
          // 강제로 로그인 페이지로 이동
          window.location.href = '/login'; 
        }
        return Promise.reject(_error);
      }
    }

    // 401 이외의 에러는 그대로 반환
    return Promise.reject(error);
  }
);

// 설정이 완료된 'api' 인스턴스를 export
export default api;