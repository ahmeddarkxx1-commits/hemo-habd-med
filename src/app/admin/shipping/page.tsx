"use client";

import { useState, useEffect } from "react";
import { Truck, Save, Plus, Trash2 } from "lucide-react";

export default function AdminShipping() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ governorate: gov, rate: newRate }),
      });
      fetchRates();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center">جاري التحميل...</div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">إدارة مصاريف الشحن</h1>
          <p className="text-foreground/60">تحكم في تكلفة الشحن لكل محافظة في مصر.</p>
        </div>
        <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
          <Truck size={32} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-sand-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-sand-50 border-b border-sand-100">
            <tr>
              <th className="px-6 py-4 font-medium text-sm">المحافظة</th>
              <th className="px-6 py-4 font-medium text-sm">تكلفة الشحن (ج.م)</th>
              <th className="px-6 py-4 font-medium text-sm text-center">حفظ</th>
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
                      if (val !== rate.rate) {
                        handleUpdate(rate.governorate, val);
                      }
                    }}
                    className="w-32 bg-white border border-sand-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-foreground/30 hover:text-rose-500 transition-colors">
                    <Save size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {saving && (
        <div className="fixed bottom-8 left-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
          تم تحديث الأسعار بنجاح!
        </div>
      )}
    </div>
  );
}
