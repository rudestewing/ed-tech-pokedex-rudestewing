import axios from 'axios';
import { API_URL } from '../config/api';

const headers = {
  'Content-Type': 'application/json',
};

const httpClient = (isContentJson: boolean = true) => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers,
  });

  return instance;
};

export const graphQL = (query: string) => {
  return httpClient().post('', {
    query,
  });
};
