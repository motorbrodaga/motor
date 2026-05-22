"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { QuickCapturePanel } from "@/features/capture/QuickCapturePanel";

export function QuickCaptureEntry() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="quick-capture-button" onClick={() => setOpen(true)}>
        <Plus aria-hidden="true" size={19} />
        <span>Быстро</span>
      </button>
      {open ? <QuickCapturePanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}
