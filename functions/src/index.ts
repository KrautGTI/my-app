"use strict";
import functions = require('firebase-functions');
import admin = require("firebase-admin");
import nodemailer = require('nodemailer');
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Change, EventContext } from 'firebase-functions';
import { Status } from './common';

admin.initializeApp(functions.config().firebase);

export const onMessageCreated = functions.firestore.document('messages/{messageId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Message create heard! Starting inner...")
    const newValue = snap.data();
    // Increment stat for all referrals on system
    admin.firestore().collection("other").doc("stats").set({
        messagesTotal: admin.firestore.FieldValue.increment(1)
    }, { merge: true }).then(function() {
        console.log("Total messages successfully increment!");
    }).catch(function(error) {
        console.error("Error incrementing Total messages: ", error);
    });
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
            to: 'info@goprestigepower.com, drcj.dev@gmail.com',
            replyTo: `${newValue.email}`,
            subject: `New Prestige Power contact from ${newValue.name}`,
            text: newValue.message,
            html: htmlEmail
        }

        // Send it
        return transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(error)
        return;
    }
  });

export const onReferralCreated = functions.firestore.document('referrals/{referralId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Referral create heard! Starting inner...")
    const newValue = snap.data();
    // Increment stat for all referrals on system
    admin.firestore().collection("other").doc("stats").set({
        referralsTotal: admin.firestore.FieldValue.increment(1)
    }, { merge: true }).then(function() {
        console.log("Total referrals successfully increment!");
    }).catch(function(error) {
        console.error("Error incrementing Total referrals: ", error);
    });

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
            to: 'info@goprestigepower.com, drcj.dev@gmail.com',
            replyTo: `${newValue.referee.email}`,
            subject: `New Prestige Power referral`,
            text: `A new client referral has been added with the email of ${newValue.referee.email}.`,
            html: htmlEmail
        }

        // Send it
        return transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(error)
        return;
    }
  });

export const onUserCreated = functions.firestore.document('users/{userId}')
  .onCreate(async (snap: { data: () => any; }) => {
    console.log("Client create heard! Starting inner...")
    const newValue = snap.data();

    // Increment stat for all users on system
    admin.firestore().collection("other").doc("stats").set({
        usersTotal: admin.firestore.FieldValue.increment(1)
    }, { merge: true }).then(() => {
        console.log("Total users successfully increment!");
    }).catch((error) => {
        console.error("Error incrementing Total users: ", error);
    });

    try {
        console.log("Started try{}...")

        // Template it
        const htmlEmail = 
        `
        <div>
            <h2>New <u>Prestige Power</u> Website client Sign Up</h2>
            <p>
                A new user has signed up! Check the admin panel to view all clients, but here is the user's details:
            </p>
            <h3>Details:</h3>
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
            to: 'info@goprestigepower.com, drcj.dev@gmail.com',
            replyTo: `${newValue.email}`,
            subject: `New Prestige Power user sign up`,
            text: `A new user sign up with the email of ${newValue.email}.`,
            html: htmlEmail
        }

        // Send it
        return transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(error)
        return;
    }
  });

  export const onUserUpdated = functions.firestore.document('users/{userId}')
    .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
        console.log("Client update heard!")
        const previousValue = change.before.data();
        const newValue = change.after.data();

        // do nothing if no data is present
        if (newValue === null || previousValue === null  || newValue === undefined || previousValue === undefined) {
            console.error("Some initial values are not set!")
            return;
        }

        if (newValue.assignedTo.userId && previousValue.assignedTo.userId !== newValue.assignedTo.userId) {
            console.log("Assigned to has been updated, sending email to admin...")
            // Grab admin email
            admin.firestore().collection("users").doc(newValue.assignedTo.userId).get().then(async (doc) => {
                if (doc.exists) {
                    // Template it
                    const htmlEmail = 
                    `
                    <div>
                        <h2>Assigned <u>Prestige Power</u> client</h2>
                        <p>
                            You have been assigned to a client on Prestige Power. Visit the <a href="https://www.goprestigepower.com/admin-panel">Admin Panel</a> to view your assigned clients.
                        </p>
                        <h3>Newly Assigned Client Details:</h3>
                        <p><u>User ID</u>: ${context.params.userId}</p>
                        <p><u>First name</u>: ${newValue.firstName}</p>
                        <p><u>Last name</u>: ${newValue.lastName}</p>
                        <p><u>Email</u>: ${newValue.email}</p>
                        <p><u>Phone</u>: ${newValue.phone}</p>
                        <p><u>Business</u>: ${newValue.name}</p>
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
                        to: doc.data()?.email,
                        replyTo: `drcj.dev@gmail.com`,
                        subject: `Assigned Prestige Power client`,
                        text: `You've been assigned a Prestige Power client with the ID of ${newValue.clientId} and name of ${newValue.firstName} ${newValue.lastName}. Go to the admin panel at www.goprestigepower.com to view the details.`,
                        html: htmlEmail
                    }

                    // Send it
                    return transporter.sendMail(mailOptions)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such user document!");
                    return;
                }
            }).catch((error) => {
                console.error("Error grabbing user document: " + error)
                return;
            })
        }

  });

  export const onBuildingCreated = functions.firestore.document('buildings/{buildingId}')
    .onCreate(async (snap: { data: () => any; }) => {
        console.log("Building create heard! Starting inner...")
        const newValue = snap.data();

        // Increment stat for all buildings on system
        admin.firestore().collection("other").doc("stats").set({
            buildingsTotal: admin.firestore.FieldValue.increment(1)
        }, { merge: true }).then(function() {
            console.log("Total buildings successfully increment!");
        }).catch(function(error) {
            console.error("Error incrementing Total buildings: ", error);
        });

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
                <p><u>ZIP</u>: ${newValue.zip}</p>
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
                to: 'info@goprestigepower.com, drcj.dev@gmail.com',
                replyTo: `drcj.dev@gmail.com`,
                subject: `New Prestige Power building add`,
                text: `A new building added for the client with ID of ${newValue.clientId}.`,
                html: htmlEmail
            }

            // Send it
            return transporter.sendMail(mailOptions)
        } catch (error) {
            console.error(error)
            return;
        }
  });

  export const onBuildingUpdated = functions.firestore.document('buildings/{buildingId}')
    .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
        console.log("Building update heard!")
        const previousValue = change.before.data();
        const newValue = change.after.data();

        // do nothing if no data is present
        if (newValue === null || previousValue === null  || newValue === undefined || previousValue === undefined) {
            console.error("Some initial values are not set!")
            return;
        }

        if (previousValue.status === Status.PENDING && newValue.status === Status.READY) {
            const buildingName = newValue.buildingName ? newValue.buildingName : `Building ${newValue.zip} `
            // Grab client email
            admin.firestore().collection("users").doc(newValue.clientId).get().then(async (doc) => {
                if (doc.exists) {
                    // Template it
                    const htmlEmail = 
                    `
                    <div>
                        <h2>Your <u>Prestige Power</u> solar proposal is ready to view!</h2>
                        <p>
                            We have reviewed your proposal for solar at your building ${buildingName} you submitted and the results are ready for you to view. Click below to view!
                        </p>
                        <a href="${newValue.proposalUrl}" target="_blank"><button>View proposal</button></a>
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
                        to: doc.data()?.email,
                        replyTo: `drcj.dev@gmail.com`,
                        subject: `Prestige Power proposal ready`,
                        text: `Your <u>Prestige Power</u> solar proposal is ready to view.`,
                        html: htmlEmail
                    }

                    // Send it
                    return transporter.sendMail(mailOptions)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such user document!");
                    return;
                }
            }).catch((error) => {
                console.error("Error grabbing user document: " + error)
                return;
            })
        }
});