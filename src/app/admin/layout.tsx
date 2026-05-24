"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Truck, 
  Settings, 
  LogOut,
  ChevronLeft,
  Bell,
  Menu,
  X,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "نظرة عامة", icon: LayoutDashboard, href: "/admin" },
  { name: "المنتجات", icon: Package, href: "/admin/products" },
  { name: "الطلبات", icon: ShoppingBag, href: "/admin/orders" },
  { name: "الشحن", icon: Truck, href: "/admin/shipping" },
  { name: "العملاء", icon: Users, href: "/admin/customers" },
  { name: "الإشعارات", icon: Bell, href: "/admin/notifications" },
  { name: "الإعدادات", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push("/account");
        }
      } catch (err) {
        setIsAdmin(false);
        router.push("/account");
      }
    }
    checkAuth();
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        router.push("/account");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-rose-500" size={40} />
        <p className="text-foreground/60 text-sm font-medium">جاري التحقق من صلاحيات المسؤول...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col lg:flex-row-reverse overflow-x-hidden" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden h-20 bg-white/80 backdrop-blur-md border-b border-sand-100 px-6 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-foreground/60 hover:text-foreground transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="text-center">
          <h1 className="font-serif text-xl tracking-widest">HEMO</h1>
          <p className="text-[8px] text-foreground/40 uppercase tracking-[0.2em]">Admin Panel</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
          H
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 right-0 h-screen w-72 bg-white border-l border-sand-100 flex flex-col z-[60]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-8 border-b border-sand-50 relative">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-foreground"
          >
            <X size={20} />
          </button>
          <h1 className="font-serif text-2xl tracking-widest text-center">HEMO</h1>
          <p className="text-[10px] text-center text-foreground/40 uppercase tracking-[0.2em] mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-[#5A5452] text-white shadow-lg shadow-sand-200" 
                    : "text-foreground/60 hover:bg-sand-50 hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && <motion.div layoutId="activeNav" className="mr-auto"><ChevronLeft size={16} /></motion.div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-sand-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-foreground/60 hover:text-rose-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full lg:max-w-[calc(100vw-18rem)]">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 bg-white/80 backdrop-blur-md border-b border-sand-100 px-8 items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-sand-50 border border-sand-100 flex items-center justify-center text-foreground/40">
              <Bell size={20} />
            </div>
            <div className="h-8 w-px bg-sand-100" />
            <h2 className="text-sm font-medium text-foreground/60">أهلاً بك، أدمن هيمو</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold">متجر هيمو</span>
              <span className="text-[10px] text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                متصل الآن
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              H
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
