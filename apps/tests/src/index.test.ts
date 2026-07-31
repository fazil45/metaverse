import { test, expect, describe, beforeAll } from "bun:test";
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

describe("User metadata endpoints", () => {
  let token = "";
  let cookie = "";
  let avatarId = "21";

  beforeAll(async () => {
    const username = `fazil-${Math.random()}`;
    const password = `123456`;

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      cookie = setCookieHeader[0]!;
      token = cookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
    );
  });

  test("User can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/metadata`, {
      avatarId: "123455",
    });

    expect(response.data.statusCode).toBe(400);
  });

  test("User can update their metadata with a right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          token: token,
        },
      },
    );
    expect(response.data.statusCode).toBe(200);
  });

  test("User can't update their metadata without token", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.data.statusCode).toBe(403);
  });
});

describe("User avatar information", () => {
  let token;
  let cookie;
  let userId: "";
  let avatarId = "21";

  beforeAll(async () => {
    const username = `fazil-${Math.random()}`;
    const password = `123456`;

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      cookie = setCookieHeader[0]!;
      token = cookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
    );
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`,
      {
        withCredentials: true,
      },
    );
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`, {
      withCredentials: true,
    });
    expect(response.data.avatars.length).not.toBe(0);
    const currentUser = response.data.avatars.find(
      (x: any) => x.id == avatarId,
    );
    expect(currentUser).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userToken;
  let userId;
  let adminToken;
  let adminId;
  let cookie;

  beforeAll(async () => {
    const username = `fazil-${Math.random()}`;
    const password = `123456`;

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      cookie = setCookieHeader[0]!;
      adminToken = cookie.split(";")[0]?.split("=")[1]!;
    }

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        withCredentials: true,
      },
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        withCredentials: true,
      },
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        withCredentials: true,
      },
    );

    mapId = map.data.mapId;
  });
});
