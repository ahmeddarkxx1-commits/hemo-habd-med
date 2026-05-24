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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[90] bg-[#5A5452] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-[#4a4544] transition-all flex items-center justify-center gap-2"
        aria-label="تواصل معنا عبر واتساب"
      >
        <MessageCircle size={16} />
        <span className="text-xs font-bold tracking-wider">الدعم</span>
      </motion.a>
    </AnimatePresence>
  );
}
