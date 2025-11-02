import { protectedApi, publicApi } from '@/lib/axios';

export const UserService = {
  /**
   * Cria um novo usuário
   * @param {string} input.firstName
   * @param {string} input.lastName
   * @param {string} input.email
   * @param {string} input.password
   * @returns {Object} Usuario criado
   * @returns {string} response.id - Tokens autenticacao
   */
  signup: async (input) => {
    const response = await publicApi.post('/users', {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password: input.password,
    });

    return {
      id: response.data.id,
      email: response.data.email,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      tokens: response.data.tokens,
    };
  },

  /**
   * Cria um novo usuário
   * @param {string} input.email
   * @param {string} input.password
   * @returns {Object} Usuario autenticado
   * @returns {string} response.id - Tokens autenticacao
   */
  login: async (input) => {
    const response = await publicApi.post('/users/login', {
      email: input.email,
      password: input.password,
    });

    return {
      id: response.data.id,
      email: response.data.email,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      tokens: response.data.tokens,
    };
  },

  /**
   * Retorna os dados de um usuário
   * @returns {Object} Usuario autenticado
   */
  me: async () => {
    const response = await protectedApi.get('/users/me');
    return {
      id: response.data.id,
      email: response.data.email,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
    };
  },

  /**
   * Retorna o balanço do usuário autenticado
   * @param {string} input.from Data Inicial (yyyy-MM-dd)
   * @param {string} input.to - Data Final (yyyy-MM-dd)
   * @returns {Object} Balanço do usuário
   */
  getBalance: async (input) => {
    const queryParams = new URLSearchParams();
    queryParams.set('from', input.from);
    queryParams.set('to', input.to);
    const response = await protectedApi.get(
      `/users/me/balance?${queryParams.toString()}`
    );
    return response.data;
  },
};
