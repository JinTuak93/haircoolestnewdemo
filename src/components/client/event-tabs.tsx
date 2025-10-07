"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const eventContents = [
  "Konten Event 1",
  "Konten Event 2",
  "Konten Event 3",
  "Konten Event 4",
  "Konten Event 5",
  "Konten Event 6",
];

function EventTabs({ zeniqTech }: { zeniqTech: any }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    "Event 1",
    "Event 2",
    "Event 3",
    "Event 4",
    "Event 5",
    "Event 6",
  ];

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className={`mx-auto text-center text-4xl md:text-5xl font-bold mb-8 text-white ${zeniqTech.className}`}
      >
        Event
      </motion.h2>

      {/* Tab bar: pill glow biru */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-8 rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-3"
      >
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`relative px-4 py-2 rounded-full text-base md:text-lg font-semibold transition
                text-blue-50/90 hover:text-white ring-1 ring-white/10 bg-white/5
                ${
                  activeTab === idx
                    ? "shadow-[0_0_25px_rgba(56,189,248,0.45)]"
                    : ""
                }
              `}
            >
              {activeTab === idx && (
                <motion.span
                  layoutId="event-active"
                  className="absolute inset-0 rounded-full bg-sky-500/30"
                  transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
                />
              )}
              <span className="relative">{tab}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mb-16 mx-auto max-w-6xl rounded-2xl p-8 bg-white/5 backdrop-blur-md ring-1 ring-white/10 text-white shadow-[0_0_30px_rgba(56,189,248,0.25)]"
      >
        <div className="min-h-[100px] flex items-center justify-center text-center">
          {eventContents[activeTab]}
        </div>
      </motion.div>
    </div>
  );
}

export default EventTabs;
