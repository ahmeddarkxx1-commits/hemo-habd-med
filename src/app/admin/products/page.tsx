"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Loader2, RefreshCw, X } from "lucide-react";

const categoriesList = [
  { id: "socks", name: "شرابات" },
  { id: "scarves", name: "كوفيات" },
  { id: "gloves", name: "جوانتيات" },
  { id: "jackets", name: "جواكت تريكو وكروشيه" },
  { id: "sweaters", name: "بلوفرات تريكو وكروشيه" },
  { id: "kids", name: "سالوبيت اطفال" },
  { id: "hats", name: "أيس كاب وقبعات" },
  { id: "blankets", name: "بطانيات كروشيه" }
];

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "sweaters",
    description: "",
    images: "",
    colors: "",
    sizes: "",
    isFeatured: false,
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("فشل حذف المنتج: " + data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const syncFromFile = async () => {
    if (!confirm("سيتم مسح المنتجات الحالية وإعادة تحميلها من الملف. هل أنت متأكد؟")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seed?force=true");
      const data = await res.json();
      if (data.success) {
        alert("تمت المزامنة بنجاح!");
        window.location.reload();
      }
    } catch (error) {
      alert("فشل في المزامنة");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId("");
    setFormData({
      name: "",
      price: "",
      category: "sweaters",
      description: "",
      images: "",
      colors: "sand, ivory",
      sizes: "S, M, L",
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setModalMode("edit");
    setEditingId(product._id);
    setFormData({
      name: product.name || "",
      price: product.price ? product.price.toString() : "",
      category: product.category || "sweaters",
      description: product.description || "",
      images: product.images ? product.images.join(", ") : "",
      colors: product.colors ? product.colors.join(", ") : "",
      sizes: product.sizes ? product.sizes.join(", ") : "",
      isFeatured: !!product.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      alert("برجاء ملء جميع الحقول المطلوبة");
      return;
    }

    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice)) {
      alert("السعر يجب أن يكون رقماً صحيحاً");
      return;
    }

    setSavingProduct(true);

    const imagesArray = formData.images
      ? formData.images.split(",").map(i => i.trim()).filter(Boolean)
      : ["/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (1).jpeg"];

    const colorsArray = formData.colors
      ? formData.colors.split(",").map(c => c.trim()).filter(Boolean)
      : [];

    const sizesArray = formData.sizes
      ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name,
      price: parsedPrice,
      category: formData.category,
      description: formData.description,
      images: imagesArray,
      colors: colorsArray,
      sizes: sizesArray,
      isFeatured: formData.isFeatured,
    };

    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        // Refresh product list
        const updatedRes = await fetch("/api/products");
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setProducts(updatedData.data);
        }
        alert(modalMode === "add" ? "تم إضافة المنتج بنجاح!" : "تم تعديل المنتج بنجاح!");
      } else {
        alert("فشل الحفظ: " + data.message);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSavingProduct(false);
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
          <h1 className="text-3xl font-serif mb-2 text-foreground">إدارة المنتجات</h1>
          <p className="text-foreground/50 text-sm font-light">تعديل وإضافة وحذف المنتجات من كتالوج المتجر.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={syncFromFile}
            className="bg-white text-foreground/60 border border-sand-100 px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all flex items-center gap-2 group"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-medium">تحديث من الملف</span>
          </button>
          <button 
            onClick={openAddModal}
            className="bg-[#5A5452] text-white px-6 py-3 rounded-2xl hover:bg-rose-500 transition-all duration-300 shadow-lg flex items-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span className="font-medium">إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sand-100 shadow-sm">
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-2">إجمالي المنتجات</p>
          <p className="text-3xl font-serif">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sand-100 shadow-sm">
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-2">نشط الآن</p>
          <p className="text-3xl font-serif">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sand-100 shadow-sm">
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-2">نفذت الكمية</p>
          <p className="text-3xl font-serif text-rose-500">0</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-sand-100 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج بالاسم..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand-50/50 border border-sand-100 rounded-2xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="w-full flex items-center justify-center gap-2 text-sm text-foreground/60 border border-sand-100 px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all"
              >
                <Filter size={16} />
                <span>{selectedCategory === "all" ? "تصفية" : categoriesList.find(c => c.id === selectedCategory)?.name || "تصفية"}</span>
              </button>
              
              {isFilterDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-sand-100 rounded-2xl shadow-xl z-20 py-2 text-right">
                  <button
                    onClick={() => { setSelectedCategory("all"); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-right px-4 py-2 hover:bg-sand-50 text-sm ${selectedCategory === "all" ? "text-rose-600 font-bold bg-sand-50/50" : "text-foreground/75"}`}
                  >
                    كل المنتجات
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-right px-4 py-2 hover:bg-sand-50 text-sm ${selectedCategory === cat.id ? "text-rose-600 font-bold bg-sand-50/50" : "text-foreground/75"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 md:-mx-8 md:px-8">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-[11px] text-foreground/40 border-b border-sand-100 uppercase tracking-[0.15em] font-bold">
                <th className="pb-4 font-bold px-4">المنتج</th>
                <th className="pb-4 font-bold px-4">الحالة</th>
                <th className="pb-4 font-bold px-4">السعر</th>
                <th className="pb-4 font-bold px-4">التصنيف</th>
                <th className="pb-4 font-bold px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="group hover:bg-sand-50/30 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-sand-50 rounded-xl overflow-hidden relative border border-sand-100 shadow-sm">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-sand-100 flex items-center justify-center text-[10px] text-foreground/30">بدون صورة</div>
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-base text-foreground group-hover:text-rose-600 transition-colors">{product.name}</p>
                        <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest">ID: {product._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase tracking-wider">متوفر</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="font-medium text-sm">{product.price.toLocaleString()} ج.م</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-xs text-foreground/60 bg-sand-50 px-3 py-1 rounded-lg border border-sand-100">
                      {categoriesList.find(c => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 text-foreground/40 hover:text-rose-500 transition-colors"
                        title="تعديل"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 text-foreground/40 hover:text-rose-600 transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-sand-50 text-xs text-foreground/40 font-medium">
          <p>عرض {filteredProducts.length} من {products.length} منتج</p>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-sand-100 my-8 text-right relative">
            <div className="flex justify-between items-center border-b border-sand-100 pb-4 mb-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-foreground/40 hover:text-foreground p-1 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="font-serif text-2xl font-bold">
                {modalMode === "add" ? "إضافة منتج جديد" : "تعديل المنتج"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">اسم المنتج *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="بلوفر صوف ألباكا..."
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5A5452]">السعر (ج.م) *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="850"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5A5452]">التصنيف *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium cursor-pointer"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">الوصف بالتفصيل *</label>
                <textarea 
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="اكتب وصفاً مفصلاً للمنتج ومواده المستخدمة وطريقة الغسيل..."
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/60">روابط الصور (مفصولة بفاصلة ,)</label>
                <input 
                  type="text" 
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="/products/WhatsApp Image 2026-05-08 at 1.03.48 AM.jpeg"
                  className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                />
                <p className="text-[10px] text-foreground/40 mt-1">يمكنك استخدام الصور الافتراضية الموجودة بالمتجر أو روابط صور خارجية.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/60">الألوان (مفصولة بفاصلة ,)</label>
                  <input 
                    type="text" 
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="sage, rose, ivory"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/60">المقاسات (مفصولة بفاصلة ,)</label>
                  <input 
                    type="text" 
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full bg-sand-50/50 border border-sand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all font-medium text-left"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-sand-300 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-foreground/75 cursor-pointer">عرض في المنتجات المميزة بالصفحة الرئيسية</label>
              </div>

              <button
                type="submit"
                disabled={savingProduct}
                className="w-full bg-[#5A5452] hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6 disabled:opacity-75"
              >
                {savingProduct ? <Loader2 className="animate-spin" size={18} /> : "حفظ المنتج"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
