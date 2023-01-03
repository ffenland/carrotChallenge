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
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withApiSession = (handler: any) => {
  return withIronSessionApiRoute(handler, sessionOptions);
};
