import { ResponseType } from "@lib/withHandler";
import withHandler from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@lib/db";
import { withApiSession } from "@lib/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const tweetId = req.query.id;
  const user = req.session.user;
  const tweet = await db.tweet.findUnique({
    where: { id: tweetId.toString() },
    include: {
      user: { select: { email: true, nickname: true } },
      likes: { select: { id: true } },
    },
  });
  const isLiked = Boolean(
    await db.like.findFirst({
      where: { tweetId: tweetId.toString(), userId: user.id },
      select: { id: true },
    })
  );
  return res.json({ ok: true, tweet, isLiked });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
