import sendEmail from "./emails";

const jwt = require("jsonwebtoken");

export const sendVerificationEmail = async (email, user_id, firstName = "",subject="Registration Successful",
     expiresIn = '1h') => {
  // Create email verification link
  const verificationToken = jwt.sign(
    {email, user_id},
    process.env.JWT_SECRET,
    {expiresIn} // Token expires in 1 hour
  );
  const verifyUrl = `/email/verify/${Buffer.from(verificationToken).toString("base64")}`;
  const verificationUrl = `${process.env.FRONT_END}${verifyUrl}`;

  // Construct verification email
  const source = fs.readFileSync("./templates/verifyEmail.mjml", "utf8");
  const htmlOutput = mjml2html(source);
  const template = Handlebars.compile(htmlOutput.html);
  const templateData = {
    firstName,
    url: verificationUrl,
  };

  // Send verification email
  await sendEmail(
    email,
    "",
    process.env.APPLICATION_NAME,
    `${process.env.EMAIL_FROM_NAME} <${process.env.FROM_EMAIL}>`,
    subject,
    "",
    template(templateData)
  );
}

export const sendPasswordForgotEmail = async (user, resetToken, subject="Reset your password" ) => {
  try {
    // Encode the token for URL safety
    const encodedToken = Buffer.from(resetToken).toString("base64");
    const resetUrl = `${process.env.FRONT_END}/reset-password/${encodedToken}`;

    // Construct the password reset email
    const source = fs.readFileSync("./storage/emails/resetPassword.mjml", "utf8");
    const htmlOutput = mjml2html(source);
    const template = Handlebars.compile(htmlOutput.html);
    const templateData = {
      firstName: user.firstName,
      url: resetUrl,
    };

    // Send the password reset email
    await sendEmail(
      user.email,
      "",
      process.env.APPLICATION_NAME,
    `${process.env.EMAIL_FROM_NAME} <${process.env.FROM_EMAIL}>`,
      subject,
      "",
      template(templateData)
    );

    return true; // Indicate success
  } catch (err) {
    console.error("Error sending password reset email:", err);
    throw new Error("Failed to send password reset email.");
  }
};