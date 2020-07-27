"use strict";
import functions = require('firebase-functions');
import admin = require("firebase-admin");
import nodemailer = require('nodemailer');
admin.initializeApp(functions.config().firebase);

export const onMessageCreated = functions.firestore.document('messages/{messageId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Message create heard! Starting inner...")
    const newValue = snap.data();
    try {
        console.log("Started try{}...")

        // Template it
        const htmlEmail = 
        `
        <div>
            <h2>New <u>Prestige Power</u> Website Contact</h2>
            <p>
                A new contact message has arrived! You can directly reply to this email to 
                contact the visitor back on their question or inquiry if need be. Their information and message is detailed below.
            </p>
            <h3>Details:</h3>
            <p><u>Name</u>: ${newValue.name}</p>
            <p><u>Email</u>: ${newValue.email}</p>
            <h3>Message:</h3>
            <p>${newValue.message}</p>
        </div>
        `
        // Config it
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: functions.config().email.user,
                pass: functions.config().email.password
            }
        })
        console.log("transporter = " + transporter)

        // Pack it
        const mailOptions = {
            from: `drcj.dev@gmail.com`,
            to: 'douglasrcjames@gmail.com, drcj.dev@gmail.com',
            replyTo: `${newValue.email}`,
            subject: `New Prestige Power contact from ${newValue.name}`,
            text: newValue.message,
            html: htmlEmail
        }

        // Send it
        transporter.sendMail(mailOptions, (err: any) => {
            if(err) {
                console.error(err);
            } else {
                console.log("Successfully sent mail with sendMail()!");
            }
        })
    } catch (error) {
        console.error(error)
    }
  });
