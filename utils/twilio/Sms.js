require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SSID; // Your Twilio account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Twilio auth token
const twilioNumber = '+15162520183'; // Your Twilio WhatsApp number
const client = require('twilio')(accountSid, authToken);

const recipientNumbers = ['+2348138885831'];

recipientNumbers.forEach(recipient => {
    client.messages
        .create({
            body: 'Hello from Twilio!',
            from:twilioNumber,
            to: recipient
        })
        .then(message => {
            console.log({message})
            console.log(`Message sent to ${recipient}: ${message.sid}`)
        })
        .catch(error => console.error(`Error sending message to ${recipient}: ${error}`));
});
