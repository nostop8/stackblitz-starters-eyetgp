import app from '../app';
import supertest from 'supertest';
import { fetchProducts } from '../services/dummy.api';

jest.mock('../services/dummy.api');

const request = supertest(app);

describe('GET /', () => {
  it('should return "Hello, World!"', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('GET /products', () => {
  it('should return products sorted by A-Z', async () => {
    (fetchProducts as jest.Mock).mockImplementation(() => {});

    const response = await request.get('/products').expect(200);

    expect(response).toEqual({});
  });
});
