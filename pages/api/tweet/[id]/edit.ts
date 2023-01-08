import { ResponseType } from "@lib/withHandler";
import withHandler from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@lib/db";
import { withApiSession } from "@lib/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    session: {
      user: { id },
    },
    body: { tweetText, userId },
    query: { id: tweetId },
  } = req;
  if (id !== userId)
    return res.status(404).json({ ok: false, errorMSG: "User error" });
  await db.tweet.update({
    where: { id: tweetId.toString() },
    data: { text: tweetText },
  });

  res.json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
