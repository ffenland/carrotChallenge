import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id: string;
    };
  }
}
export const sessionOptions = {
  cookieName: "carrotsession",
  password: process.env.SESSION_PASSWORD
    ? process.env.SESSION_PASSWORD
    : "koKB0vfkzoh4ZxucV1CV5DGeQ3ZRW6KUx",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withApiSession = (handler: any) => {
  return withIronSessionApiRoute(handler, sessionOptions);
};
