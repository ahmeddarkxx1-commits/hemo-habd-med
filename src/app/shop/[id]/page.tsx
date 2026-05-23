"use client";

import { useState, useEffect } from "react";
import { categories } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { ArrowRight, Minus, Plus, ShoppingBag, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductReviews from "@/components/ProductReviews";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          setActiveImage(data.data.images[0]);
          setSelectedColor(data.data.colors[0]);
          setSelectedSize(data.data.sizes?.[0] || "");
        } else {
          setNotFoundState(true);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={40} />
      </div>
    );
  }

  if (notFoundState || !product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: activeImage,
      customNote,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-24">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-rose-500 transition-colors mb-8">
        <ArrowRight size={16} />
        العودة للمتجر
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-sand-100 shadow-sm transition-all duration-500 group cursor-crosshair">
            {activeImage && (
              <Image 
                src={activeImage} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-125"
                priority
              />
            )}
          </div>
          <div className="flex gap-4">
            {product.images.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-foreground shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image 
                  src={img} 
                  alt={`${product.name} ${idx + 1}`} 
                  fill 
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-xs tracking-widest text-foreground/50 mb-2">{categories.find(c => c.id === product.category)?.name}</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">{product.name}</h1>
            <p className="text-2xl font-medium">{product.price} ج.م</p>
          </div>

          <p className="text-foreground/70 font-light leading-relaxed mb-6">
            {product.description}
          </p>

          {product.material && (
            <p className="text-sm font-medium mb-8 text-foreground/80 bg-sand-50 p-3 rounded-xl border border-sand-100">
              <span className="font-bold text-foreground">الخامة: </span>{product.material}
            </p>
          )}

          <div className="space-y-8 mb-10">
            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium mb-3">اللون: <span className="text-foreground/60 capitalize">{selectedColor}</span></h3>
              <div className="flex gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-foreground p-1' : 'border-transparent'}`}
                    title={color}
                  >
                    <div 
                      className="w-full h-full rounded-full border border-sand-200" 
                      style={{ 
                        backgroundColor: color.startsWith('#') || color.match(/^[a-zA-Z]+$/) ? color : `var(--c-${color})`
                      }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">المقاس: <span className="text-foreground/60">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-xl text-sm transition-all border font-medium ${selectedSize === size ? 'bg-[#5A5452] text-white border-[#5A5452]' : 'bg-white text-[#5A5452] hover:border-sand-400 border-sand-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium mb-3">الكمية</h3>
              <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-2 border border-sand-200 w-max">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sand-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-base w-6 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sand-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Custom Details */}
            <div>
              <h3 className="text-sm font-medium mb-3">تفاصيل مخصصة <span className="text-foreground/50 text-xs font-normal">(اختياري)</span></h3>
              <textarea 
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="اكتب هنا أي تفاصيل مخصصة للمنتج، مثل مقاس خاص أو تعديل معين..."
                className="w-full bg-white border border-sand-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5452] resize-none h-24 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={`flex-1 py-4 rounded-full transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 ${added ? 'bg-sage-400 text-white' : 'bg-[#5A5452] text-white hover:bg-rose-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingBag size={18} />
              {added ? "تمت الإضافة للسلة" : (product.inStock === false ? "نفذت الكمية" : "أضف للسلة")}
            </button>
            <button 
              onClick={() => {
                if (isInWishlist(product._id)) {
                  removeFromWishlist(product._id);
                } else {
                  addToWishlist({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0]
                  });
                }
              }}
              className={`w-14 h-14 bg-white rounded-full flex items-center justify-center border border-sand-200 transition-colors shadow-sm ${isInWishlist(product._id) ? 'text-rose-500 border-rose-300' : 'hover:border-rose-300 hover:text-rose-500'}`}
            >
              <Heart size={20} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id || product.id} initialReviews={product.reviews} />
    </div>
  );
}
