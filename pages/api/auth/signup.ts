import { ResponseType } from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@lib/withHandler";
import db from "@lib/db";
import bcrypt from "bcrypt";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { email: inputEmail, nickname, password } = req.body;

  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  if (!inputEmail || !regex.test(String(inputEmail)))
    return res.json({ ok: false });
  const exists = await db.user.findMany({
    where: { OR: [{ email: inputEmail }, { nickname: nickname }] },
  });
  if (exists.length === 0) {
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    console.log("1st", password, typeof password);
    const hashedPW = await bcrypt.hash(password, 3);
    await db.token.create({
      data: {
        payload: payload,
        user: {
          connectOrCreate: {
            where: { email: inputEmail },
            create: {
              nickname,
              email: inputEmail,
              password: hashedPW,
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
