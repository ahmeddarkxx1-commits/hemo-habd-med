"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={40} />
      </div>
    );
  }

  if (!stats) return <div>خطأ في تحميل الإحصائيات</div>;

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2 text-foreground">لوحة التحكم</h1>
          <p className="text-foreground/50 text-sm font-light">أهلاً بك مجدداً! إليك نظرة سريعة على أداء متجرك اليوم.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-sand-100 flex items-center gap-2 text-xs font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            تحديث مباشر
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي المبيعات" 
          value={`${stats.totalRevenue.toLocaleString()} ج.م`} 
          icon={<DollarSign size={22} />} 
          trend="+٥٪" 
          isPositive={true} 
        />
        <StatCard 
          title="الطلبات" 
          value={stats.totalOrders.toString()} 
          icon={<ShoppingBag size={22} />} 
          trend="+٢٪" 
          isPositive={true} 
        />
        <StatCard 
          title="العملاء" 
          value={stats.totalCustomers.toString()} 
          icon={<Users size={22} />} 
          trend="+١٢٪" 
          isPositive={true} 
        />
        <StatCard 
          title="المنتجات" 
          value={stats.totalProducts.toString()} 
          icon={<Package size={22} />} 
          trend="مباشر" 
          isPositive={true} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-sand-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-xl">نشاط المبيعات الأسبوعي</h2>
            <div className="flex gap-2">
              <button className="text-[10px] uppercase tracking-widest font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">أسبوعي</button>
            </div>
          </div>
          
          <div className="h-[350px] w-full flex items-end justify-between gap-4 px-2 pb-6 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-sand-50" />
            <div className="absolute inset-x-0 top-1/4 h-px bg-sand-50" />
            <div className="absolute inset-x-0 top-2/4 h-px bg-sand-50" />
            <div className="absolute inset-x-0 top-3/4 h-px bg-sand-50" />
            
            {stats.dailySales.map((day: any, i: number) => {
              const maxTotal = Math.max(...stats.dailySales.map((d: any) => d.total), 100);
              const height = (day.total / maxTotal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative z-10">
                  <div className="w-full max-w-[40px] relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 5)}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="w-full bg-[#5A5452] rounded-t-xl group-hover:bg-rose-500 transition-colors relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                    {day.total > 0 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                        {day.total} ج.م
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">
                    {day.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-sand-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-xl">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-rose-500 hover:underline">عرض الكل</Link>
          </div>
          
          <div className="space-y-6 flex-1">
            {stats.recentOrders.length === 0 ? (
              <p className="text-center text-foreground/40 text-sm py-10">لا توجد طلبات بعد</p>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sand-50 flex items-center justify-center border border-sand-100 text-foreground/30 group-hover:bg-rose-50 group-hover:border-rose-100 group-hover:text-rose-500 transition-all">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">طلب #{order._id.slice(-4).toUpperCase()}</p>
                      <p className="text-[10px] text-foreground/40 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{order.totalAmount} ج.م</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                      order.status === 'delivered' ? 'text-green-600' : 'text-rose-500'
                    }`}>{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-sand-50">
            <button className="w-full bg-sand-50 text-foreground/60 py-3 rounded-2xl text-xs font-bold hover:bg-sand-100 transition-all">تحميل تقرير اليوم</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isPositive }: { title: string, value: string, icon: React.ReactNode, trend: string, isPositive: boolean }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-sand-100 hover:shadow-xl hover:shadow-sand-100 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-sand-50 rounded-2xl text-foreground/40 group-hover:bg-[#5A5452] group-hover:text-white transition-all duration-500">{icon}</div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isPositive ? "text-green-600 bg-green-50" : "text-rose-600 bg-rose-50"}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-xs text-foreground/40 font-bold uppercase tracking-widest mb-2">{title}</h3>
        <p className="text-3xl font-serif text-foreground">{value}</p>
      </div>
    </div>
  );
}
