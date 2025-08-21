"use client";
import { useState } from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import {faqs} from "../utils/appData.json"


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 font-bold text-center pt-6 pb-4">Frequently Asked Questions</h2>
        <ul>
          {faqs.map((faq, idx) => (
            <li key={idx} className="mb-4 border border-gray-light rounded-lg">
              <button
                className={`w-full flex items-center py-4 px-4 text-left font-medium text-[18px] focus:outline-none text-color ${openIndex === idx && "border-b-4"} border-gray-light`}
                onClick={() => toggle(idx)}
              >
                {openIndex === idx ? <FaCaretDown className="mr-2 w-[20px] h-[20px]" /> : <FaCaretRight className="mr-2 w-[20px] h-[20px]" />}
                {faq.question}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out px-3 block ${openIndex === idx ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <p className="px-2 pt-4 text-gray-600 text-[14px]">{faq.answer}</p>
                <p className="px-2 py-4 text-gray-600 whitespace-pre-line text-[14px] text-base/6">{faq.answerone}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}