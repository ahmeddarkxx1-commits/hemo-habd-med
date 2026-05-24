"use client";

import { useState, useEffect } from "react";
import { Truck, Save, Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { confirmAction } from "@/lib/confirmAction";

export default function AdminShipping() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [newGov, setNewGov] = useState({ governorate: "", rate: 50 });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/shipping-rates");
      const data = await res.json();
      if (data.success) {
        setRates(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (gov: string, newRate: number) => {
    setSaving(true);
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ governorate: gov, rate: newRate }),
      });
      if (res.ok) {
        toast.success(`تم تحديث سعر الشحن لـ ${gov}`);
        fetchRates();
      } else {
        toast.error("حدث خطأ أثناء التحديث");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGov.governorate) return;
    setAdding(true);
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ governorate: newGov.governorate, rate: newGov.rate }),
      });
      if (res.ok) {
        toast.success(`تم إضافة المحافظة ${newGov.governorate}`);
        setNewGov({ governorate: "", rate: 50 });
        fetchRates();
      } else {
        toast.error("حدث خطأ أثناء الإضافة");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (gov: string) => {
    confirmAction(`هل أنت متأكد من حذف ${gov}؟ لن تظهر للعملاء في صفحة الدفع.`, async () => {
      try {
        const res = await fetch(`/api/shipping-rates?governorate=${encodeURIComponent(gov)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success(`تم حذف ${gov}`);
          fetchRates();
        } else {
          toast.error("حدث خطأ أثناء الحذف");
        }
      } catch (err) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    });
  };

  const handleSeed = async () => {
    confirmAction("هل تريد إضافة جميع المحافظات الافتراضية؟ سيؤدي هذا إلى مسح المحافظات الحالية وإعادتها للافتراضي.", async () => {
      setSeeding(true);
      try {
        const res = await fetch("/api/shipping-rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "seed" }),
        });
        if (res.ok) {
          toast.success("تم إعادة تعيين جميع المحافظات بنجاح");
          fetchRates();
        } else {
          toast.error("حدث خطأ أثناء الإضافة");
        }
      } finally {
        setSeeding(false);
      }
    });
  };

  if (loading) return <div className="p-12 text-center flex justify-center"><Loader2 className="animate-spin text-rose-500" size={32} /></div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2">إدارة مصاريف الشحن</h1>
          <p className="text-foreground/60">تحكم في تكلفة الشحن والمحافظات المتاحة للتوصيل.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-foreground text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-500 transition-colors"
          >
            {seeding ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            إضافة كل المحافظات
          </button>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl hidden md:block">
            <Truck size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-sand-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-sand-100 bg-sand-50">
          <h2 className="font-semibold mb-4">إضافة محافظة مخصصة</h2>
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm mb-2 text-foreground/80">اسم المحافظة</label>
              <input 
                type="text" 
                required
                value={newGov.governorate}
                onChange={e => setNewGov({...newGov, governorate: e.target.value})}
                placeholder="مثال: مدينة الشروق"
                className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 outline-none focus:border-rose-300"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm mb-2 text-foreground/80">تكلفة الشحن (ج.م)</label>
              <input 
                type="number" 
                required
                value={newGov.rate}
                onChange={e => setNewGov({...newGov, rate: Number(e.target.value)})}
                className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 outline-none focus:border-rose-300"
              />
            </div>
            <button 
              type="submit"
              disabled={adding}
              className="w-full md:w-auto bg-sage-400 text-white px-8 py-3 rounded-xl font-medium hover:bg-sage-500 transition-colors flex items-center justify-center gap-2 h-[50px]"
            >
              {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              إضافة
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[600px]">
            <thead className="bg-white border-b border-sand-100">
              <tr>
                <th className="px-6 py-4 font-medium text-sm text-foreground/60">المحافظة</th>
                <th className="px-6 py-4 font-medium text-sm text-foreground/60">تكلفة الشحن (ج.م)</th>
                <th className="px-6 py-4 font-medium text-sm text-foreground/60 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-50">
              {rates.map((rate) => (
                <tr key={rate._id} className="hover:bg-sand-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{rate.governorate}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      defaultValue={rate.rate}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (val !== rate.rate && !isNaN(val)) {
                          handleUpdate(rate.governorate, val);
                        }
                      }}
                      className="w-32 bg-white border border-sand-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-shadow"
                    />
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button 
                      onClick={() => handleDelete(rate.governorate)}
                      className="p-2 text-foreground/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {rates.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-foreground/50">
                    لا يوجد محافظات مضافة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
