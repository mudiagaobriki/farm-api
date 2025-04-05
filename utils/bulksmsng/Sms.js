const axios = require("axios");
require("dotenv").config();
const apiKey = process.env.BULKSMSNG_API_KEY; // API key for Bulk SMS Nigeria
const apiUrl = 'https://www.bulksmsnigeria.com/api/v1/sms/create';

function Sms(){
    async function sendSMS(from, to, body){
        const data = {
            api_token: apiKey,
            from: from,
            to: to,
            body: body,
            dnd: 2
        };

        try{
            const posted = await axios.post(apiUrl, data)

            if (posted){
                console.log("Data: ", posted?.data)
                return {
                    statusCode: 200, // represents success
                    status: "success",
                    data: posted?.data
                }
                // setTimeout(() => {return res.status(201).json({
                //     status: "success",
                // })}, 5000)

            }
        }
        catch (e) {
            return {
                statusCode: 400, // represents error
                status: "failed",
                message: `Error in sending SMS: ${e?.toString()}`
            }
            // return res.status(400).send(`Error in sending SMS: ${e?.toString()}`)
        }
    }

    return {
        sendSMS
    }
}

module.exports = Sms