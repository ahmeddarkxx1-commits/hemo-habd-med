"use client";

import { useState } from "react";

export default function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message
    const formattedMessage = `مرحباً هيمو هاند ميد،
أنا: ${name}
للتواصل: ${contact}

رسالتي:
${message}`;

    const encodedMessage = encodeURIComponent(formattedMessage);
    // Remove any +, spaces or leading zeros for wa.me link
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">الاسم</label>
        <input 
          type="text" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-300 transition-colors" 
          placeholder="اسمك الكريم" 
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">البريد الإلكتروني أو رقم الواتساب</label>
        <input 
          type="text" 
          required 
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-300 transition-colors" 
          placeholder="للتواصل معكِ" 
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">رسالتك</label>
        <textarea 
          required 
          rows={4} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-300 transition-colors resize-none" 
          placeholder="كيف يمكننا مساعدتك؟" 
        />
      </div>
      <button type="submit" className="w-full bg-foreground text-white flex items-center justify-center gap-2 font-semibold py-4 rounded-xl hover:bg-[#25D366] transition-colors shadow-md">
        <span>إرسال عبر واتساب</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
    </form>
  );
}
