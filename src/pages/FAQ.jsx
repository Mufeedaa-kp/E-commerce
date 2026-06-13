import React, { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Orders are processed within 1–2 business days and delivered within 5–7 business days.",
    },
    {
      question: "Can I return a product?",
      answer:
        "Yes, returns are accepted within 7 days of delivery if the product is unused and sealed.",
    },
    {
      question: "Are your products baby-safe?",
      answer:
        "Yes, all products are carefully selected to be safe, organic, and baby-friendly.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

      {/* Hero */}
      <div className="bg-primary-600 text-white py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h1>
        <p className="mt-4 text-sm md:text-lg opacity-90">
          Everything you need to know about our baby essentials.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-6 bg-white shadow-md rounded-xl p-6 transition hover:shadow-xl"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left flex justify-between items-center"
            >
              <span className="text-lg font-semibold text-gray-800">
                {faq.question}
              </span>
              <span className="text-primary-600 text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <p className="mt-4 text-gray-600 text-sm md:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
