import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isInitializing: true,
});

export const useAuthContext = () => useContext(AuthContext);

const LOCAL_STORAGE_ACCESS_TOKEN_KEY = '@fintrack/accessToken';
const LOCAL_STORAGE_REFRESH_TOKEN_KEY = '@fintrack/refreshToken';

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
      const response = await api.post('/users', {
        first_name: variables.firstName,
        last_name: variables.lastName,
        email: variables.email,
        password: variables.password,
      });

      return response.data;
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (variables) => {
      const response = await api.post('/users/login', {
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

        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

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
