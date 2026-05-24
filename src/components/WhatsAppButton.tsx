"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.data && data.data.whatsappNumber) {
          setWhatsappNumber(data.data.whatsappNumber);
        } else {
          // Fallback number if not found in DB
          setWhatsappNumber("201201944837");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        setWhatsappNumber("201201944837"); // Fallback
      }
    }
    fetchSettings();
  }, []);

  if (!whatsappNumber) return null;

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <AnimatePresence>
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 md:bottom-6 right-4 md:right-6 z-[90] bg-white text-foreground px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-sand-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all flex items-center justify-center gap-2 group"
        aria-label="تواصل معنا عبر واتساب"
      >
        <MessageCircle size={18} className="text-[#25D366] group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold tracking-wide mt-0.5">الدعم</span>
      </motion.a>
    </AnimatePresence>
  );
}
