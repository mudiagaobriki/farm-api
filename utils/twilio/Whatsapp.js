require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SSID; // Your Twilio account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Twilio auth token
const twilioNumber = 'whatsapp:+14155238886'; // Your Twilio WhatsApp number
const client = require('twilio')(accountSid, authToken);

function WhatsAppController(){
    async function sendWhatsAppMessages(req, res) {
        try {
            const { message, numbers} = req?.body ?? {}

            for (const number of numbers) {
                await client.messages.create({
                    body: message,
                    from: twilioNumber,
                    to: number // Use the valid WhatsApp phone number format here
                });
                console.log(`Message sent to ${number}`);
            }
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
        }
    }

    return {
        sendWhatsAppMessages
    }
}


module.exports = WhatsAppController

// // Example usage
// const numbers = ['whatsapp:+2348138885831', 'whatsapp:+2348142627974']; // Array of WhatsApp numbers
// const message = 'Hello from Twilio! This is a test message.'; // Message content
// sendWhatsAppMessages(numbers, message);
