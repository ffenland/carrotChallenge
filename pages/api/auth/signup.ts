import { ResponseType } from "@lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@lib/withHandler";
import client from "@lib/db";

import transporter from "@lib/mailSender";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { email: inputEmail } = req.body;
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  if (!regex.test(String(inputEmail))) return res.status(404);
  let adfa = inputEmail;
  if (!userInfo) return res.json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload: payload,
      user: {
        connectOrCreate: {
          where: { ...userInfo },
          create: {
            nickname: `${Date.now().toString()}guy`,
            ...(phone && { phone }),
            ...(email
              ? { email }
              : { email: `${Date.now().toString()}@datdat.com` }),
            authProvider: "CREDENTIAL",
          },
        },
      },
    },
  });
  if (email) {
    const mailOptions = {
      from: "''FFEN 🥕' <ffenland@gmail.com>",
      to: email,
      subject: "Welcome to carrot market",
      text: `Your token is ${payload}`,
    };
    const mailRes = await transporter.sendMail(mailOptions);
    console.log(mailRes);
  }
  return res.json({ ok: true, token: payload });
};

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
