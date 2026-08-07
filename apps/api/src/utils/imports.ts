export const PORT = process.env.PORT!
export const JWT_SECRET = process.env.JWT_SECRET!
export const COOKIE_SECURE = process.env.NODE_ENV === "production"
export const COOKIE_SAMESITE = process.env.NODE_ENV === "production" ? "none" : "lax" 