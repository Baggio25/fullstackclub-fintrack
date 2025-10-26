import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();

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
        const accessToken = createdUser.tokens.accessToken;
        const refreshToken = createdUser.tokens.refreshToken;
        setUser(createdUser);
        localStorage.setItem('@fintrack/accessToken', accessToken);
        localStorage.setItem('@fintrack/refreshToken', refreshToken);

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
        const accessToken = loggedUser.tokens.accessToken;
        const refreshToken = loggedUser.tokens.refreshToken;

        localStorage.setItem('@fintrack/accessToken', accessToken);
        localStorage.setItem('@fintrack/refreshToken', refreshToken);
        setUser(loggedUser);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem('@fintrack/accessToken');
        const refreshToken = localStorage.getItem('@fintrack/refreshToken');

        if (!accessToken && !refreshToken) return;

        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('@fintrack/accessToken');
        localStorage.removeItem('@fintrack/refreshToken');
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem('@fintrack/accessToken');
      const refreshToken = localStorage.getItem('@fintrack/refreshToken');

      if (!accessToken && !refreshToken) return;

      try {
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('@fintrack/accessToken');
        localStorage.removeItem('@fintrack/refreshToken');
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
