"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Users, MapPin, Phone, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        if (data.success) {
          setCustomers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif mb-2 text-foreground">إدارة العملاء</h1>
        <p className="text-foreground/50 text-sm font-light">استعراض ومتابعة بيانات العملاء المسجلين في المتجر.</p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-sand-100 overflow-hidden">
        <div className="flex gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
            <input 
              type="text" 
              placeholder="ابحث باسم العميل أو البريد الإلكتروني..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand-50/50 border border-sand-100 rounded-2xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all"
            />
          </div>
          <div className="text-sm font-medium text-foreground/50 flex items-center gap-2 bg-sand-50 px-4 py-2 rounded-xl">
            <Users size={16} />
            <span>إجمالي العملاء: {customers.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 md:-mx-8 md:px-8">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-[11px] text-foreground/40 border-b border-sand-100 uppercase tracking-[0.15em] font-bold">
                <th className="pb-4 font-bold px-4">العميل</th>
                <th className="pb-4 font-bold px-4">رقم الهاتف</th>
                <th className="pb-4 font-bold px-4">المحافظة والعنوان</th>
                <th className="pb-4 font-bold px-4">تاريخ التسجيل</th>
                <th className="pb-4 font-bold px-4">الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-foreground/40 text-sm">لا يوجد عملاء مسجلين حالياً بالبحث المحدد</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-sand-50/30 transition-colors">
                    <td className="py-5 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{customer.name}</p>
                        <p className="text-xs text-foreground/40 flex items-center gap-1 mt-0.5">
                          <Mail size={12} />
                          {customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      {customer.phone ? (
                        <span className="text-sm text-foreground/80 flex items-center gap-1.5">
                          <Phone size={12} className="text-foreground/30" />
                          <span className="font-mono">{customer.phone}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-foreground/30 italic">غير محدد</span>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      {customer.governorate ? (
                        <div>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            <MapPin size={12} className="text-rose-400" />
                            {customer.governorate}
                          </p>
                          <p className="text-[10px] text-foreground/40 mt-0.5 max-w-[200px] truncate">{customer.address || "بدون تفاصيل عنوان"}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground/30 italic">لا توجد بيانات شحن</span>
                      )}
                    </td>
                    <td className="py-5 px-4 text-sm text-foreground/60">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-foreground/30" />
                        {new Date(customer.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      {customer.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-50 border border-green-150 text-green-600">
                          <ShieldCheck size={12} />
                          مسؤول
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sand-50 border border-sand-150 text-foreground/60">
                          عميل
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
