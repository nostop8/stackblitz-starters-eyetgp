import app from "../app";
import supertest from "supertest";
import products from "./__stubs__/products.json";
import user from "./__stubs__/user.json";
import {
  createUserCart,
  fetchProducts,
  fetchUserCarts,
  postAuthLogin,
  updateUserCart,
} from "../services/dummy.api";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
} from "../consts";

jest.mock("../services/dummy.api");

const request = supertest(app);

describe("GET /", () => {
  it('should return "Hello, World!"', async () => {
    const response = await request.get("/");
    expect(response.status).toBe(HTTP_STATUS_OK);
    expect(response.text).toBe("Hello, World!");
  });
});

describe("GET /products", () => {
  it("should return products sorted by A-Z", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue({ data: products });

    const response = await request.get("/products").expect(HTTP_STATUS_OK);

    expect(response.body).toMatchSnapshot();
  });

  it("should return error if anything wrong", async () => {
    (fetchProducts as jest.Mock).mockRejectedValue(new Error("error"));

    await request.get("/products").expect(HTTP_STATUS_BAD_REQUEST);
  });
});

describe("POST /login", () => {
  it("should return user", async () => {
    (postAuthLogin as jest.Mock).mockResolvedValue({ data: user });

    const response = await request
      .post("/login")
      .send({
        username: "john",
        password: "password",
      })
      .expect(HTTP_STATUS_OK);

    expect(response.body).toMatchSnapshot();
  });

  it("should return unauthorized error", async () => {
    (postAuthLogin as jest.Mock).mockResolvedValue({
      status: HTTP_STATUS_BAD_REQUEST,
    });

    const response = await request
      .post("/login")
      .send({
        username: "john",
        password: "password",
      })
      .expect(HTTP_STATUS_UNAUTHORIZED);

    expect(response.body).toMatchSnapshot();
  });
});

describe("POST /cart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if user unauthorized", async () => {
    await request.post("/cart").expect(HTTP_STATUS_UNAUTHORIZED);
  });

  it("should return error if token missing user id", async () => {
    await request
      .post("/cart")
      .set({ Authorization: "Bearer token" })
      .expect(HTTP_STATUS_UNAUTHORIZED);
  });

  it('should return error if "productId" missing', async () => {
    await request
      .post("/cart")
      .set({ Authorization: `Bearer ${user.token}` })
      .expect(HTTP_STATUS_BAD_REQUEST);
  });

  it("shoud add product to new user cart and return OK", async () => {
    (fetchUserCarts as jest.Mock).mockResolvedValue({ data: { carts: [] } });

    await request
      .post("/cart")
      .set({ Authorization: `Bearer ${user.token}` })
      .send({ productId: 2 })
      .expect(HTTP_STATUS_OK);

    expect(fetchUserCarts).toBeCalledWith({ userId: user.id });
    expect(createUserCart).toBeCalledWith({
      userId: user.id,
      products: [{ id: 2, quantity: 1 }],
    });
    expect(updateUserCart).not.toBeCalled();
  });

  it("should add product to first available user cart and return OK", async () => {
    (fetchUserCarts as jest.Mock).mockResolvedValue({
      data: { carts: [{ id: 1 }] },
    });

    await request
      .post("/cart")
      .set({ Authorization: `Bearer ${user.token}` })
      .send({ productId: 3 })
      .expect(HTTP_STATUS_OK);

    expect(fetchUserCarts).toBeCalledWith({ userId: user.id });
    expect(updateUserCart).toBeCalledWith({
      id: 1,
      userId: user.id,
      products: [{ id: 3, quantity: 1 }],
    });
    expect(createUserCart).not.toBeCalled();
  });
});
