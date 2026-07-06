"use client";

import { useEffect } from "react";
import { trackOpen } from "@/lib/track";

export default function Tracker() {
  useEffect(() => {
    trackOpen();
  }, []);
  return null;
}
