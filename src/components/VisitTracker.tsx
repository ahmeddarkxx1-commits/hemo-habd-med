"use client";
import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // تسجيل الزيارة مرة واحدة فقط لكل session (لا تُحسب عند التنقل بين الصفحات)
    if (typeof window !== "undefined" && !sessionStorage.getItem("_hemo_visited")) {
      sessionStorage.setItem("_hemo_visited", "1");
      fetch("/api/track-visit", { method: "POST" }).catch(() => {});
    }
  }, []);

  return null;
}
