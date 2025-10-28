import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storage';
import { protectedApi, publicApi } from '@/lib/axios';
import { UserService } from '@/services/user';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isInitializing: true,
});

export const useAuthContext = () => useContext(AuthContext);

const setTokens = (tokens) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isInitializing, setIsInitializing] = useState(true);

  const signupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (variables) => {
      return await UserService.signup(variables);
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (variables) => {
      const response = await publicApi.post('/users/login', {
        email: variables.email,
        password: variables.password,
      });

      return response.data;
    },
  });

  const signup = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        setUser(createdUser);
        setTokens(createdUser.tokens);

        toast.success('Conta criada com sucesso.');
      },
      onError: () => {
        toast.error('Erro ao criar a conta.');
      },
    });
  };

  const login = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        setUser(loggedUser);
        setTokens(loggedUser.tokens);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const logout = () => {
    setUser(null);
    removeTokens();
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsInitializing(true);
        const accessToken = localStorage.getItem(
          LOCAL_STORAGE_ACCESS_TOKEN_KEY
        );
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY
        );

        if (!accessToken && !refreshToken) return;

        const response = await protectedApi.get('/users/me');

        setUser(response.data);
      } catch (error) {
        setUser(null);
        removeTokens();
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
