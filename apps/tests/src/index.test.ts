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
  let userToken;
  let userId: string;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;
  let avatarId = "21";

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameAdmin,
        password,
        role: "admin",
      },
    );

    adminId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameUser,
        password,
        role: "user",
      },
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );
  });

  test("User can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/metadata`,
      {
        avatarId: "123455",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

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
          Cookie: userCookie!,
        },
      },
    );
    expect(response.data.statusCode).toBe(200);
  });

  test("User can't update their metadata without token", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );
    expect(response.data.statusCode).toBe(403);
  });
});

describe("User avatar information", () => {
  let userToken;
  let userId: string;
  let adminToken;
  let adminId;
  let userCookie;
  let adminCookie;

  let avatarId = "21";

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameAdmin,
        password,
        role: "admin",
      },
    );

    adminId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameUser,
        password,
        role: "user",
      },
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`,
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
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`, {
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
  let mapId;
  let element1Id;
  let element2Id;
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
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameAdmin,
        password,
        role: "admin",
      },
    );

    adminId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameUser,
        password,
        role: "user",
      },
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
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
        headers: {
          Cookie: adminCookie!,
        },
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
        headers: {
          Cookie: adminCookie!,
        },
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
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    mapId = map.data.mapId;
  });

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100*200",
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
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100*200",
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
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect(response.data.statusCode).toBe(400);
  });

  test("User is not able to delete a space that doesn't exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoesntexist`,
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect(response.data.statusCode).toBe(400);
  });

  test("User is able to delete a space that exist", async () => {
    const spaceCreateresponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100*200",
        mapId: mapId!,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${spaceCreateresponse.data.spaceId}`,
      {
        withCredentials: true,
      },
    );

    expect(response.data.statusCode).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const spaceCreateresponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100*200",
        mapId: mapId!,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space${spaceCreateresponse.data.spaceId}`,
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    expect(response.data.statusCode).toBe(400);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has no spaces initially", async () => {
    const spaceCreateResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space/all`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        Cookie: adminCookie!,
      },
    });
    const filteredSpace = response.data.spaces.find(
      //@ts-ignore
      (x) => x.id == spaceCreateResponse.spaceId,
    );
    expect(response.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
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

  beforeAll(async () => {
    const usernameAdmin = `fazil-admin-${Math.random()}`;
    const usernameUser = `fazil-user-${Math.random()}`;
    const password = `123456`;

    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameAdmin,
        password,
        role: "admin",
      },
    );

    adminId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameUser,
        password,
        role: "user",
      },
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
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
        headers: {
          Cookie: adminCookie!,
        },
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
        headers: {
          Cookie: adminCookie!,
        },
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
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    mapId = map.data.mapId;

    const space = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
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
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/24sffsf`);
    expect(response.data.statusCode).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: { Cookie: userCookie! },
    });
    expect(response.data.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: { Cookie: userCookie! },
    });

    await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      headers: { Cookie: userCookie! },
      data: {
        spaceId: spaceId,
        elementId: response.data.elements[0].id,
      },
    });

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      { headers: { Cookie: userCookie! } },
    );

    expect(newResponse.data.elements.length).toBe(2);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50000,
        y: 20000,
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    expect(response.data.statusCode).toBe(400);
  });

  test("Adding an element works as expected", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
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

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
    );
    expect(newResponse.data.elements.length).toBe(3);
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
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameAdmin,
        password,
        role: "admin",
      },
    );

    adminId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameAdmin,
        password,
      },
    );

    const setCookieHeader = adminSigninResponse.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      adminCookie = setCookieHeader[0]!;
      adminToken = adminCookie.split(";")[0]?.split("=")[1]!;
    }

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        usernameUser,
        password,
        role: "user",
      },
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        usernameUser,
        password,
      },
    );

    const setCookieHeader2 = userSigninResponse.headers["set-cookie"];

    if (setCookieHeader2 && setCookieHeader2.length > 0) {
      userCookie = setCookieHeader2[0]!;
      userToken = userCookie.split(";")[0]?.split("=")[1]!;
    }
  });

  test("User is not able to hit admin Endpoints", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Cookie: userCookie!,
        },
      },
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
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
      `${BACKEND_URL}/api/v1/admin/avatar`,
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
      `${BACKEND_URL}/api/v1/admin/element/123`,
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

    expect(elementResponse.data.statusCode).toBe(403);
    expect(mapResponse.data.statusCode).toBe(403);
    expect(createAvatarResponse.data.statusCode).toBe(403);
    expect(updateElementResponse.data.statusCode).toBe(403);
  });

  test("Admin is able to hit admin Endpoints", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
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

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
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
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          Cookie: adminCookie!,
        },
      },
    );

    expect(elementResponse.data.statusCode).toBe(200);
    expect(mapResponse.data.statusCode).toBe(200);
    expect(createAvatarResponse.data.statusCode).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
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

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
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

    expect(updateElementResponse.data.statusCode).toBe(200)
  });
});
