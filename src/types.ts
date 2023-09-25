import { Request } from "express";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  token: string;
};

export type CartPayload = {
  productId: number;
};

export type DummyUserCredentials = {
  username: string;
  password: string;
};

export type DummyCart = {
  id?: number;
  userId: number;
  products: {
    id: number;
    quantity: number;
  }[];
};

export interface RequestWithUser extends Request {
  userId?: number;
}
