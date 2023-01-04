import { ResponseType } from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@lib/withHandler";
import { withApiSession } from "@lib/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  req.session.destroy();
  return res.json({ ok: true });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
