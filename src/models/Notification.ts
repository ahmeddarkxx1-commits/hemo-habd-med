import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['offer', 'info', 'alert'], default: 'info' },
    showOnce: { type: Boolean, default: true }, // If true, only show once per user session/localStorage
    link: { type: String }, // Optional link when clicked
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
