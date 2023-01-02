import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id: string;
    };
  }
}
const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.SESSION_PASSWORD!,
};

export const withApiSession = (handler: any) => {
  return withIronSessionApiRoute(handler, cookieOptions);
};
