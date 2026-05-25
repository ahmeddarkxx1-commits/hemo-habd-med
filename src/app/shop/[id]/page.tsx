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
import SizeGuideModal from "@/components/SizeGuideModal";
import { nameToSlug } from "@/lib/slug";

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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

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

    async function fetchRelatedProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          // Shuffle and pick 4 products
          const shuffled = data.data.sort(() => 0.5 - Math.random());
          setRelatedProducts(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    }

    fetchProduct().then(() => fetchRelatedProducts());
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="w-full aspect-[4/5] rounded-3xl skeleton"></div>
          <div className="flex flex-col space-y-6 pt-10">
            <div className="w-24 h-4 skeleton rounded-md"></div>
            <div className="w-3/4 h-12 skeleton rounded-lg"></div>
            <div className="w-1/3 h-8 skeleton rounded-md"></div>
            <div className="w-full h-24 skeleton rounded-xl mt-4"></div>
            <div className="w-full h-14 skeleton rounded-full mt-8"></div>
          </div>
        </div>
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
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-sand-100 luxury-shadow transition-all duration-500 group cursor-crosshair">
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
                className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-foreground shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
        <div className="flex flex-col lg:sticky lg:top-32 h-fit">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-foreground/50 mb-4">{categories.find(c => c.id === product.category)?.name}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-medium tracking-tight">{product.price} ج.م</p>
          </div>

          <p className="text-foreground/70 font-light leading-relaxed mb-8 text-lg">
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">المقاس: <span className="text-foreground/60">{selectedSize}</span></h3>
                  <button onClick={() => setIsSizeGuideOpen(true)} className="text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-rose-600 underline transition-colors">
                    دليل المقاسات
                  </button>
                </div>
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

          <div className="hidden lg:flex gap-4">
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

      {/* Reviews Section */}
      <ProductReviews productId={product._id || product.id} initialReviews={product.reviews} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-sand-100 pt-16">
          <h2 className="font-serif text-3xl mb-10 text-center">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link href={`/shop/${nameToSlug(p.name)}`} key={p._id} className="group cursor-pointer">
                <div className="relative w-full aspect-[4/5] bg-sand-100 rounded-2xl overflow-hidden mb-4 luxury-shadow luxury-shadow-hover transition-all duration-500">
                  <Image 
                    src={p.images[0] || "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (1).jpeg"} 
                    alt={p.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-rose-600 transition-colors line-clamp-1">{p.name}</h3>
                <p className="text-foreground/70 text-sm">{p.price} ج.م</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Add To Cart Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 z-40 flex gap-3 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] pb-safe-8 supports-[backdrop-filter]:bg-white/60">
        <button 
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`flex-1 py-3.5 rounded-full transition-all shadow-md font-medium flex items-center justify-center gap-2 text-sm ${added ? 'bg-sage-400 text-white' : 'bg-foreground text-white hover:bg-rose-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
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
          className={`w-[52px] h-[52px] shrink-0 bg-white rounded-full flex items-center justify-center border transition-colors shadow-sm ${isInWishlist(product._id) ? 'text-rose-500 border-rose-300' : 'border-sand-200 hover:border-rose-300 hover:text-rose-500'}`}
        >
          <Heart size={20} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
        </button>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
