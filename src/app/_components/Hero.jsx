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
    <div className="relative grid h-max place-content-center space-y-6 bg-neutral-950 p-32">
      <h2 className="text-center text-6xl font-black text-neutral-50 font-orbitron">
        Speed Up your Creative workflow
      </h2>
      <p className="text-center text-neutral-400">
        Join a growing family of 43,436 designers, creator and makers from
        around the world
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          className="text-primary hover:underline flex items-center gap-2"
          href="/dashboard"
        >
          <Button variant="secondary" className="font-orbitron">
            Buy Now!
          </Button>
        </Link>
      </div>
    </div>
  );
};

const Hero = () => {
  return <FuzzyOverlayExample />;
};

export default Hero;
