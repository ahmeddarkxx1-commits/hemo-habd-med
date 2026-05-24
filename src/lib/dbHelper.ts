import connectDB from "./db";
import mongoose from "mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { products as staticProducts } from "./data";
import fs from "fs";
import path from "path";

const LOCAL_DB_PATH = path.join(process.cwd(), "hemo_db.json");

const EGYPT_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", 
  "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", 
  "السويس", "الشرقية", "سوهاج", "جنوب سيناء", "شمال سيناء", "قنا", "كفر الشيخ", 
  "مطروح", "الأقصر", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط"
];

interface LocalDB {
  users: any[];
  orders: any[];
  products: any[];
  shippingRates: any[];
  totalVisits: number;
}

function readLocalDB(): LocalDB {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    // Seed local products with static products to make sure the app has products initially
    const initialData: LocalDB = {
      users: [],
      orders: [],
      products: staticProducts.map((p) => ({
        _id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        colors: p.colors,
        sizes: p.sizes,
        isFeatured: p.featured || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      shippingRates: [],
      totalVisits: 0,
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    const parsed = JSON.parse(data);
    if (!parsed.users) parsed.users = [];
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.products) parsed.products = [];
    if (!parsed.shippingRates) parsed.shippingRates = [];
    if (typeof parsed.totalVisits !== 'number') parsed.totalVisits = 0;
    return parsed as LocalDB;
  } catch (error) {
    console.error("Failed to read local DB:", error);
    return { users: [], orders: [], products: [], shippingRates: [], totalVisits: 0 };
  }
}

function writeLocalDB(data: LocalDB) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write to local DB:", error);
  }
}

export async function isMongoConnected(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_password>")) {
    return false;
  }
  try {
    await connectDB();
    return mongoose.connection.readyState === 1;
  } catch (e) {
    return false;
  }
}

export const dbHelper = {
  // USER METHODS
  async getUserByEmail(email: string) {
    const isConnected = await isMongoConnected();
    const cleanEmail = email.toLowerCase().trim();

    if (isConnected) {
      return await User.findOne({ email: cleanEmail });
    } else {
      const db = readLocalDB();
      const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) return null;
      return {
        ...user,
        // Mock mongoose document interface
        _id: user._id,
        id: user._id,
      };
    }
  },

  async getUserById(id: string) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await User.findById(id);
    } else {
      const db = readLocalDB();
      const user = db.users.find((u) => u._id === id);
      if (!user) return null;
      return {
        ...user,
        _id: user._id,
        id: user._id,
      };
    }
  },

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    governorate?: string;
    address?: string;
    role?: "user" | "admin";
  }) {
    const isConnected = await isMongoConnected();
    const cleanEmail = userData.email.toLowerCase().trim();

    if (isConnected) {
      return await User.create({
        ...userData,
        email: cleanEmail,
      });
    } else {
      const db = readLocalDB();
      const newUser = {
        _id: "usr_" + Math.random().toString(36).substring(2, 11),
        ...userData,
        email: cleanEmail,
        role: userData.role || "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      writeLocalDB(db);
      return newUser;
    }
  },

  async updateUser(
    id: string,
    updateData: {
      name?: string;
      phone?: string;
      governorate?: string;
      address?: string;
    }
  ) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const db = readLocalDB();
      const userIndex = db.users.findIndex((u) => u._id === id);
      if (userIndex === -1) return null;

      db.users[userIndex] = {
        ...db.users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      writeLocalDB(db);
      return db.users[userIndex];
    }
  },

  async getAllUsers() {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await User.find({}).sort({ createdAt: -1 });
    } else {
      const db = readLocalDB();
      return db.users;
    }
  },

  // ORDER METHODS
  async getOrders(userId?: string) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      const query = userId ? { userId } : {};
      return await Order.find(query).sort({ createdAt: -1 });
    } else {
      const db = readLocalDB();
      let orders = db.orders;
      if (userId) {
        orders = orders.filter((o) => o.userId === userId);
      }
      // Sort by createdAt descending
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async getOrderById(id: string) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Order.findById(id);
    } else {
      const db = readLocalDB();
      return db.orders.find((o) => o._id === id) || null;
    }
  },

  async createOrder(orderData: {
    userId?: string | null;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerNotes?: string;
    items: any[];
    totalAmount: number;
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  }) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Order.create(orderData);
    } else {
      const db = readLocalDB();
      const newOrder = {
        _id: "ord_" + Math.random().toString(36).substring(2, 11),
        ...orderData,
        status: orderData.status || "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.orders.push(newOrder);
      writeLocalDB(db);
      return newOrder;
    }
  },

  async updateOrderStatus(id: string, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Order.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const db = readLocalDB();
      const orderIndex = db.orders.findIndex((o) => o._id === id);
      if (orderIndex === -1) return null;

      db.orders[orderIndex] = {
        ...db.orders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      writeLocalDB(db);
      return db.orders[orderIndex];
    }
  },

  // PRODUCT METHODS
  async getProducts() {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Product.find({}).sort({ createdAt: -1 });
    } else {
      const db = readLocalDB();
      return db.products;
    }
  },

  async createProduct(productData: any) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Product.create(productData);
    } else {
      const db = readLocalDB();
      const newProduct = {
        _id: "prd_" + Math.random().toString(36).substring(2, 11),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.products.push(newProduct);
      writeLocalDB(db);
      return newProduct;
    }
  },

  async getProductById(id: string) {
    const isConnected = await isMongoConnected();
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (isConnected && isValidId) {
      return await Product.findById(id);
    } else {
      const db = readLocalDB();
      return db.products.find((p) => p._id === id || p.id === id) || null;
    }
  },

  async updateProduct(id: string, productData: any) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } else {
      const db = readLocalDB();
      const index = db.products.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) return null;
      db.products[index] = {
        ...db.products[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      };
      writeLocalDB(db);
      return db.products[index];
    }
  },

  async addProductReview(id: string, review: { userName: string; rating: number; comment: string }) {
    const isConnected = await isMongoConnected();
    const reviewWithDate = { ...review, date: new Date().toISOString() };
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    
    if (isConnected && isValidId) {
      const Product = (await import("@/models/Product")).default;
      return await Product.findByIdAndUpdate(
        id, 
        { $push: { reviews: reviewWithDate } }, 
        { new: true }
      );
    } else {
      const db = readLocalDB();
      const index = db.products.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) return null;
      if (!db.products[index].reviews) db.products[index].reviews = [];
      db.products[index].reviews.push(reviewWithDate);
      writeLocalDB(db);
      return db.products[index];
    }
  },

  async deleteProduct(id: string) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      return await Product.findByIdAndDelete(id);
    } else {
      const db = readLocalDB();
      const index = db.products.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) return null;
      const deleted = db.products[index];
      db.products.splice(index, 1);
      writeLocalDB(db);
      return deleted;
    }
  },

  async getShippingRates() {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      const ShippingRate = (await import("@/models/ShippingRate")).default;
      return await ShippingRate.find({ isActive: true }).sort({ governorate: 1 });
    } else {
      const db = readLocalDB();
      if (db.shippingRates.length === 0) {
        db.shippingRates = EGYPT_GOVERNORATES.map(gov => ({
          _id: "sh_" + Math.random().toString(36).substring(2, 11),
          governorate: gov,
          rate: gov === "القاهرة" || gov === "الجيزة" ? 50 : 70,
          estimatedDays: "3-5 أيام",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        writeLocalDB(db);
      }
      return db.shippingRates.filter((r: any) => r.isActive).sort((a: any, b: any) => a.governorate.localeCompare(b.governorate, "ar"));
    }
  },

  async updateShippingRate(governorate: string, rate: number, estimatedDays: string) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      const ShippingRate = (await import("@/models/ShippingRate")).default;
      return await ShippingRate.findOneAndUpdate(
        { governorate },
        { rate, estimatedDays },
        { new: true, upsert: true }
      );
    } else {
      const db = readLocalDB();
      let rateIndex = db.shippingRates.findIndex((r: any) => r.governorate === governorate);
      if (rateIndex === -1) {
        const newRate = {
          _id: "sh_" + Math.random().toString(36).substring(2, 11),
          governorate,
          rate,
          estimatedDays,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.shippingRates.push(newRate);
        writeLocalDB(db);
        return newRate;
      } else {
        db.shippingRates[rateIndex] = {
          ...db.shippingRates[rateIndex],
          rate,
          estimatedDays,
          updatedAt: new Date().toISOString()
        };
        writeLocalDB(db);
        return db.shippingRates[rateIndex];
      }
    }
  },

  async deleteShippingRate(governorate: string) {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      const ShippingRate = (await import("@/models/ShippingRate")).default;
      return await ShippingRate.findOneAndDelete({ governorate });
    } else {
      const db = readLocalDB();
      db.shippingRates = db.shippingRates.filter((r: any) => r.governorate !== governorate);
      writeLocalDB(db);
      return { success: true };
    }
  },

  async seedShippingRates() {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      const ShippingRate = (await import("@/models/ShippingRate")).default;
      // Clear existing
      await ShippingRate.deleteMany({});
      const rates = EGYPT_GOVERNORATES.map(gov => ({
        governorate: gov,
        rate: gov === "القاهرة" || gov === "الجيزة" ? 50 : 70,
        estimatedDays: "3-5 أيام",
        isActive: true
      }));
      await ShippingRate.insertMany(rates);
      return { success: true };
    } else {
      const db = readLocalDB();
      db.shippingRates = EGYPT_GOVERNORATES.map(gov => ({
        _id: "sh_" + Math.random().toString(36).substring(2, 11),
        governorate: gov,
        rate: gov === "القاهرة" || gov === "الجيزة" ? 50 : 70,
        estimatedDays: "3-5 أيام",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      writeLocalDB(db);
      return { success: true };
    }
  },

  async getStats() {
    const isConnected = await isMongoConnected();
    if (isConnected) {
      const Order = (await import("@/models/Order")).default;
      const Product = (await import("@/models/Product")).default;
      const Setting = (await import("@/models/Setting")).default;

      const orders = await Order.find({ status: { $ne: "cancelled" } });
      const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.totalAmount, 0);
      const totalOrders = await Order.countDocuments();
      const uniqueCustomers = await Order.distinct("customerPhone");
      const totalCustomers = uniqueCustomers.length;
      const totalProducts = await Product.countDocuments();
      const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

      // ── Visits ─────────────────────────────────────────────
      const settingDoc = await Setting.findOne({});
      const totalVisits = settingDoc?.totalVisits ?? 0;

      // ── Weekly sales (last 7 days) ──────────────────────────
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const dailySalesRaw = await Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: "cancelled" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$totalAmount" } } },
        { $sort: { _id: 1 } }
      ]);

      const dailySales = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayData = dailySalesRaw.find((s: any) => s._id === dateStr);
        dailySales.push({
          date: dateStr,
          total: dayData ? dayData.total : 0,
          dayName: d.toLocaleDateString('ar-EG', { weekday: 'short' })
        });
      }

      // ── Monthly sales (last 6 months) ───────────────────────
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      const monthlySalesRaw = await Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: "cancelled" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$totalAmount" } } },
        { $sort: { _id: 1 } }
      ]);

      const monthlySales = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStr = d.toISOString().slice(0, 7);
        const monthData = monthlySalesRaw.find((s: any) => s._id === monthStr);
        monthlySales.push({
          month: monthStr,
          total: monthData ? monthData.total : 0,
          monthName: d.toLocaleDateString('ar-EG', { month: 'short' })
        });
      }

      // ── Weekly revenue ──────────────────────────────────────
      const weeklyRevenue = dailySales.reduce((acc, d) => acc + d.total, 0);
      const monthlyRevenue = monthlySales[5]?.total ?? 0; // current month

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalVisits,
        weeklyRevenue,
        monthlyRevenue,
        recentOrders,
        dailySales,
        monthlySales
      };
    } else {
      // ── Local DB branch ─────────────────────────────────────
      const db = readLocalDB();
      const nonCancelledOrders = db.orders.filter((o: any) => o.status !== "cancelled");
      const totalRevenue = nonCancelledOrders.reduce((acc: number, o: any) => acc + o.totalAmount, 0);
      const totalOrders = db.orders.length;
      const uniquePhones = Array.from(new Set(db.orders.map((o: any) => o.customerPhone)));
      const totalCustomers = uniquePhones.length;
      const totalProducts = db.products.length;
      const totalVisits = db.totalVisits ?? 0;

      const recentOrders = [...db.orders]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // ── Weekly sales ────────────────────────────────────────
      const dailySales = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dailyTotal = nonCancelledOrders
          .filter((o: any) => o.createdAt?.split('T')[0] === dateStr)
          .reduce((acc: number, o: any) => acc + o.totalAmount, 0);
        dailySales.push({
          date: dateStr,
          total: dailyTotal,
          dayName: d.toLocaleDateString('ar-EG', { weekday: 'short' })
        });
      }

      // ── Monthly sales (last 6 months) ───────────────────────
      const monthlySales = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStr = d.toISOString().slice(0, 7);
        const monthTotal = nonCancelledOrders
          .filter((o: any) => o.createdAt?.startsWith(monthStr))
          .reduce((acc: number, o: any) => acc + o.totalAmount, 0);
        monthlySales.push({
          month: monthStr,
          total: monthTotal,
          monthName: d.toLocaleDateString('ar-EG', { month: 'short' })
        });
      }

      const weeklyRevenue = dailySales.reduce((acc, d) => acc + d.total, 0);
      const monthlyRevenue = monthlySales[5]?.total ?? 0;

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalVisits,
        weeklyRevenue,
        monthlyRevenue,
        recentOrders,
        dailySales,
        monthlySales
      };
    }
  }
};
