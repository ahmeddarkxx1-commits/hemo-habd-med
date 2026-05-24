"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { confirmAction } from "@/lib/confirmAction";

type NotificationType = "offer" | "info" | "alert";

interface Notification {
  _id: string;
  message: string;
  isActive: boolean;
  type: NotificationType;
  showOnce: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: "",
    isActive: true,
    type: "info" as NotificationType,
    showOnce: true,
    link: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (notification?: Notification) => {
    if (notification) {
      setFormData({
        message: notification.message,
        isActive: notification.isActive,
        type: notification.type,
        showOnce: notification.showOnce,
        link: notification.link || "",
      });
      setEditingId(notification._id);
    } else {
      setFormData({
        message: "",
        isActive: true,
        type: "info",
        showOnce: true,
        link: "",
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = editingId ? `/api/notifications/${editingId}` : "/api/notifications";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: "success", text: editingId ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح" });
        setIsFormOpen(false);
        fetchNotifications();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: data.error || "فشل الحفظ" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "حدث خطأ أثناء الاتصال" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    confirmAction("هل أنت متأكد من حذف هذا الإشعار؟", async () => {
      try {
        const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setNotifications(notifications.filter((n) => n._id !== id));
        }
      } catch (err) {
        console.error("Failed to delete notification", err);
      }
    });
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
            <Bell size={28} className="text-[#5A5452]" />
            <span>الإشعارات والعروض</span>
          </h1>
          <p className="text-foreground/50 text-sm font-light">إدارة الإشعارات العائمة والعروض التي تظهر لزوار الموقع.</p>
        </div>
        
        <button
          onClick={() => handleOpenForm()}
          className="bg-[#5A5452] hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة إشعار جديد
        </button>
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

      {isFormOpen && (
        <div className="bg-white p-6 rounded-3xl border border-sand-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">{editingId ? "تعديل الإشعار" : "إشعار جديد"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/60">نص الإشعار</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 min-h-[80px]"
                placeholder="مثال: استخدم كود OFF10 للحصول على خصم 10%"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">نوع الإشعار</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as NotificationType})}
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100"
                >
                  <option value="offer">عرض (Offer)</option>
                  <option value="info">معلومة (Info)</option>
                  <option value="alert">تنبيه (Alert)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">الرابط (اختياري)</label>
                <input 
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 text-left"
                  dir="ltr"
                  placeholder="/shop"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 accent-rose-500"
                />
                <span className="text-sm font-medium">مفعل (يظهر للزوار)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.showOnce}
                  onChange={(e) => setFormData({...formData, showOnce: e.target.checked})}
                  className="w-4 h-4 accent-rose-500"
                />
                <span className="text-sm font-medium">يظهر مرة واحدة فقط للزائر (موصى به)</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#5A5452] hover:bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-75"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : "حفظ"}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-sand-100 text-foreground/70 hover:bg-sand-200 px-6 py-2 rounded-xl text-sm font-bold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-sand-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">لا توجد إشعارات مسجلة.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-sand-50/50 border-b border-sand-100">
              <tr>
                <th className="px-6 py-4 font-bold text-foreground/70 text-right">نص الإشعار</th>
                <th className="px-6 py-4 font-bold text-foreground/70 text-right">النوع</th>
                <th className="px-6 py-4 font-bold text-foreground/70 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-foreground/70 text-center">تكرار الظهور</th>
                <th className="px-6 py-4 font-bold text-foreground/70 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-50">
              {notifications.map((notif) => (
                <tr key={notif._id} className="hover:bg-sand-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium max-w-[300px] truncate">{notif.message}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      notif.type === 'offer' ? 'bg-green-100 text-green-700' :
                      notif.type === 'alert' ? 'bg-rose-100 text-rose-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {notif.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {notif.isActive ? (
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 bg-sand-300 rounded-full inline-block"></span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-foreground/60">
                    {notif.showOnce ? "مرة واحدة" : "دائماً"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenForm(notif)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(notif._id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
