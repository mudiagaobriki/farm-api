const Message = require('../models/Message')
const Room = require("../models/Room");
const Sms = require("../utils/bulksmsng/Sms");
const {readFileSync} = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");

function MessageController(){
    const newMessage = async (req,res) => {
        const {from,recipients,body,type ="sms",subject="Notification Email"} = req.body;

        // validate the messages
        if (!(from && recipients && body)){
            return res.status(400).send("Sender, recipients and message body are required.")
        }

        try {
            if (type === "sms"){
                const smsInstance = Sms();
                let sentMessage = await smsInstance.sendSMS(from,recipients,body)

                if (sentMessage?.status){
                    const message = await Message.create({
                        type,
                        from,
                        recipients,
                        body,
                        status: sentMessage?.status
                    })

                    if (message){
                        return res.status(201).json('Message created successfully')
                    }
                    else{
                        return res.status(400).json('Error in creating message')
                    }
                }

                else{
                    return res.status(400).json("Error in sending message")
                }
            }
            else if (type === "email"){
                // construct email
                const source = readFileSync("./storage/emails/normalEmail.mjml", "utf8");
                const htmlOutput = mjml2html(source);
                const template = Handlebars.compile(htmlOutput.html);
                const templateData = {
                    content: body
                };

                console.log({recipients})
                recipients?.forEach(recipient => {
                    // send email
                    sendEmail(recipient, "", "City Crown Hotels", "City Crown Hotels <noreply@citycrownhotels.ng>",
                        subject, "", template(templateData))
                })

            }
        }
        catch (e) {
            console.log({e})
            return res.status(500).json(`Error: ${e?.toString()}`)
        }

    }

    const editMessage = async (req,res) => {
        try{
            const {name, payload} = req.body

            const message = await Message.findOneAndUpdate({name}, payload, {new: true})

            if (!message){
                return res.status(404).send('Message not found')
            }

            res.send({
                status: "success",
                message: 'Message edited successfully',
                data: message
            })

        }
        catch (err){
            return res.status(500).json({
                status: 'error',
                message: err?.toString()
            })
        }
    }

    const allMessages = async (req, res) => {
        try {
            const page = req.params?.page;
            const perPage = req.params?.perPage;
            const q = req.query?.q;

            const options = {
                page: page,
                limit: perPage,
                sort: {createdAt: -1}
            }

            const query = {
                message: q
            }

            if (q && q.length) {
                const Messages = await Message.paginate(query, options);

                if (Messages){
                    return res.send({
                        status: "success",
                        data: Messages
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Messages with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const Messages = await Message.paginate({}, options);

                if (Messages){
                    return res.send({
                        status: "success",
                        data: Messages
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Messages failed'
                    })
                }


            }
        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }

    const selectMessage  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const message = await Message.find({_id: id});

            // console.log({accountNumber})

            if (!message){
                return res.send({
                    status: 'error',
                    data: 'No room with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: message
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                status: 'error',
                error: err
            })
        }
    }

    return {
        newMessage,
        editMessage,
        allMessages,
        selectMessage,
    }

}

module.exports = MessageController