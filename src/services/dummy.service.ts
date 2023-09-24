import { Product, User, UserCredentials } from '../types';
import { fetchProducts, postAuthLogin } from './dummy.api';

async function getProductsSortedAlphabetically(): Promise<Product[]> {
  const { products: dummyProducts } = (await fetchProducts()) as {
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

async function authUser(credentials: UserCredentials) {
  const { username, firstName, lastName, avatar, token } = (await postAuthLogin(
    credentials
  )) as {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
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

export { getProductsSortedAlphabetically, authUser };
