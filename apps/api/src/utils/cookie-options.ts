import { CookieOptions } from "express";
import { COOKIE_SAMESITE, COOKIE_SECURE } from "./imports.js";

const cookieAge = 7 * 24 * 60 * 60 * 1000;

export const CookieOption: CookieOptions = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAMESITE,
  maxAge: cookieAge,
  path: "/",
};
