const sgMail = require('@sendgrid/mail');

const sendGridApiKey = process.env.SENDGRID_API_KEY;


sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'james.yi@sterlingts.com',
    subject: 'Thanks for joining!',
    text: `Hi ${name}! Welcome to the application.`
  })
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'james.yi@sterlingts.com',
    subject: 'Your account has been removed',
    text: `Hi ${name}! Sorry to see you go :(`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}