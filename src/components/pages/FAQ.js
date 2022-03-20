import React, { Component } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Helmet } from 'react-helmet-async';

import 'react-accessible-accordion/dist/fancy-example.css';

export default class FAQ extends Component {
    render() {
        return (
            <div className="wrapper">
                <Helmet>
                    <title>F.A.Q | Prestige Power</title>
                </Helmet>
                <h1 className="s-padding-b">Frequently Asked Questions</h1>
                <Accordion allowZeroExpanded>
                    {questions.map((question, index) => (
                        <AccordionItem key={index}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    {question.title}
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                            {question.body}
                            </AccordionItemPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )
    }
}


const questions = [
    {
        title: "How long does it take to get installed?",
        body: `It takes an average of 7 to 21 days from the day you sign up to the day panels are installed on
        your roof. The actual install is completed in 3 to 6 hours on the same day unless the project is
        unusually large or weather becomes an issue.`,
    },
    {
        title: "Why is my electricity bill needed?",
        body: `Your most recent electric bill is needed to obtain accurate numbers for your property that
        ensure your system is properly designed and built based on your annual kilowatt usage. We
        assess exactly how much power the customer’s household used over the previous 12 months
        and provide a customized proposal for each property.`
    },
    {
        title: "What happens if I decide to move?",
        body: `Every solar system enrolled in the no-cost “Solar as Service” program comes with a full
        transfer guarantee. If you decide to move and sell your home, contact your sales representative
        or one of Sunrun’s service transfer specialists. Homeowners who purchase solar panels have
        the option to sell them with their home or, at the customer’s cost, remove them and reinstall
        them at their new property.`
    },
    {
        title: "How does the referral bonus work?",
        body: `Once you become a Prestige Power customer, we provide a referral bonus for each residential
        or commercial customer that you refer to us and gets installed. The bonus for referral of a
        residential customer is $500. The bonus for referral of a commercial customer is $3,000. All
        bonuses are paid after the referred customer’s installation and will arrive within 2-3 weeks in
        the form of a check.`
    },
    {
        title: "How long does an appointment take?",
        body: `Prestige Power offers both in home and virtual appointments. Both options take only 10 to
        15 minutes to gather information and present your customized proposal. We are
        able to enroll your property on the same day with no payment needed!`
    },
    {
        title: "What if my roof is damaged during installation?",
        body: `Any damage to your property during site survey or installation is fully covered by Sunrun. For
        an extra layer of protection, Sunrun also offers a five-year roof penetration warranty in addition
        to other warranties.`
    },
    {
        title: "Are the solar panels under warranty?",
        body: `Yes, all solar panels come with a 25 year warranty from Sunrun. If a panel or inverter
        malfunctions through no fault of the homeowner, Sunrun will replace it.`
    },
    {
        title: "How can I monitor my solar panels and energy production?",
        body: `Homeowners can download the “mysunrun” app and track their system’s energy production in
        real time. Sunrun also receives updates on system performance every 6 hours. By constantly
        monitoring performance, Sunrun knows if there is a system malfunction and can address it
        immediately.`
    },
]
