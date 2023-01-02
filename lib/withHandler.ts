import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = "GET" | "POST";

interface ConfigType {
  methods: method[];
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<void | NextApiResponse<ResponseType>>;
  isPrivate?: boolean;
}

const withHandler = ({ methods, handler, isPrivate = true }: ConfigType) => {
  // HOF next api가 사용할 handler를 반환해준다.
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      // iron-session 덕에 req.session 사용가능.
      return res.status(401).json({ ok: false, message: "Please Login." });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
};

export default withHandler;
