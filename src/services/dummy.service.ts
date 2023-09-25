import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_UNAUTHORIZED } from "../consts";
import { UnauthorizedHttpError } from "../errors/unauthorized-error";
import { Product, User, DummyUserCredentials, CartPayload } from "../types";
import {
  createUserCart,
  fetchProducts,
  fetchUserCarts,
  postAuthLogin,
  updateUserCart,
} from "./dummy.api";

const DEFAULT_PRODUCT_QUANTITY = 1;

async function getProductsSortedAlphabetically(): Promise<Product[]> {
  const { data } = await fetchProducts();

  const { products: dummyProducts } = data as {
    products: {
      id: number;
      title: string;
      description: string;
      price: number;
      thumbnail: string;
    }[];
  };

  const products: Product[] = dummyProducts.map(
    ({ id, title, description, price, thumbnail }) => ({
      id,
      title,
      description,
      price,
      thumbnail,
    })
  );

  products.sort((a, b) => a.title.localeCompare(b.title));

  return products;
}

async function authUser(credentials: DummyUserCredentials) {
  const { data, status } = await postAuthLogin(credentials);

  if (status === HTTP_STATUS_BAD_REQUEST) {
    throw new UnauthorizedHttpError("Invalid credentials");
  }

  const {
    username,
    firstName,
    lastName,
    image: avatar,
    token,
  } = data as {
    username: string;
    firstName: string;
    lastName: string;
    image: string;
    token: string;
  };

  const user: User = {
    username,
    firstName,
    lastName,
    avatar,
    token,
  };

  return user;
}

async function addProductToCart({
  productId,
  userId,
}: {
  productId: number;
  userId: number;
}) {
  const { data } = await fetchUserCarts({ userId });

  const { carts: dummyCarts } = data as {
    carts: {
      id: number;
    }[];
  };

  if (dummyCarts.length) {
    return updateUserCart({
      id: dummyCarts[0].id,
      userId,
      products: [{ id: productId, quantity: DEFAULT_PRODUCT_QUANTITY }],
    });
  }

  return createUserCart({
    userId,
    products: [{ id: productId, quantity: DEFAULT_PRODUCT_QUANTITY }],
  });
}

export { getProductsSortedAlphabetically, authUser, addProductToCart };
