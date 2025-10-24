import axios from 'axios';

export const api = axios.create({
  //baseURL: 'https://finance-app-api-9che.onrender.com/api',
  baseURL: 'https://fullstackclub-finance-dashboard-api.onrender.com/api',
});
