"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Phone, MapPin, Loader2, LogOut, ClipboardList, Shield, Save, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", 
  "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", 
  "السويس", "الشرقية", "سوهاج", "جنوب سيناء", "شمال سيناء", "قنا", "كفر الشيخ", 
  "مطروح", "الأقصر", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط"
];

const statusMap: any = {
  pending: { label: "قيد الانتظار", color: "text-amber-600 bg-amber-50 border-amber-100" },
  processing: { label: "قيد التنفيذ", color: "text-blue-600 bg-blue-50 border-blue-100" },
  shipped: { label: "تم الشحن", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  delivered: { label: "تم التوصيل", color: "text-green-600 bg-green-50 border-green-100" },
  cancelled: { label: "ملغي", color: "text-rose-600 bg-rose-50 border-rose-100" },
};

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regGov, setRegGov] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Profile Edit States
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileGov, setProfileGov] = useState("");
  const [profileAddress, setProfileAddress] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/me");
      const result = await res.json();
      if (result.success) {
        setUser(result.data);
        // Pre-fill profile edit fields
        setProfileName(result.data.name);
        setProfilePhone(result.data.phone || "");
        setProfileGov(result.data.governorate || "");
        setProfileAddress(result.data.address || "");
        
        // Fetch order history for this user
        fetchOrders(result.data.id);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders?userId=${userId}`);
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg(result.message);
        setUser(result.data);
        setProfileName(result.data.name);
        setProfilePhone(result.data.phone || "");
        setProfileGov(result.data.governorate || "");
        setProfileAddress(result.data.address || "");
        fetchOrders(result.data.id);
      } else {
        setErrorMsg(result.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (err) {
      setErrorMsg("فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة");
      setActionLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          governorate: regGov,
          address: regAddress,
          password: regPassword,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg(result.message);
        setUser(result.data);
        setProfileName(result.data.name);
        setProfilePhone(result.data.phone || "");
        setProfileGov(result.data.governorate || "");
        setProfileAddress(result.data.address || "");
        setOrders([]);
      } else {
        setErrorMsg(result.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (err) {
      setErrorMsg("فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          phone: profilePhone,
          governorate: profileGov,
          address: profileAddress,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg(result.message);
        setUser(result.data);
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(result.message || "فشل تحديث البيانات");
      }
    } catch (err) {
      setErrorMsg("فشل الاتصال بالخادم.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        setUser(null);
        setOrders([]);
        // Clear input fields
        setLoginEmail("");
        setLoginPassword("");
        setRegName("");
        setRegEmail("");
        setRegPhone("");
        setRegGov("");
        setRegAddress("");
        setRegPassword("");
        setRegConfirmPassword("");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
        <p className="text-foreground/60 text-sm">جاري جلب تفاصيل الحساب...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-[85vh]">
      <AnimatePresence mode="wait">
        {!user ? (
          // LOGIN & REGISTER FORMS
          <motion.div
            key="auth-forms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-3xl border border-sand-100 shadow-xl mt-8"
          >
            {/* Tabs */}
            <div className="flex gap-4 border-b border-sand-100 pb-4 mb-8">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 text-center py-2 font-bold text-lg transition-all ${
                  activeTab === "login"
                    ? "text-[#5A5452] border-b-2 border-[#5A5452]"
                    : "text-foreground/40 hover:text-foreground/60"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 text-center py-2 font-bold text-lg transition-all ${
                  activeTab === "register"
                    ? "text-[#5A5452] border-b-2 border-[#5A5452]"
                    : "text-foreground/40 hover:text-foreground/60"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm">
                {successMsg}
              </div>
            )}

            {/* Forms */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Mail size={14} />
                    <span>البريد الإلكتروني *</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Lock size={14} />
                    <span>كلمة المرور *</span>
                  </label>
                  <input
                    required
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-left"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#5A5452] hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-75"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={18} /> : "تسجيل الدخول"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <User size={14} />
                    <span>الاسم بالكامل *</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="الاسم الثلاثي..."
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Mail size={14} />
                    <span>البريد الإلكتروني *</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Phone size={14} />
                    <span>رقم الهاتف الأساسي *</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="012xxxxxxx"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>المحافظة *</span>
                  </label>
                  <select
                    required
                    value={regGov}
                    onChange={(e) => setRegGov(e.target.value)}
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all cursor-pointer"
                  >
                    <option value="">اختر المحافظة...</option>
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>العنوان بالتفصيل</span>
                  </label>
                  <textarea
                    rows={2}
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="اسم الشارع، رقم العمارة، الدور..."
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Lock size={14} />
                    <span>كلمة المرور *</span>
                  </label>
                  <input
                    required
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Lock size={14} />
                    <span>تأكيد كلمة المرور *</span>
                  </label>
                  <input
                    required
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-left"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#5A5452] hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-75"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={18} /> : "إنشاء حساب"}
                </button>
              </form>
            )}
          </motion.div>
        ) : (
          // USER PROFILE & ORDERS DASHBOARD
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* User Header */}
            <div className="bg-white rounded-3xl p-8 border border-sand-100 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center font-bold text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">أهلاً بك، {user.name}</h1>
                  <p className="text-foreground/50 text-sm mt-1">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                {user.role === "admin" && (
                  <Link 
                    href="/admin" 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-sand-100 hover:bg-sand-200 text-foreground text-sm font-bold px-6 py-3.5 rounded-2xl transition-all shadow-sm"
                  >
                    <Shield size={16} />
                    <span>لوحة الإدارة</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-sand-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-foreground/70 text-sm font-bold px-6 py-3.5 rounded-2xl transition-all"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Profile details editing */}
              <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-sand-100 shadow-md space-y-6 h-fit">
                <div className="flex items-center gap-2 border-b border-sand-100 pb-3">
                  <User size={18} className="text-rose-500" />
                  <h2 className="font-serif text-lg font-bold">بيانات الملف الشخصي</h2>
                </div>

                {successMsg && (
                  <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 animate-pulse">
                    <CheckCircle size={14} />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2.5 rounded-xl text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/60">الاسم بالكامل</label>
                    <input
                      required
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-sand-50/50 border border-sand-150 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/60">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-sand-50/50 border border-sand-150 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/60">المحافظة</label>
                    <select
                      value={profileGov}
                      onChange={(e) => setProfileGov(e.target.value)}
                      className="w-full bg-sand-50/50 border border-sand-150 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium cursor-pointer"
                    >
                      <option value="">اختر المحافظة...</option>
                      {GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/60">العنوان بالتفصيل</label>
                    <textarea
                      rows={3}
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full bg-sand-50/50 border border-sand-150 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-[#5A5452] hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : (
                      <>
                        <Save size={16} />
                        <span>حفظ البيانات</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Order history */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-sand-100 shadow-md space-y-6">
                <div className="flex items-center gap-2 border-b border-sand-100 pb-3">
                  <ClipboardList size={18} className="text-rose-500" />
                  <h2 className="font-serif text-lg font-bold">تاريخ الطلبات</h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-sand-50/30 rounded-2xl border border-dashed border-sand-200 flex flex-col items-center justify-center px-6">
                    <ClipboardList size={48} className="text-foreground/20 mb-4" />
                    <h3 className="font-serif text-lg font-bold mb-2">لا توجد طلبات سابقة</h3>
                    <p className="text-foreground/50 text-sm max-w-sm mb-6 leading-relaxed">
                      لم تقومي بإجراء أي طلبات شراء بعد. تصفحي المتجر الآن واكتشفي تصاميمنا اليدوية الدافئة.
                    </p>
                    <Link href="/shop" className="bg-[#5A5452] hover:bg-rose-500 text-white text-sm font-bold px-8 py-3 rounded-full shadow-md transition-all">
                      اذهبي للمتجر
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="text-[11px] text-foreground/40 border-b border-sand-100 uppercase tracking-widest font-bold">
                          <th className="pb-3 px-2 font-bold">رقم الطلب</th>
                          <th className="pb-3 px-2 font-bold">التاريخ</th>
                          <th className="pb-3 px-2 font-bold">الحالة</th>
                          <th className="pb-3 px-2 font-bold">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand-50">
                        {orders.map((order) => {
                          const status = statusMap[order.status] || statusMap.pending;
                          return (
                            <tr key={order._id} className="group hover:bg-sand-50/20 transition-colors">
                              <td className="py-4 px-2 font-serif text-sand-700 font-bold text-sm">
                                #{order._id.slice(-6).toUpperCase()}
                              </td>
                              <td className="py-4 px-2 text-xs text-foreground/60">
                                {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="py-4 px-2">
                                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="py-4 px-2 font-bold text-sm text-foreground">
                                {order.totalAmount} ج.م
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
