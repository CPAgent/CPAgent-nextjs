'use client'; // 이 파일은 클라이언트 컴포넌트(Context)이므로 'use client'가 필수입니다.

    import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
    import { useRouter } from 'next/navigation';
    import api from '@/lib/api'; // (중요) 1단계에서 만든 Axios 클라이언트(인증 엔진)

    // 1. Context가 제공할 값의 타입(TypeScript) 정의
    interface AuthContextType {
      accessToken: string | null;     // 현재 액세스 토큰
      isLoading: boolean;             // 로딩 중인지 (자동 로그인 시도 중)
      login: (email: string, password: string) => Promise<void>; // 로그인 함수
      logout: () => void;             // 로그아웃 함수
    }

    // 2. Context 생성
    // '!'는 "이 값은 지금 당장 undefined이지만, Provider가 값을 채워줄 것이니 걱정마"라는 의미
    const AuthContext = createContext<AuthContextType>(null!);

    // 3. Provider 컴포넌트 생성 (모든 인증 로직의 핵심)
    // 이 컴포넌트가 app/layout.tsx에서 앱 전체를 감쌀 것입니다.
    export function AuthProvider({ children }: { children: ReactNode }) {
      const [accessToken, setAccessToken] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true); // 앱 첫 로드 시 '로딩 중'으로 시작
      const router = useRouter();

      /**
       * (★★★★★ 핵심 로직 1: 자동 로그인 ★★★★★)
       * 앱이 처음 로드될 때 (useEffect []) 딱 한 번 실행됩니다.
       * localStorage에 'refresh_token'이 있는지 확인하고,
       * 있다면 2단계에서 만든 '/api/auth/refresh' 프록시를 호출하여
       * 'access_token'을 자동으로 발급받습니다. (Silent Refresh)
       */
      useEffect(() => {
        const attemptSilentRefresh = async () => {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              // 2단계에서 만든 'refresh' 프록시 호출
              const response = await api.post('/auth/refresh', { 
                refresh_token: refreshToken 
              });
              
              const newAccessToken = response.data.access_token;
              setAccessToken(newAccessToken); // Context 상태에 새 토큰 저장
              
              // (중요) localStorage에도 새 토큰 저장
              // 1단계의 Axios 인터셉터는 localStorage에서 토큰을 읽어갑니다.
              localStorage.setItem('access_token', newAccessToken);

            } catch (error) {
              // (예: refresh_token 마저 만료됨)
              console.error('Silent refresh failed:', error);
              // 토큰이 유효하지 않으면 강제 로그아웃
              setAccessToken(null);
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            }
          }
          setIsLoading(false); // 자동 로그인 시도 완료 (성공/실패 무관)
        };

        attemptSilentRefresh();
      }, []); // 빈 배열: 컴포넌트 마운트 시 딱 한 번 실행

      /**
       * (핵심 로직 2: 로그인 함수)
       * app/login/page.tsx (로그인 페이지)에서 이 함수를 호출할 것입니다.
       */
      const login = async (email: string, password: string) => {
        try {
          // [프론트엔드]의 '/api/auth/login' 프록시 호출 (이 파일은 이미 존재함)
          const response = await api.post('/auth/login', { email, password });

          const { access_token, refresh_token } = response.data;

          // 1. Context 상태에 토큰 저장
          setAccessToken(access_token);
          // 2. (가장 중요) localStorage에 두 토큰 모두 저장
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);

          // 3. (중요) 1단계의 'api' 클라이언트의 기본 헤더 설정
          // (로그인 직후의 다음 요청부터 바로 헤더에 토큰이 실리도록 함)
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          // 4. 대시보드로 이동
          router.push('/dashboard');

        } catch (error) {
          console.error('Login failed:', error);
          // (중요) 에러를 다시 throw하여 로그인 페이지의 form이 에러를 잡을 수 있게 함
          throw error;
        }
      };

      /**
       * (핵심 로직 3: 로그아웃 함수)
       * components/Header.tsx (헤더)에서 이 함수를 호출할 것입니다.
       */
      const logout = () => {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // 2단계에서 만든 'logout' 프록시 호출
        // (Spring Boot DB에서 refresh_token을 파기하기 위함)
        if (refreshToken) {
          api.post('/auth/logout', { refresh_token: refreshToken })
             .catch(err => console.error("Logout API call failed:", err)); // 실패해도 프론트엔드 로그아웃은 진행
        }

        // 1. Context 상태 비우기
        setAccessToken(null);
        // 2. localStorage 비우기 (가장 중요)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // 3. 'api' 클라이언트의 기본 헤더 제거
        delete api.defaults.headers.common['Authorization'];
        
        // 4. 로그인 페이지로 이동
        router.push('/login');
      };

      // 4. Provider가 하위 컴포넌트들에게 제공할 값들
      const value = {
        accessToken,
        isLoading,
        login,
        logout,
      };

      // (중요) 로딩 중일 때는 아무것도 렌더링하지 않음
      // (자동 로그인 시도 중 페이지가 깜박이는 것을 방지)
      if (isLoading) {
        return null; // 또는 로딩 스피너 컴포넌트
      }

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    /**
     * (핵심 로직 4: 커스텀 훅)
     * 다른 컴포넌트에서 'useContext(AuthContext)' 대신
     * 'useAuth()'라는 간편한 훅을 사용하게 해줍니다.
     */
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };