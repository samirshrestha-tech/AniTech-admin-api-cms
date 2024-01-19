import nodemailer from "nodemailer";
// create a config i.e smtp config for transporting the mail with nodemailer

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// we need to have a email body to send the mail

const emailSender = async (obj) => {
  try {
    const info = await transporter.sendMail(obj);

    console.log(info.messageId);
  } catch (error) {
    console.log(error);
  }
};

// we need to send the emai with our dynamic mail.

export const sendEmailVerification = ({ email, fName, url }) => {
  const body = {
    from: `Ani Tech <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: `Please follow the link to verify your account.`, // Subject line
    text: `Hello ${fName}, please follow the link to verify your account ${url}\n\n Regards, Ani Tech`, // plain text body
    html: `<p>Hello, ${fName}</p>

<br />
<br/>

<p>Thank you for creating an account with us. Please follow the link to verify your account.</p>

<p>
    <a href="${url}">
        <button style="background:green;padding:2rem;color:white;font-weight:bolder">Verify</button>
    </a>
</p>

<br />

<p>
If the above button doesn't work, copy paste the following url and follow the steps there.
${url}

</p>

<p>Regards,
    <br />

    Ani Tech
    <br />
    www.AniTech.com
</p>
    
    `, // html body
  };

  emailSender(body);
};
