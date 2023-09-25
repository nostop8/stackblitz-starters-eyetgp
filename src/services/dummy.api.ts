import axios from "axios";
import { DummyCart, DummyUserCredentials } from "../types";

async function fetchProducts() {
  return axios.get("https://dummyjson.com/products");
}

async function postAuthLogin({ username, password }: DummyUserCredentials) {
  return axios.post("https://dummyjson.com/auth/login", {
    username,
    password,
  });
}

async function fetchUserCarts({ userId }: { userId: number }) {
  return axios.post(`https://dummyjson.com/carts/user/${userId}`);
}

async function createUserCart({ userId, products }: DummyCart) {
  return axios.post("https://dummyjson.com/carts/add", {
    userId,
    products,
  });
}

async function updateUserCart({ userId, products, id }: DummyCart) {
  return axios.post(`https://dummyjson.com/carts/${id}`, {
    merge: true,
    userId,
    products,
  });
}

export {
  fetchProducts,
  postAuthLogin,
  fetchUserCarts,
  createUserCart,
  updateUserCart,
};
