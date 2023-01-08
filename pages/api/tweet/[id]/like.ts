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
    query: { id: tweetId },
    session: { user },
  } = req;

  const alreadyExists = await db.like.findFirst({
    where: { tweetId: tweetId?.toString(), userId: user?.id },
  });
  if (alreadyExists) {
    // delete
    await db.like.delete({ where: { id: alreadyExists.id } });
  } else {
    // create
    await db.like.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: tweetId?.toString(),
          },
        },
      },
    });
  }

  return res.json({ ok: true });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
