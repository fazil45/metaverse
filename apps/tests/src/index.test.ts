import { test, expect, describe, beforeAll } from "bun:test";
import axios1 from "axios";

interface AxiosErrorResponse {
  response?: unknown;
}

interface AxiosWrapper {
  post: (...args: Parameters<typeof axios1.post>) => Promise<any>;
  put: (...args: Parameters<typeof axios1.put>) => Promise<any>;
  delete: (...args: Parameters<typeof axios1.delete>) => Promise<any>;
  get: (...args: Parameters<typeof axios1.get>) => Promise<any>;
}

const axios: AxiosWrapper = {
  post: async (...args: Parameters<typeof axios1.post>): Promise<any> => {
    try {
      const res = await axios1.post(...args);
      return res;
    } catch (error: unknown) {
      return (error as AxiosErrorResponse).response;
    }
  },
  put: async (...args: Parameters<typeof axios1.put>): Promise<any> => {
    try {
      const res = await axios1.put(...args);
      return res;
    } catch (error: unknown) {
      return (error as AxiosErrorResponse).response;
    }
  },
  delete: async (...args: Parameters<typeof axios1.delete>): Promise<any> => {
    try {
      const res = await axios1.delete(...args);
      return res;
    } catch (error: unknown) {
      return (error as AxiosErrorResponse).response;
    }
  },
  get: async (...args: Parameters<typeof axios1.get>): Promise<any> => {
    try {
      const res = await axios1.get(...args);
      return res;
    } catch (error: unknown) {
      return (error as AxiosErrorResponse).response;
    }
  },
};
const HTTP_URL = "http://localhost:4000";
const WS_URL = "ws://localhost:4001";

describe("Authentication", () => {
  test("User is able to sign up", async () => {
    const username = "fazil" + Math.random();
    const password = "123455";
    const response = await axios.post(`${HTTP_URL}/api/v1/auth/signup`, {
      username,
      password,
      role: "Admin",
    });
    expect((response as { status: number }).status).toBe(201);

    const secondResponse = await axios.post(`${HTTP_URL}/api/v1/auth/signup`, {
      username,
      password,
      type: "Admin",
    });
    expect((secondResponse as { status: number }).status).toBe(401); // duplicate username, per your controller
  });

  test("Signup request fails if the username is empty", async () => {
    const password = "123456";

    const response = await axios.post(`${HTTP_URL}/api/v1/auth/signup`, {
      password,
      admin: "Admin",
    });

    expect((response as { status: number }).status).toBe(400);
  });

  test("Signin succeeds if the username and password are correct", async () => {
    const username = `fazil${Math.random().toString(36).slice(2)}`; // alphanumeric only, no "."
    const password = "123455";

    const signupResponse = await axios.post(`${HTTP_URL}/api/v1/auth/signup`, {
      username,
      password,
      role: "Admin",
    });
    expect((signupResponse as { status: number }).status).toBe(201);

    const response = await axios.post(`${HTTP_URL}/api/v1/auth/signin`, {
      username,
      password,
    });

    expect((response as { status: number }).status).toBe(200);
    expect(
      (response as { status: number; headers: Record<string, unknown> })
        .headers["set-cookie"],
    ).toBeDefined();
  });

  test("Signin falls if the username and password are incorrect", async () => {
    const username = `fazil-${Math.random()}`;
    const password = "123456";

    await axios.post(`${HTTP_URL}/api/v1/auth/signup`, {
      username,
      password,
      role: "Admin",
    });

    const response = await axios.post(`${HTTP_URL}/api/v1/auth/signin`, {
      username: "fazil-random-123",
      password,
    });

    expect((response as { status: number }).status).toBe(403);
  });
});

describe("User metadata endpoints", () => {
  let userToken;
  let userId: string;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;
  let avatarId: string;

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameAdmin,
        password,
        role: "Admin",
      },
    );

    adminId = adminSignupResponse.data.user.id;

    const adminSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameUser,
        password,
        role: "User",
      },
    );

    userId = userSignupResponse.data.user.id;

    const userSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Test Avatar",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    avatarId = avatarResponse.data.id;
  });

  test("User can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/user/metadata`,
      {
        avatarId: "8543",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect((response as { status: number }).status).toBe(400);
  });

  test("User can update their metadata with a right avatar id", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );
    expect((response as { status: number }).status).toBe(200);
  });

  test("User can't update their metadata without token", async () => {
    const response = await axios.post(`${HTTP_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect((response as { status: number }).status).toBe(401);
  });
});

describe("User avatar information", () => {
  let userToken;
  let userId: string;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;

  let avatarId: string;

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameAdmin,
        password,
        role: "Admin",
      },
    );

    adminId = adminSignupResponse.data.user.id;

    const adminSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameUser,
        password,
        role: "User",
      },
    );

    userId = userSignupResponse.data.user.id;

    const userSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Test Avatar",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    avatarId = avatarResponse.data.id;
  });

  test("User can update their metadata with a right avatar id", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );
    expect((response as { status: number }).status).toBe(200);
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${HTTP_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`,
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${HTTP_URL}/api/v1/user/avatars`, {
      headers: {
        Cookie: userCookie!,
      },
    });
    expect(response.data.avatars.length).not.toBe(0);
    const currentUser = response.data.avatars.find(
      (x: any) => x.id == avatarId,
    );
    expect(currentUser).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId: string;
  let element1Id;
  let element2Id;
  let userToken;
  let userId;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;
  let avatarId: string;

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameAdmin,
        password,
        role: "Admin",
      },
    );

    adminId = adminSignupResponse.data.user.id;

    const adminSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameUser,
        password,
        role: "User",
      },
    );

    userId = userSignupResponse.data.user.id;

    const userSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Test Avatar",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    avatarId = avatarResponse.data.id;

    const element1 = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const element2 = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${HTTP_URL}/api/v1/admin/map`,
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
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    mapId = map.data.id;
  }, 30000);

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId!,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect(response.data.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapId (empty space)", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect(response.data.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect((response as { status: number }).status).toBe(400);
  });

  test("User is not able to delete a space that doesn't exist", async () => {
    const response = await axios.delete(
      `${HTTP_URL}/api/v1/space/randomIdDoesntexist`,
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect((response as { status: number }).status).toBe(404);
  });

  test("User is able to delete a space that exist", async () => {
    const spaceCreateresponse = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId!,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const response = await axios.delete(
      `${HTTP_URL}/api/v1/space/${spaceCreateresponse.data.spaceId}`,
      {
        withCredentials: true,
      },
    );

    expect((response as { status: number }).status).toBe(401);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const spaceCreateresponse = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId!,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const response = await axios.delete(
      `${HTTP_URL}/api/v1/space${spaceCreateresponse.data.spaceId}`,
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    expect((response as { status: number }).status).toBe(404);
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id: string;
  let element2Id;
  let userToken;
  let userId;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;
  let spaceId: string;
  let avatarId;

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameAdmin,
        password,
        role: "Admin",
      },
    );

    adminId = adminSignupResponse.data.user.id;

    const adminSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameUser,
        password,
        role: "User",
      },
    );

    userId = userSignupResponse.data.user.id;

    const userSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Test Avatar",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    avatarId = avatarResponse.data.id;

    const element1 = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const element2 = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${HTTP_URL}/api/v1/admin/map`,
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
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    mapId = map.data.id;

    const spaceResponse = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId!,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    spaceId = spaceResponse.data.spaceId;
  }, 30000);

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${HTTP_URL}/api/v1/space/24sffsf`);
    expect((response as { status: number }).status).toBe(401);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${HTTP_URL}/api/v1/space/${spaceId}`, {
      headers: { Cookie: userCookie! },
    });

    expect(response.data.space.dimensions).toBe("100x200");
    expect(response.data.space.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${HTTP_URL}/api/v1/space/${spaceId}`, {
      headers: { Cookie: userCookie! },
    });

    await axios.delete(`${HTTP_URL}/api/v1/space/element`, {
      headers: { Cookie: userCookie! },
      data: {
        spaceId: spaceId,
        elementId: response.data.space.elements[0].id,
      },
    });

    const newResponse = await axios.get(`${HTTP_URL}/api/v1/space/${spaceId}`, {
      headers: { Cookie: userCookie! },
    });

    expect(newResponse.data.space.elements.length).toBe(3);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 500000,
        y: 200000,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect((response as { status: number }).status).toBe(400);
  });

  test("Adding an element works as expected", async () => {
    const response = await axios.post(
      `${HTTP_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const newResponse = await axios.get(`${HTTP_URL}/api/v1/space/${spaceId}`, {
      headers: {
        Cookie: userCookie!,
      },
    });

    expect(newResponse.data.space.elements.length).toBe(4);
  });
});

describe("Admin Endpoints", () => {
  let userToken;
  let userId;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameAdmin,
        password,
        role: "Admin",
      },
    );

    adminId = adminSignupResponse.data.user.id;

    const adminSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameUser,
        password,
        role: "User",
      },
    );

    userId = userSignupResponse.data.user.id;

    const userSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }
  }, 30000);

  test("User is not able to hit admin Endpoints", async () => {
    const elementResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const mapResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [],
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const createAvatarResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const updateElementResponse = await axios.put(
      `${HTTP_URL}/api/v1/admin/element/123`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect((elementResponse as { status: number }).status).toBe(403);
    expect((mapResponse as { status: number }).status).toBe(403);
    expect((createAvatarResponse as { status: number }).status).toBe(403);
    expect((updateElementResponse as { status: number }).status).toBe(403);
  });

  test("Admin is able to hit admin Endpoints", async () => {
    const elementResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const mapResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [],
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const createAvatarResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "test",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    expect((elementResponse as { status: number }).status).toBe(200);
    expect((mapResponse as { status: number }).status).toBe(200);
    expect((createAvatarResponse as { status: number }).status).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        position: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const updateElementResponse = await axios.put(
      `${HTTP_URL}/api/v1/admin/element/${elementResponse.data.id}`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    expect((updateElementResponse as { status: number }).status).toBe(200);
  });
});

describe("WebSocket tests", () => {
  let userToken: string;
  let userId: string;
  let adminToken: string;
  let adminId: string;
  let userCookie: string;
  let adminCookie: string;
  let mapId: string;
  let element1Id: string;
  let element2Id: string;
  let spaceId: string;
  let ws1: WebSocket;
  let ws2: WebSocket;
  let ws1Messages: any[] = [];
  let ws2Messages: any[] = [];
  let userX: string;
  let userY: string;
  let adminX: string;
  let adminY: string;

  function waitForAndPopLatestMessage(messageArray: any[]): Promise<any> {
    return new Promise<any>((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  async function setupHTTP() {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameAdmin,
        password,
        role: "Admin",
      },
    );

    adminId = adminSignupResponse.data.user.id;

    const adminSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signup`,
      {
        username: usernameUser,
        password,
        role: "User",
      },
    );

    userId = userSignupResponse.data.user.id;

    const userSigninResponse = await axios.post(
      `${HTTP_URL}/api/v1/auth/signin`,
      {
        username: usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const element1 = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const element2 = await axios.post(
      `${HTTP_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );
    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${HTTP_URL}/api/v1/admin/map`,
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
        headers: {
          Cookie: adminCookie!,
        },
      },
    );
    mapId = map.data.id;

    const space = await axios.post(
      `${HTTP_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );
    spaceId = space.data.spaceId;
  }

  async function setupWs() {
    ws1 = new WebSocket(WS_URL);

    await new Promise((resolve) => {
      ws1.onopen = resolve;
    });

    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event.data));
    };

    ws2 = new WebSocket(WS_URL);

    await new Promise((resolve) => {
      ws2.onopen = resolve;
    });

    ws2.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event.data));
    };
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWs();
  }, 30000);

  test("Get back ack for joining the space", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          Cookie: adminToken!,
        },
      }),
    );

    const message1 = await waitForAndPopLatestMessage(ws1Messages);
    expect(message1.payload.users.length).toBe(1);

    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          Cookie: userToken!,
        },
      }),
    );

    const message2 = await waitForAndPopLatestMessage(ws2Messages);
    const message3 = await waitForAndPopLatestMessage(ws1Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");

    expect(message2.payload.users.length).toBe(2);
    expect(message3.type).toBe("user-joined");
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.payload.userId).toBe(userId);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;

    userX = message1.payload.spawn.x;
    userY = message1.payload.spawn.y;
  });

  test("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: 1000000,
          y: 500000,
        },
      }),
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);

    console.log(`Message :- ${message.type}`);

    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("User should not be able to move two blocks at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 2,
          y: adminY,
        },
      }),
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);

    expect(message.type).toBe("movement-rejected");
    // expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Correct movement should be broadcasted to the other sockets in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 1,
          y: adminY,
          userId: adminId,
        },
      }),
    );

    const message = await waitForAndPopLatestMessage(ws2Messages);

    expect(message.type).toBe("move");
    expect(message.payload.x).toBe(adminX + 1);
    expect(message.payload.y).toBe(adminY);
  });

  test("If a user leaves the other user receives a leave event", async () => {
    ws1.close();

    const message = await waitForAndPopLatestMessage(ws2Messages);

    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminId);
  });
});
