

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { InterestRegistrationModal } from "./InterestRegistrationModal";

const brandFAQs = [
  {
    question: "How fast can I launch a campaign?",
    answer: "Under 24 hours. Brief today, go live tomorrow. No delays. No back and forth."
  },
  {
    question: "Can I choose the creators I work with?",
    answer: "Yes. You approve. We activate."
  },
  {
    question: "What kind of creators are available?",
    answer: "Only proven performers. Every creator is vetted for niche, engagement, and conversion."
  },
  {
    question: "Do I need to negotiate anything?",
    answer: "No. You stay focused on outcomes."
  },
  {
    question: "Can I request specific deliverables or niches?",
    answer: "Absolutely. The more specific your brief, the better we match. This platform is built for precision."
  },
  {
    question: "Is this a marketplace or an agency?",
    answer: "Neither. You plug in. We deliver creators, content, and conversions without the agency lag."
  },
  {
    question: "Do I get performance data?",
    answer: "Yes. You get full visibility delivery, reach, clicks, conversions."
  }
];

const creatorFAQs = [
  {
    question: "How do I get brand deals?",
    answer: "If your profile fits the brief, you'll be sent the deals. Approve, or Deny."
  },
  {
    question: "How fast can I land a deal?",
    answer: "Fast. Some creators close within hours of joining. As soon as you're vetted and live, you're eligible."
  },
  {
    question: "Do I have to negotiate with brands?",
    answer: "Never. You won't see a single \"Hey, what's your rate?\" DM. We handle the brand side. You just deliver."
  },
  {
    question: "How do I get paid?",
    answer: "Fast. Once you've completed the campaign, funds are released directly to you."
  },
  {
    question: "Can I say no to a campaign?",
    answer: "Always. You're in control. If it doesn't fit your brand, skip it."
  },
  {
    question: "What makes a creator \"high-performing\" on this platform?",
    answer: "We look at engagement, niche clarity, audience trust, and your ability to drive action."
  }
];

export const FAQSection = () => {
  const [activeTab, setActiveTab] = useState<'brands' | 'creators'>('brands');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const currentFAQs = activeTab === 'brands' ? brandFAQs : creatorFAQs;

  return (
    <>
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-center">
              Your Questions <span className="italic text-gray-400">Answered</span>
            </h2>
            <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-8">
              Get answers to the most common questions from brands and creators about our partnership platform.
            </p>

            {/* Tab Switcher */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                onClick={() => setActiveTab('brands')}
                variant={activeTab === 'brands' ? 'default' : 'ghost'}
                className={`px-6 py-2 rounded-full ${
                  activeTab === 'brands' 
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Brands
              </Button>
              <Button
                onClick={() => setActiveTab('creators')}
                variant={activeTab === 'creators' ? 'default' : 'ghost'}
                className={`px-6 py-2 rounded-full ${
                  activeTab === 'creators' 
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Creators
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {currentFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-none">
                  <Card className="bg-gray-900/50 border-gray-800 mb-4 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline group">
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-lg font-medium text-white text-left group-hover:text-gray-300 transition-colors">
                          {faq.question}
                        </h3>
                        <div className="ml-4 flex-shrink-0">
                          <Plus className="h-5 w-5 text-gray-400 group-data-[state=open]:hidden" />
                          <X className="h-5 w-5 text-gray-400 group-data-[state=closed]:hidden" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      <InterestRegistrationModal 
        open={showRegistrationModal} 
        onOpenChange={setShowRegistrationModal} 
      />
    </>
  );
};

