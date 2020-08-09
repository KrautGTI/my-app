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

export const onReferralCreated = functions.firestore.document('referrals/{referralId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Referral create heard! Starting inner...")
    const newValue = snap.data();
    try {
        console.log("Started try{}...")

        // Template it
        const htmlEmail = 
        `
        <div>
            <h2>New <u>Prestige Power</u> Website Referral</h2>
            <p>
                A new client referral has been added! Check the admin panel to view all referrals, but here is the referral details:
            </p>
            <h3>Referee Details:</h3>
            <p><u>First Name</u>: ${newValue.referee.firstName}</p>
            <p><u>Last Name</u>: ${newValue.referee.lastName}</p>
            <p><u>Email</u>: ${newValue.referee.email}</p>
            <p><u>Phone</u>: ${newValue.referee.phone}</p>
            <hr/>
            <h3>Referee Details:</h3>
            <p><u>First Name</u>: ${newValue.referee.firstName}</p>
            <p><u>Last Name</u>: ${newValue.referee.lastName}</p>
            <p><u>Email</u>: ${newValue.referee.email}</p>
            <p><u>Phone</u>: ${newValue.referee.phone}</p>
            <br/>
            <p><u>Relation</u>: ${newValue.relation}</p>
            <p><u>Sales Rep</u>: ${newValue.salesRep}</p>
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
            replyTo: `${newValue.referee.email}`,
            subject: `New Prestige Power referral`,
            text: `A new client referral has been added with the email of ${newValue.referee.email}.`,
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

export const onClientCreated = functions.firestore.document('clients/{clientId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Client create heard! Starting inner...")
    const newValue = snap.data();
    try {
        console.log("Started try{}...")

        // Template it
        const htmlEmail = 
        `
        <div>
            <h2>New <u>Prestige Power</u> Website client Sign Up</h2>
            <p>
                A new client has signed up! Check the admin panel to view all clients, but here is the client details:
            </p>
            <h3>Client Details:</h3>
            <p><u>First Name</u>: ${newValue.firstName}</p>
            <p><u>Last Name</u>: ${newValue.lastName}</p>
            <p><u>Email</u>: ${newValue.email}</p>
            <p><u>Phone</u>: ${newValue.phone}</p>
            <p><u>Business</u>: ${newValue.business}</p>
            <p><u>Solar reasons</u>: ${newValue.solarReasons}</p>
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
            subject: `New Prestige Power client sign up`,
            text: `A new client sign up with the email of ${newValue.email}.`,
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

  export const onBuildingCreated = functions.firestore.document('clients/{clientId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Building create heard! Starting inner...")
    const newValue = snap.data();
    try {
        console.log("Started try{}...")

        // Template it
        const htmlEmail = 
        `
        <div>
            <h2>New <u>Prestige Power</u> Website building add</h2>
            <p>
                A new building was added! You can always check the admin panel to view the building details, but here are the details:
            </p>
            <h3>Building Details:</h3>
            <p><u>User ID of client</u>: ${newValue.clientId}</p>
            <p><u>ZIP</u>: ${newValue.lastName}</p>
            <p><u>Building name</u>: ${newValue.buildingName}</p>
            <p><u>Average bill</u>: ${newValue.averageBill}</p>
            <p><u>Shaded</u>: ${newValue.shaded}</p>
            <p><u>Bill provided?</u>: ${newValue.billUrl ? "Yes" : "No"}</p>
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
            replyTo: `drcj.dev@gmail.com`,
            subject: `New Prestige Power building add`,
            text: `A new building added for the client with ID of ${newValue.clientId}.`,
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