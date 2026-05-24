"use client";

import { useState, useEffect } from "react";
import { X, Tag, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

type NotificationType = "offer" | "info" | "alert";

interface Notification {
  _id: string;
  message: string;
  type: NotificationType;
  showOnce: boolean;
  link?: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function GlobalNotification() {
  const { data } = useSWR("/api/notifications/active", fetcher, { refreshInterval: 3000 });
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data?.success && data.data) {
      // Filter out notifications that were already seen if showOnce is true
      const filtered = data.data.filter((n: Notification) => {
        if (n.showOnce) {
          return !localStorage.getItem(`hemo_notif_${n._id}`);
        }
        return true;
      });

      // If active notifications changed, update state
      if (JSON.stringify(filtered) !== JSON.stringify(activeNotifications)) {
        setActiveNotifications(filtered);
        setCurrentIndex(0);
        if (filtered.length > 0) {
          setTimeout(() => setIsVisible(true), 500);
        } else {
          setIsVisible(false);
        }
      }
    } else {
      setActiveNotifications([]);
      setIsVisible(false);
    }
  }, [data, activeNotifications]);

  const handleClose = () => {
    setIsVisible(false);
    
    // Mark the current notification as seen
    const current = activeNotifications[currentIndex];
    if (current && current.showOnce) {
      localStorage.setItem(`hemo_notif_${current._id}`, "true");
    }

    // If there are more notifications, show the next one after a delay
    if (currentIndex < activeNotifications.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsVisible(true);
      }, 500);
    }
  };

  const currentNotification = activeNotifications[currentIndex];

  if (!currentNotification) return null;

  const Icon = currentNotification.type === 'offer' ? Tag :
               currentNotification.type === 'alert' ? AlertTriangle : Info;

  const bgStyles = currentNotification.type === 'offer' ? 'bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-rose-200/50' :
                   currentNotification.type === 'alert' ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-orange-200/50' :
                   'bg-white text-foreground border border-sand-100 shadow-xl';

  const content = (
    <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-4 ${bgStyles}`}>
      <div className={`p-2 rounded-xl shrink-0 ${currentNotification.type === 'info' ? 'bg-sand-50 text-[#5A5452]' : 'bg-white/20 text-white'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 font-medium text-sm leading-relaxed" dir="rtl">
        {currentNotification.message}
      </div>
      <button 
        onClick={(e) => {
          e.preventDefault();
          handleClose();
        }}
        className={`p-1 rounded-full shrink-0 transition-colors ${currentNotification.type === 'info' ? 'text-foreground/40 hover:bg-sand-50 hover:text-foreground' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-24 md:top-6 inset-x-0 mx-auto w-[90%] max-w-md z-[100]"
        >
          {currentNotification.link ? (
            <Link href={currentNotification.link} onClick={handleClose} className="block w-full">
              {content}
            </Link>
          ) : content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
