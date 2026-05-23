import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "HEMO HAND" },
    storePhone: { type: String, default: "01234567890" },
    storeEmail: { type: String, default: "contact@hemohand.com" },
    whatsapp: { type: String, default: "201234567890" },
    instagram: { type: String, default: "hemo.hand" },
    facebook: { type: String, default: "hemohand" },
  },
  { timestamps: true }
);

const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting;
