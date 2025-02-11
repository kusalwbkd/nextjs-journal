import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const faqs = [
    {
        "q": "Is my journal data secure?",
        "a": "Yes! We use enterprise-grade encryption and security measures to ensure your entries remain private and secure."
    },
    {
        "q": "Can I organize my journal entries?",
        "a": "Yes! Use folders, collections, and tags to keep your entries structured. You can also filter by date, mood, or collection."
    },
    {
        "q": "How does the mood tracking work?",
        "a": "Each entry can be tagged with a mood, and our analytics tool creates visual representations of your emotional journey over time."
    },
    {
        "q": "Is there a mobile app?",
        "a": "Our platform is fully responsive and works beautifully on all devices. A dedicated mobile app is coming soon!"
    }
]

const Faq = () => {
    return (
        <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full mx-auto">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-orange-900 text-lg">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-orange-700">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Faq