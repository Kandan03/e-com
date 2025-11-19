"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const About = () => {
  const [aboutSettings, setAboutSettings] = useState({
    aboutTitle: "",
    aboutContent: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings");
        setAboutSettings({
          aboutTitle: response.data.aboutTitle || "About Us",
          aboutContent: response.data.aboutContent || "",
        });
      } catch (error) {
        console.error("Error fetching about settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Don't render if there's no content
  if (!aboutSettings.aboutContent) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-linear-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-neutral-50 font-orbitron mb-4">
            {aboutSettings.aboutTitle}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <p className="text-neutral-300 text-center leading-relaxed whitespace-pre-line">
            {aboutSettings.aboutContent}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
