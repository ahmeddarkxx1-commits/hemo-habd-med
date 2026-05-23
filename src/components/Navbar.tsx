"use client";

import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Menu, ShoppingBag, Heart, User, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show public navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      <nav 
        className={`pointer-events-auto transition-all duration-500 flex justify-between items-center relative ${
          scrolled 
            ? "w-[95%] md:w-[90%] max-w-7xl mt-4 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full py-4 px-6 md:px-10" 
            : "w-full bg-transparent py-8 px-6 md:px-16"
        }`}
      >
        {/* Right side (Links & Menu) */}
        <div className="flex items-center gap-6">
          <button 
            className="lg:hidden text-foreground hover:text-rose-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <div className={`hidden lg:flex gap-6 text-[13px] tracking-wider uppercase font-bold transition-all duration-300 ${!scrolled ? 'drop-shadow-md text-foreground' : 'text-foreground/90'}`}>
            <Link href="/" className="relative group">
              <span className="hover:text-rose-600 transition-colors">الرئيسية</span>
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-rose-400 transition-all group-hover:w-full"></span>
            </Link>
            
            {/* Shop with Mega Menu */}
            <div className="relative group">
              <Link href="/shop" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                المتجر
              </Link>
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-rose-400 transition-all group-hover:w-full"></span>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full pt-6 -right-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-[600px] pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white p-8 grid grid-cols-3 gap-8">
                  <Link href="/shop?category=knitwear" className="group/item flex flex-col gap-3">
                    <div className="aspect-[4/5] bg-sand-100 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/5 group-hover/item:bg-black/0 transition-colors z-10" />
                    </div>
                    <span className="font-serif text-lg text-foreground group-hover/item:text-rose-600 transition-colors">جاكيتات وتريكو</span>
                  </Link>
                  <Link href="/shop?category=accessories" className="group/item flex flex-col gap-3">
                    <div className="aspect-[4/5] bg-sand-100 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/5 group-hover/item:bg-black/0 transition-colors z-10" />
                    </div>
                    <span className="font-serif text-lg text-foreground group-hover/item:text-rose-600 transition-colors">حقائب واكسسوارات</span>
                  </Link>
                  <Link href="/shop?category=kids" className="group/item flex flex-col gap-3">
                    <div className="aspect-[4/5] bg-sand-100 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/5 group-hover/item:bg-black/0 transition-colors z-10" />
                    </div>
                    <span className="font-serif text-lg text-foreground group-hover/item:text-rose-600 transition-colors">أطفال</span>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/collections" className="relative group">
              <span className="hover:text-rose-600 transition-colors">أحدث التشكيلات</span>
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-rose-400 transition-all group-hover:w-full"></span>
            </Link>
            
            <Link href="/process" className="relative group">
              <span className="hover:text-rose-600 transition-colors">صناعة يدوية</span>
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-rose-400 transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </div>

        {/* Logo (Center) */}
        <Link 
          href="/" 
          className={`absolute left-1/2 -translate-x-1/2 font-serif tracking-widest text-foreground font-bold transition-all duration-500 ${
            scrolled ? "text-2xl" : "text-3xl md:text-5xl drop-shadow-xl"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          HEMO
        </Link>

        {/* Left side (Icons & Extra Links) */}
        <div className={`flex items-center gap-6 transition-all duration-300 ${!scrolled ? 'drop-shadow-md text-foreground' : 'text-foreground/90'}`}>
          <div className="hidden xl:flex gap-6 text-[13px] tracking-wider uppercase font-bold ml-6">
            <Link href="/about" className="hover:text-rose-600 transition-colors">من نحن</Link>
            <Link href="/faq" className="hover:text-rose-600 transition-colors">الأسئلة الشائعة</Link>
            <Link href="/contact" className="hover:text-rose-600 transition-colors">تواصل معنا</Link>
          </div>

          <div className="relative hidden sm:flex items-center">
            <button 
              className={`hover:text-rose-600 transition-colors z-10 relative ${isSearchOpen ? 'text-rose-600 opacity-0 pointer-events-none' : 'opacity-100'}`}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={22} strokeWidth={2} />
            </button>
            <div 
              className={`absolute top-1/2 -translate-y-1/2 right-0 transition-all duration-300 origin-right flex items-center bg-white/95 backdrop-blur-xl border border-sand-200 rounded-full shadow-lg ${
                isSearchOpen ? 'w-[240px] opacity-100 px-2' : 'w-0 opacity-0 px-0 border-transparent shadow-none'
              }`}
            >
               <input 
                 type="text" 
                 placeholder="ابحثي عن منتج..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={handleSearch}
                 className={`w-full bg-transparent text-foreground text-sm py-1.5 pr-8 pl-2 focus:outline-none placeholder:text-foreground/50 transition-all ${isSearchOpen ? 'visible' : 'invisible'}`}
                 autoFocus={isSearchOpen}
                 onBlur={() => {
                   // تأخير بسيط حتى لا يختفي قبل تنفيذ البحث إذا تم الضغط بالماوس
                   setTimeout(() => setIsSearchOpen(false), 200);
                 }}
               />
               <button 
                 onClick={() => {
                   if(searchQuery.trim()) {
                     setIsSearchOpen(false);
                     router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                     setSearchQuery("");
                   }
                 }}
                 className="absolute right-3 text-foreground/50 hover:text-rose-600 transition-colors"
               >
                 <Search size={16} />
               </button>
            </div>
          </div>
          
          <Link href="/account" className="hidden sm:block hover:text-rose-600 transition-colors">
            <User size={22} strokeWidth={2} />
          </Link>
          
          <Link href="/wishlist" className="hidden sm:block relative hover:text-rose-600 transition-colors">
            <Heart size={22} strokeWidth={2} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-rose-600 transition-colors"
          >
            <ShoppingBag size={22} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto absolute top-full mt-2 w-[95%] max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 flex flex-col gap-6 origin-top animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-5 text-center">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">الرئيسية</Link>
            <div className="w-12 h-px bg-sand-200 mx-auto" />
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">المتجر</Link>
            <Link href="/shop?category=knitwear" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-foreground/70 hover:text-rose-600 transition-colors">جاكيتات وتريكو</Link>
            <Link href="/shop?category=accessories" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-foreground/70 hover:text-rose-600 transition-colors">حقائب واكسسوارات</Link>
            <Link href="/shop?category=kids" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-foreground/70 hover:text-rose-600 transition-colors">أطفال</Link>
            <div className="w-12 h-px bg-sand-200 mx-auto" />
            <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">أحدث التشكيلات</Link>
            <Link href="/process" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">صناعة يدوية</Link>
            <div className="w-12 h-px bg-sand-200 mx-auto" />
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">من نحن</Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">الأسئلة الشائعة</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-rose-600 transition-colors">تواصل معنا</Link>
          </div>
          <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-sand-100">
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-foreground hover:text-rose-600">
              <User size={24} />
            </Link>
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-foreground hover:text-rose-600">
              <Heart size={24} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
