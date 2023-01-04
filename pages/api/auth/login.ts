import { ResponseType } from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@lib/withHandler";
import { withApiSession } from "@lib/withSession";
import db from "@lib/db";
import bcrypt from "bcrypt";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { email: inputEmail, password } = req.body;
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  if (!inputEmail || !regex.test(String(inputEmail)))
    return res.json({ ok: false });
  const user = await db.user.findUnique({ where: { email: inputEmail } });
  if (!user) return res.json({ ok: false, errorMSG: "nouser" });
  const passok = await bcrypt.compare(password, user.password);
  if (!passok) return res.json({ ok: false, errorMSG: "wrongpw" });
  req.session.user = { id: user.id };
  await req.session.save();
  return res.json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
