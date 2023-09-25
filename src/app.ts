import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import json from "body-parser";
import {
  addProductToCart,
  authUser,
  getProductsSortedAlphabetically,
} from "./services/dummy.service";
import { CartPayload, RequestWithUser } from "./types";
import { UnauthorizedHttpError } from "./errors/unauthorized-error";
import { errorMiddleware } from "./middlewares/error";
import { authorizeMiddleware } from "./middlewares/authorize";
import { BadRequestError } from "./errors/bad-request-error";

const app = express();

app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/products", async (req: Request, res: Response) => {
  const products = await getProductsSortedAlphabetically();
  res.send(products);
});

app.post("/products", async (req: Request, res: Response) => {
  // no among the readme tasks, skipping
  res.send();
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await authUser({ username, password });
  res.send(user);
});

app.post(
  "/cart",
  authorizeMiddleware,
  async (req: RequestWithUser, res: Response) => {
    const { userId } = req;

    if (!userId) {
      throw new UnauthorizedHttpError("User unauthorized");
    }

    const { productId } = req.body as unknown as CartPayload;

    if (!productId) {
      throw new BadRequestError("Product id is required");
    }

    addProductToCart({ userId, productId });
    res.send();
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

app.use(errorMiddleware);

export default app;
