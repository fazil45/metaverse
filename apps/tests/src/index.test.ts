import { test, expect, describe } from "bun:test";
import axios from "axios";

const BACKEND_URL = "http://localhost:4000";

describe("Authentication", () => {
  test("User is able to sign up", async () => {
    const username = "fazil" + Math.random();
    const password = "123455";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.data.statusCode).toBe(200);

    const secondResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(secondResponse.data.statusCode).toBe(400);
  });

  test("Signup request fails if the username is empty", async () => {
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      admin: "admin",
    });

    expect(response.data.statusCode).toBe(400);
  });

  test("Signin succeeds if the username and password are correct", async () => {
    const username = `fazil-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.data.statusCode).toBe(200);
    expect(response.headers.token).toBeDefined();
  });

  test("Signin falls if the username and password are incorrect", async () => {
    const username = `fazil-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "fazil-random-123",
      password,
    });

    expect(response.data.statusCode).toBe(403);
  });
});
