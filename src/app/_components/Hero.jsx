"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FuzzyOverlayExample = () => {
  return (
    <div className="relative overflow-hidden">
      <ExampleContent />
      <FuzzyOverlay />
    </div>
  );
};

const FuzzyOverlay = () => {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: `url("/noise.png")`,
      }}
      className="pointer-events-none absolute -inset-full opacity-15"
    />
  );
};

const ExampleContent = () => {
  return (
    <div className="relative grid h-max place-content-center space-y-6 bg-neutral-950 px-8 py-24 md:p-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-center text-4xl md:text-6xl font-black text-neutral-50 font-orbitron">
          Your Digital Marketplace
        </h1>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-primary mt-4">
          Speed Up Your Creative Workflow
        </h2>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center text-neutral-400 text-lg max-w-2xl mx-auto"
      >
        Discover and sell amazing digital products, templates, and creative assets. 
        Join thousands of creators worldwide.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
      >
        <Link href="/explore">
          <Button size="lg" className="font-orbitron w-full sm:w-auto">
            Explore Products
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="secondary" className="font-orbitron w-full sm:w-auto">
            Start Selling
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

const Hero = () => {
  return <FuzzyOverlayExample />;
};

export default Hero;
