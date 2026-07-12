import { useState } from "react";
import faqImage from "../../assets/frontend_assets/FAQs.png";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Decorya?",
    answer:
      "Decorya is your one-stop online store for beautiful and affordable home decoration items — from wall décor and lighting to festive accessories and modern room accents.",
  },
  //   {
  //     question: "Do you ship across India?",
  //     answer: "Yes, Decorya delivers all over India.",
  //   },

  {
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 7–10 business days. Bulk orders might take a little longer, but we’ll keep you updated at every step.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Currently, we do not have a standard return policy. However, if you face an issue with your product, you can contact us within 3 days of delivery. Our team will verify the case, and if found valid, we may offer a replacement or suitable resolution.",
  },
  {
    question: "Are there any discounts or offers?",
    answer:
      "We frequently run festive sales, combo offers, and first-order discounts. Follow our Instagram and Facebook pages to stay updated!",
  },
  {
    question: "How can I contact Decorya’s support team?",
    answer: `You can reach us via the “Contact Us” page, email us at ${
      import.meta.env.VITE_EMAIL_ID
    }, or message us directly on our social media handles.`,
  },
  {
    question: "Do you take bulk decoration orders?",
    answer:
      "Yes, we do! For bulk or event decoration orders, you can contact our team directly. We'll verify your requirements and provide customized designs, pricing, and delivery options.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing an order, you can check your order status anytime under the “Orders” section.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className=" py-12">
            <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          FAQ
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Frequently asked questions
        </motion.p>


    <div className="flex flex-col md:flex-row items-center justify-between bg-white px-6 md:px-16">
      {/* Left Side - Image */}
      
      <div className="w-full md:w-1/2 flex justify-center">
      
        <motion.img
          src={faqImage}
          alt="FAQ"
          className="w-full max-w-md object-cover"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Right Side - FAQ Section */}
      <div className="w-full md:w-1/2 mt-10">
        <div className="space-y-4">
          {faqs.map((faq, index: number) => (
            <motion.div
              key={index}
              className="border-b border-gray-200 pb-5 cursor-pointer px-3 transition-all"
              onClick={() => toggleFAQ(index)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-gray-800 font-medium">{faq.question}</h3>
                <motion.span
                  className="text-xl text-gray-500"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? "−" : "+"}
                </motion.span>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    className="text-gray-500 mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
}
