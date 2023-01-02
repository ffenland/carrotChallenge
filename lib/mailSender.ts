import mailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
const transporter = mailer.createTransport({
  service: "google",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_GOOGLE_USER,
    pass: process.env.NODEMAILER_GOOGLE_PASS,
  },
});

export default transporter;

// const wrapedSendMail = async (mailOptions: {
//   to: string;
//   subject: string;
//   text: string;
// }) => {
//   return new Promise((resolve, reject) => {
//     sendMailer.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log("error is " + error);
//         resolve(false); // or use rejcet(false) but then you will have to handle errors
//       } else {
//         console.log("Email sent: " + info.response);
//         resolve(true);
//       }
//     });
//   });
// };

// export default wrapedSendMail;
