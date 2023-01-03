import { ResponseType } from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@lib/withHandler";
import db from "@lib/db";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { email: inputEmail, nickname } = req.body;
  console.log("InputEmail", inputEmail);
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  if (!inputEmail || !regex.test(String(inputEmail)))
    return res.json({ ok: false });
  const exists = await db.user.findMany({
    where: { OR: [{ email: inputEmail }, { nickname: nickname }] },
  });
  console.log(exists.length);
  if (exists.length === 0) {
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    await db.token.create({
      data: {
        payload: payload,
        user: {
          connectOrCreate: {
            where: { email: inputEmail },
            create: {
              nickname,
              email: inputEmail,
            },
          },
        },
      },
    });
    return res.json({ ok: true, payload });
  } else {
    return res.json({
      ok: false,
      message: "Email or nickname already exists.",
    });
  }
};

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
