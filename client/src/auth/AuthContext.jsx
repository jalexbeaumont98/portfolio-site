// client/src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as AuthAPI from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    return token && userJson
      ? { token, user: JSON.parse(userJson) }
      : null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [auth]);

  const signin = async (email, password) => {
    const data = await AuthAPI.signin({ email, password });
    setAuth({ token: data.token, user: data.user });
    return data;
  };

  const signup = async ({ name, email, password }) => {
    // backend signup currently returns { _id, name, email }
    // We can just redirect to login afterwards, not auto-login
    return AuthAPI.signup({ name, email, password });
  };

  const signout = async () => {
    await AuthAPI.signout().catch(() => {});
    setAuth(null);
  };

  const value = useMemo(
    () => ({ auth, signin, signup, signout }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}