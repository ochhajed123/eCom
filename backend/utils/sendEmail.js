const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // In Case having Issues with Gmail Then use for different services like - yahoo, gmail

    host: process.env.SMPT_HOST, // host:"smtp.gmail.com",
    port: process.env.SMPT_PORT, // port:465
    service: process.env.SMPT_SERVICE, // service: "gmail"
    auth: {
      user: process.env.SMPT_MAIL, // SMPT - simple mail Transport Protocol
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// mailOptions
/**
 * 
 {
  from: 'oshchhajed@gmail.com',
  to: 'oshan1chhajed@gmail.com',
  subject: 'Ecom Website Password Recovery',
  text: 'Your Password Reset Token is :- \n' +
    ' \n' +
    ' http://localhost:4000/api/v1/password/reset/9d963f54ab3690ceecb24628e25dd7c10f8d1990 \n' +
    ' \n' +
    ' If you have not requested This Email then Please Ignore it.'
}
 */
