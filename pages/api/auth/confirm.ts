import { ResponseType } from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@lib/withHandler";
import client from "@lib/db";
import { withApiSession } from "@lib/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { token, email, nickname } = req.body;
  const foundToken = await client.token.findUnique({
    where: { payload: token },
    include: { user: { select: { email: true, nickname: true } } },
  });

  if (!foundToken) return res.status(404).end();
  // 토큰은 일치하나, email이 일치하지 않은 경우. (남의 토큰을 입력한 경우!)
  if (email && email !== foundToken?.user.email) return res.status(404).end();
  req.session.user = { id: foundToken?.userId };
  await req.session.save();
  await client.token.deleteMany({
    where: { userId: foundToken.userId },
  });
  await client.user.update({
    where: { id: foundToken.userId },
    data: { emailVerified: true },
  });
  return res.json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
