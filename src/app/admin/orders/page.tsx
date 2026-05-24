"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, FileText, Loader2, Clock, CheckCircle, Package, Truck, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Details Modal States
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const statusMap: any = {
    pending: { label: "قيد الانتظار", color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} /> },
    processing: { label: "قيد التنفيذ", color: "bg-blue-50 text-blue-600 border-blue-100", icon: <Package size={12} /> },
    shipped: { label: "تم الشحن", color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: <Truck size={12} /> },
    delivered: { label: "تم التوصيل", color: "bg-green-50 text-green-600 border-green-100", icon: <CheckCircle size={12} /> },
    cancelled: { label: "ملغي", color: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={12} /> },
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("لا توجد طلبات لتصديرها");
      return;
    }
    
    // CSV headers
    const headers = ["رقم الطلب", "التاريخ", "العميل", "الهاتف", "المحافظة", "العنوان بالتفصيل", "حالة الطلب", "إجمالي المبلغ"];
    
    // CSV rows
    const rows = filteredOrders.map(o => [
      `#${o._id.slice(-6).toUpperCase()}`,
      new Date(o.createdAt).toLocaleDateString('ar-EG'),
      o.customerName,
      o.customerPhone,
      o.customerCity || "",
      o.customerAddress || "",
      statusMap[o.status]?.label || o.status,
      `${o.totalAmount} ج.م`
    ]);
    
    // Add UTF-8 BOM to display Arabic correctly in Excel
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        toast.success("تم تحديث حالة الطلب بنجاح");
      } else {
        toast.error("فشل تحديث حالة الطلب: " + result.message);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setUpdatingStatus(false);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2 text-foreground">إدارة الطلبات</h1>
          <p className="text-foreground/50 text-sm font-light">متابعة وإدارة طلبات العملاء وحالة التوصيل.</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-sand-100 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
            <input 
              type="text" 
              placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand-50/50 border border-sand-100 rounded-2xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {/* Filter */}
            <div className="relative flex-1 md:flex-none">
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="w-full flex items-center justify-center gap-2 text-sm text-foreground/60 border border-sand-100 px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all"
              >
                <Filter size={16} />
                <span>{selectedStatus === "all" ? "تصفية بالحالة" : statusMap[selectedStatus]?.label || "تصفية"}</span>
              </button>
              
              {isFilterDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-sand-100 rounded-2xl shadow-xl z-20 py-2 text-right">
                  <button
                    onClick={() => { setSelectedStatus("all"); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-right px-4 py-2 hover:bg-sand-50 text-sm ${selectedStatus === "all" ? "text-rose-600 font-bold bg-sand-50/50" : "text-foreground/75"}`}
                  >
                    كل الطلبات
                  </button>
                  {Object.keys(statusMap).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedStatus(key); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-right px-4 py-2 hover:bg-sand-50 text-sm ${selectedStatus === key ? "text-rose-600 font-bold bg-sand-50/50" : "text-foreground/75"}`}
                    >
                      {statusMap[key].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Export */}
            <button 
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 text-sm text-foreground/60 border border-sand-100 px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all"
            >
              <FileText size={16} />
              <span>تصدير الطلبات</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 md:-mx-8 md:px-8">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-[11px] text-foreground/40 border-b border-sand-100 uppercase tracking-[0.15em] font-bold">
                <th className="pb-4 font-bold px-4">الطلب</th>
                <th className="pb-4 font-bold px-4">التاريخ</th>
                <th className="pb-4 font-bold px-4">العميل</th>
                <th className="pb-4 font-bold px-4">الحالة</th>
                <th className="pb-4 font-bold px-4">الإجمالي</th>
                <th className="pb-4 font-bold px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-foreground/40 text-sm">لا توجد طلبات حالياً</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusMap[order.status] || statusMap.pending;
                  return (
                    <tr key={order._id} className="group hover:bg-sand-50/30 transition-colors">
                      <td className="py-5 px-4">
                        <span className="font-serif text-sand-600 font-bold tracking-widest text-sm uppercase">#{order._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="py-5 px-4 text-sm text-foreground/70">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-5 px-4">
                        <p className="font-bold text-sm text-foreground">{order.customerName}</p>
                        <p className="text-[10px] text-foreground/40 mt-0.5">{order.customerPhone}</p>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-sm font-bold text-foreground">
                        {order.totalAmount.toLocaleString()} ج.م
                      </td>
                      <td className="py-5 px-4 text-left">
                        <button 
                          onClick={() => openOrderDetails(order)}
                          className="p-2 text-foreground/40 hover:text-rose-500 transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-sand-50 text-xs text-foreground/40 font-medium">
          <p>عرض {filteredOrders.length} من {orders.length} طلب</p>
        </div>
      </div>

      {/* Order Details & Status Update Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-sand-100 my-8 text-right relative">
            <div className="flex justify-between items-center border-b border-sand-100 pb-4 mb-6">
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-foreground/40 hover:text-foreground p-1 transition-colors"
              >
                <X size={24} />
              </button>
              <div>
                <h2 className="font-serif text-2xl font-bold">تفاصيل الطلب #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
                <p className="text-foreground/40 text-xs mt-1">تاريخ الطلب: {new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Info */}
              <div className="bg-sand-50/50 p-5 rounded-2xl border border-sand-100/50">
                <h3 className="font-serif font-bold text-base mb-3 text-[#5A5452]">بيانات العميل</h3>
                <p className="text-sm font-bold text-foreground">{selectedOrder.customerName}</p>
                <p className="text-sm text-foreground/70 mt-1.5 font-medium" dir="ltr">{selectedOrder.customerPhone}</p>
                <p className="text-sm text-foreground/70 mt-1"><span className="font-bold">المحافظة:</span> {selectedOrder.customerCity}</p>
                <p className="text-sm text-foreground/70 mt-1"><span className="font-bold">العنوان بالتفصيل:</span> {selectedOrder.customerAddress}</p>
                {selectedOrder.customerNotes && (
                  <p className="text-sm text-foreground/70 mt-1"><span className="font-bold">ملاحظات العميل:</span> {selectedOrder.customerNotes}</p>
                )}
              </div>

              {/* Status Update */}
              <div className="bg-sand-50/50 p-5 rounded-2xl border border-sand-100/50 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base mb-3 text-[#5A5452]">تغيير حالة الطلب</h3>
                  <div className="relative">
                    <select
                      value={selectedOrder.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                      className="w-full bg-white border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium cursor-pointer"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="processing">قيد التنفيذ</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                    {updatingStatus && <Loader2 className="animate-spin text-rose-500 absolute left-3 top-3.5" size={16} />}
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusMap[selectedOrder.status]?.color}`}>
                    {statusMap[selectedOrder.status]?.icon}
                    {statusMap[selectedOrder.status]?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-6">
              <h3 className="font-serif font-bold text-base mb-3 text-[#5A5452]">المنتجات المطلوبة</h3>
              <div className="border border-sand-100 rounded-2xl overflow-hidden">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-sand-50 text-foreground/50 text-xs font-bold border-b border-sand-100">
                      <th className="p-3">المنتج</th>
                      <th className="p-3 text-center">التفاصيل</th>
                      <th className="p-3 text-center">الكمية</th>
                      <th className="p-3 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-50">
                    {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-sand-50/20">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 text-center text-xs text-foreground/60">
                          {item.size && <span className="bg-sand-100 px-2 py-0.5 rounded text-[10px] font-bold">مقاس: {item.size}</span>}
                          {item.color && <span className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px] text-rose-600 font-bold ml-1">لون: {item.color}</span>}
                          {!item.size && !item.color && <span>-</span>}
                          {item.customNote && (
                            <div className="mt-1 text-[10px] bg-sand-100/50 p-1 rounded text-foreground/80 border border-sand-200">
                              ملاحظة: {item.customNote}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center font-medium">{item.quantity}</td>
                        <td className="p-3 text-left font-medium">{(item.price * item.quantity).toLocaleString()} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t border-sand-100 pt-5 font-bold">
              <span className="text-base text-foreground/60">إجمالي الطلب شامل الشحن</span>
              <span className="text-xl text-rose-600">{selectedOrder.totalAmount.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
