import express, { Request, Response, NextFunction } from 'express';
import json from 'body-parser';
import {
  authUser,
  getProductsSortedAlphabetically,
} from './services/dummy.service';

const app = express();

app.use(json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/products', async (req: Request, res: Response) => {
  const products = await getProductsSortedAlphabetically();
  res.send(products);
});

app.post('/products', async (req: Request, res: Response) => {
  res.send();
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = authUser({ username, password });
  res.send(user);
});

app.post('/cart', async (req: Request, res: Response) => {
  res.send();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
