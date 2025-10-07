/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zeniqHype } from "@/common/font";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <>
      <div
        className={cn(
          "relative flex flex-row items-center justify-start gap-2 overflow-x-auto no-scrollbar w-full",
          zeniqHype.className,
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.value}
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm md:text-base transition",
              "text-blue-50/90 hover:text-white",
              "ring-1 ring-white/10 bg-white/5 backdrop-blur",
              "hover:bg-white/10",
              tabClassName
            )}
          >
            {/* active glow bg */}
            {activeIdx === idx && (
              <motion.span
                layoutId="tabs-active-bg"
                className={cn(
                  "absolute inset-0 rounded-full bg-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.45)]",
                  activeTabClassName
                )}
                transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
              />
            )}
            <span className="relative">{tab.title}</span>
          </button>
        ))}
      </div>

      <FadeInPanel
        key={propTabs[activeIdx].value}
        active={propTabs[activeIdx]}
        className={cn("mt-6", contentClassName)}
      />
    </>
  );
};

export const FadeInPanel = ({
  active,
  className,
}: {
  active: Tab;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full", className)}
    >
      {active.content}
    </motion.div>
  );
};
