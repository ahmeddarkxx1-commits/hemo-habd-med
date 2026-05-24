"use client";

import { useState, useEffect } from "react";
import {
  DollarSign, ShoppingBag, Users, Eye,
  ArrowUpRight, ArrowDownRight, Clock, Loader2,
  TrendingUp, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<"weekly" | "monthly">("weekly");

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

  if (!stats) return <div className="text-center py-10 text-foreground/50">خطأ في تحميل الإحصائيات</div>;

  // Chart data based on selected mode
  const chartData = chartMode === "weekly" ? stats.dailySales : stats.monthlySales;
  const maxVal = Math.max(...chartData.map((d: any) => d.total), 1);

  return (
    <div className="space-y-10">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2 text-foreground">لوحة التحكم</h1>
          <p className="text-foreground/50 text-sm font-light">إليك نظرة سريعة على أداء متجرك اليوم.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-white px-4 py-2 rounded-xl border border-sand-100 flex items-center gap-2 text-xs font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            تحديث مباشر
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* إجمالي المبيعات */}
        <StatCard
          title="إجمالي المبيعات"
          value={`${stats.totalRevenue.toLocaleString()} ج.م`}
          icon={<DollarSign size={20} />}
          sub={`هذا الأسبوع: ${(stats.weeklyRevenue ?? 0).toLocaleString()} ج.م`}
          color="rose"
        />

        {/* الطلبات */}
        <StatCard
          title="الطلبات"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBag size={20} />}
          sub={`هذا الشهر: ${(stats.monthlyRevenue ?? 0).toLocaleString()} ج.م`}
          color="amber"
        />

        {/* العملاء */}
        <StatCard
          title="العملاء"
          value={stats.totalCustomers.toString()}
          icon={<Users size={20} />}
          sub="عميل فريد"
          color="emerald"
        />

        {/* الزيارات */}
        <StatCard
          title="الزيارات"
          value={(stats.totalVisits ?? 0).toLocaleString()}
          icon={<Eye size={20} />}
          sub="إجمالي زوار الموقع"
          color="blue"
        />
      </div>

      {/* ── Chart + Recent Orders ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-sand-100">
          <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
            <div>
              <h2 className="font-serif text-xl">نشاط المبيعات</h2>
              <p className="text-xs text-foreground/40 mt-1">
                {chartMode === "weekly" ? "آخر 7 أيام" : "آخر 6 شهور"}
              </p>
            </div>
            <div className="flex gap-2 bg-sand-50 p-1 rounded-full">
              <button
                onClick={() => setChartMode("weekly")}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all ${
                  chartMode === "weekly"
                    ? "bg-white shadow text-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                <Clock size={12} /> أسبوعي
              </button>
              <button
                onClick={() => setChartMode("monthly")}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all ${
                  chartMode === "monthly"
                    ? "bg-white shadow text-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                <Calendar size={12} /> شهري
              </button>
            </div>
          </div>

          {/* Bars */}
          <AnimatePresence mode="wait">
            <motion.div
              key={chartMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-[280px] w-full flex items-end justify-between gap-2 md:gap-4 px-1 pb-6 relative"
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((pct) => (
                <div
                  key={pct}
                  className="absolute inset-x-0 h-px bg-sand-50"
                  style={{ bottom: `${pct}%` }}
                />
              ))}

              {chartData.map((day: any, i: number) => {
                const heightPct = maxVal > 0 ? (day.total / maxVal) * 100 : 5;
                const label = chartMode === "weekly" ? day.dayName : day.monthName;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-20">
                      {day.total > 0 ? `${day.total.toLocaleString()} ج.م` : "لا مبيعات"}
                    </div>
                    {/* Bar */}
                    <div className="w-full flex justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(heightPct, day.total > 0 ? 8 : 3)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                        className={`w-full max-w-[36px] rounded-t-xl transition-colors ${
                          day.total > 0
                            ? "bg-[#5A5452] group-hover:bg-rose-500"
                            : "bg-sand-100 group-hover:bg-sand-200"
                        } relative overflow-hidden`}
                        style={{ minHeight: "4px" }}
                      >
                        {day.total > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        )}
                      </motion.div>
                    </div>
                    {/* Label */}
                    <span className="text-[10px] text-foreground/40 font-bold whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Chart Summary */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-sand-50">
            <div className="text-center">
              <p className="text-xs text-foreground/40 mb-1">
                {chartMode === "weekly" ? "مبيعات الأسبوع" : "مبيعات الشهر الحالي"}
              </p>
              <p className="text-lg font-serif font-semibold">
                {chartMode === "weekly"
                  ? `${(stats.weeklyRevenue ?? 0).toLocaleString()} ج.م`
                  : `${(stats.monthlyRevenue ?? 0).toLocaleString()} ج.م`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/40 mb-1">
                {chartMode === "weekly" ? "أفضل يوم" : "أفضل شهر"}
              </p>
              <p className="text-lg font-serif font-semibold">
                {(() => {
                  const best = [...chartData].sort((a: any, b: any) => b.total - a.total)[0];
                  const label = chartMode === "weekly" ? best?.dayName : best?.monthName;
                  return best?.total > 0 ? `${label} (${best.total.toLocaleString()})` : "—";
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-sand-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-xl">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-rose-500 hover:underline">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-5 flex-1">
            {stats.recentOrders.length === 0 ? (
              <p className="text-center text-foreground/40 text-sm py-10">لا توجد طلبات بعد</p>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order._id || order.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sand-50 flex items-center justify-center border border-sand-100 text-foreground/30 group-hover:bg-rose-50 group-hover:border-rose-100 group-hover:text-rose-500 transition-all flex-shrink-0">
                      <ShoppingBag size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        طلب #{(order._id || order.id || "").slice(-4).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-foreground/40 mt-0.5 flex items-center gap-1">
                        <Clock size={9} />
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{order.totalAmount} ج.م</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${
                      order.status === "delivered" ? "text-green-600" : "text-rose-500"
                    }`}>
                      {order.status === "delivered" ? "مسلّم" : order.status === "pending" ? "معلق" : order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-sand-50">
            <Link
              href="/admin/orders"
              className="block w-full bg-sand-50 text-foreground/60 py-3 rounded-2xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 transition-all text-center"
            >
              عرض جميع الطلبات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── StatCard Component ──────────────────────────────────────────────────────
type CardColor = "rose" | "amber" | "emerald" | "blue";

const colorMap: Record<CardColor, { icon: string; badge: string }> = {
  rose:    { icon: "group-hover:bg-rose-500 group-hover:text-white",    badge: "text-rose-600 bg-rose-50" },
  amber:   { icon: "group-hover:bg-amber-500 group-hover:text-white",   badge: "text-amber-600 bg-amber-50" },
  emerald: { icon: "group-hover:bg-emerald-500 group-hover:text-white", badge: "text-emerald-600 bg-emerald-50" },
  blue:    { icon: "group-hover:bg-blue-500 group-hover:text-white",    badge: "text-blue-600 bg-blue-50" },
};

function StatCard({
  title, value, icon, sub, color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  sub: string;
  color: CardColor;
}) {
  const { icon: iconClass, badge: badgeClass } = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 md:p-7 rounded-[2rem] shadow-sm border border-sand-100 hover:shadow-xl hover:shadow-sand-100 transition-all duration-500 group"
    >
      <div className="flex justify-between items-start mb-5">
        <div className={`p-2.5 bg-sand-50 rounded-2xl text-foreground/40 transition-all duration-500 ${iconClass}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${badgeClass}`}>
          <TrendingUp size={10} />
          مباشر
        </div>
      </div>
      <div>
        <h3 className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-2xl md:text-3xl font-serif text-foreground leading-tight">{value}</p>
        <p className="text-[10px] text-foreground/30 mt-2">{sub}</p>
      </div>
    </motion.div>
  );
}
