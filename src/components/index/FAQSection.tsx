
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How does the creator verification process work?",
      answer: "We verify all creators through a comprehensive process that includes identity verification, audience authenticity checks, and content quality review. This ensures brands work with genuine, high-quality creators."
    },
    {
      question: "What platforms do you support?",
      answer: "We support all major social media platforms including Instagram, TikTok, YouTube, Twitter, LinkedIn, and emerging platforms. Our creators can manage campaigns across multiple platforms simultaneously."
    },
    {
      question: "How are payments processed?",
      answer: "Payments are processed securely through our platform with milestone-based releases. Brands deposit funds in escrow, and creators receive payments automatically upon deliverable approval. We charge a 25% platform fee."
    },
    {
      question: "Can I manage multiple campaigns at once?",
      answer: "Yes, our platform is designed for scalability. Brands can manage multiple campaigns simultaneously with our campaign management tools, automated workflows, and team collaboration features."
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "We provide comprehensive analytics including engagement rates, reach, impressions, click-through rates, conversion tracking, audience demographics, and ROI calculations across all platforms."
    },
    {
      question: "Is there a minimum budget requirement?",
      answer: "No, we welcome campaigns of all sizes. Whether you're a startup or enterprise brand, our platform scales to meet your needs and budget requirements."
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about our platform
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-gray-800 rounded-lg px-6 bg-gray-900/30"
            >
              <AccordionTrigger className="text-left text-white hover:text-gray-300">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
