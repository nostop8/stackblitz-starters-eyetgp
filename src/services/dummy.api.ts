import axios from 'axios';
import { UserCredentials } from '../types';

async function fetchProducts() {
  const { data } = await axios('https://dummyjson.com/products');

  return data;
}

async function postAuthLogin({ username, password }: UserCredentials) {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return response.json();
}

export { fetchProducts, postAuthLogin };
