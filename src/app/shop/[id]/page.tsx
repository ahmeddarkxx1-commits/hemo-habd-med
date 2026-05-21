"use client";

import { useState } from "react";
import { products, categories } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { ArrowRight, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);
  const { addToCart } = useCart();
  
  if (!product) {
    notFound();
  }

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
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
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-sand-100 shadow-sm transition-all duration-500">
            <Image 
              src={activeImage} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
              placeholder="blur"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
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
                  placeholder="blur"
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

          <p className="text-foreground/70 font-light leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-8 mb-10">
            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium mb-3">اللون: <span className="text-foreground/60 capitalize">{selectedColor}</span></h3>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-foreground p-1' : 'border-transparent'}`}
                  >
                    <div className="w-full h-full rounded-full border border-sand-200" style={{ backgroundColor: `var(--c-${color})` }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-3">المقاس: <span className="text-foreground/60">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
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
              disabled={!product.inStock}
              className={`flex-1 py-4 rounded-full transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 ${added ? 'bg-sage-400 text-white' : 'bg-[#5A5452] text-white hover:bg-rose-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingBag size={18} />
              {added ? "تمت الإضافة للسلة" : "أضف للسلة"}
            </button>
            <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-sand-200 hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
