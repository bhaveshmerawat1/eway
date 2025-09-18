import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "replace_with_env_secret";
const TOKEN_NAME = "app_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET) as any;

export function setTokenCookie(res: NextApiResponse, token: string) {
  // httpOnly cookie
  res.setHeader("Set-Cookie", `${TOKEN_NAME}=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_MAX_AGE}; SameSite=Lax;`);
}

export function removeTokenCookie(res: NextApiResponse) {
  res.setHeader("Set-Cookie", `app_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`);
}
