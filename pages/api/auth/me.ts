import { ResponseType } from "@lib/withHandler";
import withHandler from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@lib/db";
import { withApiSession } from "@lib/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { user } = req.session;
  const profile = await client.user.findUnique({
    where: { id: user?.id },
  });

  return res.json({ ok: true, profile });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
