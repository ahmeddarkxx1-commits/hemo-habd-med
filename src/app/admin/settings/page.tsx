"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Database, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, Loader2, Link2 } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  // Database status
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbChecking, setDbChecking] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    storeName: "HEMO HAND",
    storePhone: "01234567890",
    storeEmail: "contact@hemohand.com",
    whatsapp: "201234567890",
    instagram: "hemo.hand",
    facebook: "hemohand",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function initPage() {
      setLoading(true);
      try {
        // Fetch Settings
        const settingsRes = await fetch("/api/admin/settings");
        const settingsData = await settingsRes.json();
        if (settingsData.success) {
          setSettings(settingsData.data);
        }

        // Fetch DB Status
        await checkDb();
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    initPage();
  }, []);

  const checkDb = async () => {
    setDbChecking(true);
    try {
      const dbRes = await fetch("/api/db-check");
      const dbData = await dbRes.json();
      setDbStatus(dbData);
    } catch (err) {
      setDbStatus({ success: false, status: "error", message: "فشل الاتصال بمسار الفحص" });
    } finally {
      setDbChecking(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "تم حفظ الإعدادات بنجاح!" });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "فشل حفظ الإعدادات: " + data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "حدث خطأ أثناء الاتصال بالخادم" });
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2 text-foreground flex items-center gap-3">
            <Settings size={28} className="text-[#5A5452]" />
            <span>إعدادات المتجر</span>
          </h1>
          <p className="text-foreground/50 text-sm font-light">إدارة معلومات الاتصال وهوية المتجر وأدوات النظام.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-green-50 border-green-100 text-green-700" 
            : "bg-rose-50 border-rose-100 text-rose-700"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-sand-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-50 pb-4">
            <h2 className="font-serif text-lg font-bold text-foreground">المعلومات العامة والاتصال</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">اسم المتجر</label>
                <input 
                  type="text" 
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">هاتف المتجر</label>
                <input 
                  type="text" 
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">البريد الإلكتروني للدعم</label>
                <input 
                  type="email" 
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">رقم الواتساب (مع كود الدولة)</label>
                <input 
                  type="text" 
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                  dir="ltr"
                  placeholder="201234567890"
                />
              </div>
            </div>

            <div className="border-t border-sand-50 pt-5 space-y-5">
              <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">روابط مواقع التواصل الاجتماعي</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Link2 size={12} />
                    <span>حساب إنستجرام (Username)</span>
                  </label>
                  <input 
                    type="text" 
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                    dir="ltr"
                    placeholder="hemo.hand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                    <Link2 size={12} />
                    <span>حساب فيسبوك (Username)</span>
                  </label>
                  <input 
                    type="text" 
                    value={settings.facebook}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                    dir="ltr"
                    placeholder="hemohand"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#5A5452] hover:bg-rose-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-2 mt-4 disabled:opacity-75"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>حفظ التعديلات</span>
            </button>
          </form>
        </div>

        {/* Database & Tools Settings */}
        <div className="space-y-8">
          {/* Connection Status Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-sand-100 space-y-6">
            <div className="flex justify-between items-center border-b border-sand-50 pb-4">
              <button 
                onClick={checkDb}
                disabled={dbChecking}
                className="text-foreground/40 hover:text-foreground p-1 transition-colors"
                title="تحديث حالة الاتصال"
              >
                <RefreshCw size={16} className={dbChecking ? "animate-spin text-rose-500" : ""} />
              </button>
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Database size={20} className="text-rose-500" />
                <span>حالة قاعدة البيانات</span>
              </h2>
            </div>

            {dbStatus?.success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl flex items-start gap-2.5">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">MongoDB متصلة بنجاح</p>
                    <p className="text-xs text-green-600/80 mt-1">الموقع يعمل الآن على قاعدة البيانات السحابية الأساسية.</p>
                  </div>
                </div>
                <div className="text-xs text-foreground/50 space-y-1.5 bg-sand-50/50 p-4 rounded-xl border border-sand-100">
                  <p><strong>قاعدة البيانات:</strong> {dbStatus.database}</p>
                  <p className="truncate"><strong>المضيف:</strong> {dbStatus.host}</p>
                  <p><strong>حالة الاتصال:</strong> {dbStatus.status}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-2xl flex items-start gap-2.5">
                  <ShieldAlert size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">MongoDB غير متصلة</p>
                    <p className="text-xs text-amber-600/80 mt-1">يتم القراءة والكتابة حالياً من الملف المحلي المضمن (JSON DB) لمنع التوقف.</p>
                  </div>
                </div>
                {dbStatus?.message && (
                  <div className="text-xs text-rose-600 bg-rose-50/50 p-4 rounded-xl border border-rose-100 leading-relaxed">
                    <p className="font-bold mb-1">تفاصيل الخطأ:</p>
                    <p>{dbStatus.message}</p>
                    {dbStatus.hint && <p className="mt-2 font-bold">{dbStatus.hint}</p>}
                  </div>
                )}
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
