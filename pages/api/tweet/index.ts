import { ResponseType } from "@lib/withHandler";
import withHandler from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@lib/db";
import { withApiSession } from "@lib/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === "POST") {
    const {
      session: {
        user: { id },
      },
      body: { tweetText, userId },
    } = req;
    if (id !== userId)
      return res.status(404).json({ ok: false, errorMSG: "User error" });
    const tweet = await db.tweet.create({
      data: { text: tweetText, user: { connect: { id } } },
    });

    res.json({ ok: true, tweetId: tweet.id });
  }
  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      include: { user: { select: { email: true, nickname: true } } },
    });
    return res.json({ ok: true, tweets });
  }
};

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
